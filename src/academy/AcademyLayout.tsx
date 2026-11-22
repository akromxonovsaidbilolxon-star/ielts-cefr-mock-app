import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAcademy } from './AcademyProvider';
import { useAuth } from '../auth/AuthProvider';
import { AcademyLoading, Avatar } from './ui';
import {
  BookOpenIcon,
  ChartIcon,
  ClipboardIcon,
  GraduationIcon,
  HomeIcon,
  LayersIcon,
  ShieldIcon,
} from '../components/Icons';

const TABS = [
  { to: '/academy', label: 'Overview', end: true, icon: <HomeIcon /> },
  { to: '/academy/homework', label: 'Homework', icon: <ClipboardIcon /> },
  { to: '/academy/grades', label: 'Grades', icon: <ChartIcon /> },
  { to: '/academy/library', label: 'Library', icon: <BookOpenIcon /> },
  { to: '/academy/classes', label: 'Classes', icon: <LayersIcon /> },
];

/**
 * Shell for the education centre.
 *
 * Kept deliberately separate from the exam navigation: the exam app is the
 * student-facing product, the centre is how the school runs it (classes,
 * homework, marks, books). The two share accounts and styling only.
 */
export default function AcademyLayout() {
  const location = useLocation();
  const { backend, data, isTeacher, viewAs, setViewAsStudent, loading } = useAcademy();
  const { user } = useAuth();

  // Students do not manage classes, so the tab is teacher-only. A teacher
  // previewing the student experience keeps it: the preview filters data,
  // not permissions.
  const tabs = isTeacher ? TABS : TABS.filter((t) => t.to !== '/academy/classes');
  const viewingStudent = isTeacher && viewAs
    ? data.students.find((s) => s.id === viewAs)
    : undefined;

  return (
    <div className="acad-shell">
      <div className="acad-bar">
        <div className="acad-bar-inner">
          <Link to="/academy" className="acad-brand">
            <span className="acad-brand-mark">
              <GraduationIcon className="" />
            </span>
            <span className="acad-brand-text">
              Education Centre
              <span className="acad-brand-sub">
                {backend === 'demo' ? 'Demo data on this device' : 'Live · shared with your centre'}
              </span>
            </span>
          </Link>

          <div className="acad-identity">
            {viewingStudent ? (
              <>
                <span className="badge badge-warn">Previewing as student</span>
                <Avatar name={viewingStudent.displayName} size={28} />
                <span className="small strong acad-identity-name">{viewingStudent.displayName}</span>
                <button
                  type="button"
                  className="btn btn-sm btn-ghost"
                  onClick={() => setViewAsStudent(null)}
                >
                  Exit preview
                </button>
              </>
            ) : (
              <>
                <span className={`badge ${isTeacher ? 'badge-brand' : 'badge-accent'}`}>
                  {isTeacher ? <ShieldIcon className="" /> : null}
                  {isTeacher ? 'Teacher' : 'Student'}
                </span>
                <Avatar name={user?.displayName ?? 'Student'} size={28} />
                <span className="small strong acad-identity-name">{user?.displayName}</span>
              </>
            )}
          </div>
        </div>

        <nav className="acad-tabs" aria-label="Education centre">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) => `acad-tab${isActive ? ' active' : ''}`}
            >
              <span className="acad-tab-icon">{tab.icon}</span>
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {backend === 'demo' && (
        <div className="acad-banner">
          <span className="acad-banner-icon" aria-hidden>i</span>
          <span>
            <b>Demo mode.</b> Everything you create is saved in this browser only.
            Run <code>supabase/academy.sql</code> and add your Supabase keys to share it
            with real students.
          </span>
        </div>
      )}

      <main className="acad-main" key={location.pathname}>
        {loading ? <AcademyLoading /> : <Outlet />}
      </main>
    </div>
  );
}
