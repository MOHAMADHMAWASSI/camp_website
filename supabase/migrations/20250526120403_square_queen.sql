/*
  # Create Admin User

  1. Changes
    - Creates an admin user in auth.users table
    - Creates matching profile in public.profiles table
    
  2. Security
    - Sets up initial admin credentials
    - Password is hashed using bcrypt
*/

-- Create admin user in auth.users
DO $$
DECLARE
  admin_id uuid;
BEGIN
  -- Insert admin user and get the ID
  INSERT INTO auth.users (
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
    'admin@wildscape.com',
    crypt('Admin123!', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Admin","last_name":"User"}',
    false,
    'authenticated'
  ) RETURNING id INTO admin_id;

  -- Create matching profile
  INSERT INTO public.profiles (
    id,
    email,
    first_name,
    last_name,
    role,
    language,
    created_at
  ) VALUES (
    admin_id,
    'admin@wildscape.com',
    'Admin',
    'User',
    'admin',
    'en',
    now()
  );
END $$;