-- Fix the users table schema to remove password column requirement
-- The password is stored in auth.users, not in our custom users table

-- First, let's make the password column nullable (if it exists)
ALTER TABLE users ALTER COLUMN password DROP NOT NULL;

-- Or better yet, remove the password column entirely since it's stored in auth.users
-- ALTER TABLE users DROP COLUMN IF EXISTS password;

-- Let's also check what columns we actually need in the users table
-- The users table should only store role and reference information, not auth data

-- If you want to completely restructure, here's the recommended users table:
/*
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('patient', 'doctor', 'admin', 'director', 'superadmin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
*/

-- For now, let's just make password nullable to fix the immediate issue
