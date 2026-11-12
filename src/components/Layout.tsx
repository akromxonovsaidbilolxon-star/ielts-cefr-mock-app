import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/listening', label: 'Listening' },
  { to: '/reading', label: 'Reading' },
  { to: '/writing', label: 'Writing' },
  { to: '/speaking', label: 'Speaking' },
  { to: '/progress', label: 'Progress' },
];

export default function Layout() {
  const location = useLocation();
  const isExam = /^\/(listening|reading|writing|speaking)$/.test(location.pathname);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <Link to="/" className="brand">
            <span className="brand-mark">IE</span>
            <span>
              IELTS Mock
              <span className="brand-sub">CEFR level test</span>
            </span>
          </Link>
          <nav className="nav" aria-label="Main navigation">
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
        </div>
      </header>

      <main className={`main${isExam ? '' : ''}`}>
        <Outlet />
      </main>

      <footer className="footer">
        Practice mock exam built for learning purposes. Not affiliated with, or
        endorsed by, the IELTS test owners. Band scores are estimates.
      </footer>
    </div>
  );
}
