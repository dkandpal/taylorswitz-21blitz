import { supabase } from '@/integrations/supabase/client';

export type ThemeRow = {
  id: string;
  owner_id: string | null;
  name: string;
  config: any;
  created_at: string;
  updated_at: string;
};

const BUCKET = 'themes';

const sanitize = (s: string) => s.replace(/[^a-z0-9-_]/gi, '_').toLowerCase();

export async function uploadThemeAsset(file: File, folder: string, ownerId?: string | null) {
  const path = `${ownerId ?? 'anon'}/${sanitize(folder)}/${Date.now()}-${sanitize(file.name)}`;
  const { data, error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;
  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(data.path);
  return pub.publicUrl; // public bucket: safe to use directly in <img src=...>
}

export async function createTheme(name: string, config: any) {
  const { data: { user } } = await supabase.auth.getUser();
  const payload = { name, config, owner_id: user?.id ?? null, updated_at: new Date().toISOString() };
  const { data, error } = await supabase.from('themes').insert(payload).select().single();
  if (error) throw error;
  return data as ThemeRow;
}

export async function updateTheme(id: string, config: any) {
  const { data, error } = await supabase
    .from('themes')
    .update({ config, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as ThemeRow;
}

export async function listThemes(limit = 50) {
  const { data, error } = await supabase
    .from('themes')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data as ThemeRow[];
}

export async function getTheme(id: string) {
  const { data, error } = await supabase.from('themes').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data as ThemeRow | null;
}