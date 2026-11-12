import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import {
  bakedRoster,
  clearAudit,
  createUser,
  effectiveRoster,
  isEnforced,
  logEvent,
  readAudit,
  rosterToEnvLine,
  saveLocalRoster,
  setPassword,
  validatePassword,
  validateUsername,
  type AuditEntry,
  type RosterUser,
} from '../lib/auth';
import {
  CheckIcon,
  CopyIcon,
  KeyIcon,
  LockIcon,
  ShieldIcon,
  TrashIcon,
  UsersIcon,
  XIcon,
} from '../components/Icons';

type Tab = 'people' | 'publish' | 'activity';

export default function Admin() {
  const { session } = useAuth();
  const [tab, setTab] = useState<Tab>('people');
  const [enforced] = useState(isEnforced());
  const [users, setUsers] = useState<RosterUser[]>([]);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [notice, setNotice] = useState<string | null>(null);

  // form state
  const [newUsername, setNewUsername] = useState('');
  const [newDisplay, setNewDisplay] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newExpiry, setNewExpiry] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [resetTarget, setResetTarget] = useState<string | null>(null);
  const [resetPassword, setResetPassword] = useState('');

  const reload = () => {
    setUsers(effectiveRoster());
    setAudit(readAudit());
  };

  useEffect(() => {
    reload();
  }, []);

  const stats = useMemo(() => {
    const active = users.filter((u) => u.status === 'active').length;
    const suspended = users.filter((u) => u.status === 'suspended').length;
    return { total: users.length, active, suspended };
  }, [users]);

  /** Writes a roster back to whichever store is editable. */
  const persist = (next: RosterUser[]) => {
    if (enforced) {
      setFormError(
        'This build is locked by a published roster. Edit the deployed configuration to change these accounts.',
      );
      return;
    }
    saveLocalRoster(next);
    setUsers(next);
  };

  const addUser = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);
    setNotice(null);

    const usernameError = validateUsername(newUsername);
    if (usernameError) return setFormError(usernameError);
    const passwordError = validatePassword(newPassword);
    if (passwordError) return setFormError(passwordError);

    const username = newUsername.trim().toLowerCase();
    if (users.some((u) => u.username === username)) {
      return setFormError('That username is already taken.');
    }

    setBusy(true);
    try {
      const user = await createUser({
        username,
        displayName: newDisplay || username,
        password: newPassword,
        role: 'user',
        expiresAtISO: newExpiry ? new Date(newExpiry).toISOString() : null,
      });
      const next = [...users, user];
      persist(next);
      logEvent(session?.username ?? 'owner', 'user.created', username);
      setAudit(readAudit());
      setNewUsername('');
      setNewDisplay('');
      setNewPassword('');
      setNewExpiry('');
      setNotice(`Access granted to ${username}.`);
    } catch {
      setFormError('Could not create that account.');
    } finally {
      setBusy(false);
    }
  };

  const toggleStatus = (username: string) => {
    const next = users.map((u) =>
      u.username === username
        ? { ...u, status: u.status === 'active' ? ('suspended' as const) : ('active' as const) }
        : u,
    );
    persist(next);
    const target = next.find((u) => u.username === username);
    logEvent(
      session?.username ?? 'owner',
      target?.status === 'active' ? 'user.reactivated' : 'user.suspended',
      username,
    );
    setAudit(readAudit());
    setNotice(
      target?.status === 'active' ? `${username} can sign in again.` : `${username} is now blocked.`,
    );
  };

  const removeUser = (username: string) => {
    if (username === session?.username) {
      setFormError('You cannot remove the account you are signed in with.');
      return;
    }
    persist(users.filter((u) => u.username !== username));
    logEvent(session?.username ?? 'owner', 'user.removed', username);
    setAudit(readAudit());
    setNotice(`${username} was removed.`);
  };

  const applyPasswordReset = async (username: string) => {
    const error = validatePassword(resetPassword);
    if (error) {
      setFormError(error);
      return;
    }
    const updated = await Promise.all(
      users.map(async (u) => (u.username === username ? setPassword(u, resetPassword) : u)),
    );
    persist(updated);
    logEvent(session?.username ?? 'owner', 'user.password', username);
    setAudit(readAudit());
    setResetTarget(null);
    setResetPassword('');
    setFormError(null);
    setNotice(`Password updated for ${username}.`);
  };

  const envLine = rosterToEnvLine(users);
  const baked = bakedRoster();

  return (
    <>
      <div className="part-hero">
        <div>
          <h2>Owner panel</h2>
          <p>Control who can open this app, and see every sign-in attempt.</p>
        </div>
        <span className="badge badge-accent">
          <ShieldIcon className="" />
          Signed in as {session?.displayName}
        </span>
      </div>

      {enforced ? (
        <div className="callout callout-ok small" style={{ marginBottom: '1rem' }}>
          <b>Access rules are published.</b> {baked.length} account
          {baked.length === 1 ? '' : 's'} baked into this build. To add or remove
          people, edit the deployed <code>VITE_ACCESS_ROSTER</code> and redeploy.
        </div>
      ) : (
        <div className="callout callout-warn small" style={{ marginBottom: '1rem' }}>
          <b>Local setup only.</b> Accounts are stored in this browser, so other
          devices are not protected yet. Open the <b>Publish access rules</b> tab to
          lock the app everywhere.
        </div>
      )}

      {notice && (
        <div className="callout callout-ok small" style={{ marginBottom: '1rem' }}>
          <CheckIcon className="" /> {notice}
        </div>
      )}
      {formError && (
        <div className="callout callout-bad small" style={{ marginBottom: '1rem' }} role="alert">
          <XIcon className="" /> {formError}
        </div>
      )}

      <div className="row wrap" style={{ marginBottom: '1.1rem' }}>
        {(
          [
            ['people', 'People', <UsersIcon key="i" className="" />],
            ['publish', 'Publish access rules', <LockIcon key="i" className="" />],
            ['activity', 'Activity log', <KeyIcon key="i" className="" />],
          ] as const
        ).map(([id, label, icon]) => (
          <button
            key={id}
            type="button"
            className={`btn btn-sm ${tab === id ? '' : 'btn-ghost'}`}
            onClick={() => {
              setTab(id);
              setFormError(null);
              setNotice(null);
            }}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {tab === 'people' && (
        <div className="admin-grid">
          <div className="card card-pad">
            <div className="section-head" style={{ marginBottom: '0.7rem' }}>
              <h3 style={{ margin: 0 }}>Allowed accounts</h3>
              <span className="badge">
                {stats.active} active · {stats.suspended} blocked
              </span>
            </div>

            <div className="admin-list">
              {users.map((user) => (
                <div key={user.username} className="admin-row">
                  <div className="admin-row-main">
                    <div className="row" style={{ gap: '0.5rem' }}>
                      <span className="strong">{user.displayName}</span>
                      <span className="badge badge-brand">{user.role}</span>
                      {user.status === 'suspended' && (
                        <span className="badge badge-bad">blocked</span>
                      )}
                      {user.expiresAtISO && (
                        <span className="badge badge-warn">
                          expires {new Date(user.expiresAtISO).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <div className="tiny faint">
                      @{user.username} · added{' '}
                      {new Date(user.createdAtISO).toLocaleDateString()}
                      {user.note ? ` · ${user.note}` : ''}
                    </div>
                  </div>

                  <div className="admin-row-actions">
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() =>
                        setResetTarget(resetTarget === user.username ? null : user.username)
                      }
                    >
                      <KeyIcon className="" />
                      Password
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => toggleStatus(user.username)}
                    >
                      {user.status === 'active' ? 'Block' : 'Unblock'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => removeUser(user.username)}
                      disabled={user.username === session?.username}
                      aria-label={`Remove ${user.username}`}
                    >
                      <TrashIcon className="" />
                    </button>
                  </div>

                  {resetTarget === user.username && (
                    <div className="admin-row-reset">
                      <input
                        className="input"
                        type="password"
                        value={resetPassword}
                        onChange={(e) => setResetPassword(e.target.value)}
                        placeholder="New password (8+ chars, letter and number)"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="btn btn-sm"
                        onClick={() => applyPasswordReset(user.username)}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => {
                          setResetTarget(null);
                          setResetPassword('');
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="card card-pad">
            <h3 style={{ marginTop: 0 }}>Grant access</h3>
            <p className="small muted">
              Create a username and password for one person, then share those
              details with them directly.
            </p>
            <form onSubmit={addUser} className="stack stack-sm" noValidate>
              <label className="field">
                <span className="field-label">Username</span>
                <input
                  className="input"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  placeholder="student01"
                />
              </label>
              <label className="field">
                <span className="field-label">Display name</span>
                <input
                  className="input"
                  value={newDisplay}
                  onChange={(e) => setNewDisplay(e.target.value)}
                  placeholder="Aziz Karimov"
                />
              </label>
              <label className="field">
                <span className="field-label">Temporary password</span>
                <input
                  className="input"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  placeholder="8+ characters with a number"
                />
              </label>
              <label className="field">
                <span className="field-label">Access ends (optional)</span>
                <input
                  className="input"
                  type="date"
                  value={newExpiry}
                  onChange={(e) => setNewExpiry(e.target.value)}
                />
              </label>
              <button type="submit" className="btn btn-block" disabled={busy}>
                {busy ? 'Creating…' : 'Create account'}
              </button>
            </form>
          </div>
        </div>
      )}

      {tab === 'publish' && (
        <div className="card card-pad">
          <h3 style={{ marginTop: 0 }}>Make these rules apply everywhere</h3>
          <p className="small muted">
            The deployed app reads its roster from a build-time variable. Copy the
            line below into <code>.env.production</code> in the project, rebuild and
            redeploy — then every phone and computer enforces exactly these
            accounts.
          </p>

          <div className="code-block">
            <pre>{envLine}</pre>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                void navigator.clipboard?.writeText(envLine);
                setNotice('Access line copied to clipboard.');
              }}
            >
              <CopyIcon className="" />
              Copy
            </button>
          </div>

          <ol className="list-check" style={{ marginTop: '1rem' }}>
            <li>
              Create a file named <code>.env.production</code> in the project root.
            </li>
            <li>Paste the copied line into it and save.</li>
            <li>
              Run <code>npm run build</code> and redeploy — or push to trigger the
              Pages workflow.
            </li>
            <li>
              Confirm the login page now shows &ldquo;This app is private&rdquo; and the
              owner panel reports the rules as published.
            </li>
          </ol>

          <div className="callout callout-warn small" style={{ marginTop: '1rem' }}>
            <b>Keep this file private.</b> It contains password hashes, which are
            safe to deploy but should not be posted publicly. Add
            <code> .env.production</code> to <code>.gitignore</code> (already done) and
            set it through your host&rsquo;s environment settings instead of committing it.
          </div>

          <div className="callout callout-info small">
            <b>Forgot an owner password?</b> Generate a fresh hash with{' '}
            <code>npm run access:hash</code>, then replace that user&rsquo;s{' '}
            <code>salt</code> and <code>hash</code> in the roster line.
          </div>
        </div>
      )}

      {tab === 'activity' && (
        <div className="card">
          <div className="card-pad row-between" style={{ paddingBottom: '0.5rem' }}>
            <h3 style={{ margin: 0 }}>Recent sign-in activity</h3>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                clearAudit();
                setAudit([]);
              }}
            >
              Clear
            </button>
          </div>
          {audit.length === 0 ? (
            <div className="empty" style={{ margin: '0 1.35rem 1.35rem' }}>
              No activity recorded on this device yet.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>When</th>
                    <th>User</th>
                    <th>Event</th>
                    <th>Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {audit.map((entry) => (
                    <tr key={entry.id}>
                      <td className="nowrap small">
                        {new Date(entry.atISO).toLocaleString()}
                      </td>
                      <td className="strong small">{entry.actor}</td>
                      <td>
                        <span
                          className={`badge ${
                            entry.action.includes('failed') || entry.action.includes('blocked')
                              ? 'badge-bad'
                              : entry.action === 'login.success'
                                ? 'badge-ok'
                                : ''
                          }`}
                        >
                          {entry.action}
                        </span>
                      </td>
                      <td className="muted small">{entry.detail ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </>
  );
}
