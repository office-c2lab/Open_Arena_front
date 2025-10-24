// src/features/Challenge/components/TokenInfoCard.jsx (Tailwind 클래스 bg-black 적용 버전)

import React from 'react';
import TokenSvg from '../../../assets/icons/Token.svg';

// === 색상 정의 ===
// 💡 COLOR_BLACK을 Tailwind 클래스로 대체하므로 제거
const COLOR_YELLOW = '#FDCA40'; // Progress Bar 채움 색상 및 아이콘 배경 (Tailwind 미등록 가정)

/**
 * 토큰 잔액 정보 카드 컴포넌트 (토큰 비율 Progress Bar 적용)
 * @param {object} props
 * @param {number|string} props.currentBalance - 현재 토큰 잔액 값 (예: 80)
 * @param {number|string} props.maxValue - 토큰 최대치 (예: 100)
 */
const TokenInfoCard = ({ currentBalance, maxValue }) => {
  // Progress Bar 비율 계산 (0 ~ 100%)
  const ratio = (currentBalance / maxValue) * 100;

  return (
    // Card Container: w: 295px, h: 100px.
    <div
      className="w-[295px] h-[100px] flex flex-col justify-between pt-4 pb-0 flex-shrink-0 
                 bg-white rounded-[20px] shadow-lg overflow-hidden"
      style={{ boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.25)' }}
    >
      {/* 1. 상단 섹션 (아이콘 + 텍스트 전체 영역) */}
      <div className="flex justify-start items-center px-4 flex-shrink-0">
        {/* 아이콘 영역 (49px x 49px) */}
        <div
          className="w-[49px] h-[49px] flex justify-center items-center rounded-[10px] flex-shrink-0 bg-black" // 💡 bg-black Tailwind 클래스 사용
        >
          {/* 아이콘 이미지 (원형 배경 추가) */}

          <img src={TokenSvg} alt="Token Icon" className="w-[22px] h-[26px]" />
        </div>

        {/* 2. 텍스트 정보 및 잔액 영역 (아이콘 옆 전체 공간) */}
        <div className="flex flex-col ml-4 justify-center flex-1 h-full">
          {/* '토큰' 텍스트와 '잔액 값'을 가로로 묶고 justify-between 적용 */}
          <div className="flex flex-row justify-between items-center flex-1">
            {/* 'Token' 텍스트 (왼쪽 끝) */}
            <span
              className="font-['Noto Sans KR'] font-[350] text-[16px] leading-[24px] text-black"
              style={{ fontWeight: 350 }}
            >
              토큰
            </span>

            {/* 잔액 값 (currentBalance / maxValue) (오른쪽 끝) */}
            <div className="flex items-baseline">
              {/* 잔액 숫자 크기 (28px) */}
              <span
                className="font-['Noto Sans KR'] font-bold text-[28px] leading-[36px] text-black" // 💡 text-black Tailwind 클래스 사용
                style={{ fontWeight: 700 }}
              >
                {currentBalance}
              </span>
              {/* 슬래시와 최대값 표시 */}
              <span
                className="font-['Roboto'] font-[500] text-[12px] leading-[16px] ml-1 mb-1 text-black" // 💡 text-black Tailwind 클래스 사용
                style={{ fontWeight: 500, letterSpacing: '0.4px' }}
              >
                /{maxValue}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 하단 섹션: Progress Bar (토큰 진행 막대) */}
      <div
        className="w-full h-2 mt-2 bg-black" // 💡 배경을 bg-black Tailwind 클래스로 변경
      >
        <div
          className="h-full rounded-r-full"
          style={{
            width: `${ratio}%`,
            background: COLOR_YELLOW, // 커스텀 색상은 인라인 스타일 유지
            transition: 'width 0.5s ease-in-out',
          }}
        />
      </div>
    </div>
  );
};

export default TokenInfoCard;
