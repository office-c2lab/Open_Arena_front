// src/features/Challenge/components/ApiInfoPanel.jsx

import React from 'react';
import Skeleton from '../../../components/Skeleton/Skeleton';

// === 색상 정의 ===
const API_BG_COLOR = 'rgba(131, 123, 189, 0.3)';
const API_BORDER_COLOR = '#837BBD';
const API_TEXT_COLOR = '#4C4C4C';

// ------------------------------------------------------------------
// Skeleton
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
// 메인 컴포넌트
// ------------------------------------------------------------------
export default function ApiInfoPanel({ isLoading, apiUrl, method, headerName, apiKey }) {
  if (isLoading) return <ApiInfoPanelSkeleton />;

  // 예시 Request Body
  const requestBodyExample = '{\n  "content": "대화 입력"\n}';

  return (
    <div
      className="flex flex-col items-start w-full p-[11px] gap-3 flex-shrink-0 mt-4"
      style={{
        background: API_BG_COLOR,
        border: `1px solid ${API_BORDER_COLOR}`,
        borderRadius: '10px',
      }}
    >
      <h3 className="body-large font-700 text-[#837BBD]">문제 API</h3>

      <div className="body-medium font-500 whitespace-pre-wrap" style={{ color: API_TEXT_COLOR }}>
        <p>
          <b>URL:</b> {apiUrl ?? '정보 없음'}
        </p>

        <p>
          <b>Header Name:</b> {headerName ?? '정보 없음'}
        </p>
        <p>
          <b>API Key:</b> {apiKey ?? '정보 없음'}
        </p>

        <br />

        <p className="font-600">예시 Request Body</p>
        <pre className="p-2 rounded text-sm overflow-x-auto">{requestBodyExample}</pre>
      </div>
    </div>
  );
}
