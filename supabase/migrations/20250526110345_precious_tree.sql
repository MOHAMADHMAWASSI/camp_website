/*
  # Fix Activities RLS Policies

  1. Changes
    - Drop existing RLS policies for activities table
    - Create new comprehensive RLS policies that properly handle all operations
    
  2. Security
    - Enable RLS on activities table (ensuring it's enabled)
    - Add policies for:
      - Public read access to all activities
      - Admin-only create/update/delete access
*/

-- First ensure RLS is enabled
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Public can view activities" ON activities;
DROP POLICY IF EXISTS "Admins can manage activities" ON activities;

-- Create comprehensive policies

-- Allow public read access
CREATE POLICY "Public can view activities"
ON activities
FOR SELECT
TO public
USING (true);

-- Allow admin full access (including INSERT)
CREATE POLICY "Admins can manage activities"
ON activities
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