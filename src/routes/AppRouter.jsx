import { Routes, Route, Navigate } from 'react-router-dom';

import AdminGuard from './AdminGuard';
import LoginRedirect from './LoginRedirect';
import ProtectedRoute from './ProtectedRoute';

// Layouts
import DefaultLayout from '../ui/DefaultLayout';
import PublicLayout from '../ui/PublicLayout';
import ChallengeLayout from '../ui/ChallengeLayout';
import AdminLayout from '../ui/AdminLayout';
import LeaderboardLayout from '../ui/LeaderboardLayout'; // ✅ 추가

// Pages
import Login from '../pages/Login/Login';
import LandingPage from '../pages/LandingPage/LandingPage';
import Signup from '../pages/Signup/Signup';
import PasswordResetRequest from '../pages/PasswordReset/PasswordResetRequest';
import PasswordResetComplete from '../pages/PasswordReset/PasswordResetComplete';
import Legal from '../pages/Legal/Legal';
import AdminLogin from '../pages/admin/AdminLogin';
import Dashboard from '../pages/Dashboard/Dashboard';
import MyPage from '../pages/MyPage/ProfilePage';
// import Leaderboard from '../pages/Leaderboard/Leaderboard';
import Education from '../pages/Education/Education';
import Tutorial from '../pages/Tutorial/Tutorial';
import TutorialList from '../pages/Tutorial/TutorialList';
import TutorialChallengePlayPreview from '../pages/Tutorial/TutorialChallengePlayPreview';
import Kategorie from '../pages/Kategorie/Kategorie';
import Challenge from '../pages/Challenge/ui/Challenge';
import ChallengePlay from '../pages/Challenge/ui/ChallengePlay';
import ChatTestPage from '../pages/ChatTestPage';
import NotFound from '../pages/NotFound/NotFound';
import PublicProfile from '../pages/Profile/PublicProfile';

import Leaderboard from '../pages/Leaderboard/ArenaMockPage';
import AdminProblemPage from '../pages/admin/AdminProblemPage';
import AdminConversationMockPage from '../pages/admin/AdminConversationMockPage';
import FourZeroThree from '../pages/NotFound/FourZeroThree'; // ⭐ 403 추가
import AdminJudgePromptEditor from '../pages/admin/AdminJudgePromptEditor';
import AdminUserManagementPage from '../pages/admin/AdminUserManagementPage';
import AdminOperationsPage from '../pages/admin/AdminOperationsPage';

export default function AppRouter() {
  return (
    <Routes>
      {/* 공개 페이지 */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={
            <LoginRedirect>
              <Login />
            </LoginRedirect>
          }
        />
        <Route
          path="/signup"
          element={
            <LoginRedirect>
              <Signup />
            </LoginRedirect>
          }
        />
        <Route path="/password-reset" element={<PasswordResetRequest />} />
        <Route path="/password-reset/complete" element={<PasswordResetComplete />} />
        <Route path="/password-reset/confirm" element={<PasswordResetComplete />} />
        <Route path="/reset-password" element={<PasswordResetComplete />} />
        <Route path="/reset-password/complete" element={<PasswordResetComplete />} />
        <Route path="/auth/password-reset/complete" element={<PasswordResetComplete />} />
        <Route path="/terms" element={<Legal type="terms" />} />
        <Route path="/privacy" element={<Legal type="privacy" />} />
        <Route path="/legal/:documentType" element={<Legal />} />
      </Route>
      <Route path="/admin" element={<Navigate to="/admin/problems" replace />} />

      {/* 테스트 페이지(보호 X) */}
      <Route path="/test" element={<ChatTestPage />} />
      <Route
        path="/tutorial-preview/challenge-play"
        element={
          <div className="h-screen w-screen overflow-hidden">
            <TutorialChallengePlayPreview />
          </div>
        }
      />

      {/* 관리자 로그인 */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* ---------------------------
          🔥 Admin Layout (공통 UI)
         --------------------------- */}
      <Route
        path="/admin"
        element={
          <AdminGuard>
            <AdminLayout />
          </AdminGuard>
        }
      >
        <Route path="problems" element={<AdminProblemPage />} />
        <Route path="users" element={<AdminConversationMockPage />} />
        <Route path="user-management" element={<AdminUserManagementPage />} />
        <Route path="judge" element={<AdminJudgePromptEditor />} />
        <Route path="operations" element={<AdminOperationsPage />} />
      </Route>

      {/* ---------------------------
          🔥 LeaderboardLayout (ARENA MOCK)
         --------------------------- */}
      <Route
        element={
          <ProtectedRoute>
            <LeaderboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/leaderboard" element={<Leaderboard />} /> {/* ✅ 추가됨 */}
      </Route>

      {/* ---------------------------  
          🔥 DefaultLayout 보호 구역
         --------------------------- */}
      <Route
        element={
          <ProtectedRoute>
            <DefaultLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mypage" element={<Navigate to="/settings" replace />} />
        <Route path="/settings" element={<MyPage />} />
        <Route path="/profile/:userId" element={<PublicProfile />} />
        <Route path="/education" element={<Education />} />
        <Route path="/education/:articleId" element={<Education />} />
        <Route path="/tutorial" element={<TutorialList />} />
        <Route path="/tutorial/:tutorialId" element={<Tutorial />} />
        <Route path="/kategorie" element={<Kategorie />} />
      </Route>

      {/* ---------------------------
          🔥 Challenge 보호 Layout
         --------------------------- */}
      <Route
        element={
          <ProtectedRoute>
            <ChallengeLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/challenge/:problemId/play" element={<ChallengePlay />} />
        <Route path="/challenge/:problemId" element={<Challenge />} />
      </Route>
      {/* ⭐ 추가된 403 페이지 */}
      <Route path="/403" element={<FourZeroThree />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
