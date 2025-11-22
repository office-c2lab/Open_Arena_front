// src/AppInitializer.jsx
import { useEffect } from 'react';
import { refreshToken } from '@/api/auth';
import { useAuthStore } from '@/stores/authStore';

export default function AppInitializer() {
  const { isLoggedIn } = useAuthStore();
  const isHydrated = useAuthStore.persist?.hasHydrated?.() ?? true;

  useEffect(() => {
    //  persist 초기화 이전에는 실행 금지
    if (!isHydrated) return;

    //  로그인 안 되어 있으면 refresh 호출 금지
    if (!isLoggedIn) return;

    refreshToken()
      .then(() => console.log('🔄 Access token 자동 재발급 성공'))
      .catch(() => console.log('⚠️ 자동 로그인 실패: 로그인 필요'));

    const interval = setInterval(
      () => {
        refreshToken()
          .then(() => console.log('🔁 주기적 토큰 재발급 성공'))
          .catch(() => console.log('❌ 주기적 재발급 실패'));
      },
      1000 * 60 * 25
    );

    return () => clearInterval(interval);
  }, [isLoggedIn, isHydrated]);

  return null;
}
