import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = "shivan.meymo@gmail.com";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const APPROVAL_SECRET = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""; // Use service role key as HMAC secret

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

// Generate HMAC-SHA256 signed token
async function generateSecureToken(action: string, eventId: string): Promise<string> {
  // Token expires in 7 days
  const expiry = Date.now() + (7 * 24 * 60 * 60 * 1000);
  
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(APPROVAL_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  
  const data = encoder.encode(`${action}:${eventId}:${expiry}`);
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, data);
  const signature = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)));
  
  // Combine all parts and base64 encode the full token
  const token = btoa(`${action}:${eventId}:${expiry}:${signature}`);
  return token;
}

// HTML escape function to prevent XSS
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { eventId, title, description, location, category, startDatetime, organizerEmail, organizerDescription }: EventNotificationRequest = await req.json();

    console.log("Sending event notification email to admin for event:", eventId);

    // Validate eventId format (UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(eventId)) {
      throw new Error("Invalid event ID format");
    }

    // Generate cryptographically signed tokens
    const approveToken = await generateSecureToken("approve", eventId);
    const rejectToken = await generateSecureToken("reject", eventId);
    
    const approveUrl = `${SUPABASE_URL}/functions/v1/handle-event-approval?token=${encodeURIComponent(approveToken)}`;
    const rejectUrl = `${SUPABASE_URL}/functions/v1/handle-event-approval?token=${encodeURIComponent(rejectToken)}`;

    // Escape all user-provided content for HTML
    const safeTitle = escapeHtml(title || "");
    const safeCategory = escapeHtml(category || "");
    const safeLocation = escapeHtml(location || "");
    const safeDescription = escapeHtml(description || "No description provided");
    const safeOrganizerEmail = escapeHtml(organizerEmail || "");
    const safeOrganizerDescription = escapeHtml(organizerDescription || "");

    const emailBody = {
      from: "NowInTown <notifications@nowintown.se>",
      to: [ADMIN_EMAIL],
      subject: `New Event Pending Approval: ${safeTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <h1 style="color: #333; border-bottom: 3px solid #006AA7; padding-bottom: 10px;">New Event Submission</h1>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #006AA7; margin-top: 0;">${safeTitle}</h2>
            
            <div style="margin: 15px 0;">
              <strong>Category:</strong> ${safeCategory}<br>
              <strong>Location:</strong> ${safeLocation}<br>
              <strong>Start Date:</strong> ${new Date(startDatetime).toLocaleString()}<br>
            </div>

            <div style="margin: 15px 0;">
              <strong>Description:</strong>
              <p style="color: #666; margin: 10px 0;">${safeDescription}</p>
            </div>

            <div style="background-color: #f0f8ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <strong style="color: #006AA7;">Organizer Information:</strong><br>
              <strong>Email:</strong> ${safeOrganizerEmail}<br><br>
              <strong>About:</strong>
              <p style="color: #666; margin: 10px 0;">${safeOrganizerDescription}</p>
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
            Click the buttons above to approve or reject this event. These links expire in 7 days.
          </p>
        </div>
      `,
    };

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailBody),
    });

    const emailData = await emailResponse.json();
    console.log("Email sent successfully:", emailData);

    return new Response(JSON.stringify({ success: true, data: emailData }), {
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
