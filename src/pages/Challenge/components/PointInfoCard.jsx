// src/features/Challenge/components/PointInfoCard.jsx
import React from 'react';
import Skeleton from '../../../components/Skeleton/Skeleton';
import PointSvg from '../../../assets/icons/Point.svg';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useProblemBundle } from '@/hooks/useProblemBundle'; // ✅ API 훅 사용

const COLOR_BLACK = '#000000';

const PointInfoCardSkeleton = () => (
  <div
    className="w-full h-[80px] flex justify-start items-center p-4 flex-shrink-0 
               bg-white rounded-[20px] shadow-lg animate-pulse"
    style={{ boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.25)' }}
  >
    <div
      className="w-[49px] h-[49px] flex justify-center items-center rounded-[10px] flex-shrink-0"
      style={{ background: COLOR_BLACK }}
    >
      <img src={PointSvg} alt="Point Icon" className="w-[28px] h-[28px]" />
    </div>
    <div className="flex flex-row ml-4 items-center flex-1 justify-between">
      <span className="heading-3 font-500 text-black">점수</span>
      <Skeleton className="h-8 w-20 rounded" />
    </div>
  </div>
);

export default function PointInfoCard() {
  const { problemId } = useParams();
  const currentProblemId = parseInt(problemId, 10);
  const teamId = useAuthStore(state => state.teamInfo?.id) || undefined;

  // ✅ 문제 데이터 불러오기 (React Query 캐시 재사용)
  const { data, isLoading } = useProblemBundle(currentProblemId, teamId);

  const score = data?.problem?.score ?? 0;

  if (isLoading) return <PointInfoCardSkeleton />;

  return (
    <div
      className="w-full h-[80px] flex justify-start items-center p-4 flex-shrink-0 
                 bg-white rounded-[20px] shadow-lg"
      style={{ boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.25)' }}
    >
      <div
        className="w-[49px] h-[49px] flex justify-center items-center rounded-[10px] flex-shrink-0"
        style={{ background: COLOR_BLACK }}
      >
        <img src={PointSvg} alt="Point Icon" className="w-[28px] h-[28px]" />
      </div>

      <div className="flex flex-row ml-4 items-center flex-1 justify-between">
        <span className="heading-3 font-500 text-black">포인트</span>
        <div className="flex items-baseline">
          <span className="heading-1 font-700 text-black">{score}</span>
        </div>
      </div>
    </div>
  );
}
