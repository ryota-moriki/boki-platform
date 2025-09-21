-- Add admin role to users_profile table
ALTER TABLE users_profile ADD COLUMN is_admin BOOLEAN DEFAULT FALSE NOT NULL;

-- Set first user as admin (for development)
UPDATE users_profile SET is_admin = TRUE WHERE id = (SELECT id FROM users_profile ORDER BY created_at LIMIT 1);

-- Add comment
COMMENT ON COLUMN users_profile.is_admin IS 'Administrator role flag';