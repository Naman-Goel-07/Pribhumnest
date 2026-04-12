import { Router } from "express";
import multer from "multer";
import {
  addProperty,
  getAllProperties,
  getPropertyById,
  deleteProperty,
  createEnquiry,
} from "../controllers/propertyController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

/**
 * Multer config: memoryStorage keeps files in RAM as Buffer
 * before we stream them to Supabase Storage.
 * Limits: 4 files max, 5MB per file, images only.
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 4,
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"), false);
    }
    cb(null, true);
  },
});

// ── Public Routes ─────────────────────────────────────────────────────────
router.get("/", getAllProperties);
router.get("/details/:id", getPropertyById);

// ── Protected Routes ──────────────────────────────────────────────────────
router.post(
  "/add-property",
  authMiddleware,
  upload.array("Images", 4),
  addProperty
);
router.delete(
  "/delete-property/:id",
  authMiddleware,
  deleteProperty
);
router.post("/enquiry", authMiddleware, createEnquiry);

export default router;
