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

  // ⭐ KST 11:30 시작
  const START = "2025-12-02T11:30:00+09:00";

  const load = async () => {
    try {
      // 공개 여부 조회
      const setting = await fetchUserTotalGraphSetting();
      setEnabled(setting.enabled);

      if (!setting.enabled) {
        setSeriesData([]);
        setIsLoading(false);
        return;
      }

      // ⭐ end 없이 start만 전달 (백엔드가 end=now 자동 처리)
      let res = await fetchUserScoreSeriesTotal({
        start: START,
      });

      // 정렬 안전장치
      res = res.sort((a, b) => new Date(a.time) - new Date(b.time));

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
