/**
 * File storage for the education centre.
 *
 * Demo mode (no Supabase): files go into IndexedDB on this device.
 * Live mode: files go to Supabase Storage buckets created by
 * `supabase/academy.sql`. Books live in `academy-books`, homework uploads in
 * `academy-submissions`; both buckets are private and served with short-lived
 * signed URLs, because textbooks are licensed material.
 */

import { getSupabase, isConfigured } from '../lib/supabase';
import { deleteBlob, getBlob, putBlob } from './idb';
import { safeFileName, type FileBucket, type FileRef } from './types';

export function storageMode(): 'demo' | 'live' {
  return isConfigured ? 'live' : 'demo';
}

const BUCKETS: FileBucket[] = ['academy-books', 'academy-submissions'];

/** The signed-in user's id, so uploads are namespaced in Storage. */
async function ownerFolder(): Promise<string> {
  if (!isConfigured) return 'local';
  const { data } = await getSupabase().auth.getUser();
  return data.user?.id ?? 'anon';
}

export async function uploadAcademyFile(
  file: File,
  bucket: 'academy-books' | 'academy-submissions',
): Promise<FileRef> {
  const folder = await ownerFolder();
  const path = `${folder}/${Date.now()}-${safeFileName(file.name)}`;

  if (!isConfigured) {
    await putBlob(path, file);
    return { name: file.name, size: file.size, type: file.type, path, bucket: 'demo' };
  }

  const { error } = await getSupabase()
    .storage.from(bucket)
    .upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type || undefined });
  if (error) throw new Error(error.message);

  return { name: file.name, size: file.size, type: file.type, path, bucket };
}

const urlCache = new Map<string, string>();

/** A URL the browser can open. Demo mode creates (and caches) blob URLs. */
export async function academyFileUrl(ref: FileRef): Promise<string> {
  const key = `${ref.bucket}:${ref.path}`;
  const cached = urlCache.get(key);
  if (cached) return cached;

  if (ref.bucket === 'demo' || !isConfigured) {
    const blob = await getBlob(ref.path);
    if (!blob) {
      throw new Error(
        "This file is not stored on this device. If you are in private browsing, files cannot be saved — open the app in a normal window.",
      );
    }
    const url = URL.createObjectURL(blob);
    urlCache.set(key, url);
    return url;
  }

  const { data, error } = await getSupabase().storage.from(ref.bucket).createSignedUrl(ref.path, 3600);
  if (error || !data?.signedUrl) {
    throw new Error(error?.message ?? 'Could not open this file.');
  }
  urlCache.set(key, data.signedUrl);
  return data.signedUrl;
}

/** Opens a file in a new tab, falling back to a download when popups are blocked. */
export async function openAcademyFile(ref: FileRef): Promise<void> {
  const url = await academyFileUrl(ref);
  const win = window.open(url, '_blank', 'noopener');
  if (!win) {
    const a = document.createElement('a');
    a.href = url;
    a.download = ref.name;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
}

export async function deleteAcademyFile(ref: FileRef): Promise<void> {
  urlCache.delete(`${ref.bucket}:${ref.path}`);
  if (ref.bucket === 'demo' || !isConfigured) {
    await deleteBlob(ref.path);
    return;
  }
  if (!BUCKETS.includes(ref.bucket)) return;
  await getSupabase().storage.from(ref.bucket).remove([ref.path]);
}
