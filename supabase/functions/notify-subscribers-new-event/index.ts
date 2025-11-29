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

interface NotificationRequest {
  eventId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { eventId }: NotificationRequest = await req.json();

    console.log("Processing notifications for event:", eventId);

    // Get event details
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .eq("approved", true)
      .single();

    if (eventError || !event) {
      console.error("Event not found or not approved:", eventError);
      return new Response(
        JSON.stringify({ error: "Event not found or not approved" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get all newsletter subscriptions
    const { data: subscriptions, error: subsError } = await supabase
      .from("newsletter_subscriptions")
      .select("*");

    if (subsError) {
      console.error("Error fetching subscriptions:", subsError);
      throw subsError;
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log("No subscriptions found");
      return new Response(
        JSON.stringify({ success: true, message: "No subscribers to notify" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Found ${subscriptions.length} total subscriptions`);

    // Filter subscriptions based on event details
    const matchingSubscriptions = subscriptions.filter((sub) => {
      // Category filter
      if (sub.category_filter && sub.category_filter !== 'all') {
        if (event.category.toLowerCase() !== sub.category_filter.toLowerCase()) {
          return false;
        }
      }

      // Location filter
      if (sub.location_filter && sub.location_filter !== 'all') {
        if (!event.location.toLowerCase().includes(sub.location_filter.toLowerCase())) {
          return false;
        }
      }

      // Keyword filter
      if (sub.keyword_filter) {
        const keywords = sub.keyword_filter.split(',').map((k: string) => k.trim().toLowerCase());
        const eventText = `${event.title} ${event.description || ''} ${event.category} ${event.location}`.toLowerCase();
        const matchesKeyword = keywords.some((keyword: string) => eventText.includes(keyword));
        if (!matchesKeyword) {
          return false;
        }
      }

      return true;
    });

    console.log(`Found ${matchingSubscriptions.length} matching subscriptions`);

    // Send emails to matching subscribers
    const emailPromises = matchingSubscriptions.map(async (sub) => {
      try {
        const startDate = new Date(event.start_datetime);
        const formattedDate = startDate.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
        const formattedTime = startDate.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        });

        await resend.emails.send({
          from: "NowInTown <onboarding@resend.dev>",
          to: [sub.email],
          subject: `New Event Alert: ${event.title}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #006AA7;">New Event Matching Your Interests!</h1>
              <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="color: #333; margin-top: 0;">${event.title}</h2>
                <p style="color: #666;"><strong>Category:</strong> ${event.category}</p>
                <p style="color: #666;"><strong>Location:</strong> ${event.location}</p>
                <p style="color: #666;"><strong>Date:</strong> ${formattedDate}</p>
                <p style="color: #666;"><strong>Time:</strong> ${formattedTime}</p>
                ${event.is_free ? '<p style="color: #28a745; font-weight: bold;">FREE EVENT</p>' : ''}
                ${event.description ? `<p style="color: #666; margin-top: 15px;">${event.description}</p>` : ''}
              </div>
              <p style="margin-top: 20px;">
                <a href="https://nowintown.lovable.app/event/${event.id}" 
                   style="background: #006AA7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  View Event Details
                </a>
              </p>
              <p style="color: #999; font-size: 12px; margin-top: 30px;">
                You received this email because you subscribed to notifications for events matching your preferences on NowInTown.
              </p>
            </div>
          `,
        });
        console.log(`Email sent to ${sub.email}`);
      } catch (emailError) {
        console.error(`Failed to send email to ${sub.email}:`, emailError);
      }
    });

    await Promise.all(emailPromises);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Notified ${matchingSubscriptions.length} subscribers` 
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in notify-subscribers-new-event:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
