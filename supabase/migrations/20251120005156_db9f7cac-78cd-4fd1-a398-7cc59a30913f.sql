-- Add pricing fields to events table
ALTER TABLE public.events 
ADD COLUMN is_free BOOLEAN DEFAULT true,
ADD COLUMN price_adults NUMERIC(10, 2),
ADD COLUMN price_students NUMERIC(10, 2),
ADD COLUMN price_kids NUMERIC(10, 2),
ADD COLUMN price_seniors NUMERIC(10, 2);