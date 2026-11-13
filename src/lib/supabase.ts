import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase client.
 *
 * The URL and anon key are PUBLIC by design — they are shipped in the browser
 * bundle on every Supabase app. Security comes from Row Level Security (RLS)
 * policies in the database, never from hiding these values.
 *
 * The SERVICE ROLE key must NEVER appear here or anywhere in `src/`.
 */

const url = import.meta.env?.VITE_SUPABASE_URL ?? '';
const anonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY ?? '';

/** True when the build was configured with Supabase credentials. */
export const isConfigured = Boolean(url && anonKey);

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!isConfigured) {
    throw new Error(
      'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then rebuild.',
    );
  }
  if (!client) {
    client = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'ielts-mock:supabase-session',
      },
    });
  }
  return client;
}

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type Role = 'owner' | 'student';
export type ProfileStatus = 'active' | 'suspended';

export interface Profile {
  id: string;
  email: string;
  displayName: string;
  role: Role;
  status: ProfileStatus;
  createdAt: string | null;
}

/** Raw row shape as returned by Postgres (snake_case). */
interface ProfileRow {
  id: string;
  email: string;
  display_name: string | null;
  role: Role;
  status: ProfileStatus;
  created_at: string | null;
}

function toProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name?.trim() || row.email.split('@')[0] || 'Member',
    role: row.role,
    status: row.status,
    createdAt: row.created_at,
  };
}

/* ------------------------------------------------------------------ */
/* Profile access                                                      */
/* ------------------------------------------------------------------ */

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await getSupabase()
    .from('profiles')
    .select('id, email, display_name, role, status, created_at')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return data ? toProfile(data as ProfileRow) : null;
}

/** Every profile — owner only, enforced by RLS on the server. */
export async function listProfiles(): Promise<Profile[]> {
  const { data, error } = await getSupabase()
    .from('profiles')
    .select('id, email, display_name, role, status, created_at')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data as ProfileRow[] ?? []).map(toProfile);
}

/**
 * Change a user's role or status.
 *
 * This runs against the database, and RLS restricts it to owners. A student
 * calling this directly gets zero rows updated rather than an error, so callers
 * must verify the result actually changed.
 */
export async function updateProfile(
  id: string,
  patch: { role?: Role; status?: ProfileStatus; displayName?: string },
): Promise<boolean> {
  const row: Record<string, unknown> = {};
  if (patch.role !== undefined) row.role = patch.role;
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.displayName !== undefined) row.display_name = patch.displayName;

  const { data, error } = await getSupabase()
    .from('profiles')
    .update(row)
    .eq('id', id)
    .select('id');

  if (error) throw error;
  return Array.isArray(data) && data.length > 0;
}
