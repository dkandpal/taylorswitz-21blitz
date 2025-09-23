-- Fix RLS policies to properly handle anonymous vs authenticated users
DROP POLICY IF EXISTS "Users can update their own themes" ON public.themes;

-- Allow updates if:
-- 1. User owns the theme (authenticated user updating their own theme)
-- 2. Theme was created anonymously and user is still anonymous
-- 3. Theme was created anonymously and user is now authenticated (taking ownership)
CREATE POLICY "Users can update their own themes" ON public.themes
FOR UPDATE USING (
  (auth.uid() = owner_id) OR 
  (owner_id IS NULL)
);

-- Also fix the insert policy to be more permissive
DROP POLICY IF EXISTS "Users can insert their own themes" ON public.themes;

CREATE POLICY "Users can insert their own themes" ON public.themes
FOR INSERT WITH CHECK (
  (auth.uid() = owner_id) OR 
  (owner_id IS NULL)
);