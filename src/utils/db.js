// src/utils/db.js
import { supabase } from './supabase';

// ── READ ──────────────────────────────────────────────────────────

export async function getMemorials() {
  const { data, error } = await supabase
    .from('memorials')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
}

export async function getMemorialById(id) {
  const { data, error } = await supabase
    .from('memorials')
    .select('*')
    .eq('id', id)
    .single();
  return { data, error };
}

// ── PHOTO UPLOAD ──────────────────────────────────────────────────

/**
 * Upload a photo to Supabase Storage and return its public URL.
 * @param {File} file - the image file from the input
 * @returns {{ url: string|null, error: Error|null }}
 */
export async function uploadPhoto(file) {
  // Reject files over 5MB
  if (file.size > 5 * 1024 * 1024) {
    return { url: null, error: new Error('File too large. Maximum size is 5MB.') };
  }
  // Reject non-image files
  if (!file.type.startsWith('image/')) {
    return { url: null, error: new Error('Only image files are allowed.') };
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('pet-photos')
    .upload(fileName, file);

  if (uploadError) return { url: null, error: uploadError };

  const { data } = supabase.storage
    .from('pet-photos')
    .getPublicUrl(fileName);

  return { url: data.publicUrl, error: null };
}
// ── CREATE ────────────────────────────────────────────────────────

/**
 * Insert a new memorial into the database.
 * @param {{ name, type, breed, born, died, quote, photo_url }} memorial
 */
export async function createMemorial(memorial) {
  const { reactions, ...cleanMemorial } = memorial;

  const { data, error } = await supabase
    .from('memorials')
    .insert([cleanMemorial])
    .select()
    .single();

  return { data, error };
}

// ── REACTIONS ─────────────────────────────────────────────────────

export async function addReaction(id, type) {
  const { data, error } = await supabase.rpc('increment_reaction', {
    memorial_id: id,
    column_name: type,
  });
  return { data, error };
}

// ── USER MEMORIALS ────────────────────────────────────────────────

export async function getUserMemorials(userId) {
  const { data, error } = await supabase
    .from('memorials')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
}

export async function updateMemorial(id, updates) {
  const { data, error } = await supabase
    .from('memorials')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
}

export async function deleteMemorial(id) {
  const { error } = await supabase
    .from('memorials')
    .delete()
    .eq('id', id);
  return { error };
}
// ── SITE STATS ────────────────────────────────────────────────────

export async function getSiteStats() {
  const { data, error } = await supabase.rpc('get_site_stats');
  return { data, error };
}