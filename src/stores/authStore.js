// src/stores/authStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  logoutApi,
  adminLogoutApi,
} from "@/api/auth";

export const useAuthStore = create(
  persist(
    (set) => ({
      //---------------------------------------------------
      // ⭐ 일반 유저(팀)
      //---------------------------------------------------
      teamInfo: null,
      isLoggedIn: false,

      login: (team) =>
        set({ teamInfo: team, isLoggedIn: true }),

      logout: async () => {
        try {
          await logoutApi();
        } catch (_) {}
        set({ teamInfo: null, isLoggedIn: false });
      },

      //---------------------------------------------------
      // ⭐ 관리자
      //---------------------------------------------------
      adminInfo: null,
      isAdminLoggedIn: false,

      adminLoginState: (admin) =>
        set({ adminInfo: admin, isAdminLoggedIn: true }),

      adminLogout: async () => {
        try {
          await adminLogoutApi();
        } catch (_) {}
        set({ adminInfo: null, isAdminLoggedIn: false });
      },

      //---------------------------------------------------
      // ⭐ 공통 초기화
      //---------------------------------------------------
      setLoggedOut: () =>
        set({
          teamInfo: null,
          isLoggedIn: false,
          adminInfo: null,
          isAdminLoggedIn: false,
        }),
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);
