/*
  # Fix Cabins RLS Policies

  1. Changes
    - Drop existing RLS policies for cabins table
    - Create new, properly configured RLS policies:
      - Allow admins to perform all operations
      - Allow public to view cabins
      
  2. Security
    - Maintains RLS enabled on cabins table
    - Ensures proper access control for admin operations
    - Preserves public read access
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can insert cabins" ON cabins;
DROP POLICY IF EXISTS "Admins can manage cabins" ON cabins;
DROP POLICY IF EXISTS "Public can view cabins" ON cabins;

-- Recreate policies with correct configuration
CREATE POLICY "Enable read access for all users" ON cabins
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable insert for admin users only" ON cabins
  FOR INSERT
  TO public
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Enable update for admin users only" ON cabins
  FOR UPDATE
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

CREATE POLICY "Enable delete for admin users only" ON cabins
  FOR DELETE
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );