// src/features/Challenge/components/ApiInfoPanel.jsx

import React from 'react';
import Skeleton from '../../../components/Skeleton/Skeleton';

// ------------------------------------------------------------------
// Skeleton
// ------------------------------------------------------------------
const ApiInfoPanelSkeleton = () => {
  return (
    <div className="glass-subtle flex w-full flex-shrink-0 animate-pulse flex-col items-start gap-2 rounded-[18px] p-4">
      <Skeleton className="h-4 w-1/4 rounded mb-2" />
      <Skeleton className="h-4 w-3/4 rounded" />
      <Skeleton className="h-4 w-1/2 rounded" />
    </div>
  );
};

// ------------------------------------------------------------------
// 메인 컴포넌트
// ------------------------------------------------------------------
export default function ApiInfoPanel({
  isLoading,
  apiUrl,
  method,
  headerName,
  apiKey,
  problemCode, // ⭐ 추가된 props
}) {
  if (isLoading) return <ApiInfoPanelSkeleton />;

  const requestBodyExample = `{
  "problem_id": "${problemCode ?? '챌린지 코드 없음'}",
  "content": "안녕하세요"
}`;

  return (
    <div className="glass-subtle flex w-full flex-shrink-0 flex-col items-start gap-3 rounded-[18px] p-4">
      <h3 className="text-body-lg font-strong text-[#837BBD]">챌린지 API</h3>

      <div className="text-body font-medium whitespace-pre-wrap text-[#0F172A]">
        <p>
          <b>URL:</b> {apiUrl ?? '정보 없음'}
        </p>
        <p>
          <b>Method:</b> {method ?? '정보 없음'}
        </p>
        <p>
          <b>Headers:</b> {headerName ?? '정보 없음'}
        </p>
        <p>
          <b>API Key:</b> {apiKey ?? '정보 없음'}
        </p>

        <p className="font-bold">Request Body (예시)</p>

        <pre className="surface-solid no-scrollbar mt-1 overflow-x-auto rounded-[12px] p-3 text-body font-bold">
          {requestBodyExample}
        </pre>
      </div>
    </div>
  );
}
