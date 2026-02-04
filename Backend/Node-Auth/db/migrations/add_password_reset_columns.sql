-- Add password reset columns to user_profiles table
-- Run this SQL script in your MySQL database

USE collabit_user_db;

-- Add reset_token and reset_token_expires columns if they don't exist
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255) NULL,
ADD COLUMN IF NOT EXISTS reset_token_expires DATETIME NULL;

-- Add index for faster token lookup
CREATE INDEX IF NOT EXISTS idx_reset_token ON user_profiles(reset_token);

-- Verify the changes
DESCRIBE user_profiles;
