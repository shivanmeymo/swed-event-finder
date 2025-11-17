-- Fix security issue: Restrict profile visibility
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Users can only view their own profile (including email)
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Fix security issue: Restrict user roles visibility
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Users can view all roles" ON public.user_roles;

-- Users can see their own roles only
CREATE POLICY "Users can view own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Admins can view all roles
CREATE POLICY "Admins can view all roles" 
ON public.user_roles 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Make access_code nullable since it's no longer required for authentication
ALTER TABLE public.events ALTER COLUMN access_code DROP NOT NULL;