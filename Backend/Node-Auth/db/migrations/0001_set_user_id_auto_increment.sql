-- Migration: set user_id to AUTO_INCREMENT on existing user_profiles table
-- Run in MySQL shell or a migration tool connected to the `collabit_user` database.

-- 1) Inspect current table
-- SHOW CREATE TABLE user_profiles;
-- DESCRIBE user_profiles;

-- 2) If user_id exists but is not AUTO_INCREMENT, run:
ALTER TABLE user_profiles
  MODIFY COLUMN user_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY;

-- 3) If user_id does not exist, add it as the first column and primary key:
-- ALTER TABLE user_profiles
--   ADD COLUMN user_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST;

-- NOTE:
-- If there is already a PRIMARY KEY on another column, you may need to drop or change it first.
-- Back up your data before running DDL that changes columns or keys.