/*
  # Fix Cabins RLS Policies

  1. Changes
    - Drop existing RLS policies for cabins table
    - Create new, clearer policies for all operations
    - Ensure proper admin role checks
  
  2. Security
    - Maintain read access for all users
    - Restrict write operations to admin users only
    - Use proper role checks against profiles table
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable delete for admin users only" ON cabins;
DROP POLICY IF EXISTS "Enable insert for admin users only" ON cabins;
DROP POLICY IF EXISTS "Enable read access for all users" ON cabins;
DROP POLICY IF EXISTS "Enable update for admin users only" ON cabins;

-- Create new policies with proper role checks
CREATE POLICY "Enable read access for all users"
ON cabins FOR SELECT
TO public
USING (true);

CREATE POLICY "Enable insert for admin users only"
ON cabins FOR INSERT
TO public
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Enable update for admin users only"
ON cabins FOR UPDATE
TO public
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

CREATE POLICY "Enable delete for admin users only"
ON cabins FOR DELETE
TO public
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);