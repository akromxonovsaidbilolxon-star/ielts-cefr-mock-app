import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { Session as SupabaseSession } from '@supabase/supabase-js';
import {
  fetchProfile,
  getSupabase,
  isConfigured,
  type Profile,
  type Role,
} from '../lib/supabase';
import { setCurrentUserId } from '../lib/currentUser';

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  role: Role;
  status: 'active' | 'suspended';
}

export interface LoginResult {
  ok: boolean;
  error?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  ready: boolean;
  /** True when the build has no Supabase credentials — the app cannot lock. */
  unconfigured: boolean;
  signIn: (email: string, password: string) => Promise<LoginResult>;
  signOut: () => Promise<void>;
  /** Re-reads the profile (used after an owner edits their own account). */
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function toAuthUser(profile: Profile): AuthUser {
  return {
    id: profile.id,
    email: profile.email,
    displayName: profile.displayName,
    role: profile.role,
    status: profile.status,
  };
}

/** Friendly text for the errors Supabase actually returns. */
function explain(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('invalid login credentials')) return 'That email or password is not correct.';
  if (m.includes('email not confirmed')) return 'Please confirm your email address first — check your inbox.';
  if (m.includes('failed to fetch') || m.includes('network')) {
    return 'Could not reach the server. Check your internet connection and try again.';
  }
  if (m.includes('rate limit') || m.includes('too many')) {
    return 'Too many attempts. Please wait a minute and try again.';
  }
  return message;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(!isConfigured);
  const readyRef = useRef(false);

  /**
   * Load the profile for a session.
   *
   * A signed-in user with no profile row is NOT admitted: without a profile the
   * owner cannot see or control them, so they are signed straight back out.
   */
  const applySession = useCallback(async (session: SupabaseSession | null) => {
    if (!session) {
      setCurrentUserId(null);
      setUser(null);
      readyRef.current = true;
      setReady(true);
      return;
    }

    try {
      const profile = await fetchProfile(session.user.id);
      if (!profile) {
        await getSupabase().auth.signOut();
        setCurrentUserId(null);
        setUser(null);
      } else if (profile.status === 'suspended') {
        await getSupabase().auth.signOut();
        setCurrentUserId(null);
        setUser(null);
      } else {
        setCurrentUserId(profile.id);
        setUser(toAuthUser(profile));
      }
    } catch {
      // Network/RLS failure: do not admit, but do not destroy the session either
      // so a temporary outage does not sign everyone out permanently.
      setCurrentUserId(null);
      setUser(null);
    } finally {
      readyRef.current = true;
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isConfigured) return;

    let cancelled = false;
    const supabase = getSupabase();

    void supabase.auth.getSession().then(({ data }) => {
      if (!cancelled) void applySession(data.session);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelled) return;
      if (event === 'SIGNED_OUT') {
        setCurrentUserId(null);
        setUser(null);
        readyRef.current = true;
        setReady(true);
        return;
      }
      void applySession(session);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [applySession]);

  const signIn = useCallback(async (email: string, password: string): Promise<LoginResult> => {
    if (!isConfigured) {
      return { ok: false, error: 'This build is not configured for sign-in yet.' };
    }
    const { data, error } = await getSupabase().auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) return { ok: false, error: explain(error.message) };
    if (!data.session) return { ok: false, error: 'Sign-in did not return a session. Try again.' };

    // Confirm the account is actually provisioned before letting them in.
    const profile = await fetchProfile(data.session.user.id);
    if (!profile) {
      await getSupabase().auth.signOut();
      return {
        ok: false,
        error: 'This account has not been set up by the owner yet. Ask them to add you.',
      };
    }
    if (profile.status === 'suspended') {
      await getSupabase().auth.signOut();
      return { ok: false, error: 'This account is suspended. Contact the owner.' };
    }

    setCurrentUserId(profile.id);
    setUser(toAuthUser(profile));
    setReady(true);
    return { ok: true };
  }, []);

  const signOut = useCallback(async () => {
    if (isConfigured) await getSupabase().auth.signOut();
    setCurrentUserId(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!isConfigured) return;
    const { data } = await getSupabase().auth.getSession();
    await applySession(data.session);
  }, [applySession]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, ready, unconfigured: !isConfigured, signIn, signOut, refreshUser }),
    [user, ready, signIn, signOut, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
