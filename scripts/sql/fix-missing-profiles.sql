-- Migration: Fix Missing Profiles Issue
-- This migration addresses the issue where users exist in auth.users but don't have corresponding profiles
-- Created: 2025-08-03

-- Function to create missing profiles for existing users
CREATE OR REPLACE FUNCTION create_missing_profiles()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert profiles for users who don't have one
  INSERT INTO public.profiles (id, username, full_name, avatar_url, created_at, updated_at, role)
  SELECT 
    u.id,
    COALESCE(u.raw_user_meta_data->>'username', 'user_' || SUBSTR(u.id::text, 1, 8)),
    COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name'),
    u.raw_user_meta_data->>'avatar_url',
    NOW(),
    NOW(),
    'user'
  FROM auth.users u
  LEFT JOIN public.profiles p ON u.id = p.id
  WHERE p.id IS NULL;
  
  -- Log the number of profiles created
  RAISE NOTICE 'Created % missing profiles', (
    SELECT COUNT(*)
    FROM auth.users u
    LEFT JOIN public.profiles p ON u.id = p.id
    WHERE p.id IS NULL
  );
END;
$$;

-- Function to check for missing profiles (diagnostic)
CREATE OR REPLACE FUNCTION check_missing_profiles()
RETURNS TABLE(user_id UUID, email TEXT, created_at TIMESTAMPTZ)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.email, u.created_at
  FROM auth.users u
  LEFT JOIN public.profiles p ON u.id = p.id
  WHERE p.id IS NULL
  ORDER BY u.created_at DESC;
END;
$$;

-- Run the migration to fix any existing missing profiles
SELECT create_missing_profiles();

-- Show results
SELECT 'Missing profiles check:' as status;
SELECT * FROM check_missing_profiles();

-- Add comment for documentation
COMMENT ON FUNCTION create_missing_profiles() IS 
'Creates profiles for users who exist in auth.users but are missing from public.profiles table. This fixes the issue where deleting profiles manually breaks the signup flow.';

COMMENT ON FUNCTION check_missing_profiles() IS 
'Returns a list of users who exist in auth.users but are missing from public.profiles table for diagnostic purposes.';
