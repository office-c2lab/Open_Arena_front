// src/api/leaderboardApi.js
import api from '@/api/axiosInstance';

/**
 * 🏆 팀별 리더보드 데이터 조회
 * @param {number} teamId - 팀 ID
 * @param {number} limit - 가져올 순위 수 (기본 8)
 * @returns {Promise<Object>} { top: [...], me: {...} }
 */
export const fetchLeaderboard = async (teamId, limit = 8) => {
  const res = await api.get('/dashboard/leaderboard', {
    params: { team_id: teamId, limit },
  });
  return res.data;
};
