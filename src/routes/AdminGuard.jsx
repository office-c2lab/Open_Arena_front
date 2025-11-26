// src/routes/AdminGuard.jsx
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { adminRefreshToken } from '@/api/auth';
import { useAuthStore } from '@/stores/authStore';

export default function AdminGuard({ children }) {
  const { isAdminLoggedIn, adminLoginState, adminLogout } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hasAdminCookie =
      document.cookie.includes('admin_access_token=') ||
      document.cookie.includes('admin_refresh_token=');

    if (!hasAdminCookie) {
      setLoading(false);
      return;
    }

    adminRefreshToken()
      .then(data => {
        adminLoginState(data);
      })
      .catch(() => adminLogout())
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!isAdminLoggedIn) return <Navigate to="/admin/login" replace />;

  return children;
}
