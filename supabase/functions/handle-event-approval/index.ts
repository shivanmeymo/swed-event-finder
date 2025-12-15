import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.0";
import { Resend } from "https://esm.sh/resend@2.0.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";
const APPROVAL_SECRET = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""; // Use service role key as HMAC secret

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const resend = new Resend(RESEND_API_KEY);

// HMAC-SHA256 signature verification
async function verifyToken(token: string): Promise<{ valid: boolean; action?: string; eventId?: string; error?: string }> {
  try {
    // Decode the base64 token
    const decoded = atob(token);
    const parts = decoded.split(":");
    
    if (parts.length !== 4) {
      return { valid: false, error: "Invalid token format" };
    }
    
    const [action, eventId, expiry, signature] = parts;
    
    // Check expiration (tokens expire after 7 days)
    const expiryTimestamp = parseInt(expiry, 10);
    if (isNaN(expiryTimestamp) || Date.now() > expiryTimestamp) {
      return { valid: false, error: "Token has expired" };
    }
    
    // Verify action is valid
    if (action !== "approve" && action !== "reject") {
      return { valid: false, error: "Invalid action" };
    }
    
    // Verify UUID format for eventId
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(eventId)) {
      return { valid: false, error: "Invalid event ID" };
    }
    
    // Verify HMAC signature
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(APPROVAL_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign", "verify"]
    );
    
    const data = encoder.encode(`${action}:${eventId}:${expiry}`);
    const signatureBytes = Uint8Array.from(atob(signature), c => c.charCodeAt(0));
    
    const isValid = await crypto.subtle.verify("HMAC", key, signatureBytes, data);
    
    if (!isValid) {
      return { valid: false, error: "Invalid signature" };
    }
    
    return { valid: true, action, eventId };
  } catch (error) {
    console.error("Token verification error:", error);
    return { valid: false, error: "Token verification failed" };
  }
}

const handler = async (req: Request): Promise<Response> => {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return new Response(
        `<html><body style="font-family: Arial; text-align: center; padding: 50px;">
          <h1 style="color: #dc3545;">Invalid Request</h1>
          <p>Missing approval token.</p>
        </body></html>`,
        {
          status: 400,
          headers: { "Content-Type": "text/html" },
        }
      );
    }

    // Verify the cryptographic token
    const verification = await verifyToken(token);
    
    if (!verification.valid) {
      console.error("Token verification failed:", verification.error);
      return new Response(
        `<html><body style="font-family: Arial; text-align: center; padding: 50px;">
          <h1 style="color: #dc3545;">Invalid or Expired Token</h1>
          <p>${verification.error === "Token has expired" 
            ? "This approval link has expired. Please request a new one from the admin dashboard." 
            : "This approval link is invalid or has been tampered with."}</p>
        </body></html>`,
        {
          status: 400,
          headers: { "Content-Type": "text/html" },
        }
      );
    }

    const { action, eventId } = verification;
    console.log("Processing approval action:", action, "for event:", eventId);

    if (action === "approve") {
      // Approve the event
      const { error } = await supabase
        .from("events")
        .update({ approved: true })
        .eq("id", eventId);

      if (error) {
        console.error("Error approving event:", error);
        throw error;
      }

      // Get event details to send confirmation email
      const { data: event, error: eventError } = await supabase
        .from("events")
        .select("title, organizer_email")
        .eq("id", eventId)
        .single();

      if (eventError) {
        console.error("Error fetching event details:", eventError);
      }

      console.log("Event details:", { 
        title: event?.title, 
        organizer_email: event?.organizer_email 
      });

      // Send confirmation email to organizer
      if (event?.organizer_email) {
        try {
          console.log("Attempting to send email to:", event.organizer_email);
          const emailResult = await resend.emails.send({
            from: "NowInTown <notifications@nowintown.se>",
            to: [event.organizer_email],
            subject: "Your Event Has Been Approved! 🎉",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #28a745;">Your Event is Now Live!</h1>
                <p>Great news! Your event "<strong>${escapeHtml(event.title)}</strong>" has been approved and is now visible to everyone on NowInTown.</p>
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
        } catch (emailError: any) {
          console.error("Failed to send confirmation email. Error details:", {
            message: emailError.message,
            name: emailError.name,
            stack: emailError.stack
          });
        }
      } else {
        console.log("No organizer_email found for event:", eventId);
      }

      // Redirect to approval page
      const appUrl = Deno.env.get("APP_URL") || "https://nowintown.lovable.app";
      const redirectUrl = `${appUrl}/event-approved?title=${encodeURIComponent(event?.title || 'Unknown')}`;
      
      console.log("Redirecting to:", redirectUrl);
      
      return new Response(null, {
        status: 302,
        headers: { 
          "Location": redirectUrl,
        },
      });
    } else if (action === "reject") {
      // Update event to rejected (null = rejected per project requirements)
      const { data: event } = await supabase
        .from("events")
        .select("title")
        .eq("id", eventId)
        .single();

      const { error } = await supabase
        .from("events")
        .update({ approved: null })
        .eq("id", eventId);

      if (error) {
        console.error("Error rejecting event:", error);
        throw error;
      }

      console.log("Event rejected");

      return new Response(
        `<html><body style="font-family: Arial; text-align: center; padding: 50px;">
          <h1 style="color: #dc3545;">✗ Event Rejected</h1>
          <p>The event "${escapeHtml(event?.title || 'Unknown')}" has been rejected.</p>
        </body></html>`,
        {
          status: 200,
          headers: { "Content-Type": "text/html" },
        }
      );
    } else {
      return new Response(
        `<html><body style="font-family: Arial; text-align: center; padding: 50px;">
          <h1 style="color: #dc3545;">Invalid Action</h1>
          <p>Unknown approval action.</p>
        </body></html>`,
        {
          status: 400,
          headers: { "Content-Type": "text/html" },
        }
      );
    }
  } catch (error: any) {
    console.error("Error in handle-event-approval function:", error);
    return new Response(
      `<html><body style="font-family: Arial; text-align: center; padding: 50px;">
        <h1 style="color: #dc3545;">Error</h1>
        <p>Something went wrong. Please try again later or contact support.</p>
      </body></html>`,
      {
        status: 500,
        headers: { "Content-Type": "text/html" },
      }
    );
  }
};

// HTML escape function to prevent XSS
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

serve(handler);
