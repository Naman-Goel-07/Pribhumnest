import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authService from "../../src/services/authService.js";

// ─────────────────────────────────────────────────────────────────────────────
// AUTH ARCHITECTURE:
// All authentication is handled via Supabase Auth (client-side SDK).
// The Express backend only handles: property CRUD and admin management.
// Email delivery is routed through Resend SMTP, configured in Supabase Dashboard.
// ─────────────────────────────────────────────────────────────────────────────

// ── THUNK: userLogin ──────────────────────────────────────────────────────────
// supabase.auth.signInWithPassword()
// Guards against unverified emails via email_confirmed_at check.

export const userLogin = createAsyncThunk(
  "user/login",
  async ({ email, password }, thunkApi) => {
    try {
      return await authService.login({ email, password });
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

// ── THUNK: userRegister ───────────────────────────────────────────────────────
// supabase.auth.signUp()
// Supabase sends verification email via Resend SMTP automatically.
// Returns { needsEmailVerification: true } when email confirmation is enabled.

export const userRegister = createAsyncThunk(
  "user/register",
  async ({ name, email, password, contact }, thunkApi) => {
    try {
      return await authService.signUp({ name, email, password, contact });
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

// ── THUNK: getAccess ──────────────────────────────────────────────────────────
// supabase.auth.getSession()
// Replaces the old axios GET /api/user/getAccess.
// Restores session from Supabase's localStorage on cold start — no network call needed.

export const getAccess = createAsyncThunk(
  "user/getAccess",
  async (_, thunkApi) => {
    try {
      return await authService.getSession();
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

// ── THUNK: logoutUser ─────────────────────────────────────────────────────────
// supabase.auth.signOut()
// Clears localStorage session. onAuthStateChange fires SIGNED_OUT → Redux cleared.

export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (_, thunkApi) => {
    try {
      await authService.logout();
      return { message: "Logged out successfully" };
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

// ── THUNK: forgotPassword ─────────────────────────────────────────────────────
// supabase.auth.resetPasswordForEmail()
// Supabase sends a password reset email via Resend SMTP automatically.
// No custom backend call needed.

export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async ({ email }, thunkApi) => {
    try {
      return await authService.forgotPassword(email);
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

// ── THUNK: updatepassword ─────────────────────────────────────────────────────
// supabase.auth.updateUser({ password })
// Called on the UpdatePassword page after user follows the reset link.
// Supabase sets a temporary session from the reset token in the URL.

export const updatepassword = createAsyncThunk(
  "user/updatepassword",
  async ({ newPassword }, thunkApi) => {
    try {
      return await authService.updatePassword(newPassword);
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

// ── THUNK: resendVerificationEmail ────────────────────────────────────────────
// supabase.auth.resend({ type: 'signup', email })
// Used on the EmailVerificationPending page.

export const resendVerificationEmail = createAsyncThunk(
  "user/resendVerificationEmail",
  async (email, thunkApi) => {
    try {
      return await authService.resendVerificationEmail(email);
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

// ── THUNK: getAllUsers (Admin — Express backend) ───────────────────────────────

export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async (_, thunkApi) => {
    try {
      const axios = (await import("axios")).default;
      const BASE = import.meta.env.VITE_BACKEND_URL;
      const response = await axios.get(`${BASE}/api/user/allUsers`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ── THUNK: updateRole (Admin — Express backend) ───────────────────────────────

export const updateRole = createAsyncThunk(
  "user/updateRole",
  async ({ id, role }, thunkApi) => {
    try {
      const axios = (await import("axios")).default;
      const BASE = import.meta.env.VITE_BACKEND_URL;
      const response = await axios.patch(
        `${BASE}/api/user/update-role/${id}`,
        { role },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ── THUNK: deleteUser (Admin — Express backend) ───────────────────────────────

export const deleteUser = createAsyncThunk(
  "user/delete",
  async (id, thunkApi) => {
    try {
      const axios = (await import("axios")).default;
      const BASE = import.meta.env.VITE_BACKEND_URL;
      const response = await axios.delete(
        `${BASE}/api/user/delete-user/${id}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// INITIAL STATE
// ─────────────────────────────────────────────────────────────────────────────

const initialState = {
  isAuthenticated: false,
  loading: true,         // true on startup while getSession() runs
  error: null,

  users: null,           // Supabase auth user object
  role: null,            // 'user' | 'admin' | 'pg_owner'
  profile: null,         // { id, name, email, contact, role }

  needsEmailVerification: false,
  pendingEmail: null,    // email awaiting Supabase confirmation

  allUsers: [],          // admin: all profiles
};

// ─────────────────────────────────────────────────────────────────────────────
// SLICE
// ─────────────────────────────────────────────────────────────────────────────

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    /**
     * setAuthState — called by the onAuthStateChange listener in App.jsx.
     * Handles SIGNED_IN / SIGNED_OUT events in real time.
     */
    setAuthState(state, action) {
      const { isAuthenticated, user, profile } = action.payload;
      state.isAuthenticated = isAuthenticated;
      state.users = user;
      state.profile = profile;
      state.role = profile?.role || null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Login ─────────────────────────────────────────────────────────────
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.users = action.payload.user;
        state.profile = action.payload.profile;
        state.role = action.payload.profile?.role || "user";
        state.error = null;
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      })

      // ── Register ──────────────────────────────────────────────────────────
      .addCase(userRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userRegister.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.needsEmailVerification) {
          state.needsEmailVerification = true;
          state.pendingEmail = action.payload.user?.email || null;
          state.isAuthenticated = false;
        } else {
          // Email confirmation disabled in Supabase dashboard
          state.isAuthenticated = true;
          state.users = action.payload.user;
          state.profile = action.payload.profile;
          state.role = action.payload.profile?.role || "user";
        }
      })
      .addCase(userRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── getAccess (session restore) ───────────────────────────────────────
      .addCase(getAccess.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAccess.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = action.payload.isAuthenticated;
        state.users = action.payload.user || null;
        state.profile = action.payload.profile || null;
        state.role = action.payload.profile?.role || null;
      })
      .addCase(getAccess.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
      })

      // ── Logout ────────────────────────────────────────────────────────────
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        return { ...initialState, loading: false }; // full state reset
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── forgotPassword ────────────────────────────────────────────────────
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── updatepassword ────────────────────────────────────────────────────
      .addCase(updatepassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatepassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updatepassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Admin: getAllUsers ─────────────────────────────────────────────────
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.allUsers = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Admin: updateRole ─────────────────────────────────────────────────
      .addCase(updateRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload.user || action.payload;
        state.allUsers = state.allUsers.map((u) =>
          u.id === updatedUser.id ? updatedUser : u
        );
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Admin: deleteUser ─────────────────────────────────────────────────
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setAuthState } = userSlice.actions;
export default userSlice.reducer;
