import { createClient } from 'npm:@supabase/supabase-js@2.39.3';
import Stripe from 'npm:stripe@14.14.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '');
const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '';

Deno.serve(async (req) => {
  try {
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      throw new Error('No signature provided');
    }

    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, endpointSecret);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const { reservationId, paymentType } = session.metadata;

      // Record payment
      const { error: paymentError } = await supabase
        .from('cabin_reservation_payments')
        .insert({
          reservation_id: reservationId,
          amount: session.amount_total / 100, // Convert from cents
          payment_method: 'online',
          payment_status: 'paid',
          transaction_id: session.payment_intent
        });

      if (paymentError) throw paymentError;

      // Update reservation status
      const { error: updateError } = await supabase
        .from('cabin_reservations')
        .update({
          status: 'confirmed',
          payment_status: paymentType === 'partial' ? 'partial' : 'paid',
          payment_date: new Date().toISOString()
        })
        .eq('id', reservationId);

      if (updateError) throw updateError;

      // Send confirmation email
      await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-reservation-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'confirmation',
          reservationId
        })
      });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400 }
    );
  }
});