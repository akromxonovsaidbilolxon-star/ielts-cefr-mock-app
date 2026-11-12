import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ListeningExam from './pages/ListeningExam';
import ReadingExam from './pages/ReadingExam';
import WritingExam from './pages/WritingExam';
import SpeakingExam from './pages/SpeakingExam';
import Results from './pages/Results';
import Progress from './pages/Progress';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/listening" element={<ListeningExam />} />
        <Route path="/reading" element={<ReadingExam />} />
        <Route path="/writing" element={<WritingExam />} />
        <Route path="/speaking" element={<SpeakingExam />} />
        <Route path="/results" element={<Results />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
