-- Enable RLS on all tables and create proper policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;  
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;

-- Create profiles table for authenticated users
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name text,
  avatar_url text,
  role text DEFAULT 'member',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create photo albums table for gallery
CREATE TABLE IF NOT EXISTS public.photo_albums (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  cover_image_url text,
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  is_public boolean DEFAULT true
);

ALTER TABLE public.photo_albums ENABLE ROW LEVEL SECURITY;

-- Create photos table
CREATE TABLE IF NOT EXISTS public.photos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  album_id uuid REFERENCES public.photo_albums(id) ON DELETE CASCADE,
  title text,
  image_url text NOT NULL,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  uploaded_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- Update existing tables to reference auth.users properly
ALTER TABLE public.memberships 
ADD CONSTRAINT memberships_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.registrations 
ADD CONSTRAINT registrations_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.messages 
ADD CONSTRAINT messages_sender_id_fkey 
FOREIGN KEY (sender_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create RLS policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Create RLS policies for photo albums
CREATE POLICY "Public albums are viewable by everyone" 
ON public.photo_albums FOR SELECT 
USING (is_public = true OR created_by = auth.uid());

CREATE POLICY "Authenticated users can create albums" 
ON public.photo_albums FOR INSERT 
TO authenticated 
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own albums" 
ON public.photo_albums FOR UPDATE 
USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own albums" 
ON public.photo_albums FOR DELETE 
USING (created_by = auth.uid());

-- Create RLS policies for photos
CREATE POLICY "Photos in public albums are viewable by everyone" 
ON public.photos FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.photo_albums 
    WHERE id = photos.album_id 
    AND (is_public = true OR created_by = auth.uid())
  )
);

CREATE POLICY "Authenticated users can upload photos" 
ON public.photos FOR INSERT 
TO authenticated 
WITH CHECK (uploaded_by = auth.uid());

CREATE POLICY "Users can update their own photos" 
ON public.photos FOR UPDATE 
USING (uploaded_by = auth.uid());

CREATE POLICY "Users can delete their own photos" 
ON public.photos FOR DELETE 
USING (uploaded_by = auth.uid());

-- Create RLS policies for events
CREATE POLICY "Events are viewable by everyone" 
ON public.events FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create events" 
ON public.events FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Create RLS policies for registrations
CREATE POLICY "Users can view their own registrations" 
ON public.registrations FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can register for events" 
ON public.registrations FOR INSERT 
TO authenticated 
WITH CHECK (user_id = auth.uid());

-- Create RLS policies for sponsors
CREATE POLICY "Sponsors are viewable by everyone" 
ON public.sponsors FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage sponsors" 
ON public.sponsors FOR ALL 
TO authenticated 
USING (true);

-- Create function to handle new user signup
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create storage policies for albums bucket
CREATE POLICY "Album images are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'albums');

CREATE POLICY "Authenticated users can upload album images" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'albums' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own album images" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'albums' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own album images" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'albums' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create storage policies for sponsor logos
CREATE POLICY "Sponsor logos are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'sponsor-logos');

CREATE POLICY "Authenticated users can upload sponsor logos" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'sponsor-logos');

-- Create storage policies for event covers
CREATE POLICY "Event covers are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'event-covers');

CREATE POLICY "Authenticated users can upload event covers" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'event-covers');