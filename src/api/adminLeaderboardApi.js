// src/api/adminLeaderboardApi.js
import api from "./axiosInstance";

// 관리자용 리더보드 조회
export const fetchAdminLeaderboard = async ({ teamId }) => {
  const res = await api.get("/admin/leaderboard", {
    params: { team_id: teamId },
  });
  return res.data;
};
