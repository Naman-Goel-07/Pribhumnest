/**
 * adminMiddleware
 * Must be used AFTER authMiddleware.
 * Checks req.profile.role === 'admin'. Rejects non-admins with 403.
 */
const adminMiddleware = (req, res, next) => {
  if (!req.profile) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Not authenticated" });
  }

  if (req.profile.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Forbidden: Admin access required" });
  }

  next();
};

export default adminMiddleware;
