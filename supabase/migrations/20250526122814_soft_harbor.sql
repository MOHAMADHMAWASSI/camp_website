/*
  # Fix profiles table RLS policies
  
  1. Security Changes
    - Drop existing policies
    - Add new policies for admin access
    - Add policies for user self-management
    - Add policies for new user registration
  
  2. Changes
    - Fix OLD table reference in update policy
    - Optimize policy conditions
    - Ensure proper role management
*/

-- First, drop existing policies to prevent conflicts
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create new, optimized policies
CREATE POLICY "Enable admin full access"
ON profiles
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Enable users to read own profile"
ON profiles
FOR SELECT
TO authenticated
USING (
  auth.uid() = id
);

CREATE POLICY "Enable users to update own profile"
ON profiles
FOR UPDATE
TO authenticated
USING (
  auth.uid() = id
)
WITH CHECK (
  auth.uid() = id
  AND (
    -- Users can only update non-role fields
    role = (SELECT role FROM profiles WHERE id = auth.uid())
    OR
    -- Unless they're an admin
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
);

CREATE POLICY "Enable new user registration"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = id
  AND role = 'client'
);

CREATE POLICY "Enable admin user creation"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);