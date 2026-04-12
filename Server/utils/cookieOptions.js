/**
 * cookieOptions.js
 * Centralised cookie configuration for the pribhumnest_token HttpOnly cookie.
 *
 * Security attributes:
 *  - HttpOnly:  JS cannot access the cookie (XSS mitigation)
 *  - Secure:    HTTPS-only in production
 *  - SameSite: 'None' required for cross-site (Vercel Frontend <-> Railway/Render Backend)
 *              In development, use 'Lax' to avoid HTTPS requirement
 *  - maxAge:    7 days (matches Supabase's default JWT expiry)
 */
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
};

export default cookieOptions;
