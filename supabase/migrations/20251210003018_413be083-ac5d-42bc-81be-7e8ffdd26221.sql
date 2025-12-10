-- Fix the security definer view issue by using security_invoker
DROP VIEW IF EXISTS public.events_public;

CREATE VIEW public.events_public 
WITH (security_invoker = true)
AS
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