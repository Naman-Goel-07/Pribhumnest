-- ============================================================
-- PRIBHUMNEST - FULL DATABASE SCHEMA
-- Run this in your Supabase SQL Editor
-- ============================================================

-- ----------------------------------------------------------------
-- EXTENSION: Enable UUID generation
-- ----------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------
-- TABLE: profiles
-- Extends auth.users with role and contact info.
-- Auto-populated via a trigger on auth.users insert.
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL DEFAULT '',
  email       TEXT UNIQUE NOT NULL,
  contact     TEXT DEFAULT '',
  role        TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'pg_owner')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- TABLE: properties
-- Core PG listing data.
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.properties (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id          UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title             TEXT NOT NULL,
  locality          TEXT NOT NULL,
  city              TEXT NOT NULL,
  gender            TEXT NOT NULL CHECK (gender IN ('Boys', 'Girls', 'Co-Living')),
  lock_in_period    INTEGER NOT NULL DEFAULT 1,
  electricity       NUMERIC(10, 2) NOT NULL DEFAULT 0,
  sharing           JSONB NOT NULL DEFAULT '{}',   -- { "Single": 3500, "Double": 2500, "Triple": 2000 }
  common_facilities JSONB NOT NULL DEFAULT '{}',   -- { "WiFi": true, "Mattress": true, ... }
  safety            JSONB NOT NULL DEFAULT '{}',   -- { "CCTV": true, "Guard": false }
  bills_included    JSONB NOT NULL DEFAULT '{}',   -- { "Water": true, "Gas": false }
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- TABLE: property_images
-- Normalised 1:N relationship: one property -> many images.
-- Stores public Supabase Storage URLs.
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.property_images (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id  UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  image_url    TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- TABLE: enquiries
-- User-to-Property contact logs.
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.enquiries (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id   UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  contact       TEXT NOT NULL,
  message       TEXT DEFAULT '',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- TABLE: registration_otps
-- Temporary OTP storage for email verification pre-registration.
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.registration_otps (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email      TEXT NOT NULL,
  otp        TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '10 minutes'),
  used       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- INDEXES: For performance on common queries
-- ----------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_properties_city     ON public.properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_gender   ON public.properties(gender);
CREATE INDEX IF NOT EXISTS idx_properties_owner    ON public.properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_property_images_pid ON public.property_images(property_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_pid       ON public.enquiries(property_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_uid       ON public.enquiries(user_id);
CREATE INDEX IF NOT EXISTS idx_reg_otps_email      ON public.registration_otps(email);

-- ----------------------------------------------------------------
-- TRIGGER: Auto-create profile on auth.users insert
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, contact)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'contact', '')
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ----------------------------------------------------------------
-- TRIGGER: Auto-update updated_at timestamps
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- ================================================================
-- ROW LEVEL SECURITY POLICIES
-- ================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registration_otps ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------
-- PROFILES policies
-- ----------------------------------------------------------------
-- Anyone can view profiles (needed for owner lookup)
CREATE POLICY "profiles_public_read" ON public.profiles
  FOR SELECT USING (TRUE);

-- Users can update ONLY their own profile
CREATE POLICY "profiles_owner_update" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Service role can do anything (admin backend bypass using service key)
-- This is implicit when using the service role key - no policy needed.

-- ----------------------------------------------------------------
-- PROPERTIES policies
-- ----------------------------------------------------------------
-- Public read: anyone (anon or authenticated) can view active properties
CREATE POLICY "properties_public_read" ON public.properties
  FOR SELECT USING (is_active = TRUE);

-- Insert: only authenticated users can add properties
CREATE POLICY "properties_auth_insert" ON public.properties
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Update: owner can update their own property
CREATE POLICY "properties_owner_update" ON public.properties
  FOR UPDATE USING (auth.uid() = owner_id);

-- Delete: owner can delete their own property
CREATE POLICY "properties_owner_delete" ON public.properties
  FOR DELETE USING (auth.uid() = owner_id);

-- ----------------------------------------------------------------
-- PROPERTY_IMAGES policies
-- ----------------------------------------------------------------
-- Public read: anyone can view images of active properties
CREATE POLICY "property_images_public_read" ON public.property_images
  FOR SELECT USING (TRUE);

-- Insert/Delete: owner of the parent property
CREATE POLICY "property_images_owner_insert" ON public.property_images
  FOR INSERT WITH CHECK (
    auth.uid() = (SELECT owner_id FROM public.properties WHERE id = property_id)
  );

CREATE POLICY "property_images_owner_delete" ON public.property_images
  FOR DELETE USING (
    auth.uid() = (SELECT owner_id FROM public.properties WHERE id = property_id)
  );

-- ----------------------------------------------------------------
-- ENQUIRIES policies
-- ----------------------------------------------------------------
-- Authenticated users can insert enquiries
CREATE POLICY "enquiries_auth_insert" ON public.enquiries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can view their own enquiries
CREATE POLICY "enquiries_owner_read" ON public.enquiries
  FOR SELECT USING (auth.uid() = user_id);

-- Property owners can see enquiries for their properties
CREATE POLICY "enquiries_pg_owner_read" ON public.enquiries
  FOR SELECT USING (
    auth.uid() = (SELECT owner_id FROM public.properties WHERE id = property_id)
  );

-- ----------------------------------------------------------------
-- REGISTRATION_OTPS policies
-- ----------------------------------------------------------------
-- No public access - all access via service role in backend only
CREATE POLICY "reg_otp_no_public_access" ON public.registration_otps
  FOR ALL USING (FALSE);

-- ================================================================
-- STORAGE BUCKET SETUP (Run in SQL Editor)
-- ================================================================
-- NOTE: First create the bucket in the Supabase Dashboard:
--   Storage > New Bucket > Name: "property-images" > Public: TRUE
-- Then apply these policies:

-- Allow public read of storage objects
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', TRUE)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "property_images_storage_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'property-images');

CREATE POLICY "property_images_storage_auth_upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'property-images' AND auth.role() = 'authenticated'
  );

CREATE POLICY "property_images_storage_owner_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'property-images' AND auth.uid()::text = (storage.foldername(name))[1]
  );
