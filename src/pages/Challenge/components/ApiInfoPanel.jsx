// src/features/Challenge/components/ApiInfoPanel.jsx (최종 수정 버전: break-all 적용)

import React from 'react';

// === 색상 정의 (명세에서 추출) ===
const API_BG_COLOR = 'rgba(131, 123, 189, 0.3)';
const API_BORDER_COLOR = '#837BBD';
const API_TEXT_COLOR = '#4C4C4C'; // 본문 색상

/**
 * 챌린지 문제 API 정보를 표시하는 패널 컴포넌트 (Frame 2087327782)
 * 💡 탭 내용 영역 안에 위치하도록 w-full 및 외부 마진 제거
 */
export default function ApiInfoPanel() {
  return (
    <div // flex-direction: column, padding: 11px 13px
      className="flex flex-col items-start w-full p-[11px] gap-1 flex-shrink-0 mt-4" // mt-4로 위쪽 여백 추가
      style={{
        background: API_BG_COLOR,
        border: `1px solid ${API_BORDER_COLOR}`,
        borderRadius: '10px',
      }}
    >
      {/* 💡 제목 (문제 API) */}
      <h3 className="body-large font-700 text-[#837BBD] mb-3">문제 API</h3>

      <p // Body Large - 500
        // 💡 break-words 대신 break-all을 사용하여 긴 URL도 강제로 줄 바꿈합니다.
        className="body-large font-500 break-all"
        style={{ color: API_TEXT_COLOR }}
      >
        http://12.165.144:14434/m001/api/chat <br />
        &#123; content: "대화 입력" &#125;
      </p>
    </div>
  );
}
