import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { getAdminMe, getMe } from '@/api/auth';
import { useAuthStore } from '@/stores/authStore';

export default function AppInitializer({ children }) {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith('/admin');
  const login = useAuthStore(state => state.login);
  const setUserLoggedOut = useAuthStore(state => state.setUserLoggedOut);
  const setAuthInitialized = useAuthStore(state => state.setAuthInitialized);
  const adminLogin = useAuthStore(state => state.adminLoginState);
  const setAdminLoggedOut = useAuthStore(state => state.setAdminLoggedOut);
  const setAdminAuthInitialized = useAuthStore(state => state.setAdminAuthInitialized);

  useEffect(() => {
    let isActive = true;

    const initializeUserAuth = async () => {
      try {
        const user = await getMe();
        if (isActive) login(user);
      } catch {
        if (isActive) setUserLoggedOut();
      } finally {
        if (isActive) setAuthInitialized(true);
      }
    };

    const initializeAdminAuth = async () => {
      try {
        const admin = await getAdminMe();
        if (isActive) adminLogin(admin);
      } catch {
        if (isActive) setAdminLoggedOut();
      } finally {
        if (isActive) setAdminAuthInitialized(true);
      }
    };

    if (isAdminRoute) {
      setAuthInitialized(false);
      initializeAdminAuth();
    } else {
      setAdminAuthInitialized(false);
      initializeUserAuth();
    }

    return () => {
      isActive = false;
    };
  }, [
    adminLogin,
    isAdminRoute,
    login,
    setAdminAuthInitialized,
    setAdminLoggedOut,
    setAuthInitialized,
    setUserLoggedOut,
  ]);

  return children;
}
