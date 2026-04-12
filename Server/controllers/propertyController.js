import { adminClient, anonClient } from "../supabase/client.js";
import {
  uploadImagesToStorage,
  insertPropertyImages,
  deleteStorageFolder,
} from "../utils/supabaseHelpers.js";
import { z } from "zod";

// ── Zod Schema ─────────────────────────────────────────────────────────────

const addPropertySchema = z.object({
  Title: z.string().min(1, "Title is required"),
  Locality: z.string().min(1, "Locality is required"),
  City: z.string().min(1, "City is required"),
  Gender: z.enum(["Boys", "Girls", "Co-Living"], {
    errorMap: () => ({ message: "Gender must be Boys, Girls, or Co-Living" }),
  }),
  LockInPeriod: z.coerce.number().min(1, "Lock-in period is required"),
  Electricity: z.coerce.number().min(0, "Electricity cost must be non-negative"),
  Sharing: z.string().optional(),       // JSON string from FormData
  CommonFacilities: z.string().optional(), // JSON string from FormData
  Safety: z.string().optional(),        // JSON string from FormData
  BillsIncluded: z.string().optional(), // JSON string from FormData
});

// ── Controllers ────────────────────────────────────────────────────────────

/**
 * POST /api/property/add-property
 * Adds a new PG listing with images uploaded to Supabase Storage.
 * Protected: requires authenticated user (authMiddleware).
 */
export const addProperty = async (req, res, next) => {
  try {
    const parsed = addPropertySchema.parse(req.body);

    // Parse JSON fields from FormData
    const sharing = parsed.Sharing ? JSON.parse(parsed.Sharing) : {};
    const commonFacilities = parsed.CommonFacilities
      ? JSON.parse(parsed.CommonFacilities)
      : {};
    const safety = parsed.Safety ? JSON.parse(parsed.Safety) : {};
    const billsIncluded = parsed.BillsIncluded
      ? JSON.parse(parsed.BillsIncluded)
      : {};

    // 1. Insert the property record first to get the ID
    const { data: property, error: insertError } = await adminClient
      .from("properties")
      .insert({
        owner_id: req.user.id,
        title: parsed.Title,
        locality: parsed.Locality,
        city: parsed.City,
        gender: parsed.Gender,
        lock_in_period: parsed.LockInPeriod,
        electricity: parsed.Electricity,
        sharing,
        common_facilities: commonFacilities,
        safety,
        bills_included: billsIncluded,
      })
      .select()
      .single();

    if (insertError) {
      return res
        .status(400)
        .json({ message: insertError.message || "Failed to add property" });
    }

    // 2. Upload images to Supabase Storage (if any)
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = await uploadImagesToStorage(
        req.files,
        req.user.id,
        property.id
      );
      // 3. Insert image records into property_images table
      await insertPropertyImages(property.id, imageUrls);
    }

    return res.status(201).json({
      message: "Property added successfully",
      property: { ...property, images: imageUrls },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/property
 * Lists all active properties with their images.
 * Supports query filters: city, gender, min_rent, max_rent.
 * Public: no auth required.
 */
export const getAllProperties = async (req, res, next) => {
  try {
    const { city, gender, min_rent, max_rent } = req.query;

    let query = anonClient
      .from("properties")
      .select(`
        *,
        property_images ( image_url, display_order )
      `)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    // Apply filters
    if (city) query = query.ilike("city", `%${city}%`);
    if (gender) query = query.eq("gender", gender);

    const { data: properties, error } = await query;

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    // Normalise the response shape to match what the frontend expects
    const normalised = properties.map((p) => ({
      _id: p.id,
      Title: p.title,
      Locality: p.locality,
      City: p.city,
      Gender: p.gender,
      LockInPeriod: p.lock_in_period,
      Electricity: p.electricity,
      Sharing: p.sharing,
      CommonFacilities: p.common_facilities,
      Safety: p.safety,
      BillsIncluded: p.bills_included,
      Images: p.property_images
        .sort((a, b) => a.display_order - b.display_order)
        .map((img) => img.image_url),
      owner_id: p.owner_id,
      created_at: p.created_at,
    }));

    // Apply rent filter on Sharing.Single (cheapest tier)
    let filtered = normalised;
    if (min_rent) {
      filtered = filtered.filter(
        (p) => Number(p.Sharing?.Single) >= Number(min_rent)
      );
    }
    if (max_rent) {
      filtered = filtered.filter(
        (p) => Number(p.Sharing?.Single) <= Number(max_rent)
      );
    }

    return res.status(200).json({ findProperty: filtered });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/property/details/:id
 * Returns full details for a single property including images.
 * Public: no auth required.
 */
export const getPropertyById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data: property, error } = await anonClient
      .from("properties")
      .select(`
        *,
        property_images ( image_url, display_order )
      `)
      .eq("id", id)
      .eq("is_active", true)
      .single();

    if (error || !property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const normalised = {
      _id: property.id,
      Title: property.title,
      Locality: property.locality,
      City: property.city,
      Gender: property.gender,
      LockInPeriod: property.lock_in_period,
      Electricity: property.electricity,
      Sharing: property.sharing,
      CommonFacilities: property.common_facilities,
      Safety: property.safety,
      BillsIncluded: property.bills_included,
      Images: property.property_images
        .sort((a, b) => a.display_order - b.display_order)
        .map((img) => img.image_url),
      owner_id: property.owner_id,
      created_at: property.created_at,
    };

    return res.status(200).json({ findProperty: [normalised] });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/property/delete-property/:id
 * Soft-deletes (deactivates) a property.
 * Protected: only the owner or admin can delete.
 */
export const deleteProperty = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verify ownership or admin
    const { data: property, error: findError } = await adminClient
      .from("properties")
      .select("owner_id")
      .eq("id", id)
      .single();

    if (findError || !property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const isOwner = property.owner_id === req.user.id;
    const isAdmin = req.profile.role === "admin";

    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ message: "Forbidden: You do not own this property" });
    }

    // Soft delete: set is_active = false
    const { error } = await adminClient
      .from("properties")
      .update({ is_active: false })
      .eq("id", id);

    if (error) {
      return res.status(500).json({ message: "Failed to delete property" });
    }

    return res.status(200).json({ message: "Property deleted successfully" });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/property/enquiry
 * Creates an enquiry for a property.
 * Protected: user must be logged in.
 */
export const createEnquiry = async (req, res, next) => {
  try {
    const { propertyId, name, email, contact, message } = req.body;

    if (!propertyId || !name || !email || !contact) {
      return res
        .status(400)
        .json({ message: "propertyId, name, email, and contact are required" });
    }

    const { data, error } = await adminClient.from("enquiries").insert({
      property_id: propertyId,
      user_id: req.user.id,
      name,
      email,
      contact,
      message: message || "",
    }).select().single();

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(201).json({
      message: "Enquiry submitted successfully",
      enquiry: data,
    });
  } catch (err) {
    next(err);
  }
};
