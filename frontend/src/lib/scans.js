import { supabase } from './supabase';

/**
 * Save a scan to Supabase `scans` table.
 */
export async function saveScan(data) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase.from('scans').insert({
    user_id:          user.id,
    image_name:       data.imageName || null,
    language:         data.language || 'eng',
    raw_text:         data.rawText || null,
    cleaned_text:     data.cleanedText || null,
    notes:            data.notes || null,
    translated_text:  data.translatedText || null,
    translation_lang: data.translationLang || null,
  });

  if (error) throw error;
}

/**
 * Fetch all scans for the current user.
 */
export async function getScans() {
  const { data, error } = await supabase
    .from('scans')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;
  return data;
}

/**
 * Delete a scan by id.
 */
export async function deleteScan(id) {
  const { error } = await supabase.from('scans').delete().eq('id', id);
  if (error) throw error;
}
