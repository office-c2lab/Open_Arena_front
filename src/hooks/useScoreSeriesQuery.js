import { useEffect, useRef, useState } from 'react';
import { fetchScoreSeries, fetchScoreHead } from '@/api/leaderboardApi';

/**
 * ⏱ 실시간 점수 시계열 데이터 폴링 훅 (0점에서 시작 + 직선 방지)
 */
export function useScoreSeriesQuery(interval = 5000, forceRefreshMs = 10000) {
  const [seriesData, setSeriesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const lastSuccessRef = useRef(null);
  const lastForceRef = useRef(Date.now());
  const lastScoresRef = useRef({});
  const lastAsOfRef = useRef(null);
  const hasInitializedRef = useRef(false); // ✅ 초기 0점 데이터 세팅 여부

  useEffect(() => {
    let timer;

    const poll = async () => {
      try {
        const now = Date.now();
        const timeSinceLastForce = now - lastForceRef.current;

        // 1️⃣ head 조회
        const headRes = await fetchScoreHead();
        const newTimestamp = headRes?.last_success_at;

        const changed = newTimestamp && newTimestamp !== lastSuccessRef.current;
        const needForce = timeSinceLastForce > forceRefreshMs;

        if (!changed && !needForce) return;

        if (changed) lastSuccessRef.current = newTimestamp;
        if (needForce) lastForceRef.current = now;

        // 2️⃣ series 조회
        const scoreRes = await fetchScoreSeries();
        const { asof, top_teams } = scoreRes;
        if (!top_teams?.length) return;

        // ✅ 점수 변화 검사
        const newScores = {};
        let hasChange = false;

        top_teams.forEach(team => {
          newScores[team.teamname] = team.score;
          if (lastScoresRef.current[team.teamname] !== team.score) {
            hasChange = true;
          }
        });

        // ✅ 첫 실행 시 0점 데이터 추가
        if (!hasInitializedRef.current) {
          const basePoint = { time: '00:00' };
          top_teams.forEach(team => {
            basePoint[team.teamname] = 0;
          });

          setSeriesData([basePoint]); // 초기 0점
          hasInitializedRef.current = true;
          // console.log('🟢 초기 0점 데이터 세팅 완료');
        }

        // ✅ 변화가 없으면 패스
        if (!hasChange || asof === lastAsOfRef.current) {
          // console.log('⏸ 점수 변화 없음 — 업데이트 생략');
          return;
        }

        // ✅ 기록 갱신
        lastAsOfRef.current = asof;
        lastScoresRef.current = newScores;

        // ✅ 새로운 점수 추가
        setSeriesData(prev => {
          const newPoint = { time: asof };
          top_teams.forEach(team => {
            newPoint[team.teamname] = team.score;
          });
          return [...prev, newPoint];
        });

        setIsLoading(false);
      } catch (err) {
        console.error('Polling error:', err);
        setError(err);
      }
    };

    poll(); // 첫 실행
    timer = setInterval(poll, interval);
    return () => clearInterval(timer);
  }, [interval, forceRefreshMs]);

  return { data: seriesData, isLoading, error };
}
