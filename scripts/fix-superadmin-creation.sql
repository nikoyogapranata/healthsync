-- First, let's create a more robust solution
-- Drop the problematic function and policies
DROP FUNCTION IF EXISTS is_superadmin();
DROP POLICY IF EXISTS "Superadmin can read all" ON public.users;
DROP POLICY IF EXISTS "Superadmin can insert any" ON public.users;
DROP POLICY IF EXISTS "Superadmin can update any" ON public.users;

-- Create a simpler approach: use auth.jwt() to check claims
-- This avoids querying the users table recursively

-- Allow superadmin to read all users (check auth metadata)
CREATE POLICY "Superadmin can read all"
ON public.users
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    -- Use a direct query with specific user IDs to avoid recursion
    SELECT unnest(ARRAY['your-superadmin-user-id-here']::uuid[])
  )
  OR auth.uid() = user_id
);

-- Allow superadmin to insert any user
CREATE POLICY "Superadmin can insert any"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IN (
    SELECT unnest(ARRAY['your-superadmin-user-id-here']::uuid[])
  )
  OR auth.uid() = user_id
);

-- Allow superadmin to update any user
CREATE POLICY "Superadmin can update any"
ON public.users
FOR UPDATE
TO authenticated
USING (
  auth.uid() IN (
    SELECT unnest(ARRAY['your-superadmin-user-id-here']::uuid[])
  )
  OR auth.uid() = user_id
)
WITH CHECK (
  auth.uid() IN (
    SELECT unnest(ARRAY['your-superadmin-user-id-here']::uuid[])
  )
  OR auth.uid() = user_id
);
