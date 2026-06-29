// src/api/dashboardApi.js
import api from '@/api/axiosInstance';

/** 🔥 팀별 대시보드 조회 (신규 API) */
export const fetchTeamDashboard = async teamId => {
  const res = await api.get(`/problem/team/${teamId}`);
  return res.data;
  // {
  //   solved_count,
  //   total_score,
  //   problems: [{ title, is_active, solved }]
  // }
};
