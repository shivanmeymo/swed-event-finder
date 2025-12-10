-- Hide organizer_email from public access by creating a view that excludes it
-- and updating RLS to prevent direct access to the email column

-- First, let's add a policy that prevents selecting the organizer_email column
-- We'll use a security definer function to mask the email

-- Create a function to mask email addresses
CREATE OR REPLACE FUNCTION public.mask_email(email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only return email if the requester is the organizer or an admin
  IF auth.uid() IS NOT NULL AND (
    -- Check if user is the organizer (their email matches)
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND profiles.email = mask_email.email)
    OR
    -- Check if user is an admin
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  ) THEN
    RETURN email;
  ELSE
    RETURN NULL;
  END IF;
END;
$$;