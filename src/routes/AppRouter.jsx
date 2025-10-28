import { Routes, Route } from 'react-router-dom';
import DefaultLayout from '../ui/DefaultLayout';
import ChallengeLayout from '../ui/ChallengeLayout';

import Login from '../pages/Login/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import Leaderboard from '../pages/Leaderboard/Leaderboard';
import AdminLeaderboard from '../pages/Leaderboard/AdminLeaderboard';

import Tutorial from '../pages/Tutorial/Tutorial';
import NotFound from '../pages/NotFound/NotFound'; // ← 404 페이지 추가
import Kategorie from '../pages/Kategorie/Kategorie';
import Challenge from '../pages/Challenge/Challenge';
import MainPage from '../pages/MainPage/MainPage';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<MainPage />} />
      {/* DefaultLayout 하위 Route */}
      <Route element={<DefaultLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/admin/leaderboard" element={<AdminLeaderboard />} />
        <Route path="/tutorial" element={<Tutorial />} />
        <Route path="/kategorie" element={<Kategorie />} />
        <Route path="*" element={<NotFound />} />

        {/* DefaultLayout 안에서 처리할 404 */}
      </Route>

      {/* ChallengeLayout 하위 Route */}
      <Route element={<ChallengeLayout />}>
        <Route path="/challenge/*" element={<Challenge />} />
      </Route>
    </Routes>
  );
}
