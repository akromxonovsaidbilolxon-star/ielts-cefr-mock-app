/**
 * Tracks who is signed in, so browser storage can be namespaced per user.
 *
 * WHY: every storage key used to be global ('ielts-mock:history:v1'). On a
 * shared phone, two students saw each other's results. Keys are now suffixed
 * with the signed-in user's id.
 *
 * This is a module-level variable rather than React state on purpose: the
 * storage helpers in lib/storage.ts and lib/mlStorage.ts are plain functions
 * called from many components, and threading a user id through all of them
 * would touch far more code than it is worth.
 */

let currentUserId: string | null = null;

export function setCurrentUserId(id: string | null): void {
  currentUserId = id;
}

export function getCurrentUserId(): string | null {
  return currentUserId;
}

/**
 * Namespace a storage key.
 *
 * Signed-out reads fall back to 'anon' so nothing throws and stale data is
 * never shown as though it belonged to the next person who signs in.
 */
export function scopedKey(base: string): string {
  return `${base}:${currentUserId ?? 'anon'}`;
}
