-- Create admin users in auth.users table
-- Note: This is a special migration to insert directly into auth.users
-- Normally you should use the Supabase Auth API, but for initial admin setup this is acceptable

-- First, let's ensure we have the proper structure for user management
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create admin accounts
-- Note: You'll need to set these passwords through the Supabase Auth API or dashboard
-- This migration creates the user records, but passwords should be set securely

-- Create a function to safely create admin users if they don't exist
CREATE OR REPLACE FUNCTION create_admin_user_if_not_exists(user_email TEXT, user_password TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_id UUID;
BEGIN
    -- Check if user already exists
    SELECT id INTO user_id
    FROM auth.users
    WHERE email = user_email;
    
    -- If user doesn't exist, we'll need to create it through the auth API
    -- For now, let's create a placeholder that can be updated
    IF user_id IS NULL THEN
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            recovery_sent_at,
            last_sign_in_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            user_email,
            crypt(user_password, gen_salt('bf')),
            NOW(),
            NOW(),
            NOW(),
            '{"provider": "email", "providers": ["email"]}',
            '{"full_name": "Admin User"}',
            NOW(),
            NOW(),
            '',
            '',
            '',
            ''
        ) RETURNING id INTO user_id;
    END IF;
    
    RETURN user_id;
END;
$$;

-- Create the admin users
SELECT create_admin_user_if_not_exists('vansh@thenetwork.com', 'admin123');
SELECT create_admin_user_if_not_exists('kanishka@thenetwork.com', 'admin123');
SELECT create_admin_user_if_not_exists('tanisha@thenetwork.com', 'admin123');
SELECT create_admin_user_if_not_exists('lakshay@thenetwork.com', 'admin123');
SELECT create_admin_user_if_not_exists('samyak@thenetwork.com', 'admin123');

-- Clean up the function
DROP FUNCTION IF EXISTS create_admin_user_if_not_exists(TEXT, TEXT);