import api from './axiosInstance';

const membershipLabels = {
  free: '무료 회원',
  paid: '유료 회원',
};

export const normalizeUser = user => ({
  ...user,
  login_id: user.email,
  username: user.nickname,
  teamname: user.nickname,
  membershipType: user.membership,
  membershipLabel: membershipLabels[user.membership] || user.membership,
});

export const getLegalDocuments = async () => {
  const { data } = await api.get('/auth/legal-documents');
  return data;
};

export const requestEmailVerification = async email => {
  const { data } = await api.post('/auth/email-verifications', { email });
  return data;
};

export const confirmEmailVerification = async ({ challengeId, code }) => {
  const { data } = await api.post(`/auth/email-verifications/${challengeId}/confirm`, { code });
  return data;
};

export const register = async payload => {
  const { data } = await api.post('/auth/register', payload);
  return normalizeUser(data);
};

export const requestPasswordReset = async email => {
  const { data } = await api.post('/auth/password-reset-requests', { email });
  return data;
};

export const completePasswordReset = async payload => {
  const { data } = await api.post('/auth/password-resets', payload);
  return data;
};

export const getMe = async () => {
  const { data } = await api.get('/account/me');
  return normalizeUser(data);
};

export const login = async credentials => {
  await api.post('/auth/login', {
    email: credentials.email,
    password: credentials.password,
    remember_me: Boolean(credentials.remember_me),
  });

  return getMe();
};

export const logoutApi = async () => {
  await api.post('/auth/logout');
};

export const adminLogin = async payload => ({
  id: 'local-admin',
  username: payload?.username || 'local-admin',
});

export const adminLogoutApi = async () => ({ ok: true });

export const getAdminMe = async () => {
  throw new Error('Backend admin auth is not connected yet.');
};

export const adminRefreshToken = async () => {
  throw new Error('Backend admin auth is not connected yet.');
};
