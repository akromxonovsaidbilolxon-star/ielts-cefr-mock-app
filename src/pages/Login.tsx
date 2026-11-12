import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { hasStrongCrypto, lockoutRemaining, MAX_FAILED_ATTEMPTS } from '../lib/auth';
import { LockIcon, EyeIcon, EyeOffIcon, ShieldIcon } from '../components/Icons';

export default function Login() {
  const { session, signIn, ready, enforced } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const from = (location.state as { from?: string } | null)?.from ?? '/';

  if (ready && session) return <Navigate to={from} replace />;

  const locked = lockoutRemaining(username);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setError(null);
    setBusy(true);
    try {
      const result = await signIn(username, password, remember);
      if (result.ok) {
        navigate(from, { replace: true });
      } else {
        setError(result.error);
        setPassword('');
      }
    } catch {
      setError('Something went wrong while signing in. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-head">
          <div className="auth-badge">
            <ShieldIcon className="" />
          </div>
          <h1>Sign in</h1>
          <p className="muted small">
            {enforced
              ? 'This app is private. Use the username and password the owner gave you.'
              : 'No accounts have been created yet.'}
          </p>
        </div>

        {!hasStrongCrypto() && (
          <div className="callout callout-warn small" style={{ marginBottom: '1rem' }}>
            <b>Insecure connection.</b> This page is not on HTTPS or localhost, so
            password hashing is weakened. Open the app over HTTPS for proper
            security.
          </div>
        )}

        {!enforced && (
          <div className="callout callout-info small" style={{ marginBottom: '1rem' }}>
            No access roster is configured in this build.{' '}
            <Link to="/setup">Set up the owner account</Link> to lock the app.
          </div>
        )}

        <form onSubmit={handleSubmit} className="stack stack-md" noValidate>
          <label className="field">
            <span className="field-label">Username</span>
            <input
              className="input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              inputMode="text"
              placeholder="your username"
              required
            />
          </label>

          <label className="field">
            <span className="field-label">Password</span>
            <div className="password-wrap">
              <input
                className="input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="your password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOffIcon className="" /> : <EyeIcon className="" />}
              </button>
            </div>
          </label>

          <div className="row-between">
            <label className="check-row">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span className="small">Keep me signed in</span>
            </label>
            <span className="tiny faint">
              {remember ? 'Until I sign out or 12h pass' : 'This session only'}
            </span>
          </div>

          {error && (
            <div className="callout callout-bad small" role="alert">
              {error}
            </div>
          )}

          {locked > 0 && (
            <div className="callout callout-warn small">
              Locked after {MAX_FAILED_ATTEMPTS} failed attempts. Wait {locked} minute
              {locked === 1 ? '' : 's'} before trying again.
            </div>
          )}

          <button
            type="submit"
            className="btn btn-lg btn-block"
            disabled={busy || !username || !password || locked > 0}
          >
            <LockIcon className="" />
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="auth-foot tiny faint">
          Access is limited to accounts created by the app owner. Passwords are
          never stored in plain text.
        </div>
      </div>
    </div>
  );
}
