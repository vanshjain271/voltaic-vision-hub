-- Add new fields to profiles table for enhanced member directory
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS position TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS description TEXT;

-- Update existing rows to have default position
UPDATE public.profiles SET position = 'Member' WHERE position IS NULL;