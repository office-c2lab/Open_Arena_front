// src/api/adminProblemsApi.js
import api from '@/api/axiosInstance';

/**
 * 문제 활성/비활성 토글
 * PATCH /admin/problems/{problem_id}/active/toggle
 *
 * @param {number} problemId
 * @returns {Promise<any>}
 */
export const toggleAdminProblemActive = (problemId) => {
  return api
    .patch(`/admin/problems/${problemId}/active/toggle`)
    .then((res) => res.data);
};

export const getAdminProblems = () =>
  api.get('/admin/problems/view').then(res => res.data);

export const createProblem = async (payload) => {
  const res = await api.post("/admin/problems", payload);
  return res.data;
};