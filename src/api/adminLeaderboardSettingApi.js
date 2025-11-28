// src/api/adminLeaderboardSettingApi.js
import api from "./axiosInstance";

// 현재 공개 설정 조회
export const fetchLeaderboardSetting = () =>
  api.get("/dashboard/arena").then(res => res.data);

// 어드민 리더보드 딸깍이 > 사용자 리더보드 온오프
export const toggleLeaderboardSetting = () =>
  api.post("/admin/arena/leaderboard-setting/toggle").then(res => res.data);
