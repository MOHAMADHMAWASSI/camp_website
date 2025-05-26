/*
  # Fix profiles table RLS policies

  1. Changes
    - Drop existing RLS policies that cause infinite recursion
    - Create new, optimized policies for profiles table:
      - Allow admins to manage all profiles
      - Allow users to read and update their own profiles
      - Allow new user registration
    
  2. Security
    - Enable RLS on profiles table
    - Add policies for:
      - Admin access (all operations)
      - Self-management (read/update own profile)
      - Registration (insert new profile)
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
  role = 'admin'
)
WITH CHECK (
  role = 'admin'
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
    -- Prevent users from escalating their role
    (role IS NOT DISTINCT FROM OLD.role)
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

-- Add policy for admin user creation
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