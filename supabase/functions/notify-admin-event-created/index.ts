import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const ADMIN_EMAIL = "shivan.meymo@gmail.com";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EventNotificationRequest {
  eventId: string;
  title: string;
  description: string;
  location: string;
  category: string;
  startDatetime: string;
  organizerEmail: string;
  organizerDescription: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { eventId, title, description, location, category, startDatetime, organizerEmail, organizerDescription }: EventNotificationRequest = await req.json();

    console.log("Sending event notification email to admin for event:", eventId);

    // Generate approval/reject tokens (simple base64 encoding for demo)
    const approveToken = btoa(`approve:${eventId}`);
    const rejectToken = btoa(`reject:${eventId}`);
    
    const approveUrl = `${SUPABASE_URL}/functions/v1/handle-event-approval?token=${approveToken}`;
    const rejectUrl = `${SUPABASE_URL}/functions/v1/handle-event-approval?token=${rejectToken}`;

    const emailResponse = await resend.emails.send({
      from: "NowInTown <onboarding@resend.dev>",
      to: [ADMIN_EMAIL],
      subject: `New Event Pending Approval: ${title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <h1 style="color: #333; border-bottom: 3px solid #006AA7; padding-bottom: 10px;">New Event Submission</h1>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #006AA7; margin-top: 0;">${title}</h2>
            
            <div style="margin: 15px 0;">
              <strong>Category:</strong> ${category}<br>
              <strong>Location:</strong> ${location}<br>
              <strong>Start Date:</strong> ${new Date(startDatetime).toLocaleString()}<br>
            </div>

            <div style="margin: 15px 0;">
              <strong>Description:</strong>
              <p style="color: #666; margin: 10px 0;">${description || "No description provided"}</p>
            </div>

            <div style="background-color: #f0f8ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <strong style="color: #006AA7;">Organizer Information:</strong><br>
              <strong>Email:</strong> ${organizerEmail}<br><br>
              <strong>About:</strong>
              <p style="color: #666; margin: 10px 0;">${organizerDescription}</p>
            </div>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${approveUrl}" style="display: inline-block; background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 0 10px; font-weight: bold;">
              ✓ Approve Event
            </a>
            <a href="${rejectUrl}" style="display: inline-block; background-color: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 0 10px; font-weight: bold;">
              ✗ Reject Event
            </a>
          </div>

          <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">
            Click the buttons above to approve or reject this event without logging in.
          </p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in notify-admin-event-created function:", error);
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
