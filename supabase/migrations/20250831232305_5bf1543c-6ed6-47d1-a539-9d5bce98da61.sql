-- Fix security issues - Add missing RLS policies for tables without them

-- Add RLS policies for users table
CREATE POLICY "Users can view all profiles" 
ON public.users FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert users" 
ON public.users FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Add RLS policies for clubs table
CREATE POLICY "Clubs are viewable by everyone" 
ON public.clubs FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create clubs" 
ON public.clubs FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update clubs" 
ON public.clubs FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can delete clubs" 
ON public.clubs FOR DELETE 
TO authenticated 
USING (true);

-- Add RLS policies for memberships table
CREATE POLICY "Users can view memberships" 
ON public.memberships FOR SELECT 
USING (true);

CREATE POLICY "Users can create memberships for themselves" 
ON public.memberships FOR INSERT 
TO authenticated 
WITH CHECK (user_id = auth.uid());

-- Add RLS policies for messages table
CREATE POLICY "Users can view messages" 
ON public.messages FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can send messages" 
ON public.messages FOR INSERT 
TO authenticated 
WITH CHECK (sender_id = auth.uid());

-- Fix function search path issue
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;