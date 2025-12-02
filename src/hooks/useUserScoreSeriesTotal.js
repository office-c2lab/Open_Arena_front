import { useEffect, useState } from "react";
import {
  fetchUserScoreSeriesTotal,
  fetchUserTotalGraphSetting,
} from "@/api/userTotalGraphApi";

export function useUserScoreSeriesTotal(interval = 5000) {
  const [seriesData, setSeriesData] = useState([]);
  const [enabled, setEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 대회 시작 시간 하드코딩
  const START_KST = "2025-12-02T09:00:00+09:00";
  const START_UTC = new Date(START_KST).toISOString();

  const load = async () => {
    try {
      // 1) 공개 여부 조회
      const setting = await fetchUserTotalGraphSetting();
      setEnabled(setting.enabled);

      if (!setting.enabled) {
        setSeriesData([]);
        setIsLoading(false);
        return;
      }

      // 2) 그래프 데이터 조회
      const end = new Date().toISOString();
      const res = await fetchUserScoreSeriesTotal({
        start: START_UTC,
        end,
      });

      setSeriesData(res);
      setIsLoading(false);
    } catch (err) {
      console.error("user score-series error:", err);
      setError(err);
    }
  };

  useEffect(() => {
    load();
    const timer = setInterval(load, interval);
    return () => clearInterval(timer);
  }, [interval]);

  return { data: seriesData, enabled, isLoading, error };
}
