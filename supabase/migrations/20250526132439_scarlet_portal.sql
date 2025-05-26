/*
  # Add payment and notification features

  1. Changes
    - Add new columns to cabin_reservations for payment tracking
    - Create payment history table
    - Create notification tracking table
    - Add RLS policies for new tables
    - Add function for checking late arrivals

  2. Security
    - Enable RLS on new tables
    - Add policies for admin and user access
*/

-- Update cabin_reservations table with new columns
ALTER TABLE cabin_reservations
ADD COLUMN payment_method text CHECK (payment_method IN ('online', 'onsite')) DEFAULT 'onsite',
ADD COLUMN payment_amount numeric DEFAULT 0,
ADD COLUMN payment_date timestamptz,
ADD COLUMN check_in_time timestamptz,
ADD COLUMN late_threshold interval DEFAULT '2 hours'::interval;

-- Create cabin_reservation_payments table
CREATE TABLE IF NOT EXISTS cabin_reservation_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id uuid REFERENCES cabin_reservations(id) ON DELETE CASCADE,
  amount numeric NOT NULL CHECK (amount > 0),
  payment_method text NOT NULL,
  payment_status text NOT NULL,
  transaction_id text,
  created_at timestamptz DEFAULT now()
);

-- Create cabin_reservation_notifications table
CREATE TABLE IF NOT EXISTS cabin_reservation_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id uuid REFERENCES cabin_reservations(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('confirmation', 'cancellation', 'reminder')),
  sent_at timestamptz DEFAULT now(),
  recipient_email text NOT NULL,
  template_data jsonb DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE cabin_reservation_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE cabin_reservation_notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for cabin_reservation_payments
CREATE POLICY "Enable all for admin users on payments"
  ON cabin_reservation_payments
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

CREATE POLICY "Enable read for own payments"
  ON cabin_reservation_payments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cabin_reservations
      WHERE cabin_reservations.id = cabin_reservation_payments.reservation_id
      AND cabin_reservations.user_id = auth.uid()
    )
  );

-- Create policies for cabin_reservation_notifications
CREATE POLICY "Enable all for admin users on notifications"
  ON cabin_reservation_notifications
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

CREATE POLICY "Enable read for own notifications"
  ON cabin_reservation_notifications
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cabin_reservations
      WHERE cabin_reservations.id = cabin_reservation_notifications.reservation_id
      AND cabin_reservations.user_id = auth.uid()
    )
  );

-- Create function to check for late arrivals
CREATE OR REPLACE FUNCTION check_late_arrivals()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE cabin_reservations
  SET status = 'cancelled'
  WHERE status = 'confirmed'
    AND check_in_time IS NULL
    AND start_date = CURRENT_DATE
    AND CURRENT_TIME > (start_time::time + late_threshold);
    
  -- Trigger notifications for cancelled reservations
  INSERT INTO cabin_reservation_notifications (
    reservation_id,
    type,
    recipient_email,
    template_data
  )
  SELECT 
    cr.id,
    'cancellation',
    p.email,
    jsonb_build_object(
      'reservation_id', cr.id,
      'cabin_name', c.name,
      'start_date', cr.start_date,
      'start_time', cr.start_time,
      'guest_name', p.first_name || ' ' || p.last_name
    )
  FROM cabin_reservations cr
  JOIN profiles p ON p.id = cr.user_id
  JOIN cabins c ON c.id = cr.cabin_id
  WHERE cr.status = 'cancelled'
    AND NOT EXISTS (
      SELECT 1 FROM cabin_reservation_notifications
      WHERE reservation_id = cr.id AND type = 'cancellation'
    );
END;
$$;