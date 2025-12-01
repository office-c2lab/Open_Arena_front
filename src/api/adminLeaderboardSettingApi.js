// src/api/adminLeaderboardSettingApi.js
import api from "@/api/axiosInstance";

// ⭐ 현재 공개 설정 조회
export const fetchLeaderboardSetting = () =>
  api.get("/admin/arena/leaderboard-setting").then(res => res.data);

// ⭐ 공개 설정 ON/OFF 토글
export const toggleLeaderboardSetting = () =>
  api.post("/admin/arena/leaderboard-setting/toggle").then(res => res.data);
