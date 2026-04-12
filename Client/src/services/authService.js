import supabase from "../supabaseClient.js";

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL HELPER: Fetch profile from the "profiles" table by user ID.
// Called internally after login/session restore.
// ─────────────────────────────────────────────────────────────────────────────

const fetchProfile = async (userId) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, email, contact, role")
    .eq("id", userId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch profile: ${error.message}`);
  }

  return data;
};

// ─────────────────────────────────────────────────────────────────────────────
// 1. SIGNUP
//
// Creates a new Supabase Auth user and passes name + contact as metadata.
// The DB trigger on auth.users automatically creates the profile row.
//
// Returns:
//   { needsEmailVerification: true, message: "..." }
//
// IMPORTANT: The user CANNOT login until they click the link sent to
// their email. Supabase sets email_confirmed_at after verification.
// ─────────────────────────────────────────────────────────────────────────────

export const signUp = async ({ name, email, password, contact }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,        // stored in raw_user_meta_data — DB trigger reads this
        contact,     // stored in raw_user_meta_data — DB trigger reads this
      },
      // Optional: override the verification redirect URL
      // emailRedirectTo: `${window.location.origin}/login`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  // Supabase signUp returns a session immediately IF email confirmation is
  // disabled in the dashboard. If email confirmation is ENABLED (our case),
  // data.session will be null and data.user.email_confirmed_at will be null.
  if (data.user && !data.user.email_confirmed_at) {
    return {
      needsEmailVerification: true,
      message: "Account created! Please check your email to verify your account before logging in.",
      user: data.user,
    };
  }

  // Fallback: email confirmation disabled — user is immediately active
  const profile = await fetchProfile(data.user.id);
  return {
    needsEmailVerification: false,
    user: data.user,
    profile,
    session: data.session,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. LOGIN
//
// Authenticates with email + password.
// Checks email_confirmed_at BEFORE allowing access.
// On success: fetches the profile row and returns everything needed for Redux.
// ─────────────────────────────────────────────────────────────────────────────

export const login = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Supabase returns "Email not confirmed" error if user hasn't verified
    if (
      error.message.toLowerCase().includes("email not confirmed") ||
      error.message.toLowerCase().includes("not confirmed")
    ) {
      throw new Error(
        "Your email is not verified. Please check your inbox and click the verification link."
      );
    }
    throw new Error(error.message);
  }

  // Double-check: belt-and-suspenders on email verification
  if (!data.user.email_confirmed_at) {
    // Sign out immediately to clear any partial session
    await supabase.auth.signOut();
    throw new Error(
      "Your email is not verified. Please check your inbox and click the verification link."
    );
  }

  // Fetch extended profile (role, name, contact) from the profiles table
  const profile = await fetchProfile(data.user.id);

  return {
    user: data.user,       // Supabase Auth user object
    profile,               // { id, name, email, contact, role }
    session: data.session, // { access_token, refresh_token, expires_at }
    isAuthenticated: true,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. GET CURRENT SESSION
//
// Replaces the old getAccess() axios call.
// Used on app startup to restore state from the persisted Supabase session.
//
// Supabase stores the session in localStorage automatically, and
// getSession() restores it without any server round-trip for the initial check.
// ─────────────────────────────────────────────────────────────────────────────

export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    // Clear corrupt session or token errors
    await supabase.auth.signOut();
    throw new Error(error.message);
  }

  // No active session
  if (!data.session) {
    return { isAuthenticated: false, user: null, profile: null };
  }

  const { user } = data.session;

  // Verify email is confirmed before restoring session
  if (!user.email_confirmed_at) {
    await supabase.auth.signOut();
    return { isAuthenticated: false, user: null, profile: null };
  }

  const profile = await fetchProfile(user.id);

  return {
    isAuthenticated: true,
    user,
    profile,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. LOGOUT
//
// Signs the user out from Supabase Auth.
// Supabase removes the session from localStorage automatically.
// ─────────────────────────────────────────────────────────────────────────────

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
  return { message: "Logged out successfully" };
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. ON AUTH STATE CHANGE (listener)
//
// Supabase fires this callback whenever the auth state changes:
//   - SIGNED_IN   (login, email verification, token refresh)
//   - SIGNED_OUT  (logout, token expiry)
//   - TOKEN_REFRESHED
//
// Usage:
//   const { data: { subscription } } = listenToAuthChanges((event, session) => {
//     dispatch(handleAuthStateChange({ event, session }))
//   })
//
//   // cleanup on unmount:
//   subscription.unsubscribe()
// ─────────────────────────────────────────────────────────────────────────────

export const listenToAuthChanges = (callback) => {
  return supabase.auth.onAuthStateChange(callback);
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. RESEND VERIFICATION EMAIL
//
// If the user asks to resend the confirmation email.
// ─────────────────────────────────────────────────────────────────────────────

export const resendVerificationEmail = async (email) => {
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
  });
  if (error) throw new Error(error.message);
  return { message: "Verification email resent. Please check your inbox." };
};

// ─────────────────────────────────────────────────────────────────────────────
// 7. FORGOT PASSWORD
//
// Sends a password reset link to the user's email (Supabase built-in).
// User clicks the link → lands on /update-password → calls updatePassword()
// ─────────────────────────────────────────────────────────────────────────────

export const forgotPassword = async (email) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    // Supabase appends the recovery token to this URL as a query param.
    // detectSessionInUrl: true (in supabaseClient.js) intercepts it automatically,
    // sets the temp session, and fires onAuthStateChange with SIGNED_IN event.
    redirectTo: `${window.location.origin}/update-password`,
  });
  if (error) throw new Error(error.message);
  return { message: "Password reset link sent to your email. Please check your inbox." };
};

// ─────────────────────────────────────────────────────────────────────────────
// 8. UPDATE PASSWORD
//
// Called after the user follows the reset link (Supabase sets a temp session).
// The user must be in an active reset session (URL contains #access_token).
// ─────────────────────────────────────────────────────────────────────────────

export const updatePassword = async (newPassword) => {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw new Error(error.message);
  return { message: "Password updated successfully." };
};

// ─────────────────────────────────────────────────────────────────────────────
// 9. FETCH PROFILE (exported for use in components if needed)
// ─────────────────────────────────────────────────────────────────────────────

export { fetchProfile };
