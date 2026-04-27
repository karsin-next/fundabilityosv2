-- Add fundability_score column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS fundability_score INTEGER DEFAULT NULL;

-- Add user_email column to sessions for tracking guest assessments
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS user_email TEXT DEFAULT NULL;
