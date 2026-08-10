// src/routes/AdminGuard.jsx
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

export default function AdminGuard({ children }) {
  const { isAdminLoggedIn, isAdminAuthInitialized } = useAuthStore();

  if (!isAdminAuthInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#10050F] text-gray-300">
        관리자 세션을 확인하는 중...
      </div>
    );
  }

  if (!isAdminLoggedIn) return <Navigate to="/admin/login" replace />;

  return children;
}
