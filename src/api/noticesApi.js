import api from './axiosInstance';

export const getPublicNotices = async ({ offset = 0, limit = 100 } = {}) => {
  const { data } = await api.get('/notices', { params: { offset, limit } });
  return data;
};

export const getPublicNotice = async noticeId => {
  const { data } = await api.get(`/notices/${noticeId}`);
  return data;
};
