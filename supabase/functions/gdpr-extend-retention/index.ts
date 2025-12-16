import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const handler = async (req: Request): Promise<Response> => {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("user_id");

    if (!userId) {
      return new Response(
        `<html><body style="font-family: Arial; text-align: center; padding: 50px;">
          <h1 style="color: #dc3545;">Invalid Request</h1>
          <p>Missing user ID.</p>
        </body></html>`,
        { status: 400, headers: { "Content-Type": "text/html" } }
      );
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      return new Response(
        `<html><body style="font-family: Arial; text-align: center; padding: 50px;">
          <h1 style="color: #dc3545;">Invalid User ID</h1>
          <p>The provided user ID is not valid.</p>
        </body></html>`,
        { status: 400, headers: { "Content-Type": "text/html" } }
      );
    }

    console.log("Extending data retention for user:", userId);

    // Extend the user's data retention
    const { error } = await supabase.rpc('extend_data_retention', { p_user_id: userId });

    if (error) {
      console.error("Error extending data retention:", error);
      return new Response(
        `<html><body style="font-family: Arial; text-align: center; padding: 50px;">
          <h1 style="color: #dc3545;">Error</h1>
          <p>Failed to extend your data retention. Please try again or contact support.</p>
        </body></html>`,
        { status: 500, headers: { "Content-Type": "text/html" } }
      );
    }

    console.log("Data retention extended successfully for user:", userId);

    return new Response(
      `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Data Retention Extended - NowInTown</title>
      </head>
      <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #f9f9f9;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="font-size: 80px; margin-bottom: 20px;">✅</div>
          <h1 style="color: #28a745; margin-bottom: 20px;">Data Retention Extended!</h1>
          <p style="font-size: 18px; color: #333; margin-bottom: 30px;">
            Great news! Your NowInTown account and all your data will be kept for another year.
          </p>
          <p style="color: #666; margin-bottom: 30px;">
            Thank you for continuing to be part of our community. We're here to help you break loneliness and find exciting events in your area!
          </p>
          <a href="https://nowintown.lovable.app" style="display: inline-block; background-color: #006AA7; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Visit NowInTown
          </a>
          <p style="color: #999; font-size: 12px; margin-top: 40px;">
            NowInTown - Breaking loneliness, bringing people together<br>
            Uppsala, Sweden
          </p>
        </div>
      </body>
      </html>`,
      { status: 200, headers: { "Content-Type": "text/html" } }
    );
  } catch (error: any) {
    console.error("Error in gdpr-extend-retention function:", error);
    return new Response(
      `<html><body style="font-family: Arial; text-align: center; padding: 50px;">
        <h1 style="color: #dc3545;">Error</h1>
        <p>Something went wrong. Please try again later or contact support at contact@nowintown.se</p>
      </body></html>`,
      { status: 500, headers: { "Content-Type": "text/html" } }
    );
  }
};

serve(handler);
