import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from './AuthProvider';

function Boot() {
  return (
    <div className="boot-screen">
      <div className="boot-mark">IE</div>
      <div className="muted small">Checking access…</div>
    </div>
  );
}

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { user, ready, unconfigured } = useAuth();
  const location = useLocation();

  if (!ready) return <Boot />;

  // No Supabase credentials: refuse to pretend the app is protected.
  if (unconfigured) return <Navigate to="/login" replace />;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}

/** Owner-only routes. Authorisation is also enforced by RLS in the database. */
export function RequireOwner({ children }: { children: ReactNode }) {
  const { user, ready } = useAuth();

  if (!ready) return <Boot />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'owner') return <Navigate to="/" replace />;

  return <>{children}</>;
}
