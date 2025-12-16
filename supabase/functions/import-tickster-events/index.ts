import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TicksterEvent {
  id: string;
  name: string;
  description?: string;
  location?: {
    name?: string;
    address?: string;
    city?: string;
  };
  startUtc: string;
  endUtc?: string;
  imageUrl?: string;
  url?: string;
  categories?: string[];
  organizer?: {
    name?: string;
  };
  tickets?: {
    price?: number;
  }[];
}

interface TicksterResponse {
  events: TicksterEvent[];
  totalCount: number;
}

// Map Tickster categories to our categories
function mapCategory(ticksterCategories?: string[]): string {
  if (!ticksterCategories || ticksterCategories.length === 0) return 'Other';
  
  const categoryMap: Record<string, string> = {
    'music': 'Music',
    'concert': 'Music',
    'festival': 'Music',
    'sport': 'Sports',
    'sports': 'Sports',
    'football': 'Sports',
    'hockey': 'Sports',
    'art': 'Art',
    'exhibition': 'Art',
    'museum': 'Art',
    'theater': 'Art',
    'theatre': 'Art',
    'comedy': 'Art',
    'student': 'Student',
    'education': 'Student',
    'tech': 'Tech',
    'technology': 'Tech',
    'conference': 'Tech',
    'food': 'Food',
    'drink': 'Food',
    'gastronomy': 'Food',
    'family': 'Family',
    'kids': 'Family',
    'children': 'Family',
  };
  
  for (const cat of ticksterCategories) {
    const lowerCat = cat.toLowerCase();
    for (const [key, value] of Object.entries(categoryMap)) {
      if (lowerCat.includes(key)) {
        return value;
      }
    }
  }
  
  return 'Other';
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const TICKSTER_API_KEY = Deno.env.get('TICKSTER_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');

    // SECURITY: Require authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the user's token and check admin role
    const userClient = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
    const { data: { user }, error: userError } = await userClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      console.error('Invalid auth token:', userError);
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is admin using service role client
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    
    const { data: adminRole, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (roleError || !adminRole) {
      console.error('User is not admin:', user.id);
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Admin user verified:', user.email);

    if (!TICKSTER_API_KEY) {
      console.error('TICKSTER_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'Tickster API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get optional parameters from request body
    let city = '';
    let limit = 50;
    
    if (req.method === 'POST') {
      try {
        const body = await req.json();
        city = body.city || '';
        limit = body.limit || 50;
      } catch {
        // Use defaults if body parsing fails
      }
    }

    console.log(`Fetching events from Tickster API (city: ${city || 'all'}, limit: ${limit})`);

    // Fetch events from Tickster API
    let ticksterUrl = `https://event.api.tickster.com/api/v1/sv/events?pageSize=${limit}`;
    if (city) {
      ticksterUrl += `&city=${encodeURIComponent(city)}`;
    }

    const ticksterResponse = await fetch(ticksterUrl, {
      headers: {
        'X-API-KEY': TICKSTER_API_KEY,
        'Accept': 'application/json',
      },
    });

    if (!ticksterResponse.ok) {
      const errorText = await ticksterResponse.text();
      console.error(`Tickster API error: ${ticksterResponse.status} - ${errorText}`);
      return new Response(
        JSON.stringify({ error: `Tickster API error: ${ticksterResponse.status}`, details: errorText }),
        { status: ticksterResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const ticksterData: TicksterResponse = await ticksterResponse.json();
    console.log(`Received ${ticksterData.events?.length || 0} events from Tickster`);

    if (!ticksterData.events || ticksterData.events.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No events found from Tickster', imported: 0 }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use the authenticated admin user as the organizer for imported events
    const organizerId = user.id;

    let importedCount = 0;
    let skippedCount = 0;
    const errors: string[] = [];

    for (const event of ticksterData.events) {
      try {
        // Check if event already exists (by title and start date)
        const { data: existing } = await supabase
          .from('events')
          .select('id')
          .eq('title', event.name)
          .eq('start_datetime', event.startUtc)
          .limit(1);

        if (existing && existing.length > 0) {
          console.log(`Skipping duplicate event: ${event.name}`);
          skippedCount++;
          continue;
        }

        // Build location string
        let location = 'Sweden';
        if (event.location) {
          const parts = [event.location.name, event.location.address, event.location.city].filter(Boolean);
          if (parts.length > 0) {
            location = parts.join(', ');
          }
        }

        // Determine if event is free and get price
        const isFree = !event.tickets || event.tickets.length === 0 || 
          event.tickets.every(t => !t.price || t.price === 0);
        const priceAdults = event.tickets?.[0]?.price || null;

        // Insert event
        const { error: insertError } = await supabase
          .from('events')
          .insert({
            title: event.name,
            description: event.description || `Event imported from Tickster. Visit ${event.url || 'tickster.com'} for more information.`,
            location: location,
            category: mapCategory(event.categories),
            start_datetime: event.startUtc,
            end_datetime: event.endUtc || new Date(new Date(event.startUtc).getTime() + 2 * 60 * 60 * 1000).toISOString(),
            image_url: event.imageUrl || null,
            organizer_id: organizerId,
            organizer_description: event.organizer?.name ? `Organized by ${event.organizer.name}` : 'Imported from Tickster',
            approved: true, // Auto-approve imported events
            is_free: isFree,
            price_adults: isFree ? null : priceAdults,
          });

        if (insertError) {
          console.error(`Error inserting event ${event.name}:`, insertError);
          errors.push(`${event.name}: ${insertError.message}`);
        } else {
          importedCount++;
          console.log(`Imported event: ${event.name}`);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error(`Error processing event ${event.name}:`, err);
        errors.push(`${event.name}: ${errorMessage}`);
      }
    }

    console.log(`Import complete. Imported: ${importedCount}, Skipped: ${skippedCount}, Errors: ${errors.length}`);

    return new Response(
      JSON.stringify({
        success: true,
        imported: importedCount,
        skipped: skippedCount,
        errors: errors.length > 0 ? errors : undefined,
        total: ticksterData.totalCount,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error in import-tickster-events:', error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
