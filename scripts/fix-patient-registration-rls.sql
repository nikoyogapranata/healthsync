-- Fix RLS policies for patient registration

-- Drop existing conflicting policies
DROP POLICY IF EXISTS "User registration and admin creation" ON public.users;
DROP POLICY IF EXISTS "Self registration" ON public.users;
DROP POLICY IF EXISTS "Superadmin can insert any" ON public.users;

-- Create comprehensive policy for users table
CREATE POLICY "Users can register and superadmin can manage"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (
  -- Allow self-registration (user creating their own record)
  auth.uid() = user_id
  OR
  -- Allow superadmin to create any user (using function to avoid recursion)
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.raw_user_meta_data->>'role' = 'superadmin'
  )
);

-- Fix patients table policy
DROP POLICY IF EXISTS "Patients can manage their own records" ON public.patients;
DROP POLICY IF EXISTS "Patient records management" ON public.patients;

CREATE POLICY "Patient registration and management"
ON public.patients
FOR ALL
TO authenticated
USING (
  -- Users can access their own patient records
  auth.uid() = user_id
  OR
  -- Superadmin can access all patient records
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.raw_user_meta_data->>'role' = 'superadmin'
  )
  OR
  -- Doctors and admins can access patient records (add this later if needed)
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.user_id = auth.uid() 
    AND users.role IN ('doctor', 'admin', 'director')
  )
);

-- Also allow SELECT for users table
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
CREATE POLICY "Users can read own data and superadmin can read all"
ON public.users
FOR SELECT
TO authenticated
USING (
  -- Users can read their own data
  auth.uid() = user_id
  OR
  -- Superadmin can read all users
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.raw_user_meta_data->>'role' = 'superadmin'
  )
);

-- Allow UPDATE for users (for profile updates)
CREATE POLICY "Users can update own data and superadmin can update all"
ON public.users
FOR UPDATE
TO authenticated
USING (
  auth.uid() = user_id
  OR
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.raw_user_meta_data->>'role' = 'superadmin'
  )
);

-- Verify the policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('users', 'patients')
ORDER BY tablename, policyname;
