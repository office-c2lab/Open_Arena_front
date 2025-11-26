// src/api/axiosInstance.js
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 1200000,
  withCredentials: true, // 쿠키 포함 필수
});

// 🔥 요청 인터셉터 (Authorization 헤더 제거)
api.interceptors.request.use(
  (config) => {
    // 쿠키 기반이라 Authorization 헤더 필요 없음
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔥 응답 인터셉터 (핵심)
// - access_token 만료 → refresh 시도
// - refresh 성공 → 원래 요청 자동 재시도
// - refresh 실패 → 자동 로그아웃
let isRefreshing = false;
let pendingRequests = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { logout } = useAuthStore.getState();

    // 401 아니면 기본 reject
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    /**
     * 1) 중복 refresh 요청 방지
     */
    if (!isRefreshing) {
      isRefreshing = true;

      try {
        // 🔥 refresh API 요청
        await api.post('/auth/refresh');

        // refresh 성공 → 대기 중 요청들 모두 재시도
        pendingRequests.forEach((cb) => cb());
        pendingRequests = [];

        return api(error.config); // 원래 요청 재시도
      } catch (refreshError) {
        console.warn("Refresh 실패 → 강제 로그아웃");
        logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    /**
     * 2) refresh 중이면 요청 대기열에 push
     */
    return new Promise((resolve) => {
      pendingRequests.push(() => resolve(api(error.config)));
    });
  }
);

export default api;
