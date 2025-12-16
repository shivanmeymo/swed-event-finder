-- Enable required extensions for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Add GDPR tracking fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS data_retention_extended_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS gdpr_deletion_notified_at TIMESTAMP WITH TIME ZONE;

-- Add similar tracking to events table
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS data_retention_extended_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create function to check and send GDPR deletion warnings (called 30 days before deletion)
CREATE OR REPLACE FUNCTION public.get_users_due_for_gdpr_warning()
RETURNS TABLE(user_id uuid, email text, full_name text)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, p.email, p.full_name
  FROM profiles p
  WHERE 
    -- Data is older than 11 months (335 days) but user hasn't been notified in last 60 days
    p.data_retention_extended_at < NOW() - INTERVAL '335 days'
    AND (p.gdpr_deletion_notified_at IS NULL OR p.gdpr_deletion_notified_at < NOW() - INTERVAL '60 days');
$$;

-- Create function to get users due for deletion (data older than 1 year)
CREATE OR REPLACE FUNCTION public.get_users_due_for_gdpr_deletion()
RETURNS TABLE(user_id uuid, email text)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, p.email
  FROM profiles p
  WHERE 
    p.data_retention_extended_at < NOW() - INTERVAL '365 days';
$$;

-- Function to mark user as notified
CREATE OR REPLACE FUNCTION public.mark_gdpr_warning_sent(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE profiles SET gdpr_deletion_notified_at = NOW() WHERE id = p_user_id;
END;
$$;

-- Function to extend data retention (called when user extends their data)
CREATE OR REPLACE FUNCTION public.extend_data_retention(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE profiles SET data_retention_extended_at = NOW(), gdpr_deletion_notified_at = NULL WHERE id = p_user_id;
  UPDATE events SET data_retention_extended_at = NOW() WHERE organizer_id = p_user_id;
END;
$$;