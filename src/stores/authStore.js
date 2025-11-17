// src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useSessionStore } from '@/stores/useSessionStore'; // ⬅️ 추가

export const useAuthStore = create(
  persist(
    (set) => ({
      teamInfo: null,
      isLoggedIn: false,

      // 🔑 로그인
      login: (teamData) =>
        set({
          teamInfo: teamData,
          isLoggedIn: true,
        }),

      // 🚪 로그아웃
      logout: () => {
        // 1) authStore 초기화
        set({
          teamInfo: null,
          isLoggedIn: false,
        });

        // 2) sessionStore 초기화
        useSessionStore.getState().clearSession(); // 🔥 핵심
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
