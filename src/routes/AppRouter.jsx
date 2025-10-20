import { Routes, Route } from 'react-router-dom';
import DefaultLayout from '../ui/DefaultLayout';
import ChallengeLayout from '../ui/ChallengeLayout';

import Login from '../pages/Login/Login';
import Challenge from '../pages/Challenge/Challenge';
import Dashboard from '../pages/Dashboard/Dashboard';
import Leaderboard from '../pages/Leaderboard/Leaderboard';
import Tutorial from '../pages/Tutorial/Tutorial';
import NotFound from '../pages/NotFound/NotFound'; // ← 404 페이지 추가

export default function AppRouter() {
  return (
    <Routes>
      {/* DefaultLayout 하위 Route */}
      <Route element={<DefaultLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/tutorial" element={<Tutorial />} />
        <Route path="/challenge" element={<Challenge />} />
        <Route path="/login" element={<Login />} />
        {/* DefaultLayout 안에서 처리할 404 */}
      </Route>

      {/* ChallengeLayout 하위 Route */}
      <Route element={<ChallengeLayout />}>
        {/* 여기에 챌린지 문제풀기 화면들 */} <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
