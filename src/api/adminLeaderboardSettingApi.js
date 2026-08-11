import api from './axiosInstance';

export const fetchLeaderboardSetting = async () => {
  const { data } = await api.get('/admin/settings/leaderboard');
  return data;
};

export const updateLeaderboardSetting = async enabled => {
  const { data } = await api.put('/admin/settings/leaderboard', { enabled });
  return data;
};

export const toggleLeaderboardSetting = updateLeaderboardSetting;
