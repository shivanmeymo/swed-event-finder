import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);

    if (userError || !user) {
      throw new Error('Invalid user token');
    }

    // Delete user's events
    const { error: eventsError } = await supabaseClient
      .from('events')
      .delete()
      .eq('organizer_id', user.id);

    if (eventsError) {
      console.error('Error deleting events:', eventsError);
    }

    // Delete user's profile
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .delete()
      .eq('id', user.id);

    if (profileError) {
      console.error('Error deleting profile:', profileError);
    }

    // Delete the auth user (this will cascade to other tables due to RLS)
    const { error: deleteError } = await supabaseClient.auth.admin.deleteUser(user.id);

    if (deleteError) {
      throw deleteError;
    }

    return new Response(
      JSON.stringify({ success: true, message: 'User account deleted successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in delete-user-account function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
