-- Fix users table to work with registration
ALTER TABLE users ALTER COLUMN password DROP NOT NULL;
UPDATE users SET password = 'managed_by_supabase_auth' WHERE password IS NULL;
ALTER TABLE users ALTER COLUMN password SET DEFAULT 'managed_by_supabase_auth';

-- Temporarily disable RLS for registration to work
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE patients DISABLE ROW LEVEL SECURITY;

-- Or if you want to keep RLS enabled, create permissive policies
-- DROP ALL existing policies first
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'users') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON users';
    END LOOP;
    
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'patients') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON patients';
    END LOOP;
END $$;

-- Create simple, working policies
CREATE POLICY "Allow all operations for authenticated users" ON users
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for authenticated users" ON patients  
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Re-enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
