/*
  # Cabin Calendar Schema

  1. New Tables
    - `cabin_time_slots`
      - `id` (uuid, primary key)
      - `cabin_id` (uuid, references cabins)
      - `start_time` (time)
      - `end_time` (time)
      - `is_active` (boolean)
      - `created_at` (timestamp)

    - `holidays`
      - `id` (uuid, primary key)
      - `name` (text)
      - `date` (date)
      - `is_recurring` (boolean)
      - `created_at` (timestamp)

    - `cabin_reservations`
      - `id` (uuid, primary key)
      - `cabin_id` (uuid, references cabins)
      - `user_id` (uuid, references auth.users)
      - `start_date` (date)
      - `end_date` (date)
      - `start_time` (time)
      - `end_time` (time)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for admin access and public read access
*/

-- Create cabin_time_slots table
CREATE TABLE IF NOT EXISTS cabin_time_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cabin_id uuid REFERENCES cabins(id) ON DELETE CASCADE,
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_time_range CHECK (start_time < end_time)
);

-- Create holidays table
CREATE TABLE IF NOT EXISTS holidays (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  date date NOT NULL,
  is_recurring boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create cabin_reservations table
CREATE TABLE IF NOT EXISTS cabin_reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cabin_id uuid REFERENCES cabins(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  start_date date NOT NULL,
  end_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_date_range CHECK (start_date <= end_date)
);

-- Enable RLS
ALTER TABLE cabin_time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE cabin_reservations ENABLE ROW LEVEL SECURITY;

-- Create policies for cabin_time_slots
CREATE POLICY "Enable all operations for admin users on cabin_time_slots"
  ON cabin_time_slots
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

CREATE POLICY "Enable read access for all users on cabin_time_slots"
  ON cabin_time_slots
  FOR SELECT
  TO public
  USING (true);

-- Create policies for holidays
CREATE POLICY "Enable all operations for admin users on holidays"
  ON holidays
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

CREATE POLICY "Enable read access for all users on holidays"
  ON holidays
  FOR SELECT
  TO public
  USING (true);

-- Create policies for cabin_reservations
CREATE POLICY "Enable all operations for admin users on cabin_reservations"
  ON cabin_reservations
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

CREATE POLICY "Enable read access for all users on cabin_reservations"
  ON cabin_reservations
  FOR SELECT
  TO public
  USING (true);

-- Create updated_at trigger for cabin_reservations
CREATE TRIGGER update_cabin_reservations_updated_at
  BEFORE UPDATE ON cabin_reservations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();