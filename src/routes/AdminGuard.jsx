// src/routes/AdminGuard.jsx
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

export default function AdminGuard({ children }) {
  const { isAdminLoggedIn } = useAuthStore();

  if (!isAdminLoggedIn) return <Navigate to="/admin/login" replace />;

  return children;
}
