// src/features/Challenge/components/PointInfoCard.jsx (justify-between 적용 수정 버전)

import React from 'react';
// 💡 아이콘 임포트
import PointSvg from '../../../assets/icons/Point.svg';

// === 색상 정의 ===
const COLOR_BLACK = '#000000';
const COLOR_PINK = '#FF93AC'; // jam:coin Vector 색상 (아이콘 배경)

/**
 * 포인트 잔액 정보 카드 컴포넌트
 * (피그마 Rectangle 23938 기반)
 * @param {object} props
 * @param {number|string} props.currentBalance - 현재 포인트 잔액 값 (예: 150)
 */
const PointInfoCard = ({ currentBalance }) => {
  return (
    // Card Container: width: 295px, height: 100px
    <div
      className="w-[295px] h-[100px] flex justify-start items-center p-4 flex-shrink-0 
                 bg-white rounded-[20px] shadow-lg"
      style={{ boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.25)' }}
    >
      {/* 1. 아이콘 영역 (Rectangle 23942: 49px x 49px) */}
      <div
        className="w-[49px] h-[49px] flex justify-center items-center rounded-[10px] flex-shrink-0"
        style={{ background: COLOR_BLACK }}
      >
        {/* 아이콘 이미지 (jam:coin Vector 색상 적용 - 원형 배경 추가) */}

        {/* 💡 임포트된 아이콘 사용 */}
        <img src={PointSvg} alt="Point Icon" className="w-[28px] h-[28px]" />
      </div>

      {/* 2. 텍스트 및 잔액 정보 영역 */}
      {/* 💡 flex-row와 justify-between을 적용하여 남은 공간을 모두 분리 간격으로 사용 */}
      <div className="flex flex-row ml-4 items-center flex-1 justify-between">
        {/* 'Point' 텍스트 */}
        {/* 💡 mr-16 같은 간격 클래스 제거 */}
        <span
          className="font-['Noto Sans KR'] font-[350] text-[16px] leading-[24px] text-black"
          style={{ fontWeight: 350 }}
        >
          포인트
        </span>

        {/* 잔액 값 */}
        <div className="flex items-baseline">
          {/* 잔액 (Heading1 - 700, 36px) */}
          <span
            className="font-['Noto Sans KR'] font-bold text-[36px] leading-[44px]"
            style={{ color: COLOR_BLACK, fontWeight: 700 }}
          >
            {currentBalance}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PointInfoCard;
