// src/features/Challenge/components/PointInfoCard.jsx

import React from 'react';
import Skeleton from '../../../components/Skeleton/Skeleton';
import PointSvg from '../../../assets/icons/Point.svg';
import { useParams } from 'react-router-dom';
import { useProblemBundle } from '@/hooks/useProblemBundle';

const COLOR_BLACK = '#000000';

const PointInfoCardSkeleton = ({ compact = false }) => (
  <div
    className={`glass-panel w-full ${compact ? 'min-h-[72px] p-2.5' : 'min-h-[96px] p-4'} flex flex-shrink-0 items-center justify-start rounded-[20px] animate-pulse`}
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
    <div className="ml-4 flex flex-1 flex-col gap-2">
      <Skeleton className="h-4 w-full rounded" />
      <Skeleton className="h-4 w-full rounded" />
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
      className={`glass-panel w-full ${compact ? 'min-h-[72px] p-2.5' : 'min-h-[96px] p-4'} flex flex-shrink-0 items-center justify-start rounded-[20px]`}
    >
      <div
        className={`${compact ? 'h-[36px] w-[36px]' : 'w-[49px] h-[49px]'} flex justify-center items-center rounded-[10px] flex-shrink-0`}
        style={{ background: COLOR_BLACK }}
      >
        <img
          src={PointSvg}
          alt=""
          aria-hidden="true"
          className={compact ? 'h-[22px] w-[22px]' : 'w-[28px] h-[28px]'}
        />
      </div>

      <div className="ml-4 flex min-w-0 flex-1 flex-col items-end gap-2">
        <strong className={`${compact ? 'text-body' : 'text-body-lg'} text-[#FF4854]`}>
          {Number(bestScore).toLocaleString()} 포인트 획득
        </strong>
        <strong className={`${compact ? 'text-body' : 'text-body-lg'} text-black`}>
          최대 {Number(score).toLocaleString()} 포인트
        </strong>
      </div>
    </div>
  );
}
