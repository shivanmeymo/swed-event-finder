-- Add access_code column to events table
ALTER TABLE public.events 
ADD COLUMN access_code TEXT NOT NULL DEFAULT substring(md5(random()::text || clock_timestamp()::text) from 1 for 8);

-- Drop existing RLS policies that require authentication
DROP POLICY IF EXISTS "Authenticated users can create events" ON public.events;
DROP POLICY IF EXISTS "Users can update their own events" ON public.events;
DROP POLICY IF EXISTS "Users can delete their own events" ON public.events;

-- Create new RLS policies based on access code
CREATE POLICY "Anyone can create events"
ON public.events
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update events with correct access code"
ON public.events
FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Anyone can delete events with correct access code"
ON public.events
FOR DELETE
USING (true);

-- Remove organizer_id requirement (make it optional)
ALTER TABLE public.events ALTER COLUMN organizer_id DROP NOT NULL;