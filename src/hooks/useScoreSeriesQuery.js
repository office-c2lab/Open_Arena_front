// src/hooks/useScoreSeriesQuery.js
import { useEffect, useRef, useState } from "react";
import { fetchScoreSeries } from "@/api/leaderboardApi";

export function useScoreSeriesQuery(interval = 1500) {
  const [seriesData, setSeriesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const lastAsOfRef = useRef(null);
  const lastScoresRef = useRef({});
  const hasInitRef = useRef(false);
  const isPollingRef = useRef(false);

  useEffect(() => {
    let timer;

    const poll = async () => {
      if (isPollingRef.current) return; // 중복 호출 방지
      isPollingRef.current = true;

      try {
        const res = await fetchScoreSeries();
        const { asof, top_teams } = res;

        if (!top_teams?.length) {
          isPollingRef.current = false;
          return;
        }

        // ---------------------
        // 1) 초기 0점 렌더링
        // ---------------------
        if (!hasInitRef.current) {
          const base = { time: "INIT" };
          top_teams.forEach((t) => (base[t.teamname] = 0));

          setSeriesData([base]);
          hasInitRef.current = true;
          setIsLoading(false);
        }

        // ---------------------
        // 2) 점수 변화 감지
        // ---------------------
        const newScores = {};
        let hasChange = false;

        top_teams.forEach((team) => {
          newScores[team.teamname] = team.score;
          if (lastScoresRef.current[team.teamname] !== team.score) {
            hasChange = true;
          }
        });

        // 변화 없거나 동일 asof면 skip
        if (!hasChange || lastAsOfRef.current === asof) {
          isPollingRef.current = false;
          return;
        }

        // ---------------------
        // 3) 갱신
        // ---------------------
        lastAsOfRef.current = asof;
        lastScoresRef.current = newScores;

        const newPoint = { time: asof };
        top_teams.forEach((team) => {
          newPoint[team.teamname] = team.score;
        });

        setSeriesData((prev) => [...prev, newPoint]);
      } catch (err) {
        console.error("series polling error:", err);
        setError(err);
      } finally {
        isPollingRef.current = false;
      }
    };

    poll();
    timer = setInterval(poll, interval);

    return () => clearInterval(timer);
  }, [interval]);

  return { data: seriesData, isLoading, error };
}

// import { useEffect, useRef, useState } from 'react';
// import { fetchScoreSeries, fetchScoreHead } from '@/api/leaderboardApi';

// /**
//  * ⏱ 실시간 점수 시계열 데이터 폴링 훅 (0점에서 시작 + 직선 방지)
//  */
// export function useScoreSeriesQuery(interval = 1500, forceRefreshMs = 8000) {
//   const [seriesData, setSeriesData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const lastSuccessRef = useRef(null);
//   const lastForceRef = useRef(Date.now());
//   const lastScoresRef = useRef({});
//   const lastAsOfRef = useRef(null);
//   const hasInitializedRef = useRef(false); // ✅ 초기 0점 데이터 세팅 여부

//   useEffect(() => {
//     let timer;

//     const poll = async () => {
//       try {
//         const now = Date.now();
//         const timeSinceLastForce = now - lastForceRef.current;

//         // 1️⃣ head 조회
//         const headRes = await fetchScoreHead();
//         const newTimestamp = headRes?.last_success_at;

//         const changed = newTimestamp && newTimestamp !== lastSuccessRef.current;
//         const needForce = timeSinceLastForce > forceRefreshMs;

//         if (!changed && !needForce) return;

//         if (changed) lastSuccessRef.current = newTimestamp;
//         if (needForce) lastForceRef.current = now;

//         // 2️⃣ series 조회
//         const scoreRes = await fetchScoreSeries();
//         const { asof, top_teams } = scoreRes;
//         if (!top_teams?.length) return;

//         // ✅ 점수 변화 검사
//         const newScores = {};
//         let hasChange = false;

//         top_teams.forEach(team => {
//           newScores[team.teamname] = team.score;
//           if (lastScoresRef.current[team.teamname] !== team.score) {
//             hasChange = true;
//           }
//         });

//         // ✅ 첫 실행 시 0점 데이터 추가
//         if (!hasInitializedRef.current) {
//           const basePoint = { time: '00:00' };
//           top_teams.forEach(team => {
//             basePoint[team.teamname] = 0;
//           });

//           setSeriesData([basePoint]); // 초기 0점
//           hasInitializedRef.current = true;
//           // console.log('🟢 초기 0점 데이터 세팅 완료');
//         }

//         // ✅ 변화가 없으면 패스
//         if (!hasChange || asof === lastAsOfRef.current) {
//           // console.log('⏸ 점수 변화 없음 — 업데이트 생략');
//           return;
//         }

//         // ✅ 기록 갱신
//         lastAsOfRef.current = asof;
//         lastScoresRef.current = newScores;

//         // ✅ 새로운 점수 추가
//         setSeriesData(prev => {
//           const newPoint = { time: asof };
//           top_teams.forEach(team => {
//             newPoint[team.teamname] = team.score;
//           });
//           return [...prev, newPoint];
//         });

//         setIsLoading(false);
//       } catch (err) {
//         console.error('Polling error:', err);
//         setError(err);
//       }
//     };

//     poll(); // 첫 실행
//     timer = setInterval(poll, interval);
//     return () => clearInterval(timer);
//   }, [interval, forceRefreshMs]);

//   return { data: seriesData, isLoading, error };
// }
