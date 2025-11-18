// src/api/adminLeaderboardSettingApi.js
import api from "./axiosInstance";

// 현재 공개 설정 조회
export const fetchLeaderboardSetting = () =>
  api.get("/admin/arena/leaderboard-setting").then(res => res.data);

// 토글 실행
export const toggleLeaderboardSetting = () =>
  api.post("/admin/arena/leaderboard-setting/toggle").then(res => res.data);
