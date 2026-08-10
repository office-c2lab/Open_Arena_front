const trimTrailingSlash = value => value.replace(/\/+$/, '');

export const API_BASE_URL = trimTrailingSlash(import.meta.env.VITE_API_BASE_URL || '/api/v1');
export const USER_CSRF_COOKIE_NAME = import.meta.env.VITE_USER_CSRF_COOKIE_NAME || 'arena_csrf';
export const ADMIN_CSRF_COOKIE_NAME =
  import.meta.env.VITE_ADMIN_CSRF_COOKIE_NAME || 'arena_admin_csrf';
