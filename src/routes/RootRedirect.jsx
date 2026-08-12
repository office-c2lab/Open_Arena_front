// src/routes/RootRedirect.jsx
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

export default function RootRedirect({ children }) {
  const { isLoggedIn, isAuthInitialized } = useAuthStore();

  if (!isAuthInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-body-lg font-strong text-[#6B6B6B]">
        로그인 상태를 확인하는 중입니다.
      </div>
    );
  }

  if (isLoggedIn) return <Navigate to="/dashboard" replace />;

  return children;
}
