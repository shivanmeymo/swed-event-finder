import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

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

    // Decode token
    const decoded = atob(token);
    const [action, eventId] = decoded.split(":");

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
      const { data: event } = await supabase
        .from("events")
        .select("title, organizer_email")
        .eq("id", eventId)
        .single();

      // TODO: Send confirmation email to organizer
      console.log("Event approved, should send confirmation to:", event?.organizer_email);

      return new Response(
        `<html><body style="font-family: Arial; text-align: center; padding: 50px;">
          <h1 style="color: #28a745;">✓ Event Approved!</h1>
          <p>The event "${event?.title || 'Unknown'}" has been successfully approved.</p>
          <p style="color: #666; margin-top: 20px;">A confirmation email has been sent to the organizer.</p>
        </body></html>`,
        {
          status: 200,
          headers: { "Content-Type": "text/html" },
        }
      );
    } else if (action === "reject") {
      // Delete the event
      const { data: event } = await supabase
        .from("events")
        .select("title")
        .eq("id", eventId)
        .single();

      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", eventId);

      if (error) {
        console.error("Error rejecting event:", error);
        throw error;
      }

      console.log("Event rejected and deleted");

      return new Response(
        `<html><body style="font-family: Arial; text-align: center; padding: 50px;">
          <h1 style="color: #dc3545;">✗ Event Rejected</h1>
          <p>The event "${event?.title || 'Unknown'}" has been rejected and removed.</p>
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
        <p>Something went wrong: ${error.message}</p>
      </body></html>`,
      {
        status: 500,
        headers: { "Content-Type": "text/html" },
      }
    );
  }
};

serve(handler);
