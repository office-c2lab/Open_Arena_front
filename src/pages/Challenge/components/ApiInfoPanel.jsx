// src/features/Challenge/components/ApiInfoPanel.jsx (수정된 전체 코드)

import React from 'react';
import Skeleton from '../../../components/Skeleton/Skeleton'; 

// === 색상 정의 ===
const API_BG_COLOR = 'rgba(131, 123, 189, 0.3)';
const API_BORDER_COLOR = '#837BBD';
const API_TEXT_COLOR = '#4C4C4C'; 

// ------------------------------------------------------------------
// 💡 ApiInfoPanel Skeleton 정의 (유지)
// ------------------------------------------------------------------
const ApiInfoPanelSkeleton = () => {
  return (
    <div 
      className="flex flex-col items-start w-full p-[11px] gap-2 flex-shrink-0 mt-4 animate-pulse"
      style={{
        background: API_BG_COLOR,
        border: `1px solid ${API_BORDER_COLOR}`,
        borderRadius: '10px',
      }}
    >
      <Skeleton className="h-4 w-1/4 rounded mb-2" /> 
      <Skeleton className="h-4 w-3/4 rounded" />   
      <Skeleton className="h-4 w-1/2 rounded" />   
    </div>
  );
};
// ------------------------------------------------------------------

/**
* 챌린지 문제 API 정보를 표시하는 패널 컴포넌트
* @param {object} props
* @param {boolean} props.isLoading - 로딩 상태
 * @param {string} props.apiUrl - 문제 API URL (동적으로 바인딩될 값)
*/
export default function ApiInfoPanel({ isLoading, apiUrl }) { 
  if (isLoading) {
    return <ApiInfoPanelSkeleton />;
  }

    // API 호출 시 JSON 바디 예시
    const requestBodyExample = '{\n  "content": "대화 입력"\n}'; 

  return (
    <div 
      className="flex flex-col items-start w-full p-[11px] gap-1 flex-shrink-0 mt-4" 
      style={{
        background: API_BG_COLOR,
        border: `1px solid ${API_BORDER_COLOR}`,
        borderRadius: '10px',
      }}
    >
      <h3 className="body-large font-700 text-[#837BBD] mb-3">문제 API</h3>

      <p 
        className="body-large font-500 break-all whitespace-pre-wrap" 
        style={{ color: API_TEXT_COLOR }}
      >
         {apiUrl || 'API URL 정보 없음'} 
                <br />
                {requestBodyExample}
      </p>
    </div>
  );
}