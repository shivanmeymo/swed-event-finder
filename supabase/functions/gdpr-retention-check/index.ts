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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting GDPR retention check...");

    // Step 1: Send warning emails to users whose data is about to expire (30 days before)
    const { data: usersToWarn, error: warnError } = await supabase.rpc('get_users_due_for_gdpr_warning');

    if (warnError) {
      console.error("Error fetching users for warning:", warnError);
    } else if (usersToWarn && usersToWarn.length > 0) {
      console.log(`Found ${usersToWarn.length} users to warn about upcoming data deletion`);

      for (const user of usersToWarn) {
        const safeName = escapeHtml(user.full_name || 'Valued User');
        const extendUrl = `${SUPABASE_URL}/functions/v1/gdpr-extend-retention?user_id=${user.user_id}`;

        try {
          await resend.emails.send({
            from: "NowInTown <notifications@nowintown.se>",
            to: [user.email],
            subject: "Important: Your NowInTown Data Will Be Deleted Soon",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                <h1 style="color: #006AA7; border-bottom: 3px solid #FECC00; padding-bottom: 10px;">
                  Important Notice About Your Data
                </h1>
                
                <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p>Dear ${safeName},</p>
                  
                  <p>We hope this message finds you well! We're reaching out because it's been almost a year since you last used NowInTown, and according to GDPR regulations, we're required to delete inactive user data after 12 months.</p>
                  
                  <h2 style="color: #dc3545;">Your data will be permanently deleted in 30 days</h2>
                  
                  <p>This includes:</p>
                  <ul>
                    <li>Your profile information</li>
                    <li>All events you've created</li>
                    <li>Your account access</li>
                  </ul>
                  
                  <h3 style="color: #006AA7;">Don't want to lose your data?</h3>
                  
                  <p>If you'd like to keep your account and all your data, simply click the button below. This will extend your data retention for another year!</p>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${extendUrl}" style="display: inline-block; background-color: #28a745; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 18px;">
                      ✓ Keep My Data - Extend for 1 Year
                    </a>
                  </div>
                  
                  <p style="color: #666;">By extending, you're confirming that you want to continue using NowInTown and keep your account active.</p>
                  
                  <hr style="border: 1px solid #eee; margin: 30px 0;">
                  
                  <p style="color: #666; font-size: 14px;">
                    <strong>Why are we doing this?</strong><br>
                    Under the General Data Protection Regulation (GDPR), we're committed to data minimization and only keeping your personal information as long as it's needed. This helps protect your privacy and ensures we maintain a clean, secure database.
                  </p>
                  
                  <p style="color: #666; font-size: 14px;">
                    If you have any questions, please contact us at <a href="mailto:contact@nowintown.se">contact@nowintown.se</a>
                  </p>
                </div>
                
                <p style="color: #999; font-size: 12px; text-align: center;">
                  NowInTown - Breaking loneliness, bringing people together<br>
                  Uppsala, Sweden | <a href="https://nowintown.lovable.app/terms" style="color: #006AA7;">Terms & Conditions</a> | <a href="https://nowintown.lovable.app/data-integrity" style="color: #006AA7;">Data Integrity Policy</a>
                </p>
              </div>
            `,
          });
          
          // Mark user as notified
          await supabase.rpc('mark_gdpr_warning_sent', { p_user_id: user.user_id });
          console.log(`Warning email sent to ${user.email}`);
        } catch (emailError) {
          console.error(`Failed to send warning email to ${user.email}:`, emailError);
        }
      }
    } else {
      console.log("No users need GDPR warning emails");
    }

    // Step 2: Delete data for users who haven't extended (past 1 year)
    const { data: usersToDelete, error: deleteError } = await supabase.rpc('get_users_due_for_gdpr_deletion');

    if (deleteError) {
      console.error("Error fetching users for deletion:", deleteError);
    } else if (usersToDelete && usersToDelete.length > 0) {
      console.log(`Found ${usersToDelete.length} users for GDPR data deletion`);

      for (const user of usersToDelete) {
        try {
          // Delete user's events
          const { error: eventsError } = await supabase
            .from('events')
            .delete()
            .eq('organizer_id', user.user_id);

          if (eventsError) {
            console.error(`Error deleting events for user ${user.user_id}:`, eventsError);
            continue;
          }

          // Delete user's profile
          const { error: profileError } = await supabase
            .from('profiles')
            .delete()
            .eq('id', user.user_id);

          if (profileError) {
            console.error(`Error deleting profile for user ${user.user_id}:`, profileError);
            continue;
          }

          // Delete user from auth (this cascades to user_roles due to foreign key)
          const { error: authError } = await supabase.auth.admin.deleteUser(user.user_id);

          if (authError) {
            console.error(`Error deleting auth user ${user.user_id}:`, authError);
            continue;
          }

          console.log(`Successfully deleted all data for user ${user.user_id} (${user.email}) - GDPR compliance`);
        } catch (deleteUserError) {
          console.error(`Failed to delete user ${user.user_id}:`, deleteUserError);
        }
      }
    } else {
      console.log("No users need GDPR data deletion");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `GDPR check complete. Warned: ${usersToWarn?.length || 0}, Deleted: ${usersToDelete?.length || 0}` 
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in GDPR retention check:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
