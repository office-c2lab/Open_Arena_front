// src/AppInitializer.jsx
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { refreshToken } from '@/api/auth';

export default function AppInitializer({ children }) {
  const { setLoggedOut } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const hasRefresh = document.cookie.includes('refresh_token=');

      // 🔥 처음 방문: refresh_token 없으면 아무것도 하지 않음
      if (!hasRefresh) {
        setLoading(false);
        return;
      }

      try {
        await refreshToken(); // access_token만 갱신
        // ❗ teamInfo/adminInfo는 유지됨 (중요!)
      } catch (err) {
        // refresh 실패할 때만 로그아웃 처리
        setLoggedOut();
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  if (loading) return <div>Loading...</div>;

  return children;
}
