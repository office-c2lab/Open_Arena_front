import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 1200000,
  withCredentials: true, //쿠키(Refresh Token) 보내기 위해 꼭 필요
});

/*  Authorization 헤더 제거됨 */

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.warn('토큰 만료 또는 유효하지 않은 토큰 → 자동 로그아웃');
      const { logout } = useAuthStore.getState();

      logout();
    }
    return Promise.reject(error);
  }
);

export default api;

//세은 매니저님 코드
// // src/api/axiosInstance.js
// import axios from 'axios';
// import { useAuthStore } from '@/stores/authStore';  // ⬅ 추가

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL,
//   headers: { 'Content-Type': 'application/json' },
//   timeout: 1200000,
//   withCredentials: true,
// });

// /* 
//    요청 인터셉터
//   - 매 요청마다 자동으로 Authorization 헤더에 토큰 추가
// */
// api.interceptors.request.use(
//   (config) => {
//     const token = useAuthStore.getState().teamInfo?.accessToken; // 토큰 가져오기
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// /*
//    응답 인터셉터
//   - 401 발생 시 자동 로그아웃 + 로그인 페이지로 이동
// */
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       console.warn(" 토큰 만료 또는 유효하지 않은 토큰 → 자동 로그아웃");
//       const { logout } = useAuthStore.getState();
//       logout();
//       // 필요하면 로그인 페이지로 자동 이동도 가능:
//       // window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;
