import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.0";
import { Resend } from "https://esm.sh/resend@2.0.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const resend = new Resend(RESEND_API_KEY);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationEmailRequest {
  eventId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { eventId }: NotificationEmailRequest = await req.json();

    console.log("Sending notification emails for event:", eventId);

    // Get event details
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single();

    if (eventError || !event) {
      console.error("Error fetching event details:", eventError);
      throw new Error("Event not found");
    }

    console.log("Event details:", event);

    // Get all subscriptions that match the event criteria
    const { data: subscriptions, error: subError } = await supabase
      .from("newsletter_subscriptions")
      .select("email, category_filter, location_filter, keyword_filter");

    if (subError) {
      console.error("Error fetching subscriptions:", subError);
      throw new Error("Failed to fetch subscriptions");
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log("No subscriptions found");
      return new Response(
        JSON.stringify({ success: true, message: "No subscribers to notify" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Found ${subscriptions.length} total subscriptions`);

    // Filter subscriptions based on event criteria
    const matchingSubscriptions = subscriptions.filter(sub => {
      // Check category filter - skip if 'all' or empty
      if (sub.category_filter && sub.category_filter !== 'all' && sub.category_filter !== event.category) {
        console.log(`Subscription ${sub.email} skipped: category mismatch (${sub.category_filter} vs ${event.category})`);
        return false;
      }

      // Check location filter - skip if 'all' or empty
      if (sub.location_filter && sub.location_filter !== 'all') {
        if (!event.location.toLowerCase().includes(sub.location_filter.toLowerCase())) {
          console.log(`Subscription ${sub.email} skipped: location mismatch`);
          return false;
        }
      }

      // Check keyword filter
      if (sub.keyword_filter) {
        const keywords = sub.keyword_filter.toLowerCase().split(',').map((k: string) => k.trim());
        const eventText = `${event.title} ${event.location} ${event.description || ''}`.toLowerCase();
        const hasMatch = keywords.some((keyword: string) => eventText.includes(keyword));
        if (!hasMatch) {
          console.log(`Subscription ${sub.email} skipped: keyword mismatch`);
          return false;
        }
      }

      console.log(`Subscription ${sub.email} matches event criteria`);
      return true;
    });

    console.log(`Found ${matchingSubscriptions.length} matching subscriptions`);

    // Send emails to all matching subscribers
    const emailPromises = matchingSubscriptions.map(async (subscription) => {
      try {
        const startDate = new Date(event.start_datetime);
        const formattedDate = startDate.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });

        await resend.emails.send({
          from: "NowInTown <notifications@nowintown.se>",
          to: [subscription.email],
          subject: `New Event Alert: ${event.title} 🎉`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #006AA7;">New Event Matching Your Interests!</h1>
              <h2 style="color: #333;">${event.title}</h2>
              <p><strong>Category:</strong> ${event.category}</p>
              <p><strong>Location:</strong> ${event.location}</p>
              <p><strong>Date:</strong> ${formattedDate}</p>
              ${event.is_free ? '<p style="color: #28a745; font-weight: bold;">FREE EVENT</p>' : ''}
              <p style="margin-top: 30px;">Check out this event and more on NowInTown!</p>
              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                Best regards,<br>
                The NowInTown Team
              </p>
            </div>
          `,
        });
        console.log(`Email sent to ${subscription.email}`);
      } catch (error) {
        console.error(`Failed to send email to ${subscription.email}:`, error);
      }
    });

    await Promise.all(emailPromises);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Notification emails sent to ${matchingSubscriptions.length} subscribers` 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-notification-emails function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
