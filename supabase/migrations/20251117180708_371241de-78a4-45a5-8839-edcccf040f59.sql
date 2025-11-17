-- Remove the access_code column since it's no longer used for authentication
ALTER TABLE public.events DROP COLUMN access_code;