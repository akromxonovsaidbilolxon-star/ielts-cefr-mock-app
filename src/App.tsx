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
import Setup from './pages/Setup';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import RequireAuth, { RequireOwner } from './auth/RequireAuth';

export default function App() {
  return (
    <Routes>
      {/* Public: sign-in and first-run setup */}
      <Route path="/login" element={<Login />} />
      <Route path="/setup" element={<Setup />} />

      {/* Everything below requires a valid session */}
      <Route
        element={
          <RequireAuth>
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
  );
}
