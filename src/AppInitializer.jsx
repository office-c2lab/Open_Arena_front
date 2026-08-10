import { useEffect } from 'react';

import { getMe } from '@/api/auth';
import { useAuthStore } from '@/stores/authStore';

export default function AppInitializer({ children }) {
  const login = useAuthStore(state => state.login);
  const setUserLoggedOut = useAuthStore(state => state.setUserLoggedOut);
  const setAuthInitialized = useAuthStore(state => state.setAuthInitialized);

  useEffect(() => {
    let isActive = true;

    const initializeAuth = async () => {
      try {
        const user = await getMe();
        if (isActive) login(user);
      } catch {
        if (isActive) setUserLoggedOut();
      } finally {
        if (isActive) setAuthInitialized(true);
      }
    };

    initializeAuth();

    return () => {
      isActive = false;
    };
  }, [login, setAuthInitialized, setUserLoggedOut]);

  return children;
}
