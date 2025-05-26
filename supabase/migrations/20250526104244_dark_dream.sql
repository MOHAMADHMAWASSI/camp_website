/*
  # Create Activities and Cabins Schema

  1. New Tables
    - `activities`
      - Basic info (name, description, duration, difficulty)
      - Pricing and availability (price, available_spots)
      - Media (images, icon)
      - Categorization (type, season)
      - Location and relationships
      - Timestamps
    - `cabins`
      - Basic info (name, description, price, capacity)
      - Category and location
      - Timestamps
    - `cabin_amenities`
      - Amenities for each cabin
    - `cabin_images`
      - Images for each cabin
    - `cabin_availability`
      - Availability periods for cabins

  2. Security
    - Enable RLS on all tables
    - Public read access
    - Admin-only write access
    - Appropriate constraints and checks

  3. Triggers
    - Updated_at timestamp maintenance
*/

-- Create enum for cabin categories
CREATE TYPE cabin_category AS ENUM ('standard', 'family', 'luxury', 'group');

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  duration text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('easy', 'moderate', 'challenging')),
  price numeric NOT NULL CHECK (price >= 0),
  images text[] DEFAULT '{}',
  icon text,
  season text[] DEFAULT '{}' CHECK (season <@ ARRAY['spring', 'summer', 'fall', 'winter']),
  type text NOT NULL CHECK (type IN ('Sport', 'Relaxation', 'Discovery', 'Family-Friendly', 'Night Adventures')),
  location text NOT NULL,
  available_spots integer NOT NULL CHECK (available_spots >= 0),
  available_dates date[] DEFAULT '{}',
  related_activities uuid[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

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
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE cabins ENABLE ROW LEVEL SECURITY;
ALTER TABLE cabin_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE cabin_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE cabin_availability ENABLE ROW LEVEL SECURITY;

-- Create policies for activities
CREATE POLICY "Public can view activities"
  ON activities
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage activities"
  ON activities
  FOR ALL
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create policies for cabins
CREATE POLICY "Public can view cabins"
  ON cabins
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage cabins"
  ON cabins
  FOR ALL
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create policies for cabin amenities
CREATE POLICY "Public can view cabin amenities"
  ON cabin_amenities
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage cabin amenities"
  ON cabin_amenities
  FOR ALL
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create policies for cabin images
CREATE POLICY "Public can view cabin images"
  ON cabin_images
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage cabin images"
  ON cabin_images
  FOR ALL
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create policies for cabin availability
CREATE POLICY "Public can view cabin availability"
  ON cabin_availability
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage cabin availability"
  ON cabin_availability
  FOR ALL
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_activities_updated_at
  BEFORE UPDATE ON activities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_cabins_updated_at
  BEFORE UPDATE ON cabins
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();