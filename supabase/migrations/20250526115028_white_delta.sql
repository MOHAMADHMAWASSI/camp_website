/*
  # Fix RLS policies for cabins table

  1. Changes
    - Drop all existing policies on the cabins table
    - Create new policies with proper role checks and permissions
    - Ensure policies are properly scoped for each operation type

  2. Security
    - Enable RLS on cabins table
    - Allow public read access to all cabins
    - Restrict insert/update/delete operations to admin users only
    - Add proper role checks using profiles table
*/

-- First ensure RLS is enabled
ALTER TABLE cabins ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Enable read access for all users" ON cabins;
DROP POLICY IF EXISTS "Enable insert for admin users only" ON cabins;
DROP POLICY IF EXISTS "Enable update for admin users only" ON cabins;
DROP POLICY IF EXISTS "Enable delete for admin users only" ON cabins;

-- Create new policies with proper role checks

-- Allow anyone to read cabins
CREATE POLICY "Enable read access for all users"
ON cabins FOR SELECT
TO public
USING (true);

-- Allow only admins to insert new cabins
CREATE POLICY "Enable insert for admin users only"
ON cabins FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Allow only admins to update cabins
CREATE POLICY "Enable update for admin users only"
ON cabins FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Allow only admins to delete cabins
CREATE POLICY "Enable delete for admin users only"
ON cabins FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);