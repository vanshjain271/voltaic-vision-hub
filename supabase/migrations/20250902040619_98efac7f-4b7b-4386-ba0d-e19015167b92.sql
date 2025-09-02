-- Create user roles enum and system
CREATE TYPE public.user_role AS ENUM ('admin', 'visitor');

-- Create user_roles table 
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role user_role NOT NULL DEFAULT 'visitor',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_roles.user_id = get_user_role.user_id;
$$;

-- Create helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = is_admin.user_id AND role = 'admin'
  );
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own role" ON public.user_roles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL USING (public.is_admin());

-- Create join_applications table for membership requests
CREATE TABLE public.join_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  roll_number TEXT NOT NULL,
  branch TEXT NOT NULL,
  reason_to_join TEXT NOT NULL,
  prior_experience TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on join_applications
ALTER TABLE public.join_applications ENABLE ROW LEVEL SECURITY;

-- RLS policies for join_applications
CREATE POLICY "Anyone can submit applications" ON public.join_applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all applications" ON public.join_applications
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update applications" ON public.join_applications
  FOR UPDATE USING (public.is_admin());

-- Update existing table policies to restrict admin actions
-- Update events policies
DROP POLICY IF EXISTS "Authenticated users can create events" ON public.events;
CREATE POLICY "Admins can create events" ON public.events
  FOR INSERT WITH CHECK (public.is_admin());

-- Update sponsors policies  
DROP POLICY IF EXISTS "Authenticated users can manage sponsors" ON public.sponsors;
CREATE POLICY "Admins can manage sponsors" ON public.sponsors
  FOR ALL USING (public.is_admin());

-- Update blog_posts policies
DROP POLICY IF EXISTS "Authors can create their own posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authors can update their own posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authors can delete their own posts" ON public.blog_posts;

CREATE POLICY "Admins can create blog posts" ON public.blog_posts
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update blog posts" ON public.blog_posts
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete blog posts" ON public.blog_posts
  FOR DELETE USING (public.is_admin());

-- Update photo_albums policies
DROP POLICY IF EXISTS "Authenticated users can create albums" ON public.photo_albums;
DROP POLICY IF EXISTS "Users can update their own albums" ON public.photo_albums;
DROP POLICY IF EXISTS "Users can delete their own albums" ON public.photo_albums;

CREATE POLICY "Admins can create albums" ON public.photo_albums
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update albums" ON public.photo_albums
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete albums" ON public.photo_albums
  FOR DELETE USING (public.is_admin());

-- Update photos policies
DROP POLICY IF EXISTS "Authenticated users can upload photos" ON public.photos;
DROP POLICY IF EXISTS "Users can update their own photos" ON public.photos;
DROP POLICY IF EXISTS "Users can delete their own photos" ON public.photos;

CREATE POLICY "Admins can upload photos" ON public.photos
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update photos" ON public.photos
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete photos" ON public.photos
  FOR DELETE USING (public.is_admin());

-- Trigger to create default visitor role for new users
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'visitor');
  RETURN NEW;
END;
$$;

-- Create trigger for new user role assignment
DROP TRIGGER IF EXISTS on_auth_user_created_role ON auth.users;
CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();