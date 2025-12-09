-- Fix: Remove the overly permissive SELECT policy that exposes all newsletter subscriber emails
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.newsletter_subscriptions;