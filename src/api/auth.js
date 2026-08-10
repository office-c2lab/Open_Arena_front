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
  profileImage: user.profile_image_url || null,
  profileBackgroundImage: user.profile_background_url || null,
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

const normalizeAdmin = admin => ({
  ...admin,
  username: admin.username ?? admin.nickname,
  login_id: admin.username ?? admin.email,
});

export const getAdminMe = async () => {
  const { data } = await api.get('/admin/account/me');
  return normalizeAdmin(data);
};

export const adminLogin = async credentials => {
  await api.post('/admin/auth/login', {
    username: credentials.username,
    password: credentials.password,
  });

  return getAdminMe();
};

export const adminLogoutApi = async () => {
  await api.post('/admin/auth/logout');
};
