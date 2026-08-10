import api from './axiosInstance';

export const checkLiveness = async () => {
  const { data } = await api.get('/health/live');
  return data;
};

export const checkReadiness = async () => {
  const { data } = await api.get('/health/ready');
  return data;
};
