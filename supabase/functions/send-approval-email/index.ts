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

interface ApprovalEmailRequest {
  eventId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { eventId }: ApprovalEmailRequest = await req.json();

    console.log("Sending approval email for event:", eventId);

    // Get event details
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("title, organizer_email")
      .eq("id", eventId)
      .single();

    if (eventError) {
      console.error("Error fetching event details:", eventError);
      throw new Error("Event not found");
    }

    console.log("Event details:", { 
      title: event?.title, 
      organizer_email: event?.organizer_email 
    });

    // Send confirmation email to organizer
    if (event?.organizer_email) {
      console.log("Attempting to send email to:", event.organizer_email);
      const emailResult = await resend.emails.send({
        from: "NowInTown <onboarding@resend.dev>",
        to: [event.organizer_email],
        subject: "Your Event Has Been Approved! 🎉",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #28a745;">Your Event is Now Live!</h1>
            <p>Great news! Your event "<strong>${event.title}</strong>" has been approved and is now visible to everyone on NowInTown.</p>
            <p>Your event will appear in the upcoming events section and users can start discovering it.</p>
            <p style="margin-top: 30px;">Thank you for contributing to our community!</p>
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              Best regards,<br>
              The NowInTown Team
            </p>
          </div>
        `,
      });
      console.log("Email sent successfully! Result:", emailResult);

      // Trigger notification to subscribers
      try {
        await supabase.functions.invoke('notify-subscribers-new-event', {
          body: { eventId }
        });
        console.log("Subscriber notifications triggered");
      } catch (notifError) {
        console.error("Failed to trigger subscriber notifications:", notifError);
      }

      return new Response(
        JSON.stringify({ success: true, message: "Approval email sent and subscribers notified" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    } else {
      console.log("No organizer_email found for event:", eventId);
      return new Response(
        JSON.stringify({ success: false, message: "No organizer email found" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
  } catch (error: any) {
    console.error("Error in send-approval-email function:", error);
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
