import { createClient } from 'npm:@supabase/supabase-js@2.39.3';
import Stripe from 'npm:stripe@14.14.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentPayload {
  reservationId: string;
  paymentType: 'full' | 'partial';
  returnUrl: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { reservationId, paymentType, returnUrl }: PaymentPayload = await req.json();

    // Get reservation details
    const { data: reservation, error: reservationError } = await supabase
      .from('cabin_reservations')
      .select(`
        *,
        cabins (name, price),
        profiles (first_name, last_name, email)
      `)
      .eq('id', reservationId)
      .single();

    if (reservationError) throw reservationError;

    // Calculate payment amount
    const totalAmount = reservation.payment_amount;
    const paymentAmount = paymentType === 'partial' ? totalAmount * 0.3 : totalAmount;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${reservation.cabins.name} - ${paymentType === 'partial' ? '30% Deposit' : 'Full Payment'}`,
              description: `Check-in: ${reservation.start_date} at ${reservation.start_time}`,
            },
            unit_amount: Math.round(paymentAmount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${returnUrl}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${returnUrl}?success=false`,
      customer_email: reservation.profiles.email,
      metadata: {
        reservationId,
        paymentType,
      },
    });

    // Update reservation payment status
    const { error: updateError } = await supabase
      .from('cabin_reservations')
      .update({
        payment_method: 'online',
        payment_status: 'pending',
      })
      .eq('id', reservationId);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
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