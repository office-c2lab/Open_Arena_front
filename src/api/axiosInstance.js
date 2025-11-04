// /src/api/axiosInstance.js

import axios from "axios";

const api = axios.create({
  // 환경 변수에서 기본 URL을 가져옵니다.
  baseURL: import.meta.env.VITE_API_BASE_URL,
  
  // CORS 요청 시 쿠키(인증 정보)를 포함하여 전송하도록 설정
  // withCredentials: true,
});

export default api;