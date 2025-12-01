// 랜덤 상태 생성기 (hint 제거)
const randState = () => (Math.random() > 0.6 ? "green" : "gray");

// ---------------------------
// 1) 점수 변화 mock (TotalLeaderboard)
// ---------------------------
export const mockTotalLeaderboard = [
  { time: '2025-11-26T09:00:00', A팀: 0, B팀: 0, C팀: 0 },
  { time: '2025-11-26T10:00:00', A팀: 200, B팀: 100, C팀: 0 },
  { time: '2025-11-26T11:00:00', A팀: 300, B팀: 200, C팀: 50 },
  { time: '2025-11-26T12:00:00', A팀: 500, B팀: 300, C팀: 200 },
];

// ---------------------------
// 2) 문제 40개 배점 mock
// ---------------------------
export const mockProblemScores = {
  scores: Array.from({ length: 40 }, (_, i) => ((i % 5) + 1) * 10), // 100~500 반복
};

// ---------------------------
// 3) 12팀 × 40문제 mock (success/pending)
// ---------------------------
const teamNames = Array.from({ length: 12 }, (_, i) => `팀${i + 1}`);

export const mockHackingBoard = teamNames.map((name) => {
  const colors = Array.from({ length: 40 }, randState);
  const successCount = colors.filter((c) => c === "green").length;

  return {
    username: name,
    total_score: successCount * 100,
    colors,
  };
});
