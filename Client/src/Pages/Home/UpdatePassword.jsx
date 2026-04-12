import { useState } from "react";
import { Button, TextField } from "@mui/material";
import key from "../../assets/key.gif";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updatepassword } from "../../../redux/Slice/userSlice.js";
import { toast } from "react-toastify";

/**
 * UpdatePassword
 *
 * Reached after the user clicks the Supabase password reset link in their email.
 * Supabase automatically sets a temporary session from the token in the URL
 * (handled by detectSessionInUrl: true in supabaseClient.js).
 *
 * We no longer need to pass an email — supabase.auth.updateUser() applies to
 * the currently active reset session automatically.
 */
const UpdatePassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword) {
      setError("Password is required");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");

    try {
      // Calls supabase.auth.updateUser({ password: newPassword })
      // Supabase uses the current session (set from the reset link token)
      await dispatch(updatepassword({ newPassword })).unwrap();
      toast.success("Password updated successfully!");
      navigate("/login");
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Failed to update password. The reset link may have expired.");
    }
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-white via-[#f1fefc] to-[#d5f5f3] px-4 min-h-screen">
      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-xl">
        <div className="flex flex-col items-center gap-3 mb-6">
          <img src={key} alt="key" className="w-[10vw] md:w-[5vw]" />
          <h2 className="text-xl font-semibold text-gray-700">Set New Password</h2>
          <p className="text-sm text-gray-500 text-center">
            Enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={Boolean(error)}
            fullWidth
          />
          <TextField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={Boolean(error)}
            helperText={error}
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            style={{ backgroundColor: "#0ABAB5", marginTop: "1rem" }}
          >
            Update Password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
