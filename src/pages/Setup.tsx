import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import {
  createUser,
  isEnforced,
  localRoster,
  logEvent,
  saveLocalRoster,
  SESSION_HOURS,
  validatePassword,
  validateUsername,
  hasStrongCrypto,
} from '../lib/auth';
import { ShieldIcon, EyeIcon, EyeOffIcon } from '../components/Icons';

/**
 * First-run setup. Only reachable when the build carries no access roster,
 * which means the app is unlocked. The account created here is stored on this
 * device only — publish `.env.production` (generated in the owner panel) to make
 * the rule permanent for every device.
 */
export default function Setup() {
  const { session, enforceSetup } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // If a roster is already baked in, setup is not available.
  if (isEnforced()) return <Navigate to="/login" replace />;
  if (session) return <Navigate to="/" replace />;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setError(null);

    const usernameError = validateUsername(username);
    if (usernameError) return setError(usernameError);
    const passwordError = validatePassword(password);
    if (passwordError) return setError(passwordError);
    if (password !== confirm) return setError('The two passwords do not match.');
    if (localRoster().some((u) => u.username === username.trim().toLowerCase())) {
      return setError('That username already exists on this device.');
    }

    setBusy(true);
    try {
      const owner = await createUser({
        username,
        displayName: displayName || username,
        password,
        role: 'owner',
        note: 'Created during first-run setup',
      });
      saveLocalRoster([owner]);
      logEvent(owner.username, 'owner.created', 'first-run setup');

      const now = new Date();
      enforceSetup({
        userId: owner.id,
        username: owner.username,
        displayName: owner.displayName,
        role: 'owner',
        issuedAtISO: now.toISOString(),
        lastSeenISO: now.toISOString(),
        expiresAtISO: new Date(now.getTime() + SESSION_HOURS * 3_600_000).toISOString(),
        remember: true,
      });
      navigate('/admin', { replace: true });
    } catch {
      setError('Could not create the account. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card auth-card-wide">
        <div className="auth-head">
          <div className="auth-badge">
            <ShieldIcon className="" />
          </div>
          <h1>Set up owner access</h1>
          <p className="muted small">
            This build has no access roster, so anyone with the link can currently
            use it. Create the owner account to lock it down.
          </p>
        </div>

        {!hasStrongCrypto() && (
          <div className="callout callout-warn small" style={{ marginBottom: '1rem' }}>
            <b>Insecure connection.</b> Open this page over HTTPS or on localhost so
            passwords can be hashed properly.
          </div>
        )}

        <form onSubmit={handleSubmit} className="stack stack-md" noValidate>
          <div className="grid-2">
            <label className="field">
              <span className="field-label">Username</span>
              <input
                className="input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                placeholder="owner"
                required
              />
            </label>
            <label className="field">
              <span className="field-label">Display name (optional)</span>
              <input
                className="input"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
              />
            </label>
          </div>

          <label className="field">
            <span className="field-label">Password</span>
            <div className="password-wrap">
              <input
                className="input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                placeholder="at least 8 characters, with a number"
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

          <label className="field">
            <span className="field-label">Confirm password</span>
            <input
              className="input"
              type={showPassword ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              required
            />
          </label>

          {error && (
            <div className="callout callout-bad small" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-lg btn-block"
            disabled={busy || !username || !password}
          >
            {busy ? 'Creating account…' : 'Create owner account'}
          </button>
        </form>

        <div className="callout callout-info small" style={{ marginTop: '1rem' }}>
          <b>Important:</b> this account is saved on this device. To enforce it on
          every phone and computer, open <b>Owner panel → Publish access rules</b>
          and add the generated line to your deployment.
        </div>

        <div className="auth-foot tiny faint">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
