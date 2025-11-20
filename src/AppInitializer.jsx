// src/AppInitializer.jsx
import { useEffect } from 'react';
import { refreshToken } from '@/api/auth';

export default function AppInitializer() {
  useEffect(() => {
    refreshToken()
      .then(() => console.log('🔄 Access token 자동 재발급 성공'))
      .catch(() => console.log('⚠️ 자동 로그인 실패: 로그인 필요'));
  }, []);

  return null; // UI 없음 (전역 초기 작업만 수행)
}
