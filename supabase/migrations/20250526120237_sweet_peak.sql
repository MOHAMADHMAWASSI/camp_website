/*
  # Create Admin User

  1. Changes
    - Creates an admin user in the auth.users table
    - Creates corresponding admin profile in profiles table
    - Sets up proper foreign key relationship

  2. Security
    - Creates a secure admin account
    - Maintains referential integrity
*/

-- First create the user in auth.users
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000000',
  'admin@wildscape.com',
  crypt('Admin123!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"first_name":"Admin","last_name":"User"}',
  false,
  'authenticated'
) ON CONFLICT (id) DO NOTHING;

-- Then create the profile with the matching ID
INSERT INTO profiles (
  id,
  email,
  first_name,
  last_name,
  role,
  language,
  created_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'admin@wildscape.com',
  'Admin',
  'User',
  'admin',
  'en',
  now()
) ON CONFLICT (id) DO NOTHING;