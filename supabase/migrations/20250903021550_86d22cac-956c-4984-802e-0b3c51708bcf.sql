-- Fix RLS policies for photo albums and photos to allow authenticated users to create content
-- Update photo_albums policies
DROP POLICY IF EXISTS "Admins can create albums" ON public.photo_albums;
DROP POLICY IF EXISTS "Admins can update albums" ON public.photo_albums;
DROP POLICY IF EXISTS "Admins can delete albums" ON public.photo_albums;

CREATE POLICY "Authenticated users can create albums" 
ON public.photo_albums 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own albums" 
ON public.photo_albums 
FOR UPDATE 
USING (auth.uid() = created_by);

CREATE POLICY "Admins and creators can delete albums" 
ON public.photo_albums 
FOR DELETE 
USING (auth.uid() = created_by OR is_admin());

-- Update photos policies  
DROP POLICY IF EXISTS "Admins can upload photos" ON public.photos;
DROP POLICY IF EXISTS "Admins can update photos" ON public.photos;
DROP POLICY IF EXISTS "Admins can delete photos" ON public.photos;

CREATE POLICY "Authenticated users can upload photos" 
ON public.photos 
FOR INSERT 
WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can update their own photos" 
ON public.photos 
FOR UPDATE 
USING (auth.uid() = uploaded_by OR is_admin());

CREATE POLICY "Users and admins can delete photos" 
ON public.photos 
FOR DELETE 
USING (auth.uid() = uploaded_by OR is_admin());