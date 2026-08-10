import api from './axiosInstance';
import { normalizeUser } from './auth';

export const getTodayUsage = async () => {
  const { data } = await api.get('/account/usage/today');
  return data;
};

export const getChallengeStats = async () => {
  const { data } = await api.get('/account/challenge-stats');
  return data;
};

export const changePassword = async payload => {
  const { data } = await api.patch('/account/password', payload);
  return data;
};

export const changeNickname = async nickname => {
  const { data } = await api.patch('/account/nickname', { nickname });
  return normalizeUser(data);
};

export const withdrawAccount = async payload => {
  await api.post('/account/withdraw', payload);
};
