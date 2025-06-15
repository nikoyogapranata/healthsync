-- Drop existing conflicting policies
DROP POLICY IF EXISTS "Self registration" ON public.users;
DROP POLICY IF EXISTS "Superadmin can insert any" ON public.users;

-- Create a comprehensive INSERT policy that handles both cases
CREATE POLICY "User registration and admin creation"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (
  -- Allow self-registration (user creating their own record)
  auth.uid() = user_id
  OR
  -- Allow superadmin to create any user
  auth.uid() IN (
    SELECT user_id FROM users WHERE role = 'superadmin'
  )
);

-- Also ensure superadmin can read all users (needed for the check above)
CREATE POLICY "Superadmin can read all users"
ON public.users
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
  OR
  auth.uid() IN (
    SELECT user_id FROM users WHERE role = 'superadmin'
  )
);

-- Allow superadmin to update user records
CREATE POLICY "Superadmin can update users"
ON public.users
FOR UPDATE
TO authenticated
USING (
  auth.uid() = user_id
  OR
  auth.uid() IN (
    SELECT user_id FROM users WHERE role = 'superadmin'
  )
);

-- Similar policies for admins table
DROP POLICY IF EXISTS "Admins can manage their own records" ON public.admins;
CREATE POLICY "Admin records management"
ON public.admins
FOR ALL
TO authenticated
USING (
  auth.uid() = user_id
  OR
  auth.uid() IN (
    SELECT user_id FROM users WHERE role = 'superadmin'
  )
);

-- Similar policies for directors table
DROP POLICY IF EXISTS "Directors can manage their own records" ON public.directors;
CREATE POLICY "Director records management"
ON public.directors
FOR ALL
TO authenticated
USING (
  auth.uid() = user_id
  OR
  auth.uid() IN (
    SELECT user_id FROM users WHERE role = 'superadmin'
  )
);

-- Verify policies are working
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('users', 'admins', 'directors')
ORDER BY tablename, policyname;
