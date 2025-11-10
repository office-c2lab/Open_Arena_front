// src/api/axiosInstance.js

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 환경변수 우선
  headers: { 'Content-Type': 'application/json' },
  
  // 💡 챌린지 제출 시간 초과 문제를 해결하기 위해 타임아웃을 2분(120000ms)으로 설정
  timeout: 1200000, 
  
  // withCredentials: true, // 필요 시 주석 해제
});

export default api;