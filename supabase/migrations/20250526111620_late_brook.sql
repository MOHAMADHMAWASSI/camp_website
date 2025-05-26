/*
  # Add Cabin Policies and Amenities Support

  1. New Tables
    - `cabin_policies`
      - `id` (uuid, primary key)
      - `cabin_id` (uuid, references cabins)
      - `policy_type` (text)
      - `description` (text)
      - `created_at` (timestamp)
    
    - `cabin_amenity_categories`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `icon` (text)
      - `created_at` (timestamp)

  2. Changes
    - Add new columns to `cabin_amenities`:
      - `category_id` (uuid, references cabin_amenity_categories)
      - `details` (jsonb)

  3. Security
    - Enable RLS on new tables
    - Add policies for public viewing and admin management
*/

-- Create cabin_policies table
CREATE TABLE IF NOT EXISTS cabin_policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cabin_id uuid REFERENCES cabins(id) ON DELETE CASCADE,
  policy_type text NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create cabin_amenity_categories table
CREATE TABLE IF NOT EXISTS cabin_amenity_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  icon text,
  created_at timestamptz DEFAULT now()
);

-- Add new columns to cabin_amenities
ALTER TABLE cabin_amenities
ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES cabin_amenity_categories(id),
ADD COLUMN IF NOT EXISTS details jsonb DEFAULT '{}';

-- Enable RLS
ALTER TABLE cabin_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE cabin_amenity_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for cabin_policies
CREATE POLICY "Public can view cabin policies"
  ON cabin_policies
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage cabin policies"
  ON cabin_policies
  FOR ALL
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create policies for cabin_amenity_categories
CREATE POLICY "Public can view cabin amenity categories"
  ON cabin_amenity_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage cabin amenity categories"
  ON cabin_amenity_categories
  FOR ALL
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Insert default amenity categories
INSERT INTO cabin_amenity_categories (name, icon) VALUES
  ('Kitchen', 'utensils'),
  ('Bathroom', 'shower'),
  ('Bedroom', 'bed'),
  ('Entertainment', 'tv'),
  ('Climate Control', 'thermometer'),
  ('Outdoor', 'sun'),
  ('Accessibility', 'wheelchair'),
  ('Safety', 'shield'),
  ('Connectivity', 'wifi')
ON CONFLICT (name) DO NOTHING;