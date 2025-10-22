// src/features/Challenge/components/AttemptHistoryCard.jsx (수정된 코드)

import React from 'react';

// === 색상 정의 ===
const COLOR_PURPLE = '#837BBD';
const COLOR_PURPLE_LIGHT = '#7D70DA';
const COLOR_RED = '#FF4854';
const COLOR_GREEN = '#84CC16';
const COLOR_WHITE = '#FFFFFF';
const BORDER_COLOR = '#EBE8FE';

/**
 * 챌린지 시도 기록 카드 컴포넌트
 * @param {object} props
 * @param {number} props.attemptNumber - 시도 번호 (1, 2, 3...)
 * @param {boolean} props.isSuccess - 성공 여부 (true: 성공, false: 실패)
 * @param {string} props.promptSummary - 사용자가 입력한 프롬프트 요약 텍스트
 * @param {function} props.onClick - 카드 클릭 시 실행될 핸들러
 */
const AttemptHistoryCard = ({ attemptNumber, isSuccess, promptSummary, onClick }) => {
  const resultText = isSuccess ? '성공' : '실패';
  const resultBgColor = isSuccess ? COLOR_GREEN : COLOR_RED;

  // 💡 수정된 부분: w-[267px] 대신 w-full을 사용하여 부모의 너비(최대 263px)에 맞춥니다.
  return (
    // Card Container: (height: 120px)
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

        {/* 성공/실패 태그 */}
        <div
          className="flex justify-center items-center w-[65px] h-[26px] rounded-[8px]"
          style={{ background: resultBgColor }}
        >
          <span
            className="font-['Noto Sans KR'] font-[400] text-[11.14px] leading-[17px] text-white"
            style={{ fontWeight: 400 }}
          >
            {resultText}
          </span>
        </div>
      </div>

      {/* 2. 하단 영역: 프롬프트 요약 및 배경 박스 (Flex Row) */}
      <div
        className="w-full h-[48px] rounded-[10px] flex items-center flex-shrink-0"
        style={{ background: COLOR_PURPLE }}
      >
        {/* 프롬프트 요약 텍스트 */}
        <p
          className="w-full font-['Noto Sans KR'] font-[350] text-[11.14px] leading-[17px] text-white
             mx-[8px] overflow-hidden" // mx-[8px]을 유지하여 좌우 여백 확보
          style={{
            height: '34px', // 최대 2줄을 표시하기 위한 높이
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            wordBreak: 'break-all',
          }}
        >
          {promptSummary}
        </p>
      </div>
    </div>
  );
};

export default AttemptHistoryCard;
