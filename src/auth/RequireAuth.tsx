import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from './AuthProvider';

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { session, ready, enforced } = useAuth();
  const location = useLocation();

  if (!ready) {
    return (
      <div className="boot-screen">
        <div className="boot-mark">IE</div>
        <div className="muted small">Checking access…</div>
      </div>
    );
  }

  if (!session) {
    // With no roster at all, the first visitor is sent to set up the owner.
    const target = enforced ? '/login' : '/setup';
    return <Navigate to={target} replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}

/** Owner-only routes. */
export function RequireOwner({ children }: { children: ReactNode }) {
  const { session, ready } = useAuth();

  if (!ready) {
    return (
      <div className="boot-screen">
        <div className="boot-mark">IE</div>
        <div className="muted small">Checking access…</div>
      </div>
    );
  }

  if (!session) return <Navigate to="/login" replace />;
  if (session.role !== 'owner') return <Navigate to="/" replace />;

  return <>{children}</>;
}
