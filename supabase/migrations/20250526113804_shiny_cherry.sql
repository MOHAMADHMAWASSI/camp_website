/*
  # Add RLS policies for cabins table

  1. Security Changes
    - Enable RLS on cabins table
    - Add policies for:
      - Public read access
      - Admin full access
      - Insert policy for admins
*/

-- Enable RLS if not already enabled
ALTER TABLE cabins ENABLE ROW LEVEL SECURITY;

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