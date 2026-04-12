import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

// Routes
import userRoutes from "./routes/userRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";

// Middleware
import errorMiddleware from "./middleware/errorMiddleware.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── Core Middleware ───────────────────────────────────────────────────────

/**
 * CORS Configuration
 * withCredentials: true on the frontend requires:
 *   - origin: specific URL (not '*')
 *   - credentials: true
 * In production add your actual Vercel domain to FRONTEND_URL.
 */
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Parse cookies (required for HttpOnly cookie sessions)
app.use(cookieParser());

// Parse JSON and URL-encoded bodies
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ── Health Check ──────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "Pribhumnest API",
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ────────────────────────────────────────────────────────────
app.use("/api/user", userRoutes);
app.use("/api/property", propertyRoutes);

// ── 404 Handler ───────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.path} not found` });
});

// ── Global Error Handler (must be LAST) ───────────────────────────────────
app.use(errorMiddleware);

// ── Start Server ──────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Pribhumnest Server running on http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🌐 CORS origin: ${process.env.FRONTEND_URL || "http://localhost:5173"}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health\n`);
});

export default app;
