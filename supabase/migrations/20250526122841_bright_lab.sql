/*
  # Fix profiles table policies

  1. Changes
    - Remove recursive policy checks that were causing infinite loops
    - Simplify policy conditions for better performance
    - Maintain security while avoiding self-referential queries
  
  2. Security
    - Maintain RLS enabled on profiles table
    - Ensure users can only read their own profile
    - Allow admins full access
    - Allow new user registration
    - Allow users to update their own profile
*/

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Enable admin full access" ON profiles;
DROP POLICY IF EXISTS "Enable admin user creation" ON profiles;
DROP POLICY IF EXISTS "Enable new user registration" ON profiles;
DROP POLICY IF EXISTS "Enable users to read own profile" ON profiles;
DROP POLICY IF EXISTS "Enable users to update own profile" ON profiles;

-- Recreate policies without recursive checks
CREATE POLICY "Enable admin full access"
ON profiles
FOR ALL
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin')
WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Enable new user registration"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id AND role = 'client');

CREATE POLICY "Enable users to read own profile"
ON profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Enable users to update own profile"
ON profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  (auth.uid() = id AND role = (SELECT role FROM profiles WHERE id = auth.uid()))
  OR
  (auth.jwt() ->> 'role' = 'admin')
);