/*
  # Create cabins management tables

  1. New Tables
    - `cabins`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (numeric)
      - `capacity` (integer)
      - `category` (text, enum)
      - `location_x` (numeric)
      - `location_y` (numeric)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    - `cabin_amenities`
      - `id` (uuid, primary key) 
      - `cabin_id` (uuid, foreign key)
      - `name` (text)
    - `cabin_images`
      - `id` (uuid, primary key)
      - `cabin_id` (uuid, foreign key)
      - `url` (text)
      - `position` (integer)
    - `cabin_availability`
      - `id` (uuid, primary key)
      - `cabin_id` (uuid, foreign key)
      - `start_date` (date)
      - `end_date` (date)
      - `is_available` (boolean)

  2. Security
    - Enable RLS on all tables
    - Add policies for admin access
    - Add policies for public read access
*/

-- Create enum for cabin categories
CREATE TYPE cabin_category AS ENUM ('standard', 'family', 'luxury', 'group');

-- Create cabins table
CREATE TABLE IF NOT EXISTS cabins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  capacity integer NOT NULL CHECK (capacity > 0),
  category cabin_category NOT NULL,
  location_x numeric,
  location_y numeric,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create cabin_amenities table
CREATE TABLE IF NOT EXISTS cabin_amenities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cabin_id uuid REFERENCES cabins(id) ON DELETE CASCADE,
  name text NOT NULL
);

-- Create cabin_images table
CREATE TABLE IF NOT EXISTS cabin_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cabin_id uuid REFERENCES cabins(id) ON DELETE CASCADE,
  url text NOT NULL,
  position integer NOT NULL DEFAULT 0
);

-- Create cabin_availability table
CREATE TABLE IF NOT EXISTS cabin_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cabin_id uuid REFERENCES cabins(id) ON DELETE CASCADE,
  start_date date NOT NULL,
  end_date date NOT NULL,
  is_available boolean NOT NULL DEFAULT true,
  CHECK (start_date <= end_date)
);

-- Enable RLS
ALTER TABLE cabins ENABLE ROW LEVEL SECURITY;
ALTER TABLE cabin_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE cabin_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE cabin_availability ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public can view cabins" ON cabins
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage cabins" ON cabins
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Public can view cabin amenities" ON cabin_amenities
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage cabin amenities" ON cabin_amenities
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Public can view cabin images" ON cabin_images
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage cabin images" ON cabin_images
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Public can view cabin availability" ON cabin_availability
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage cabin availability" ON cabin_availability
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cabins_updated_at
  BEFORE UPDATE ON cabins
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();