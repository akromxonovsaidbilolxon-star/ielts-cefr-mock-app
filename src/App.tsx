import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ListeningExam from './pages/ListeningExam';
import ReadingExam from './pages/ReadingExam';
import WritingExam from './pages/WritingExam';
import SpeakingExam from './pages/SpeakingExam';
import Results from './pages/Results';
import Progress from './pages/Progress';
import Login from './pages/Login';
import Admin from './pages/Admin';
// Multilevel pages are code-split: a learner taking IELTS never downloads them.
const MlHome = lazy(() => import('./pages/MlHome'));
const MlListening = lazy(() => import('./pages/MlListening'));
const MlReading = lazy(() => import('./pages/MlReading'));
const MlWriting = lazy(() => import('./pages/MlWriting'));
const MlSpeaking = lazy(() => import('./pages/MlSpeaking'));
const MlResults = lazy(() => import('./pages/MlResults'));
const MlProgress = lazy(() => import('./pages/MlProgress'));
import NotFound from './pages/NotFound';
import RequireAuth, { RequireOwner } from './auth/RequireAuth';
import StorageMigration from './components/StorageMigration';

export default function App() {
  return (
    <Suspense
      fallback={
        <div className="boot-screen">
          <div className="boot-mark">IE</div>
          <div className="muted small">Loading…</div>
        </div>
      }
    >
    <Routes>
      {/* Public: sign-in only. Accounts are created by the owner. */}
      <Route path="/login" element={<Login />} />

      {/* Everything below requires a valid session */}
      <Route
        element={
          <RequireAuth>
            <StorageMigration />
            <Layout />
          </RequireAuth>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/listening" element={<ListeningExam />} />
        <Route path="/reading" element={<ReadingExam />} />
        <Route path="/writing" element={<WritingExam />} />
        <Route path="/speaking" element={<SpeakingExam />} />
        <Route path="/results" element={<Results />} />
        <Route path="/progress" element={<Progress />} />

        {/* Multilevel (Uzbekistan) exam — separate content, timing and results */}
        <Route path="/multilevel" element={<MlHome />} />
        <Route path="/multilevel/listening" element={<MlListening />} />
        <Route path="/multilevel/reading" element={<MlReading />} />
        <Route path="/multilevel/writing" element={<MlWriting />} />
        <Route path="/multilevel/speaking" element={<MlSpeaking />} />
        <Route path="/multilevel/results" element={<MlResults />} />
        <Route path="/multilevel/progress" element={<MlProgress />} />

        <Route
          path="/admin"
          element={
            <RequireOwner>
              <Admin />
            </RequireOwner>
          }
        />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
    </Suspense>
  );
}
