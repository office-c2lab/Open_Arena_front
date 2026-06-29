// src/hooks/useScoreSeriesQuery.js
import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchScoreSeriesTotal } from '@/api/leaderboardApi';

export function useScoreSeriesQuery(interval = 5000) {
  const [seriesData, setSeriesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const lastDataKeyRef = useRef('');

  // ⭐ 대회 시작 (KST)
  const start = '2026-06-25T10:00:00+09:00';
  // ⭐ 대회 종료 (KST 17:30)
  const end = '2026-06-26T17:30:00+09:00';

  const normalizeSeries = useCallback(rows => {
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
  }, []);

  const load = useCallback(async () => {
    try {
      const res = await fetchScoreSeriesTotal({
        start,
        end, // ⭐ 추가!
      });

      const nextSeriesData = normalizeSeries(res);
      const nextDataKey = JSON.stringify(nextSeriesData);

      if (nextDataKey !== lastDataKeyRef.current) {
        lastDataKeyRef.current = nextDataKey;
        setSeriesData(nextSeriesData);
      }
      setIsLoading(false);
    } catch (err) {
      console.error('score-series load error:', err);
      setError(err);
    }
  }, [end, normalizeSeries, start]);

  useEffect(() => {
    load();
    const timer = setInterval(load, interval);
    return () => clearInterval(timer);
  }, [interval, load]);

  return { data: seriesData, isLoading, error };
}
