/*
  # Create Admin User and Profile

  1. Changes
    - Creates an admin user in auth.users table
    - Creates matching profile in public.profiles table
    - Sets up admin credentials for the application

  2. Security
    - Password is properly hashed using bcrypt
    - User is created with authenticated role
    - Profile is created with admin role
*/

-- Create admin user in auth.users
WITH new_user AS (
  INSERT INTO auth.users (
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
    'admin@wildscape.com',
    crypt('Admin123!', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Admin","last_name":"User"}',
    false,
    'authenticated'
  ) RETURNING id
)
-- Create matching profile
INSERT INTO public.profiles (
  id,
  email,
  first_name,
  last_name,
  role,
  language,
  created_at
)
SELECT 
  id,
  'admin@wildscape.com',
  'Admin',
  'User',
  'admin',
  'en',
  now()
FROM new_user;