import api from '@/api/axiosInstance';

export const fetchAdminTeams = async ({ activeOnly = false } = {}) => {
  const res = await api.get('/admin/teams', {
    params: activeOnly ? { active_only: true } : undefined,
  });
  return res.data;
};

export const toggleAdminTeamActive = async teamId => {
  const res = await api.post(`/admin/teams/${teamId}/active-toggle`);
  return res.data;
};

export const resetAdminTeamPassword = async ({ teamId, password }) => {
  const res = await api.post(
    `/admin/teams/${teamId}/password-reset`,
    password ? { password } : undefined
  );
  return res.data;
};
