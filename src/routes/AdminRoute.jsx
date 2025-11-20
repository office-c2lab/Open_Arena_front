// src/router/AdminRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export default function AdminRoute({ children }) {
  const { teamInfo, isLoggedIn } = useAuthStore();

  // 1) 로그인 안 됨 → 로그인 페이지로
  if (!isLoggedIn) return <Navigate to="/admin/login" replace />;

  // 2) 어드민 권한이 아님 → 접근 금지 페이지나 홈으로
  if (teamInfo?.role !== "admin") {
    return <Navigate to="/not-authorized" replace />;
  }

  // 3) 통과
  return children;
}
