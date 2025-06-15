-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Combined user management" ON public.users;
DROP POLICY IF EXISTS "Self registration" ON public.users;
DROP POLICY IF EXISTS "Superadmin can insert any" ON public.users;
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
DROP POLICY IF EXISTS "Superadmin can read all users" ON public.users;
DROP POLICY IF EXISTS "Superadmin can update all users" ON public.users;

-- Create simple, non-recursive policies
-- Allow authenticated users to read their own data
CREATE POLICY "Users can read own data"
ON public.users
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow authenticated users to insert their own data (for registration)
CREATE POLICY "Users can insert own data"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to update their own data
CREATE POLICY "Users can update own data"
ON public.users
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create a function to check if current user is superadmin (avoids recursion)
CREATE OR REPLACE FUNCTION is_superadmin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE user_id = auth.uid() 
    AND role = 'superadmin'
  );
$$;

-- Allow superadmin to read all users (using function to avoid recursion)
CREATE POLICY "Superadmin can read all"
ON public.users
FOR SELECT
TO authenticated
USING (is_superadmin());

-- Allow superadmin to insert any user
CREATE POLICY "Superadmin can insert any"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (is_superadmin());

-- Allow superadmin to update any user
CREATE POLICY "Superadmin can update any"
ON public.users
FOR UPDATE
TO authenticated
USING (is_superadmin())
WITH CHECK (is_superadmin());

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION is_superadmin() TO authenticated;

-- Make sure RLS is enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Also fix the admins table policies
DROP POLICY IF EXISTS "Superadmin can manage admins" ON public.admins;
CREATE POLICY "Superadmin can manage admins"
ON public.admins
FOR ALL
TO authenticated
USING (is_superadmin())
WITH CHECK (is_superadmin());

-- Fix directors table policies
DROP POLICY IF EXISTS "Superadmin can manage directors" ON public.directors;
CREATE POLICY "Superadmin can manage directors"
ON public.directors
FOR ALL
TO authenticated
USING (is_superadmin())
WITH CHECK (is_superadmin());

-- Enable RLS on related tables
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.directors ENABLE ROW LEVEL SECURITY;
