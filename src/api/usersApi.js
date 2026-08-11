import api from './axiosInstance';

export const getPublicUserProfile = async userId => {
  const { data } = await api.get(`/users/${userId}/profile`);
  return data;
};
