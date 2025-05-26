/*
  # Fix Activities RLS Policies

  1. Changes
    - Drop existing RLS policies for activities table
    - Recreate policies with proper USING and WITH CHECK clauses
    - Ensure admin users can perform all operations including INSERT

  2. Security
    - Maintains public read access
    - Ensures only admins can modify data
    - Properly handles all operations (SELECT, INSERT, UPDATE, DELETE)
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

-- Allow admin full access with proper checks
CREATE POLICY "Admins can manage activities"
ON activities
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