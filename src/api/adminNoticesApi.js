import api from './axiosInstance';

const compactParams = params =>
  Object.fromEntries(
    Object.entries(params || {}).filter(([, value]) => value !== undefined && value !== '')
  );

export const getAdminNotices = async ({ query, status, isPinned, offset = 0, limit = 20 } = {}) => {
  const { data } = await api.get('/admin/notices', {
    params: compactParams({ query, status, is_pinned: isPinned, offset, limit }),
  });
  return data;
};

export const getAdminNotice = async noticeId => {
  const { data } = await api.get(`/admin/notices/${noticeId}`);
  return data;
};

export const createAdminNotice = async payload => {
  const { data } = await api.post('/admin/notices', payload);
  return data;
};

export const updateAdminNotice = async ({ noticeId, payload }) => {
  const { data } = await api.patch(`/admin/notices/${noticeId}`, payload);
  return data;
};

export const deleteAdminNotice = async noticeId => {
  await api.delete(`/admin/notices/${noticeId}`);
};
