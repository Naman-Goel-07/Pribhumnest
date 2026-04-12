import { Router } from "express";
import {
  getAllUsers,
  updateRole,
  deleteUser,
  getAllEnquiries,
  adminGetAllProperties,
} from "../controllers/adminController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = Router();

// ── Admin-Only Routes ─────────────────────────────────────────────────────
// Auth (login, register, logout, password reset) is now handled entirely
// client-side via the Supabase JS SDK. The backend only exposes admin
// management endpoints that require the service role key.

router.get("/allUsers", authMiddleware, adminMiddleware, getAllUsers);
router.patch("/update-role/:id", authMiddleware, adminMiddleware, updateRole);
router.delete("/delete-user/:id", authMiddleware, adminMiddleware, deleteUser);
router.get("/admin/all-enquiries", authMiddleware, adminMiddleware, getAllEnquiries);
router.get("/admin/all-properties", authMiddleware, adminMiddleware, adminGetAllProperties);

export default router;
