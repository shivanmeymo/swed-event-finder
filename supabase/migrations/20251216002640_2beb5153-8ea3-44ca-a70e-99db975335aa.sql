-- Fix 1: Remove the overly permissive SELECT policy on events table
-- The events_public view with mask_email function should be used for public access
DROP POLICY IF EXISTS "Anyone can view events" ON public.events;

-- Create a more restrictive SELECT policy:
-- Only organizers can see their own events' full details, admins can see all
CREATE POLICY "Organizers can view own events" 
ON public.events 
FOR SELECT 
USING (
  auth.uid() = organizer_id 
  OR has_role(auth.uid(), 'admin')
);

-- Create policy for public access via service role only (for the view)
-- The events_public view will handle masking the email
CREATE POLICY "Service role can view all events"
ON public.events
FOR SELECT
TO service_role
USING (true);

-- Fix 2: The events_public is a VIEW not a table, so RLS doesn't apply directly
-- But we need to ensure unauthenticated users can still see approved events via the view
-- Grant SELECT on the view to anon and authenticated roles
GRANT SELECT ON public.events_public TO anon;
GRANT SELECT ON public.events_public TO authenticated;