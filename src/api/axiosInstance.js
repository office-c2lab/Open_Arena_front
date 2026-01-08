// src/api/axiosInstance.js
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  timeout: 120000,
});

let isRefreshing = false;
let pendingRequests = [];

api.interceptors.response.use(
  res => res,
  async error => {
    const status = error.response?.status;
    const originalRequest = error.config;
    const url = originalRequest?.url || '';

    // ✅ 401 아니면 패스
    if (status !== 401) return Promise.reject(error);

    // ✅ auth 자체 요청은 refresh 대상에서 제외 (무한루프 방지)
    const isAuthRequest =
      url.includes('/auth/login') ||
      url.includes('/auth/refresh') ||
      url.includes('/auth/me') || // 있으면 포함
      url.includes('/admin/auth/login') || // 네 백엔드 라우트에 맞게 조정
      url.includes('/admin/auth/refresh');

    if (isAuthRequest) return Promise.reject(error);

    // ✅ 원요청 재시도 플래그 (중복 재시도 방지)
    if (originalRequest._retry) return Promise.reject(error);
    originalRequest._retry = true;

    const { setLoggedOut } = useAuthStore.getState();

    // ✅ refresh 진행 중이면 큐에 대기
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingRequests.push({ resolve, reject });
      }).then(() => api(originalRequest));
    }

    isRefreshing = true;

    try {
      // 🔥 refresh 요청 (쿠키 기반)
      await api.post('/auth/refresh');

      // 대기 중인 요청들 재개
      pendingRequests.forEach(p => p.resolve());
      pendingRequests = [];

      // 원 요청 재시도
      return api(originalRequest);
    } catch (refreshError) {
      // 대기 중인 요청들 실패 처리
      pendingRequests.forEach(p => p.reject(refreshError));
      pendingRequests = [];

      // 🔥 여기서 공통 로그아웃
      setLoggedOut();
      // 필요하면 라우팅
      window.location.href = '/login';

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
