-- ============================================================
-- MIGRATION: Drop custom OTP system (run in Supabase SQL Editor)
-- Custom OTP replaced by Supabase Auth native email verification.
-- ============================================================

-- Drop the registration_otps table (no longer used)
DROP TABLE IF EXISTS public.registration_otps;

-- Drop the index (already removed with the table, but kept for safety)
DROP INDEX IF EXISTS idx_reg_otps_email;

-- No other schema changes needed.
-- Supabase Auth handles:
--   - Email verification  (signup confirmation link)
--   - Password reset      (recovery link)
-- Both are delivered via the SMTP provider configured below.
