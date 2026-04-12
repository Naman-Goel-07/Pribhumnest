import { useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { resendVerificationEmail } from "../../../redux/Slice/userSlice.js";
import { MdMarkEmailRead, MdOutlineRefresh } from "react-icons/md";
import { Button } from "@mui/material";

/**
 * EmailVerificationPending
 *
 * Shown after a user signs up.
 * Allows them to resend the verification email.
 * The user will be auto-logged in when they click the email link
 * because onAuthStateChange fires a SIGNED_IN event with the session.
 */
const EmailVerificationPending = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pendingEmail, loading } = useSelector((state) => state.user);
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    if (!pendingEmail) {
      toast.error("No email address found. Please try registering again.");
      return;
    }
    try {
      await dispatch(resendVerificationEmail(pendingEmail)).unwrap();
      toast.success("Verification email resent! Please check your inbox.");
      setResent(true);
    } catch (err) {
      toast.error(err || "Failed to resend. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-[#f1fefc] to-[#d5f5f3] p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center space-y-6"
      >
        {/* Icon */}
        <div className="flex justify-center">
          <div className="bg-[#e6fffe] rounded-full p-6">
            <MdMarkEmailRead className="text-[#0ABAB5] text-6xl" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800">
          Verify Your Email
        </h1>

        <p className="text-gray-600 text-sm leading-relaxed">
          We sent a verification link to{" "}
          <span className="font-semibold text-[#0ABAB5]">
            {pendingEmail || "your email"}
          </span>
          .<br />
          Please check your inbox and click the link to activate your account.
        </p>

        <div className="bg-[#f0fffe] border border-[#0ABAB5]/30 rounded-xl p-4 text-left space-y-2">
          <p className="text-xs font-semibold text-teal-700 uppercase tracking-wide">
            What to do next:
          </p>
          <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
            <li>Open the email from Pribhumnest</li>
            <li>Click the "Confirm your email" button</li>
            <li>You'll be automatically logged in</li>
          </ul>
        </div>

        {/* Resend Button */}
        <Button
          onClick={handleResend}
          disabled={loading || resent}
          variant="contained"
          fullWidth
          startIcon={<MdOutlineRefresh />}
          style={{
            backgroundColor: resent ? "#ccc" : "#0ABAB5",
            textTransform: "none",
            fontWeight: "bold",
            borderRadius: "12px",
            padding: "12px",
          }}
        >
          {resent ? "Email Resent ✓" : "Resend Verification Email"}
        </Button>

        <p className="text-xs text-gray-400">
          Wrong email?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-[#0ABAB5] font-semibold hover:underline cursor-pointer"
          >
            Register again
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default EmailVerificationPending;
