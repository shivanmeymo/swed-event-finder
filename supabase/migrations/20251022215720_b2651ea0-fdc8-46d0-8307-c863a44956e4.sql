-- Remove capacity field and update date structure for events
-- Add start_datetime and end_datetime for better event scheduling

-- Add new datetime columns
ALTER TABLE public.events 
ADD COLUMN start_datetime TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
ADD COLUMN end_datetime TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '2 hours');

-- Remove the old text-based date field
ALTER TABLE public.events DROP COLUMN IF EXISTS date;

-- Note: Events will be automatically cleaned up after end_datetime
-- This requires a scheduled job or cron function to be implemented separately