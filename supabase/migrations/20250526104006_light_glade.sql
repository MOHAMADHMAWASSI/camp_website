/*
  # Create activities table

  1. New Tables
    - `activities`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `duration` (interval)
      - `difficulty` (text)
      - `price` (numeric)
      - `images` (text[])
      - `icon` (text)
      - `season` (text[])
      - `type` (text)
      - `location` (text)
      - `available_spots` (integer)
      - `available_dates` (date[])
      - `related_activities` (uuid[])
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `activities` table
    - Add policies for:
      - Public read access
      - Admin write access
*/

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  duration interval NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('easy', 'moderate', 'challenging', 'expert')),
  price numeric NOT NULL CHECK (price >= 0),
  images text[] DEFAULT '{}',
  icon text,
  season text[] DEFAULT '{}' CHECK (season <@ ARRAY['spring', 'summer', 'fall', 'winter']),
  type text NOT NULL,
  location text NOT NULL,
  available_spots integer NOT NULL CHECK (available_spots >= 0),
  available_dates date[] DEFAULT '{}',
  related_activities uuid[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Create policies
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

-- Create updated_at trigger
CREATE TRIGGER update_activities_updated_at
  BEFORE UPDATE ON activities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();