import { adminClient } from "../supabase/client.js";
import { randomUUID } from "crypto";

/**
 * uploadImagesToStorage
 * Handles multi-file upload of image buffers (from multer memoryStorage)
 * to the Supabase Storage bucket "property-images".
 *
 * @param {Express.Multer.File[]} files - Array of multer file objects
 * @param {string} ownerId             - Authenticated user UUID (for folder namespacing)
 * @param {string} propertyId          - Property UUID (for folder namespacing)
 * @returns {Promise<string[]>}        - Array of public image URLs
 */
export const uploadImagesToStorage = async (files, ownerId, propertyId) => {
  if (!files || files.length === 0) return [];

  const bucketName = "property-images";
  const uploadedUrls = [];

  for (const file of files) {
    const fileExt = file.originalname.split(".").pop();
    const fileName = `${randomUUID()}.${fileExt}`;
    // Namespaced path: ownerId/propertyId/filename.ext
    const filePath = `${ownerId}/${propertyId}/${fileName}`;

    const { error } = await adminClient.storage
      .from(bucketName)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      console.error("[uploadImagesToStorage] Upload error:", error.message);
      throw new Error(`Failed to upload image: ${error.message}`);
    }

    // Get the public URL for the uploaded file
    const { data } = adminClient.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    uploadedUrls.push(data.publicUrl);
  }

  return uploadedUrls;
};

/**
 * insertPropertyImages
 * Inserts image URL records into the property_images table.
 *
 * @param {string} propertyId    - Parent property UUID
 * @param {string[]} imageUrls  - Array of public image URLs
 */
export const insertPropertyImages = async (propertyId, imageUrls) => {
  const records = imageUrls.map((url, index) => ({
    property_id: propertyId,
    image_url: url,
    display_order: index,
  }));

  const { error } = await adminClient
    .from("property_images")
    .insert(records);

  if (error) {
    throw new Error(`Failed to insert image records: ${error.message}`);
  }
};

/**
 * deleteStorageFolder
 * Deletes all objects under a specific folder path in Supabase Storage.
 * Used when a property (and all its images) is deleted.
 *
 * @param {string} folderPath  - e.g. "ownerId/propertyId/"
 */
export const deleteStorageFolder = async (folderPath) => {
  const bucketName = "property-images";

  // List all files in the folder
  const { data: files, error: listError } = await adminClient.storage
    .from(bucketName)
    .list(folderPath);

  if (listError || !files?.length) return;

  const filePaths = files.map((f) => `${folderPath}/${f.name}`);
  const { error } = await adminClient.storage
    .from(bucketName)
    .remove(filePaths);

  if (error) {
    console.error("[deleteStorageFolder] Error:", error.message);
  }
};
