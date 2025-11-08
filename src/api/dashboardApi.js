// src/api/dashboardApi.js
import api from '@/api/axiosInstance';

/** 팀 대시보드 조회 */
export const fetchTeamDashboard = async (teamId) => {
  const res = await api.get(`/dashboard/team/${teamId}`);
  return res.data;
};
