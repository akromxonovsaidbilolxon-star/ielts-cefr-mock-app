import { useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { migrateLegacyKeys } from '../lib/storage';
import { migrateLegacyMlKeys } from '../lib/mlStorage';

/**
 * Runs one-time, non-destructive migrations of pre-per-user browser data.
 *
 * Mounted inside the authenticated area so it only ever runs for a signed-in
 * user, and only once per session.
 */
export default function StorageMigration() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    migrateLegacyKeys();
    migrateLegacyMlKeys();
  }, [user]);

  return null;
}
