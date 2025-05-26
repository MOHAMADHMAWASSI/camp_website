/*
  # Add RLS policies for pricing rules

  1. Changes
    - Enable RLS on pricing_rules table
    - Add policies for admin users to manage pricing rules
    - Add policy for public users to view pricing rules

  2. Security
    - Enable RLS on pricing_rules table
    - Add policies for:
      - Admin users can perform all operations
      - Public users can view pricing rules
*/

-- Enable RLS
ALTER TABLE pricing_rules ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable all operations for admin users"
  ON public.pricing_rules
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Enable read access for all users"
  ON public.pricing_rules
  FOR SELECT
  TO public
  USING (true);