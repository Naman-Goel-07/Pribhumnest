import { adminClient } from "../supabase/client.js";

/**
 * authMiddleware
 * Extracts the JWT from the pribhumnest_token HttpOnly cookie,
 * verifies it against Supabase, and attaches the user + profile
 * to req for downstream use.
 *
 * On failure: returns 401. Does NOT redirect (this is an API server).
 */
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.pribhumnest_token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No session cookie" });
    }

    // Verify the JWT with Supabase Auth (service role can introspect any token)
    const {
      data: { user },
      error,
    } = await adminClient.auth.getUser(token);

    if (error || !user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Invalid or expired session" });
    }

    // Fetch user's profile (role, name, contact)
    const { data: profile, error: profileError } = await adminClient
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User profile not found" });
    }

    // Attach both to request for downstream controllers
    req.user = user;
    req.profile = profile;
    next();
  } catch (err) {
    console.error("[authMiddleware] Error:", err.message);
    return res.status(500).json({ message: "Internal Server Error in auth" });
  }
};

export default authMiddleware;
