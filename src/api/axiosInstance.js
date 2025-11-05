import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://16.145.207.109:8000', // 환경변수 우선
  headers: { 'Content-Type': 'application/json' },
  // withCredentials: true, // 필요 시 주석 해제
});

export default api;
