import api from './axiosInstance';

const compactParams = params =>
  Object.fromEntries(
    Object.entries(params || {}).filter(([, value]) => value !== undefined && value !== '')
  );

export const getAdminProblems = async ({ query, offset = 0, limit = 20 } = {}) => {
  const { data } = await api.get('/admin/problems', {
    params: compactParams({ query, offset, limit }),
  });
  return data;
};

export const getAdminProblem = async problemId => {
  const { data } = await api.get(`/admin/problems/${problemId}`);
  return data;
};

export const createProblem = async payload => {
  const { data } = await api.post('/admin/problems', payload);
  return data;
};

export const updateProblem = async (problemId, payload) => {
  const { data } = await api.patch(`/admin/problems/${problemId}`, payload);
  return data;
};

export const deleteProblem = async (problemId, confirmation) => {
  await api.delete(`/admin/problems/${problemId}`, { data: { confirmation } });
};

export const setAdminProblemState = async ({ problemId, isActive }) => {
  const { data } = await api.patch(`/admin/problems/${problemId}/state`, {
    is_active: isActive,
  });
  return data;
};

export const toggleAdminProblemActive = setAdminProblemState;

export const getAdminCategories = async () => {
  const { data } = await api.get('/admin/categories');
  return data;
};

export const createAdminCategory = async payload => {
  const { data } = await api.post('/admin/categories', payload);
  return data;
};

export const updateAdminCategory = async ({ categoryId, payload }) => {
  const { data } = await api.patch(`/admin/categories/${categoryId}`, payload);
  return data;
};

export const deleteAdminCategory = async categoryId => {
  await api.delete(`/admin/categories/${categoryId}`);
};

const endpointPath = kind => `/admin/${kind}-endpoints`;

export const getAdminEndpoints = async kind => {
  const { data } = await api.get(endpointPath(kind));
  return data;
};

export const createAdminEndpoint = async ({ kind, payload }) => {
  const { data } = await api.post(endpointPath(kind), payload);
  return data;
};

export const updateAdminEndpoint = async ({ kind, endpointId, payload }) => {
  const { data } = await api.patch(`${endpointPath(kind)}/${endpointId}`, payload);
  return data;
};

export const deleteAdminEndpoint = async ({ kind, endpointId }) => {
  await api.delete(`${endpointPath(kind)}/${endpointId}`);
};

export const getAdminChallengeSetting = async () => {
  const { data } = await api.get('/admin/settings/challenge');
  return data;
};

export const updateAdminChallengeSetting = async enabled => {
  const { data } = await api.put('/admin/settings/challenge', { enabled });
  return data;
};

export const getProtectedTerms = async problemId => {
  const { data } = await api.get(`/admin/problems/${problemId}/protected-terms`);
  return data;
};

export const createProtectedTerm = async ({ problemId, value, label }) => {
  const { data } = await api.post(`/admin/problems/${problemId}/protected-terms`, {
    value,
    ...(label ? { label } : {}),
  });
  return data;
};

export const deleteProtectedTerm = async ({ problemId, termId }) => {
  await api.delete(`/admin/problems/${problemId}/protected-terms/${termId}`);
};
