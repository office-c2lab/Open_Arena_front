// src/features/Challenge/components/PointInfoCard.jsx

import React from 'react';
import Skeleton from '../../../components/Skeleton/Skeleton';
import PointSvg from '../../../assets/icons/Point.svg';
import { useParams } from 'react-router-dom';
import { useProblemBundle } from '@/hooks/useProblemBundle';

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
      <span className={`${compact ? 'text-body-lg' : 'text-card-title'} font-medium text-black`}>
        포인트
      </span>
      <Skeleton className="h-8 w-20 rounded" />
    </div>
  </div>
);

export default function PointInfoCard({ compact = false }) {
  const { problemId } = useParams();
  const currentProblemId = problemId || undefined;

  // 챌린지 기본 포인트
  const { data: problemData, isLoading: isProblemLoading } = useProblemBundle(currentProblemId);

  const score = problemData?.problem?.score ?? 0;
  const bestScore = problemData?.problem?.best_score ?? 0;

  if (isProblemLoading) return <PointInfoCardSkeleton compact={compact} />;

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
        <span className={`${compact ? 'text-body-lg' : 'text-card-title'} font-medium text-black`}>
          포인트
        </span>

        <div className="flex items-baseline">
          {/* 최고 포인트 */}
          <span
            className={`${compact ? 'text-card-title' : 'text-section-title'} font-strong text-gray-600`}
          >
            {bestScore}
          </span>

          {/* / 구분 */}
          <span
            className={`${compact ? 'text-card-title' : 'text-section-title'} font-medium text-black mx-2`}
          >
            /
          </span>

          {/* 챌린지 포인트 */}
          <span
            className={`${compact ? 'text-card-title' : 'text-section-title'} font-strong text-black`}
          >
            {score}
          </span>
        </div>
      </div>
    </div>
  );
}
