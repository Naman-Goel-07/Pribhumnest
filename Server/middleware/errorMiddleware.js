/**
 * errorMiddleware
 * Global Express catch-all error handler.
 * Catches both synchronous thrown errors and next(err) calls.
 * Must be registered LAST in server.js (after all routes).
 */
const errorMiddleware = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message || err);

  // Zod validation errors
  if (err.name === "ZodError") {
    return res.status(400).json({
      message: "Validation Error",
      errors: err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }

  // Multer errors (file upload)
  if (err.code === "LIMIT_FILE_SIZE") {
    return res
      .status(400)
      .json({ message: "File too large. Maximum size is 5MB per image." });
  }

  if (err.code === "LIMIT_FILE_COUNT") {
    return res
      .status(400)
      .json({ message: "Too many files. Maximum 4 images allowed." });
  }

  const statusCode = err.statusCode || res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorMiddleware;
