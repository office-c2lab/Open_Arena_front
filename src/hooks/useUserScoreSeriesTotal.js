import { useEffect, useRef, useState } from "react";
import {
  fetchUserScoreSeriesTotal,
  fetchUserTotalGraphSetting,
} from "@/api/userTotalGraphApi";

export function useUserScoreSeriesTotal(interval = 5000) {
  const [seriesData, setSeriesData] = useState([]);
  const [enabled, setEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const lastDataKeyRef = useRef('');

  // ⭐ KST 대회 시작 09:00
  const START = "2026-06-25T00:50:00+09:00";
  // ⭐ 대회 종료 17:30
  // const END = "2025-12-03T17:30:00+09:00";

  const normalizeSeries = rows => {
    const sortedRows = [...rows].sort((a, b) => new Date(a.time) - new Date(b.time));
    const compactedRows = [];
    let previousScoreKey = '';

    sortedRows.forEach(row => {
      const scoreKey = Object.keys(row)
        .filter(key => key !== 'time')
        .sort()
        .map(key => `${key}:${Number(row[key]) || 0}`)
        .join('|');

      if (scoreKey === previousScoreKey) return;

      compactedRows.push(row);
      previousScoreKey = scoreKey;
    });

    return compactedRows;
  };

  const load = async () => {
    try {
      const setting = await fetchUserTotalGraphSetting();
      setEnabled(prev => (prev === setting.enabled ? prev : setting.enabled));

      if (!setting.enabled) {
        setSeriesData(prev => (prev.length === 0 ? prev : []));
        lastDataKeyRef.current = '';
        setIsLoading(false);
        return;
      }

      const res = await fetchUserScoreSeriesTotal({
        start: START,
        // end: END,
      });

      const nextSeriesData = normalizeSeries(res);
      const nextDataKey = JSON.stringify(nextSeriesData);

      if (nextDataKey !== lastDataKeyRef.current) {
        lastDataKeyRef.current = nextDataKey;
        setSeriesData(nextSeriesData);
      }
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
