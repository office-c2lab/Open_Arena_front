// src/store/authStore.js

import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // 👈 persist import

// 스토어 생성 및 초기 상태 정의
export const useAuthStore = create(
  // 💡 persist 미들웨어 적용
  persist(
    (set) => ({
      /**
       * teamInfo: 로그인 성공 시 서버에서 받은 팀 객체
       */
      teamInfo: null,
      
      /**
       * isLoggedIn: 로그인 여부 (Boolean)
       */
      isLoggedIn: false,
      
      // 🔑 로그인 액션
      login: (teamData) => set({ 
        teamInfo: teamData, 
        isLoggedIn: true 
      }),
      
      // 🚪 로그아웃 액션
      logout: () => set({ 
        teamInfo: null, 
        isLoggedIn: false 
      }),
    }),
    {
      // 💡 persist 설정 객체
      name: 'auth-storage', // localStorage에 저장될 키 이름 (고유해야 함)
      // 기본 storage는 localStorage입니다.
    }
  )
);