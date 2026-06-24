// src/features/Challenge/components/AttemptHistoryCard.jsx (세션 활성화 상태 반영)

import React from 'react';
import Skeleton from '../../../components/Skeleton/Skeleton';

// === 색상 정의 ===
const COLOR_PURPLE = '#837BBD';
const COLOR_PURPLE_LIGHT = '#7D70DA';
const COLOR_RED = '#FF4854';
const COLOR_GREEN = '#84CC16';
const COLOR_WHITE = '#FFFFFF';
const COLOR_NOT_SUBMITTED = '#D9DADB';

// ------------------------------------------------------------------
// 💡 AttemptHistoryCard Skeleton 정의
// ------------------------------------------------------------------
export const AttemptHistoryCardSkeleton = () => {
  return (
    <div
      className="w-full h-[110px] flex flex-col justify-between p-[10px] flex-shrink-0 
            bg-white/55 rounded-[18px] border border-white/65 animate-pulse backdrop-blur-md"
      style={{
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7), 0 4px 12px rgba(15,23,42,0.06)',
      }}
    >
      {/* 1. 상단 영역: 시도 번호 태그와 결과 태그 스켈레톤 */}
      <div className="flex justify-between items-center flex-shrink-0 h-[32px]">
        {/* 시도 번호 태그 스켈레톤 */}
        <Skeleton className="w-[32px] h-[32px] rounded-[10px]" />
        {/* 결과 태그 스켈레톤 */}
        <Skeleton className="w-[72px] h-[28px] rounded-full" />
      </div>
      {/* 2. 하단 영역: 프롬프트 요약 스켈레톤 */}
      <div
        className="w-full h-[48px] rounded-[14px] flex items-center flex-shrink-0 bg-white/35"
      >
        {/* 텍스트 줄 스켈레톤 */}
        <div className="w-full mx-[8px] space-y-2">
          <Skeleton className="h-3 w-11/12 rounded" />
          <Skeleton className="h-3 w-3/4 rounded" />
        </div>
      </div>
    </div>
  );
};
// ------------------------------------------------------------------

/**
 * 챌린지 시도 기록 카드 컴포넌트
 * @param {boolean} props.isActive - 현재 활성화된 세션인지 여부
 * @param {number} props.attemptNumber - 시도 번호
 * @param {boolean} props.isSuccess - 성공 여부 (임시)
 * @param {boolean} props.isSubmitted - 제출 여부 (임시)
 * @param {string} props.promptSummary - 프롬프트 요약
 * @param {function} props.onClick - 클릭 핸들러
 */
const AttemptHistoryCard = ({
  attemptNumber,
  isSuccess,
  isSubmitted,
  promptSummary,
  onClick,
  isActive,
}) => {
  let resultText, resultBgColor, summaryBgColor;

  if (isSubmitted) {
    // 제출된 경우 (성공 또는 실패)
    resultText = isSuccess ? '성공' : '실패';
    resultBgColor = isSuccess ? COLOR_GREEN : COLOR_RED;
    summaryBgColor = 'transparent';
  } else {
    // 미제출된 경우
    resultText = '미제출';
    resultBgColor = COLOR_NOT_SUBMITTED;
    summaryBgColor = 'transparent';
  }

  const summaryText = promptSummary;

  return (
    <div
      className={`group w-full h-[110px] flex flex-col justify-between p-[10px] flex-shrink-0 cursor-pointer 
            bg-white/50 rounded-[18px] border border-white/70 backdrop-blur-md transition-all duration-200 hover:-translate-y-[1px] hover:border-white/90 hover:bg-white/64 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_10px_22px_rgba(15,23,42,0.11)] ${
              isActive ? 'ring-2 ring-offset-2 ring-purple-500' : ''
            }`}
      onClick={onClick}
      style={{
        borderColor: isActive ? COLOR_PURPLE_LIGHT : 'rgba(255,255,255,0.65)',
        boxShadow:
          'inset 0 1px 0 rgba(255,255,255,0.82), inset 0 0 18px rgba(131,123,189,0.12), 0 8px 22px rgba(15,23,42,0.08)',
      }}
    >
      {/* 1. 상단 영역: 시도 번호 태그와 결과 태그 (Flex Row) */}
      <div className="flex justify-between items-center flex-shrink-0 h-[32px]">
        {/* 시도 번호 태그 */}
        <div
          className="flex justify-center items-center w-[32px] h-[32px] rounded-[10px] box-border bg-white/45 backdrop-blur-md transition-all duration-200 group-hover:bg-white/65"
          style={{
            border: `1.5px solid ${COLOR_PURPLE_LIGHT}`,
            backgroundColor: isActive ? COLOR_PURPLE_LIGHT : 'transparent',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7), 0 4px 12px rgba(131,123,189,0.18)',
          }}
        >
          <span
            className="heading-3 font-700"
            style={{ color: isActive ? COLOR_WHITE : COLOR_PURPLE_LIGHT }}
          >
            {attemptNumber}
          </span>
        </div>
        {/* 성공/실패/미제출 태그 */}
        <div
          className="flex justify-center items-center min-w-[72px] h-[28px] rounded-full px-4 transition-transform duration-200 group-hover:scale-[1.03]"
          style={{
            background: resultBgColor,
            boxShadow: isSubmitted
              ? `0 8px 18px ${isSuccess ? 'rgba(132,204,22,0.25)' : 'rgba(255,72,84,0.28)'}, inset 0 1px 0 rgba(255,255,255,0.35)`
              : 'inset 0 1px 0 rgba(255,255,255,0.35)',
          }}
        >
          <span className={`body-medium font-700 ${isSubmitted ? 'text-white' : 'text-[#4C4C4C]'}`}>
            {resultText}
          </span>
        </div>
      </div>
      {/* 2. 하단 영역: 프롬프트 요약 및 배경 박스 (Flex Row) */}
      <div
        className="w-full flex flex-1 items-center flex-shrink-0 pt-2"
        style={{ background: summaryBgColor }}
      >
        {/* 프롬프트 요약 텍스트 */}
        <p
          className="w-full body-large font-500 overflow-hidden text-[#0F172A]"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            wordBreak: 'break-all',
          }}
        >
          {summaryText}
        </p>
      </div>
    </div>
  );
};

export default AttemptHistoryCard;
