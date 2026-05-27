// src/api/axiosInstance.js
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  timeout: 120000,
});

const refreshState = {
  user: {
    isRefreshing: false,
    pendingRequests: [],
  },
  admin: {
    isRefreshing: false,
    pendingRequests: [],
  },
};

const getRequestPath = url => {
  if (!url) return '';

  try {
    return new URL(url, window.location.origin).pathname;
  } catch {
    return url.split('?')[0];
  }
};

const getAuthScope = path => (path.startsWith('/admin') ? 'admin' : 'user');

const refreshPathByScope = {
  user: '/auth/refresh',
  admin: '/auth/admin-refresh',
};

const redirectPathByScope = {
  user: '/login',
  admin: '/admin/login',
};

const resolvePendingRequests = state => {
  state.pendingRequests.forEach(p => p.resolve());
  state.pendingRequests = [];
};

const rejectPendingRequests = (state, error) => {
  state.pendingRequests.forEach(p => p.reject(error));
  state.pendingRequests = [];
};

api.interceptors.response.use(
  res => res,
  async error => {
    const status = error.response?.status;
    const originalRequest = error.config;
    const path = getRequestPath(originalRequest?.url || '');

    // ✅ 401 아니면 패스
    if (status !== 401) return Promise.reject(error);

    // ✅ auth 자체 요청은 refresh 대상에서 제외 (무한루프 방지)
    const isAuthRequest = path.startsWith('/auth/');

    if (isAuthRequest) return Promise.reject(error);

    // ✅ 원요청 재시도 플래그 (중복 재시도 방지)
    if (originalRequest._retry) return Promise.reject(error);
    originalRequest._retry = true;

    const authScope = getAuthScope(path);
    const state = refreshState[authScope];

    // ✅ refresh 진행 중이면 큐에 대기
    if (state.isRefreshing) {
      return new Promise((resolve, reject) => {
        state.pendingRequests.push({ resolve, reject });
      }).then(() => api(originalRequest));
    }

    state.isRefreshing = true;

    try {
      // 🔥 refresh 요청 (쿠키 기반)
      await api.post(refreshPathByScope[authScope]);

      // 대기 중인 요청들 재개
      resolvePendingRequests(state);

      // 원 요청 재시도
      return api(originalRequest);
    } catch (refreshError) {
      // 대기 중인 요청들 실패 처리
      rejectPendingRequests(state, refreshError);

      // 🔥 여기서 scope별 로그아웃
      const { setUserLoggedOut, setAdminLoggedOut } = useAuthStore.getState();
      if (authScope === 'admin') {
        setAdminLoggedOut();
      } else {
        setUserLoggedOut();
      }
      // 필요하면 라우팅
      window.location.href = redirectPathByScope[authScope];

      return Promise.reject(refreshError);
    } finally {
      state.isRefreshing = false;
    }
  }
);

export default api;
