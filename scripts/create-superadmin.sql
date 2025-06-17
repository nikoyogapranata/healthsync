-- Create superadmin user in Supabase Auth
-- This should be done through Supabase dashboard or auth admin API

-- Insert superadmin into users table
INSERT INTO users (
  user_id,
  email,
  password,
  role,
  profile_picture,
  created_at
) VALUES (
  '1bcd3bd2-7e92-4642-a958-02d2449bba05',
  'superadmin@healthsync.id',
  'managed_by_supabase_auth',
  'superadmin',
  NULL,
  now()
) ON CONFLICT (user_id) DO NOTHING;

-- Verify the superadmin was created
SELECT user_id, email, role, created_at 
FROM users 
WHERE role = 'superadmin';
