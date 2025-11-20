// src/api/adminAxiosInstance.js
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + '/admin',
  headers: { 'Content-Type': 'application/json' },
  timeout: 1200000,
  withCredentials: true,
});

// 🚀 관리자 전용 토큰 주입
adminApi.interceptors.request.use(
  (config) => {
    const adminToken = useAuthStore.getState().teamInfo?.adminAccessToken;
    
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }

    // 혹시 role 체크 필요하면
    const { teamInfo } = useAuthStore.getState();
    if (teamInfo?.role !== 'admin') {
      console.error('⛔ 관리자 권한 없음 → 요청 차단');
      throw new Error('관리자 권한이 없습니다.');
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 401 → 관리자 세션 종료
adminApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      console.warn('⛔ 관리자 토큰 만료');
      useAuthStore.getState().logout();
      // window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default adminApi;
