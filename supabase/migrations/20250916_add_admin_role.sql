-- Migration: Add admin role system
-- Date: 2025-09-16
-- Purpose: Implement role-based access control for admin panel

-- Step 1: Add role column to users_profile table
ALTER TABLE users_profile
ADD COLUMN IF NOT EXISTS role text DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Step 2: Create index for role column for better query performance
CREATE INDEX IF NOT EXISTS idx_users_profile_role ON users_profile(role);

-- Step 3: Update existing users to have 'user' role
UPDATE users_profile SET role = 'user' WHERE role IS NULL;

-- Step 4: Create RLS policies for admin-only operations on management tables
-- Note: These policies ensure only admins can modify content

-- Policy for chapters table (admin write access)
CREATE POLICY "Only admins can insert chapters" ON chapters
FOR INSERT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users_profile
    WHERE users_profile.id = auth.uid()
    AND users_profile.role = 'admin'
  )
);

CREATE POLICY "Only admins can update chapters" ON chapters
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users_profile
    WHERE users_profile.id = auth.uid()
    AND users_profile.role = 'admin'
  )
);

CREATE POLICY "Only admins can delete chapters" ON chapters
FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users_profile
    WHERE users_profile.id = auth.uid()
    AND users_profile.role = 'admin'
  )
);

-- Policy for slides table (admin write access)
CREATE POLICY "Only admins can insert slides" ON slides
FOR INSERT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users_profile
    WHERE users_profile.id = auth.uid()
    AND users_profile.role = 'admin'
  )
);

CREATE POLICY "Only admins can update slides" ON slides
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users_profile
    WHERE users_profile.id = auth.uid()
    AND users_profile.role = 'admin'
  )
);

CREATE POLICY "Only admins can delete slides" ON slides
FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users_profile
    WHERE users_profile.id = auth.uid()
    AND users_profile.role = 'admin'
  )
);

-- Policy for questions table (admin write access)
CREATE POLICY "Only admins can insert questions" ON questions
FOR INSERT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users_profile
    WHERE users_profile.id = auth.uid()
    AND users_profile.role = 'admin'
  )
);

CREATE POLICY "Only admins can update questions" ON questions
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users_profile
    WHERE users_profile.id = auth.uid()
    AND users_profile.role = 'admin'
  )
);

CREATE POLICY "Only admins can delete questions" ON questions
FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users_profile
    WHERE users_profile.id = auth.uid()
    AND users_profile.role = 'admin'
  )
);

-- Step 5: Create a helper function to check admin status
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users_profile
    WHERE users_profile.id = auth.uid()
    AND users_profile.role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 6: Grant permissions
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;

-- Note: To set a user as admin, run this command with their user ID:
-- UPDATE users_profile SET role = 'admin' WHERE id = 'USER_UUID_HERE';