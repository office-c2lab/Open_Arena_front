// src/features/Challenge/components/PointInfoCard.jsx

import React from 'react';
import Skeleton from '../../../components/Skeleton/Skeleton';
import PointSvg from '../../../assets/icons/Point.svg';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useProblemBundle } from '@/hooks/useProblemBundle';
import { useProblemBestScore } from '@/hooks/useProblemBestScore'; // ⭐ 추가

const COLOR_BLACK = '#000000';

const PointInfoCardSkeleton = ({ compact = false }) => (
  <div
    className={`w-full ${compact ? 'h-[58px] p-2.5' : 'h-[80px] p-4'} flex justify-start items-center flex-shrink-0 
               glass-panel rounded-[20px] animate-pulse`}
  >
    <div
      className={`${compact ? 'h-[36px] w-[36px]' : 'w-[49px] h-[49px]'} flex justify-center items-center rounded-[10px] flex-shrink-0`}
      style={{ background: COLOR_BLACK }}
    >
      <img
        src={PointSvg}
        alt="Point Icon"
        className={compact ? 'h-[22px] w-[22px]' : 'w-[28px] h-[28px]'}
      />
    </div>
    <div className="flex flex-row ml-4 items-center flex-1 justify-between">
      <span className={`${compact ? 'body-large' : 'heading-3'} font-500 text-black`}>점수</span>
      <Skeleton className="h-8 w-20 rounded" />
    </div>
  </div>
);

export default function PointInfoCard({ compact = false }) {
  const { problemId } = useParams();
  const currentProblemId = parseInt(problemId, 10);
  const teamId = useAuthStore(state => state.teamInfo?.id) || undefined;

  // 문제 기본 점수
  const { data: problemData, isLoading: isProblemLoading } = useProblemBundle(
    currentProblemId,
    teamId
  );

  // ⭐ 최고 점수(best_score)
  const { data: bestScoreData, isLoading: isBestLoading } = useProblemBestScore(
    currentProblemId,
    teamId
  );

  const score = problemData?.problem?.score ?? 0;
  const bestScore = bestScoreData?.best_score ?? 0; // ⭐ 0 또는 실제 점수

  if (isProblemLoading || isBestLoading) return <PointInfoCardSkeleton compact={compact} />;

  return (
    <div
      className={`w-full ${compact ? 'h-[58px] p-2.5' : 'h-[80px] p-4'} flex justify-start items-center flex-shrink-0 
                 glass-panel rounded-[20px]`}
    >
      <div
        className={`${compact ? 'h-[36px] w-[36px]' : 'w-[49px] h-[49px]'} flex justify-center items-center rounded-[10px] flex-shrink-0`}
        style={{ background: COLOR_BLACK }}
      >
        <img
          src={PointSvg}
          alt="Point Icon"
          className={compact ? 'h-[22px] w-[22px]' : 'w-[28px] h-[28px]'}
        />
      </div>

      <div className="flex flex-row ml-4 items-center flex-1 justify-between">
        <span className={`${compact ? 'body-large' : 'heading-3'} font-500 text-black`}>점수</span>

        <div className="flex items-baseline">
          {/* 최고 점수 */}
          <span className={`${compact ? 'heading-3' : 'heading-2'} font-700 text-gray-600`}>
            {bestScore}
          </span>

          {/* / 구분 */}
          <span className={`${compact ? 'heading-3' : 'heading-2'} font-500 text-black mx-2`}>
            /
          </span>

          {/* 문제 점수 */}
          <span className={`${compact ? 'heading-3' : 'heading-2'} font-700 text-black`}>{score}</span>
        </div>
      </div>
    </div>
  );
}
