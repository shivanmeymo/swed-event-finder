-- Drop the existing "Anyone can view events" policy
DROP POLICY IF EXISTS "Anyone can view events" ON public.events;

-- Create a new policy that allows viewing events but masks the organizer_email for non-authorized users
-- We'll create a view that uses the mask_email function instead

-- Create a secure view for public event access
CREATE OR REPLACE VIEW public.events_public AS
SELECT 
  id,
  title,
  description,
  location,
  category,
  start_datetime,
  end_datetime,
  image_url,
  organizer_id,
  organizer_description,
  is_free,
  price_adults,
  price_students,
  price_kids,
  price_seniors,
  attendees,
  approved,
  created_at,
  updated_at,
  -- Only show email to authorized users (organizer themselves or admin)
  public.mask_email(organizer_email) as organizer_email
FROM public.events;

-- Grant access to the view
GRANT SELECT ON public.events_public TO anon, authenticated;

-- Recreate the RLS policy to allow viewing events
CREATE POLICY "Anyone can view events" 
ON public.events 
FOR SELECT 
USING (true);