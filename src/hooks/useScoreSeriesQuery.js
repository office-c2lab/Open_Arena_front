// src/hooks/useScoreSeriesQuery.js
import { useEffect, useState } from "react";
import { fetchScoreSeriesTotal } from "@/api/leaderboardApi";

export function useScoreSeriesQuery(interval = 5000) {
  const [seriesData, setSeriesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ⭐ 대회 시작 시간 (UTC 변환 ❌ 그대로 KST 사용)
  const START = "2025-12-03T09:00:00+09:00";

  const load = async () => {
    try {
      // ⭐ end 생략 → 백엔드가 자동으로 현재 시각까지 처리
      const res = await fetchScoreSeriesTotal({
        start: START,
      });

      // 안전하게 시간 정렬
      const sorted = res.sort((a, b) => new Date(a.time) - new Date(b.time));

      setSeriesData(sorted);
      setIsLoading(false);
    } catch (err) {
      console.error("score-series load error:", err);
      setError(err);
    }
  };

  useEffect(() => {
    load();
    const timer = setInterval(load, interval);
    return () => clearInterval(timer);
  }, [interval]);

  return { data: seriesData, isLoading, error };
}
