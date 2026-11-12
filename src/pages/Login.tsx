import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { EyeIcon, EyeOffIcon, LockIcon, ShieldIcon } from '../components/Icons';

export default function Login() {
  const { signIn, ready, user, unconfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const from = (location.state as { from?: string } | null)?.from ?? '/';

  if (ready && user) {
    navigate(from, { replace: true });
    return null;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setError(null);
    setBusy(true);
    try {
      const result = await signIn(email, password);
      if (result.ok) {
        navigate(from, { replace: true });
      } else {
        setError(result.error ?? 'Could not sign in.');
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
            This app is private. Use the email and password the owner set up for you.
          </p>
        </div>

        {unconfigured && (
          <div className="callout callout-bad small" style={{ marginBottom: '1rem' }}>
            <b>Sign-in is not configured.</b> This build has no Supabase
            credentials, so nobody can sign in. Set{' '}
            <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>,
            then rebuild.
          </div>
        )}

        <form onSubmit={handleSubmit} className="stack stack-md" noValidate>
          <label className="field">
            <span className="field-label">Email</span>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              inputMode="email"
              placeholder="you@example.com"
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

          {error && (
            <div className="callout callout-bad small" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-lg btn-block"
            disabled={busy || !email || !password}
          >
            <LockIcon className="" />
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="auth-foot tiny faint">
          Accounts are created by the app owner. There is no self-registration.
          Forgotten your password? Ask the owner to reset it.
        </div>
      </div>
    </div>
  );
}
