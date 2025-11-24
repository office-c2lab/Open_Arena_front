// src/stores/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { logoutApi } from '@/api/auth';
import { useSessionStore } from '@/stores/useSessionStore';

export const useAuthStore = create(
  persist(
    set => ({
      teamInfo: null,
      isLoggedIn: false,

      login: teamData =>
        set({
          teamInfo: teamData, //여기에 accessToken 포함된 객체가 들어옴
          isLoggedIn: true,
        }),

      logout: async () => {
        try {
          await logoutApi(); //  서버에 실제 로그아웃 요청
        } catch (err) {
          console.error('로그아웃 API 오류:', err);
        }

        //  Zustand 스토어 초기화
        set({
          teamInfo: null,
          isLoggedIn: false,
        });

        // 세션 초기화
        useSessionStore.getState().clearSession();
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
