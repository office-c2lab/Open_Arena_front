// /src/routes/AppRouter.jsx

import { Routes, Route } from "react-router-dom";

import RootRedirect from "./RootRedirect";
import LoginRedirect from "./LoginRedirect";

import DefaultLayout from "../ui/DefaultLayout";
import ChallengeLayout from "../ui/ChallengeLayout";

import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Leaderboard from "../pages/Leaderboard/Leaderboard";
import AdminLeaderboard from "../pages/admin/AdminLeaderboard";
import AdminLogin from "../pages/admin/AdminLogin";
import Tutorial from "../pages/Tutorial/Tutorial";
import NotFound from "../pages/NotFound/NotFound";
import Kategorie from "../pages/Kategorie/Kategorie";
import Challenge from "../pages/Challenge/ui/Challenge";
import ChatTestPage from "../pages/ChatTestPage";
import LeaderboardMatrix from "../pages/admin/LeaderboardMatrix";

export default function AppRouter() {
  return (
    <Routes>
      {/* 🔥 "/" → 로그인 여부에 따라 자동 라우팅 */}
      <Route path="/" element={<RootRedirect />} />

      {/* 로그인 페이지 → 로그인 상태면 Dashboard로 */}
      <Route
        path="/login"
        element={
          <LoginRedirect>
            <Login />
          </LoginRedirect>
        }
      />

      <Route path="/test" element={<ChatTestPage />} />

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/leaderboard" element={<AdminLeaderboard />} />
       <Route path="/admin/matrix" element={<LeaderboardMatrix />} />

      {/* DefaultLayout 하위 */}
      <Route element={<DefaultLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/tutorial" element={<Tutorial />} />
        <Route path="/kategorie" element={<Kategorie />} />
      </Route>

      {/* ChallengeLayout 하위 */}
      <Route element={<ChallengeLayout />}>
        <Route path="/challenge/:problemId" element={<Challenge />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
