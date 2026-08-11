import api from './axiosInstance';

export const getDashboard = async () => {
  const { data } = await api.get('/dashboard');
  return data;
};

export const fetchTeamDashboard = getDashboard;
