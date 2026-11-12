import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import {
  BookIcon,
  ChartIcon,
  HeadphonesIcon,
  HomeIcon,
  LogOutIcon,
  MicIcon,
  PenIcon,
  ShieldIcon,
} from './Icons';

const NAV = [
  { to: '/', label: 'Home', short: 'Home', end: true, icon: <HomeIcon /> },
  { to: '/listening', label: 'Listening', short: 'Listen', icon: <HeadphonesIcon /> },
  { to: '/reading', label: 'Reading', short: 'Read', icon: <BookIcon /> },
  { to: '/writing', label: 'Writing', short: 'Write', icon: <PenIcon /> },
  { to: '/speaking', label: 'Speaking', short: 'Speak', icon: <MicIcon /> },
  { to: '/progress', label: 'Progress', short: 'Progress', icon: <ChartIcon /> },
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const isExam = /^\/(listening|reading|writing|speaking)/.test(location.pathname);

  // Close the account menu when the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Close on Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const initials = (user?.displayName ?? '?')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return (
    <div className={`app-shell${isExam ? ' in-exam' : ''}`}>
      <header className="topbar">
        <div className="topbar-inner">
          <Link to="/" className="brand">
            <span className="brand-mark">IE</span>
            <span className="brand-text">
              IELTS Mock
              <span className="brand-sub">CEFR level test</span>
            </span>
          </Link>

          <nav className="nav nav-desktop" aria-label="Main navigation">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="account">
            <button
              type="button"
              className="account-btn"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              aria-label="Account menu"
            >
              <span className="avatar">{initials || '?'}</span>
              <span className="account-name">{user?.displayName}</span>
              <svg
                className={`chevron${menuOpen ? ' open' : ''}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {menuOpen && (
              <>
                <div
                  className="menu-backdrop"
                  onClick={() => setMenuOpen(false)}
                  aria-hidden
                />
                <div className="account-menu" role="menu">
                  <div className="account-menu-head">
                    <div className="strong">{user?.displayName}</div>
                    <div className="tiny faint">{user?.email}</div>
                    <span className="badge badge-brand" style={{ marginTop: '0.35rem' }}>
                      {user?.role === 'owner' ? 'Owner' : 'Member'}
                    </span>
                  </div>
                  <div className="divider" />
                  {user?.role === 'owner' && (
                    <Link to="/admin" className="account-menu-item" role="menuitem">
                      <ShieldIcon className="" />
                      Owner panel
                    </Link>
                  )}
                  <Link to="/multilevel" className="account-menu-item" role="menuitem">
                    <BookIcon className="" />
                    Multilevel (CEFR)
                  </Link>
                  <Link to="/progress" className="account-menu-item" role="menuitem">
                    <ChartIcon className="" />
                    My progress
                  </Link>
                  <button
                    type="button"
                    className="account-menu-item danger"
                    role="menuitem"
                    onClick={() => {
                      void signOut();
                      navigate('/login', { replace: true });
                    }}
                  >
                    <LogOutIcon className="" />
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="main">
        <Outlet />
      </main>

      <footer className="footer">
        Practice mock exam built for learning purposes. Not affiliated with, or
        endorsed by, the IELTS test owners. Band scores are estimates.
      </footer>

      {/* Mobile-only bottom navigation */}
      <nav className="tabbar" aria-label="Primary">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `tabbar-item${isActive ? ' active' : ''}`}
          >
            <span className="tabbar-icon">{item.icon}</span>
            <span className="tabbar-label">{item.short}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
