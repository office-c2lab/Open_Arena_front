import { Routes, Route } from 'react-router-dom';

import RootRedirect from './RootRedirect';
import LoginRedirect from './LoginRedirect';
import ProtectedRoute from './ProtectedRoute';

import DefaultLayout from '../ui/DefaultLayout';
import ChallengeLayout from '../ui/ChallengeLayout';
import AdminGuard from './AdminGuard';

import Login from '../pages/Login/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import Leaderboard from '../pages/Leaderboard/Leaderboard';
import AdminLeaderboard from '../pages/admin/AdminLeaderboard';
import AdminLogin from '../pages/admin/AdminLogin';
import Tutorial from '../pages/Tutorial/Tutorial';
import NotFound from '../pages/NotFound/NotFound';
import Kategorie from '../pages/Kategorie/Kategorie';
import Challenge from '../pages/Challenge/ui/Challenge';
import ChatTestPage from '../pages/ChatTestPage';
import LeaderboardMatrix from '../pages/admin/LeaderboardMatrix';

export default function AppRouter() {
  return (
    <Routes>
      {/* "/" → 로그인 여부에 따라 이동 */}
      <Route path="/" element={<RootRedirect />} />

      {/* 로그인 페이지 - 이미 로그인 되어 있으면 Dashboard로 */}
      <Route
        path="/login"
        element={
          <LoginRedirect>
            <Login />
          </LoginRedirect>
        }
      />

      {/* 테스트 페이지는 보호 X */}
      <Route path="/test" element={<ChatTestPage />} />

      {/* 관리자 페이지 (관리자 인증은 따로 만들면 됨) */}
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route
        path="/admin/leaderboard"
        element={
          <AdminGuard>
            <AdminLeaderboard />
          </AdminGuard>
        }
      />

      <Route
        path="/admin/matrix"
        element={
          <AdminGuard>
            <LeaderboardMatrix />
          </AdminGuard>
        }
      />

      {/*  DefaultLayout 하위는 모두 보호 */}
      <Route
        element={
          <ProtectedRoute>
            <DefaultLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/tutorial" element={<Tutorial />} />
        <Route path="/kategorie" element={<Kategorie />} />
      </Route>

      {/*  Challenge 페이지도 보호 */}
      <Route
        element={
          <ProtectedRoute>
            <ChallengeLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/challenge/:problemId" element={<Challenge />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
