/*
  # Add INSERT policy for cabins table

  1. Security Changes
    - Add RLS policy to allow admins to insert new cabins
    - This complements existing policies that allow admins to manage cabins
    - Ensures proper authorization checks for cabin creation

  Note: This policy specifically targets the INSERT operation which was missing from
  the previous ALL policy configuration
*/

CREATE POLICY "Admins can insert cabins"
ON public.cabins
FOR INSERT
TO public
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);