// src/features/Challenge/components/PointInfoCard.jsx (전체 코드)

import React from 'react';
import Skeleton from '../../../components/Skeleton/Skeleton'; // 💡 Skeleton import 가정
// 💡 아이콘 임포트
import PointSvg from '../../../assets/icons/Point.svg';

// === 색상 정의 ===
const COLOR_BLACK = '#000000';
// const COLOR_PINK = '#FF93AC'; // jam:coin Vector 색상 (아이콘 배경)

// ------------------------------------------------------------------
// 💡 PointInfoCard Skeleton 정의
// ------------------------------------------------------------------
const PointInfoCardSkeleton = () => {
    return (
        <div 
            className="w-full h-[80px] flex justify-start items-center p-4 flex-shrink-0 
                      bg-white rounded-[20px] shadow-lg animate-pulse"
            style={{ boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.25)' }}
        >
            {/* 1. 아이콘 영역 스켈레톤 */}
            <Skeleton className="w-[49px] h-[49px] rounded-[10px] flex-shrink-0" />

            {/* 2. 텍스트 및 잔액 정보 영역 스켈레톤 */}
            <div className="flex flex-row ml-4 items-center flex-1 justify-between">
                {/* 'Point' 텍스트 스켈레톤 */}
                <Skeleton className="h-8 w-1/3 rounded" /> 

                {/* 잔액 값 스켈레톤 */}
                <Skeleton className="h-8 w-1/3 rounded" /> 
            </div>
        </div>
    );
};
// ------------------------------------------------------------------

/**
 * 포인트 잔액 정보 카드 컴포넌트
 * @param {object} props
 * @param {number|string} props.currentBalance - 현재 포인트 잔액 값 (예: 150)
 * @param {boolean} props.isLoading - 로딩 상태
 */
const PointInfoCard = ({ currentBalance, isLoading }) => { // 💡 isLoading prop 추가
    if (isLoading) {
        return <PointInfoCardSkeleton />;
    }

    return (
        // Card Container: width: 295px, height: 100px
        <div
            className="w-full h-[80px] flex justify-start items-center p-4 flex-shrink-0 
                     bg-white rounded-[20px] shadow-lg"
            style={{ boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.25)' }}
        >
            {/* 1. 아이콘 영역 (Rectangle 23942: 49px x 49px) */}
            <div
                className="w-[49px] h-[49px] flex justify-center items-center rounded-[10px] flex-shrink-0"
                style={{ background: COLOR_BLACK }}
            >
                {/* 💡 임포트된 아이콘 사용 */}
                <img src={PointSvg} alt="Point Icon" className="w-[28px] h-[28px]" />
            </div>

            {/* 2. 텍스트 및 잔액 정보 영역 */}
            <div className="flex flex-row ml-4 items-center flex-1 justify-between">
                {/* 'Point' 텍스트 */}
                <span className="heading-3 font-500 text-black">포인트</span>

                {/* 잔액 값 */}
                <div className="flex items-baseline">
                    {/* 잔액 (Heading1 - 700, 36px) */}
                    <span className="heading-1 font-700 text-black">{currentBalance}</span>
                </div>
            </div>
        </div>
    );
};

export default PointInfoCard;