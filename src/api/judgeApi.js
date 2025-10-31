// src/api/judgeApi.js

import api from "./axiosInstance"; 

/**
 * 🧑‍⚖️ 챌린지 심사 요청 API (POST /judge)
 */
export const judgeChallenge = async ({ problem_id, team_id, session_id }) => {
    try {
        const response = await api.post("/judge", {
            problem_id,
            team_id,
            session_id,
        });
        // ✅ 성공 메시지 추가
        console.log(`[API] ✅ 심사 요청 성공: 세션 ${session_id}`);
        return response.data; // 서버 응답 (200 Successful Response)
    } catch (error) {
        console.error("[API] ❌ 심사 요청 실패:", error);
        throw error;
    }
};