-- Add organizer email, description and approval status to events table
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS organizer_email TEXT,
ADD COLUMN IF NOT EXISTS organizer_description TEXT,
ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT false;