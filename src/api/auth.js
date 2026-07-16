// src/api/auth.js
export const login = async credentials => {
  const loginId = credentials?.login_id || credentials?.username || 'local-user';

  return {
    id: 'local-user',
    login_id: loginId,
    username: loginId,
    teamname: loginId,
  };
};

export const logoutApi = async () => ({ ok: true });

export const getMe = async () => {
  throw new Error('Backend auth is disabled.');
};

export const refreshToken = async () => {
  throw new Error('Backend auth is disabled.');
};

export const adminLogin = async payload => ({
  id: 'local-admin',
  username: payload?.username || 'local-admin',
});

export const adminLogoutApi = async () => ({ ok: true });

export const getAdminMe = async () => {
  throw new Error('Backend auth is disabled.');
};

export const adminRefreshToken = async () => {
  throw new Error('Backend auth is disabled.');
};
