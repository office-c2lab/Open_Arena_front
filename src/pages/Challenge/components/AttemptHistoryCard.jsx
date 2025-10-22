// src/features/Challenge/components/AttemptHistoryCard.jsx (미제출 상태 추가)

import React from 'react';

// === 색상 정의 ===
const COLOR_PURPLE = '#837BBD';
const COLOR_PURPLE_LIGHT = '#7D70DA';
const COLOR_RED = '#FF4854';
const COLOR_GREEN = '#84CC16';
const COLOR_WHITE = '#FFFFFF';
const BORDER_COLOR = '#EBE8FE';

// 💡 미제출 색상 추가
const COLOR_NOT_SUBMITTED = '#D9DADB';

/**
 * 챌린지 시도 기록 카드 컴포넌트
 * @param {object} props
 * @param {number} props.attemptNumber - 시도 번호 (1, 2, 3...)
 * @param {boolean} props.isSuccess - 성공 여부 (true: 성공, false: 실패). isSubmitted가 true일 때만 유효.
 * @param {boolean} props.isSubmitted - 제출 여부 (true: 제출됨, false: 미제출).
 * @param {string} props.promptSummary - 사용자가 입력한 프롬프트 요약 텍스트
 * @param {function} props.onClick - 카드 클릭 시 실행될 핸들러
 */
const AttemptHistoryCard = ({ attemptNumber, isSuccess, isSubmitted, promptSummary, onClick }) => {
  let resultText, resultBgColor, summaryBgColor;

  if (isSubmitted) {
    // 💡 제출된 경우 (성공 또는 실패)
    resultText = isSuccess ? '성공' : '실패';
    resultBgColor = isSuccess ? COLOR_GREEN : COLOR_RED;
    summaryBgColor = COLOR_PURPLE; // 프롬프트 배경색
  } else {
    // 💡 미제출된 경우
    resultText = '미제출';
    resultBgColor = COLOR_NOT_SUBMITTED; // 결과 태그 배경색
    summaryBgColor = COLOR_NOT_SUBMITTED; // 프롬프트 배경색
  }

  // 미제출 상태일 때 프롬프트 요약 텍스트
  const summaryText = promptSummary; // Card Container: (height: 120px)

  return (
    <div
      className="w-full h-[120px] flex flex-col justify-between p-[7px] flex-shrink-0 cursor-pointer 
        bg-white rounded-[10px] border border-solid"
      onClick={onClick}
      style={{
        border: `1px solid ${BORDER_COLOR}`,
        filter: 'drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.25))',
      }}
    >
      {/* 1. 상단 영역: 시도 번호 태그와 결과 태그 (Flex Row) */}
      <div className="flex justify-between items-center flex-shrink-0 h-[36px]">
        {/* 시도 번호 태그 */}
        <div
          className="flex justify-center items-center w-[26px] h-[26px] rounded-[8px] box-border"
          style={{ border: `1px solid ${COLOR_PURPLE_LIGHT}` }}
        >
          <span
            className="font-['Noto Sans KR'] font-[350] text-[11.14px] leading-[17px]"
            style={{ color: COLOR_PURPLE_LIGHT }}
          >
            {attemptNumber}
          </span>
        </div>
        {/* 성공/실패/미제출 태그 */}
        <div
          className="flex justify-center items-center w-[65px] h-[26px] rounded-[8px]"
          style={{ background: resultBgColor }}
        >
          <span
            className={`font-['Noto Sans KR'] font-[400] text-[11.14px] leading-[17px] ${isSubmitted ? 'text-white' : 'text-[#4C4C4C]'}`}
            style={{ fontWeight: 400 }}
          >
            {resultText}
          </span>
        </div>
      </div>
      {/* 2. 하단 영역: 프롬프트 요약 및 배경 박스 (Flex Row) */}
      <div
        className="w-full h-[48px] rounded-[10px] flex items-center flex-shrink-0"
        style={{ background: summaryBgColor }}
      >
        {/* 프롬프트 요약 텍스트 */}
        <p
          className={`w-full font-['Noto Sans KR'] font-[350] text-[11.14px] leading-[17px] 
      mx-[8px] overflow-hidden ${isSubmitted ? 'text-white' : 'text-[#4C4C4C]'}`} // 💡 미제출 시 텍스트 색상 변경
          style={{
            height: '34px', // 최대 2줄을 표시하기 위한 높이
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
