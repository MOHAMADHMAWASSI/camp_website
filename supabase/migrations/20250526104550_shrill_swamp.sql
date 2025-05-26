/*
  # Create activities and cabins tables

  1. Tables
    - activities (main activities table)
    - cabins (main cabins table)
    - cabin_amenities (cabin amenities junction table)
    - cabin_images (cabin images table)
    - cabin_availability (cabin availability table)

  2. Security
    - Enable RLS on all tables
    - Create policies for public viewing
    - Create policies for admin management

  3. Triggers
    - Add updated_at triggers for activities and cabins
*/

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