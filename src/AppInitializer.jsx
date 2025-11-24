// src/AppInitializer.jsx
import { useEffect } from 'react';
import { refreshToken } from '@/api/auth';

export default function AppInitializer() {
  useEffect(() => {
    //  앱 시작 시 1회 실행
    refreshToken()
      .then(() => console.log('Access token 자동 재발급 성공'))
      .catch(() => console.log('자동 로그인 실패: 로그인 필요'));

    //  25분마다 refreshToken 자동 실행 (30분 만료 전에 갱신)
    const interval = setInterval(
      () => {
        refreshToken()
          .then(() => console.log('주기적 토큰 재발급 성공'))
          .catch(() => console.log('주기적 재발급 실패'));
      },
      1000 * 60 * 25
    ); // 25분

    return () => clearInterval(interval);
  }, []);

  return null;
}
