import { createClient } from 'npm:@supabase/supabase-js@2.39.3';
import { Resend } from 'npm:resend@2.1.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailPayload {
  type: 'confirmation' | 'cancellation';
  reservationId: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

    const { type, reservationId }: EmailPayload = await req.json();

    // Get reservation details
    const { data: reservation, error: reservationError } = await supabase
      .from('cabin_reservations')
      .select(`
        *,
        cabins (name, price),
        profiles (first_name, last_name, email),
        cabin_reservation_payments (amount, payment_method, payment_status)
      `)
      .eq('id', reservationId)
      .single();

    if (reservationError) throw reservationError;

    const emailData = {
      from: 'WildScape Camping <reservations@wildscapecamping.com>',
      to: reservation.profiles.email,
      subject: type === 'confirmation' 
        ? 'Your WildScape Camping Reservation Confirmation'
        : 'WildScape Camping Reservation Cancelled',
      html: type === 'confirmation'
        ? `
          <h1>Reservation Confirmation</h1>
          <p>Dear ${reservation.profiles.first_name},</p>
          <p>Your reservation at WildScape Camping has been confirmed.</p>
          
          <h2>Reservation Details</h2>
          <ul>
            <li>Cabin: ${reservation.cabins.name}</li>
            <li>Check-in: ${reservation.start_date} at ${reservation.start_time}</li>
            <li>Check-out: ${reservation.end_date} at ${reservation.end_time}</li>
            <li>Guests: ${reservation.guests}</li>
            <li>Total Amount: $${reservation.payment_amount}</li>
            <li>Payment Method: ${reservation.payment_method}</li>
            <li>Payment Status: ${reservation.payment_status}</li>
          </ul>

          <h2>Important Information</h2>
          <ul>
            <li>Please arrive on time for check-in</li>
            <li>Bring a valid ID for check-in</li>
            <li>Late arrival (2+ hours) will result in automatic cancellation</li>
          </ul>

          <p>We look forward to welcoming you!</p>
        `
        : `
          <h1>Reservation Cancelled</h1>
          <p>Dear ${reservation.profiles.first_name},</p>
          <p>Your reservation at WildScape Camping has been cancelled due to late arrival.</p>
          
          <h2>Reservation Details</h2>
          <ul>
            <li>Cabin: ${reservation.cabins.name}</li>
            <li>Check-in: ${reservation.start_date} at ${reservation.start_time}</li>
          </ul>

          <p>If you believe this is an error, please contact us immediately.</p>
        `
    };

    const { data: email, error: emailError } = await resend.emails.send(emailData);
    if (emailError) throw emailError;

    // Log notification
    const { error: notificationError } = await supabase
      .from('cabin_reservation_notifications')
      .insert({
        reservation_id: reservationId,
        type,
        recipient_email: reservation.profiles.email,
        template_data: emailData
      });

    if (notificationError) throw notificationError;

    return new Response(
      JSON.stringify({ message: 'Email sent successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});