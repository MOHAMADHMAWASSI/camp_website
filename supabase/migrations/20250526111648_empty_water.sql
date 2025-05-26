/*
  # Add cabin policies and amenities support
  
  1. New Tables
    - cabin_policies: Stores policy information (pets, smoking, etc.)
    - cabin_amenity_categories: Organizes amenities into categories
  
  2. Changes
    - Add category and details columns to cabin_amenities table
  
  3. Security
    - Enable RLS on new tables
    - Add policies for public viewing and admin management
  
  4. Data
    - Insert default amenity categories
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
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'cabin_amenities' AND column_name = 'category_id'
  ) THEN
    ALTER TABLE cabin_amenities ADD COLUMN category_id uuid REFERENCES cabin_amenity_categories(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'cabin_amenities' AND column_name = 'details'
  ) THEN
    ALTER TABLE cabin_amenities ADD COLUMN details jsonb DEFAULT '{}';
  END IF;
END $$;

-- Enable RLS
ALTER TABLE cabin_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE cabin_amenity_categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$
BEGIN
  DROP POLICY IF EXISTS "Public can view cabin policies" ON cabin_policies;
  DROP POLICY IF EXISTS "Admins can manage cabin policies" ON cabin_policies;
  DROP POLICY IF EXISTS "Public can view cabin amenity categories" ON cabin_amenity_categories;
  DROP POLICY IF EXISTS "Admins can manage cabin amenity categories" ON cabin_amenity_categories;
END $$;

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