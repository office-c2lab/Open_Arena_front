// src/features/Challenge/components/PointInfoCard.jsx

import React from 'react';
import Skeleton from '../../../components/Skeleton/Skeleton';
import PointSvg from '../../../assets/icons/Point.svg';

const COLOR_BLACK = '#000000';

// 💡 PointInfoCard Skeleton: 숫자만 스켈레톤
const PointInfoCardSkeleton = () => {
  return (
    <div
      className="w-full h-[80px] flex justify-start items-center p-4 flex-shrink-0 
                 bg-white rounded-[20px] shadow-lg animate-pulse"
      style={{ boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.25)' }}
    >
      {/* 1. 아이콘 영역 (고정) */}
      <div
        className="w-[49px] h-[49px] flex justify-center items-center rounded-[10px] flex-shrink-0"
        style={{ background: COLOR_BLACK }}
      >
        <img src={PointSvg} alt="Point Icon" className="w-[28px] h-[28px]" />
      </div>

      {/* 2. 텍스트 및 잔액 정보 영역 */}
      <div className="flex flex-row ml-4 items-center flex-1 justify-between">
        {/* '포인트' 텍스트 (고정) */}
        <span className="heading-3 font-500 text-black">포인트</span>

        {/* 숫자만 스켈레톤 */}
        <Skeleton className="h-8 w-20 rounded" />
      </div>
    </div>
  );
};

const PointInfoCard = ({ currentBalance, isLoading }) => {
  if (isLoading) return <PointInfoCardSkeleton />;

  return (
    <div
      className="w-full h-[80px] flex justify-start items-center p-4 flex-shrink-0 
                 bg-white rounded-[20px] shadow-lg"
      style={{ boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.25)' }}
    >
      {/* 1. 아이콘 */}
      <div
        className="w-[49px] h-[49px] flex justify-center items-center rounded-[10px] flex-shrink-0"
        style={{ background: COLOR_BLACK }}
      >
        <img src={PointSvg} alt="Point Icon" className="w-[28px] h-[28px]" />
      </div>

      {/* 2. 텍스트 및 잔액 정보 */}
      <div className="flex flex-row ml-4 items-center flex-1 justify-between">
        {/* '포인트' 텍스트 */}
        <span className="heading-3 font-500 text-black">포인트</span>

        {/* 잔액 숫자 */}
        <div className="flex items-baseline">
          <span className="heading-1 font-700 text-black">{currentBalance}</span>
        </div>
      </div>
    </div>
  );
};

export default PointInfoCard;
