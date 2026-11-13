import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import {
  listProfiles,
  updateProfile,
  type Profile,
  type ProfileStatus,
  type Role,
} from '../lib/supabase';
import {
  CheckIcon,
  KeyIcon,
  LockIcon,
  ShieldIcon,
  TrashIcon,
  UsersIcon,
  XIcon,
} from '../components/Icons';

type Tab = 'people' | 'add' | 'security';

/**
 * Owner panel.
 *
 * Every change here goes straight to the database, so it applies to every
 * device immediately — no rebuild, no redeploy. Authorisation is enforced by
 * Row Level Security: a non-owner calling these functions gets nothing back.
 *
 * Account CREATION is intentionally not done in the browser. Creating a user
 * requires the service role key, which must never be shipped to a browser. The
 * owner creates accounts in the Supabase dashboard (or via the invite Edge
 * Function), and this panel manages them from there.
 */
export default function Admin() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>('people');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setProfiles(await listProfiles());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load accounts.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const stats = useMemo(() => {
    const active = profiles.filter((p) => p.status === 'active').length;
    const suspended = profiles.filter((p) => p.status === 'suspended').length;
    const owners = profiles.filter((p) => p.role === 'owner').length;
    return { total: profiles.length, active, suspended, owners };
  }, [profiles]);

  const flash = (message: string) => {
    setNotice(message);
    setError(null);
    window.setTimeout(() => setNotice(null), 4000);
  };

  const change = async (
    profile: Profile,
    patch: { role?: Role; status?: ProfileStatus },
    successMessage: string,
  ) => {
    setBusyId(profile.id);
    setError(null);
    try {
      const changed = await updateProfile(profile.id, patch);
      if (!changed) {
        setError('That change was not saved. You may not have owner permission.');
        return;
      }
      flash(successMessage);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save that change.');
    } finally {
      setBusyId(null);
    }
  };

  const toggleStatus = (profile: Profile) => {
    const next: ProfileStatus = profile.status === 'active' ? 'suspended' : 'active';
    const verb = next === 'active' ? 'reactivated' : 'suspended';
    void change(profile, { status: next }, `${profile.displayName} ${verb}.`);
  };

  const toggleRole = (profile: Profile) => {
    const next: Role = profile.role === 'owner' ? 'student' : 'owner';
    if (next === 'owner' && !window.confirm(
      `Make ${profile.displayName} an owner? Owners can manage every account, including yours.`,
    )) return;
    const verb = next === 'owner' ? 'is now an owner' : 'is now a student';
    void change(profile, { role: next }, `${profile.displayName} ${verb}.`);
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Owner panel</h1>
          <p className="muted small">
            Manage who can use this app. Changes apply everywhere immediately.
          </p>
        </div>
      </div>

      {notice && (
        <div className="callout callout-ok small" style={{ marginBottom: '1rem' }}>
          <CheckIcon className="" /> {notice}
        </div>
      )}
      {error && (
        <div className="callout callout-bad small" style={{ marginBottom: '1rem' }} role="alert">
          <XIcon className="" /> {error}
        </div>
      )}

      <div className="row wrap" style={{ marginBottom: '1.1rem' }}>
        {(
          [
            ['people', 'People', <UsersIcon key="p" className="" />],
            ['add', 'Add someone', <KeyIcon key="a" className="" />],
            ['security', 'Security', <LockIcon key="s" className="" />],
          ] as const
        ).map(([id, label, icon]) => (
          <button
            key={id}
            type="button"
            className={`btn btn-sm ${tab === id ? '' : 'btn-ghost'}`}
            onClick={() => {
              setTab(id);
              setError(null);
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
              <h3 style={{ margin: 0 }}>Accounts</h3>
              <span className="badge">
                {stats.active} active · {stats.suspended} blocked
              </span>
            </div>

            {loading && <p className="muted small">Loading…</p>}

            {!loading && profiles.length === 0 && (
              <p className="muted small">
                No accounts yet. Use <b>Add someone</b> to create the first one.
              </p>
            )}

            <div className="stack stack-sm">
              {profiles.map((profile) => {
                const isSelf = profile.id === user?.id;
                const lastOwner = profile.role === 'owner' && stats.owners === 1;
                return (
                  <div
                    key={profile.id}
                    className="row-between"
                    style={{
                      padding: '0.7rem 0',
                      borderBottom: '1px solid var(--line, #e6e8ef)',
                      gap: '0.75rem',
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div className="strong" style={{ overflowWrap: 'anywhere' }}>
                        {profile.displayName}
                        {isSelf && <span className="tiny faint"> (you)</span>}
                      </div>
                      <div className="tiny muted" style={{ overflowWrap: 'anywhere' }}>
                        {profile.email}
                      </div>
                      <div className="row tiny" style={{ gap: '0.35rem', marginTop: '0.3rem' }}>
                        <span className={`badge ${profile.role === 'owner' ? 'badge-brand' : ''}`}>
                          {profile.role === 'owner' ? 'Owner' : 'Student'}
                        </span>
                        <span
                          className={`badge ${profile.status === 'active' ? 'badge-ok' : 'badge-bad'}`}
                        >
                          {profile.status === 'active' ? 'Active' : 'Suspended'}
                        </span>
                      </div>
                    </div>

                    <div className="row wrap" style={{ gap: '0.35rem' }}>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        disabled={busyId === profile.id || (isSelf && lastOwner)}
                        onClick={() => toggleRole(profile)}
                        title={
                          isSelf && lastOwner
                            ? 'You are the only owner — promote someone else first.'
                            : undefined
                        }
                      >
                        <ShieldIcon className="" />
                        {profile.role === 'owner' ? 'Make student' : 'Make owner'}
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        disabled={busyId === profile.id || isSelf}
                        onClick={() => toggleStatus(profile)}
                        title={isSelf ? 'You cannot suspend your own account.' : undefined}
                      >
                        {profile.status === 'active' ? (
                          <>
                            <TrashIcon className="" />
                            Suspend
                          </>
                        ) : (
                          <>
                            <CheckIcon className="" />
                            Reactivate
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card card-pad">
            <h3 style={{ marginTop: 0 }}>What each action does</h3>
            <ul className="list-check small">
              <li>
                <b>Suspend</b> — the person is signed out and cannot sign in again.
                Their results on their own device are untouched.
              </li>
              <li>
                <b>Make owner</b> — full access to this panel, including managing
                your own account. Only do this for someone you fully trust.
              </li>
              <li>
                <b>Reactivate</b> — lets them sign in again.
              </li>
            </ul>
            <div className="callout callout-info small" style={{ marginTop: '0.85rem' }}>
              To <b>delete</b> someone permanently, or <b>reset their password</b>,
              use the Supabase dashboard → Authentication → Users. Deleting there
              also removes their profile automatically.
            </div>
          </div>
        </div>
      )}

      {tab === 'add' && (
        <div className="card card-pad">
          <h3 style={{ marginTop: 0 }}>Add someone to the app</h3>
          <p className="small muted">
            Creating an account needs a secret key that must never be placed in a
            browser, so it is done in the Supabase dashboard. It takes about 30
            seconds per person, and they can sign in immediately afterwards.
          </p>

          <ol className="list-check" style={{ marginTop: '1rem' }}>
            <li>
              Open your project at <b>supabase.com</b> → <b>Authentication</b> →{' '}
              <b>Users</b>.
            </li>
            <li>
              Click <b>Add user</b> → <b>Create new user</b>.
            </li>
            <li>
              Enter their <b>email</b> and a <b>password</b> you will give them, and
              tick <b>Auto Confirm User</b> so they can sign in straight away.
            </li>
            <li>
              Save. A profile row is created automatically — see the{' '}
              <code>handle_new_user</code> trigger in the setup SQL.
            </li>
            <li>
              They open the app, sign in with that email and password, and appear in
              the <b>People</b> tab.
            </li>
          </ol>

          <div className="callout callout-warn small" style={{ marginTop: '1rem' }}>
            <b>Keep public sign-up switched off.</b> In Supabase → Authentication →
            Sign In / Providers, make sure <b>Allow new users to sign up</b> is
            disabled. Otherwise anyone who finds your project could create their own
            account.
          </div>
        </div>
      )}

      {tab === 'security' && (
        <div className="card card-pad">
          <h3 style={{ marginTop: 0 }}>How access is enforced</h3>
          <ul className="list-check small">
            <li>
              Passwords are stored and hashed by Supabase Auth. This app never sees
              or stores them.
            </li>
            <li>
              Every database read and write is checked by <b>Row Level Security</b>{' '}
              on the server. Hiding buttons in the app is not what stops people.
            </li>
            <li>
              A signed-in person with no profile row is refused entry, so an account
              cannot slip in unseen.
            </li>
            <li>
              Only owners may list accounts or change roles and status.
            </li>
          </ul>
          <div className="callout callout-info small" style={{ marginTop: '1rem' }}>
            Your Supabase <b>anon key</b> is safe to ship — that is its purpose. The{' '}
            <b>service role key</b> is not, and is never used in this app.
          </div>
        </div>
      )}
    </div>
  );
}
