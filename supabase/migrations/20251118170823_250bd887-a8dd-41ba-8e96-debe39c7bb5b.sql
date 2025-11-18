-- Enforce that organizer_id cannot be NULL to prevent orphaned events
ALTER TABLE public.events ALTER COLUMN organizer_id SET NOT NULL;