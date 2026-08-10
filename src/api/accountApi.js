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

const uploadProfileMedia = async (path, image) => {
  const formData = new FormData();
  formData.append('image', image);

  const { data } = await api.put(path, formData);
  return data;
};

export const uploadProfileImage = image => uploadProfileMedia('/account/profile-image', image);

export const deleteProfileImage = async () => {
  await api.delete('/account/profile-image');
};

export const uploadProfileBackground = image =>
  uploadProfileMedia('/account/profile-background', image);

export const deleteProfileBackground = async () => {
  await api.delete('/account/profile-background');
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
