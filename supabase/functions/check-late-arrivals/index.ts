import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get reservations that should be cancelled
    const { data: lateReservations, error: reservationsError } = await supabase
      .from('cabin_reservations')
      .select('id')
      .eq('status', 'confirmed')
      .is('check_in_time', null)
      .eq('start_date', new Date().toISOString().split('T')[0])
      .lte('start_time', new Date(Date.now() - 7200000).toISOString());

    if (reservationsError) throw reservationsError;

    if (lateReservations && lateReservations.length > 0) {
      // Cancel late reservations
      const { error: updateError } = await supabase
        .from('cabin_reservations')
        .update({ status: 'cancelled' })
        .in('id', lateReservations.map(r => r.id));

      if (updateError) throw updateError;

      // Send cancellation emails
      for (const reservation of lateReservations) {
        await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-reservation-email`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'cancellation',
            reservationId: reservation.id
          })
        });
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Late check-in check completed',
        cancelledReservations: lateReservations?.length || 0
      }),
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