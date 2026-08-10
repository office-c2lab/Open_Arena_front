import api from './axiosInstance';

export const getAdminUsers = async ({
  query,
  membership,
  accountStatus,
  offset = 0,
  limit = 20,
} = {}) => {
  const { data } = await api.get('/admin/users', {
    params: {
      ...(query ? { query } : {}),
      ...(membership ? { membership } : {}),
      ...(accountStatus ? { account_status: accountStatus } : {}),
      offset,
      limit,
    },
  });
  return data;
};

export const getAdminUserTodayUsage = async userId => {
  const { data } = await api.get(`/admin/users/${userId}/usage/today`);
  return data;
};

export const changeAdminUserMembership = async ({ userId, membership, reason }) => {
  const { data } = await api.patch(`/admin/users/${userId}/membership`, {
    membership,
    ...(reason ? { reason } : {}),
  });
  return data;
};

export const changeAdminUserStatus = async ({ userId, accountStatus, reason }) => {
  const { data } = await api.patch(`/admin/users/${userId}/status`, {
    account_status: accountStatus,
    ...(reason ? { reason } : {}),
  });
  return data;
};

export const revokeAdminUserSessions = async ({ userId, reason }) => {
  const { data } = await api.post(`/admin/users/${userId}/sessions/revoke`, {
    ...(reason ? { reason } : {}),
  });
  return data;
};

export const sendAdminUserPasswordResetEmail = async userId => {
  const { data } = await api.post(`/admin/users/${userId}/password-reset-email`);
  return data;
};

export const addAdminUserQuota = async ({ userId, quotaType, amount, reason }) => {
  const { data } = await api.post(`/admin/users/${userId}/quota-adjustments`, {
    quota_type: quotaType,
    amount,
    ...(reason ? { reason } : {}),
  });
  return data;
};

export const getAdminFreeDailyLimits = async () => {
  const { data } = await api.get('/admin/settings/free-daily-limits');
  return data;
};

export const updateAdminFreeDailyLimits = async limits => {
  const { data } = await api.put('/admin/settings/free-daily-limits', limits);
  return data;
};
