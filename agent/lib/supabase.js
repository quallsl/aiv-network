import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

export async function getPendingFilms() {
  const { data, error } = await supabase
    .from('films')
    .select('id, title, description, thumbnail_url, artist_id, status, created_at')
    .eq('status', 'pending');
  if (error) throw error;
  return data;
}

export async function getAllApprovedFilms() {
  const { data, error } = await supabase
    .from('films')
    .select('id, title, thumbnail_url, scheduled_removal_at, status')
    .in('status', ['approved', 'awaiting_curation']);
  if (error) throw error;
  return data;
}

export async function updateFilmStatus(id, status, note = null) {
  const { error } = await supabase
    .from('films')
    .update({ status, review_note: note, reviewed_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

export async function updateFilmThumbnail(id, thumbnail_url) {
  const { error } = await supabase
    .from('films')
    .update({ thumbnail_url })
    .eq('id', id);
  if (error) throw error;
}

