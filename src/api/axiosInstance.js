import axios from 'axios';

import { ADMIN_CSRF_COOKIE_NAME, API_BASE_URL, USER_CSRF_COOKIE_NAME } from './config';
import { ApiError } from './errors';

const readCookie = name => {
  if (typeof document === 'undefined') return null;

  const prefix = `${encodeURIComponent(name)}=`;
  const cookie = document.cookie.split('; ').find(item => item.startsWith(prefix));

  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : null;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15_000,
  headers: {
    Accept: 'application/json',
  },
});

api.interceptors.request.use(config => {
  const method = config.method?.toLowerCase();

  if (method && !['get', 'head', 'options'].includes(method)) {
    const requestPath = String(config.url || '');
    const cookieName = requestPath.startsWith('/admin/')
      ? ADMIN_CSRF_COOKIE_NAME
      : USER_CSRF_COOKIE_NAME;
    const csrfToken = readCookie(cookieName);

    if (csrfToken && !config.headers.has('X-CSRF-Token')) {
      config.headers.set('X-CSRF-Token', csrfToken);
    }
  }

  return config;
});

api.interceptors.response.use(
  response => response,
  error => Promise.reject(ApiError.from(error))
);

export default api;
