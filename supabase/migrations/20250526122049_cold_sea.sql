/*
  # Add newsletter and maintenance tables

  1. New Tables
    - newsletter_subscribers
      - id (uuid, primary key)
      - email (text, unique)
      - created_at (timestamp)
    - cabin_blocked_dates
      - id (uuid, primary key)
      - cabin_id (uuid, foreign key to cabins)
      - start_date (date)
      - end_date (date)
      - reason (text)
      - type (text)
      - notes (text)
    - pricing_rules
      - id (uuid, primary key)
      - name (text)
      - type (text)
      - condition (jsonb)
      - adjustment (numeric)
      - adjustment_type (text)
      - priority (integer)
      - active (boolean)

  2. Security
    - Enable RLS on all tables
    - Add policies for public and admin access
*/

-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create cabin_blocked_dates table
CREATE TABLE IF NOT EXISTS cabin_blocked_dates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cabin_id uuid REFERENCES cabins(id) ON DELETE CASCADE,
  start_date date NOT NULL,
  end_date date NOT NULL,
  reason text NOT NULL,
  type text NOT NULL CHECK (type IN ('maintenance', 'renovation', 'private')),
  notes text,
  created_at timestamptz DEFAULT now(),
  CHECK (start_date <= end_date)
);

-- Create pricing_rules table
CREATE TABLE IF NOT EXISTS pricing_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('season', 'day', 'occupancy')),
  condition jsonb NOT NULL DEFAULT '{}',
  adjustment numeric NOT NULL,
  adjustment_type text NOT NULL CHECK (adjustment_type IN ('percentage', 'fixed')),
  priority integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE cabin_blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_rules ENABLE ROW LEVEL SECURITY;

-- Create policies for newsletter_subscribers
CREATE POLICY "Enable insert for all users"
  ON newsletter_subscribers
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Enable read for admin users only"
  ON newsletter_subscribers
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create policies for cabin_blocked_dates
CREATE POLICY "Enable read for all users"
  ON cabin_blocked_dates
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable all for admin users"
  ON cabin_blocked_dates
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create policies for pricing_rules
CREATE POLICY "Enable read for all users"
  ON pricing_rules
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable all for admin users"
  ON pricing_rules
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );