-- Fix security issues for newsletter_subscriptions table

-- Drop the existing overly permissive SELECT policy
DROP POLICY IF EXISTS "Anyone can view newsletter subscriptions" ON public.newsletter_subscriptions;

-- Create a restrictive SELECT policy - users can only view their own subscriptions
CREATE POLICY "Users can view own subscriptions" 
ON public.newsletter_subscriptions 
FOR SELECT 
USING (email = auth.jwt()->>'email');

-- Add UPDATE policy so users can modify their own subscription preferences
CREATE POLICY "Users can update own subscriptions" 
ON public.newsletter_subscriptions 
FOR UPDATE 
USING (email = auth.jwt()->>'email')
WITH CHECK (email = auth.jwt()->>'email');

-- Add DELETE policy so users can unsubscribe
CREATE POLICY "Users can delete own subscriptions" 
ON public.newsletter_subscriptions 
FOR DELETE 
USING (email = auth.jwt()->>'email');