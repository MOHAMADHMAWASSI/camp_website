/*
  # Update Cabins RLS Policies

  1. Security
    - Enable RLS on cabins table
    - Add policy for public read access
    - Add policy for admin management
*/

-- Enable RLS if not already enabled
ALTER TABLE cabins ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ BEGIN
  DROP POLICY IF EXISTS "Public can view cabins" ON cabins;
  DROP POLICY IF EXISTS "Admins can manage cabins" ON cabins;
END $$;

-- Allow public read access to all cabins
CREATE POLICY "Public can view cabins"
ON cabins
FOR SELECT
TO public
USING (true);

-- Allow admins to manage cabins (all operations)
CREATE POLICY "Admins can manage cabins"
ON cabins
FOR ALL
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