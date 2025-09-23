-- Add missing columns to themes table for theme storage
ALTER TABLE public.themes 
ADD COLUMN name TEXT NOT NULL DEFAULT 'Untitled Theme',
ADD COLUMN config JSONB NOT NULL DEFAULT '{}',
ADD COLUMN created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_themes_updated_at
BEFORE UPDATE ON public.themes
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();