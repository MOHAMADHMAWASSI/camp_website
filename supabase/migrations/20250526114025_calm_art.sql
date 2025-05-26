/*
  # Fix Cabins RLS Policy

  1. Changes
    - Drop and recreate the RLS policy for inserting cabins to fix the policy check
    - Simplify the policy to use a single condition instead of separate qual and with_check
    - Ensure admins can properly insert new cabins

  2. Security
    - Maintains RLS enabled on cabins table
    - Ensures only admins can insert new cabins
    - Keeps existing policies for other operations
*/

-- Drop the existing insert policy
DROP POLICY IF EXISTS "Admins can insert cabins" ON cabins;

-- Create a new, properly configured insert policy
CREATE POLICY "Admins can insert cabins" ON cabins
FOR INSERT
TO public
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);