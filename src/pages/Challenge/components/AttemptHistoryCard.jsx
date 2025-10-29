// src/features/Challenge/components/AttemptHistoryCard.jsx (전체 코드)

import React from 'react';
import Skeleton from '../../../components/Skeleton/Skeleton'; // 💡 Skeleton import 가정

// === 색상 정의 ===
const COLOR_PURPLE = '#837BBD';
const COLOR_PURPLE_LIGHT = '#7D70DA';
const COLOR_RED = '#FF4854';
const COLOR_GREEN = '#84CC16';
const COLOR_WHITE = '#FFFFFF';
const BORDER_COLOR = '#EBE8FE';

// 💡 미제출 색상 추가
const COLOR_NOT_SUBMITTED = '#D9DADB';

// ------------------------------------------------------------------
// 💡 AttemptHistoryCard Skeleton 정의 (AttemptHistoryPanel에서 사용)
// ------------------------------------------------------------------
export const AttemptHistoryCardSkeleton = () => {
    return (
        <div
            className="w-full h-[110px] flex flex-col justify-between p-[5px] flex-shrink-0 
            bg-white rounded-[10px] border border-solid animate-pulse"
            style={{ 
                border: `1px solid ${BORDER_COLOR}`,
                filter: 'drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.25))',
            }}
        >
            {/* 1. 상단 영역: 시도 번호 태그와 결과 태그 스켈레톤 */}
            <div className="flex justify-between items-center flex-shrink-0 h-[36px]">
                {/* 시도 번호 태그 스켈레톤 */}
                <Skeleton className="w-[26px] h-[26px] rounded-[8px]" />
                {/* 결과 태그 스켈레톤 */}
                <Skeleton className="w-[65px] h-[26px] rounded-[8px]" />
            </div>
            {/* 2. 하단 영역: 프롬프트 요약 스켈레톤 */}
            <div
                className="w-full h-[58px] rounded-[10px] flex items-center flex-shrink-0"
                style={{ background: '#EBE8FE' }} // 배경색만 설정
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
 * @param {boolean} props.isLoading - 로딩 상태 (내부 처리용)
 * // ... (나머지 props 유지)
 */
const AttemptHistoryCard = ({ attemptNumber, isSuccess, isSubmitted, promptSummary, onClick, isLoading }) => {
    
    // 이 컴포넌트에서는 내부 처리 대신 부모(AttemptHistoryPanel)에서 스켈레톤 렌더링을 제어합니다.
    // 따라서 isLoading prop은 false로 넘어오거나 무시됩니다.
    
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
    const summaryText = promptSummary; 

    return (
        <div
            className="w-full h-[110px] flex flex-col justify-between p-[5px] flex-shrink-0 cursor-pointer 
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
                    <span className="body-small" style={{ color: COLOR_PURPLE_LIGHT }}>
                        {attemptNumber}
                    </span>
                </div>
                {/* 성공/실패/미제출 태그 */}
                <div
                    className="flex justify-center items-center w-[65px] h-[26px] rounded-[8px]"
                    style={{ background: resultBgColor }}
                >
                    <span className={`body-small ${isSubmitted ? 'text-white' : 'text-[#4C4C4C]'}`}>
                        {resultText}
                    </span>
                </div>
            </div>
            {/* 2. 하단 영역: 프롬프트 요약 및 배경 박스 (Flex Row) */}
            <div
                className="w-full h-[58px] rounded-[10px] flex items-center flex-shrink-0"
                style={{ background: summaryBgColor }}
            >
                {/* 프롬프트 요약 텍스트 */}
                <p
                    className={`w-full body-medium font-300 
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