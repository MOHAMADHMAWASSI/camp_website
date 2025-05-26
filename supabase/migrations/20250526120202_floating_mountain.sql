/*
  # Create Admin Profile

  1. Changes
    - Inserts an admin user profile for testing
    - Email: admin@wildscape.com
    - Password: Admin123!
    - Role: admin
    - Language: en

  2. Security
    - Profile will be linked to Supabase auth user
    - Has admin role with full access
*/

-- Insert admin profile if it doesn't exist
INSERT INTO profiles (
  id,
  email,
  first_name,
  last_name,
  role,
  language,
  created_at
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'admin@wildscape.com',
  'Admin',
  'User',
  'admin',
  'en',
  now()
)
ON CONFLICT (id) DO NOTHING;