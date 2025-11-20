// src/api/auth.js

import api from './axiosInstance'; // 앞서 만드신 axios 인스턴스를 가져옵니다.

/**
 * 로그인 요청 (POST /auth/login)
 * @param {object} credentials - { login_id, password }
 * @returns {Promise<object>} TeamOut 객체
 */
export const login = async credentials => {
  // api.post(엔드포인트, 요청 본문)
  const response = await api.post('/auth/login', credentials);
  return response.data; // 응답 데이터를 반환합니다.
};

export const refreshToken = () => {
  return api.post('/auth/refresh').then(res => res.data);
};

export const logoutApi = () => {
  return api.post('/auth/logout').then(res => res.data);
};
