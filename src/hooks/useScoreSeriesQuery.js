// src/hooks/useScoreSeriesQuery.js
import { useEffect, useState } from "react";
import { fetchScoreSeriesTotal } from "@/api/leaderboardApi";

export function useScoreSeriesQuery(interval = 5000) {
  const [seriesData, setSeriesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const START_KST = "2025-12-02T09:00:00+09:00";
  const START_UTC = new Date(START_KST).toISOString();

  const load = async () => {
    try {
      const end = new Date().toISOString();

      const res = await fetchScoreSeriesTotal({
        start: START_UTC,
        end,
      });

      setSeriesData(res);
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
