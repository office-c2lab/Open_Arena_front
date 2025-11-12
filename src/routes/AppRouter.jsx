// /src/routes/AppRouter.jsx

import { Routes, Route } from 'react-router-dom';
import DefaultLayout from '../ui/DefaultLayout';
import ChallengeLayout from '../ui/ChallengeLayout';

import Login from '../pages/Login/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import Leaderboard from '../pages/Leaderboard/Leaderboard';
import AdminLeaderboard from '../pages/admin/AdminLeaderboard';
import AdminLogin from '../pages/admin/AdminLogin';
import Tutorial from '../pages/Tutorial/Tutorial';
import NotFound from '../pages/NotFound/NotFound'; 
import Kategorie from '../pages/Kategorie/Kategorie';

// 💡 Challenge 대신 ChallengePage 임포트 (경로를 확인해주세요)
import MainPage from '../pages/MainPage/MainPage';
import Challenge from '../pages/Challenge/ui/Challenge';
import ChatTestPage from '../pages/ChatTestPage';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/test" element={<ChatTestPage />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/leaderboard" element={<AdminLeaderboard />} />
      {/* <Route path="/" element={<MainPage />} /> */}
      <Route path="*" element={<NotFound />} />
      
      {/* DefaultLayout 하위 Route */}
      <Route element={<DefaultLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/tutorial" element={<Tutorial />} />
        <Route path="/kategorie" element={<Kategorie />} />
      </Route>

      {/* ChallengeLayout 하위 Route */}
      <Route element={<ChallengeLayout />}>
        {/* 💡 challengeId 파라미터를 명시하고 ChallengePage로 연결 */}
        <Route path="/challenge/:problemId" element={<Challenge />} /> 
        
      </Route>
    </Routes>
  );
}