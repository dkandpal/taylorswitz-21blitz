-- Fix RLS policies to allow anonymous users to update themes they created
DROP POLICY IF EXISTS "Users can update their own themes" ON public.themes;

CREATE POLICY "Users can update their own themes" ON public.themes
FOR UPDATE USING (
  (auth.uid() = owner_id) OR 
  (owner_id IS NULL AND auth.uid() IS NULL)
);