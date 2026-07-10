// src/features/Challenge/components/ApiInfoPanel.jsx

import React from 'react';
import Skeleton from '../../../components/Skeleton/Skeleton';

// ------------------------------------------------------------------
// Skeleton
// ------------------------------------------------------------------
const ApiInfoPanelSkeleton = () => {
  return (
    <div className="flex flex-col items-start w-full p-4 gap-2 flex-shrink-0 animate-pulse rounded-[18px] border border-white/65 bg-white/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_4px_12px_rgba(15,23,42,0.05)] backdrop-blur-md">
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
  "problem_id": "${problemCode ?? '문제코드 없음'}",
  "content": "안녕하세요"
}`;

  return (
    <div className="flex flex-col items-start w-full p-4 gap-3 flex-shrink-0 rounded-[18px] border border-white/65 bg-white/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_4px_12px_rgba(15,23,42,0.05)] backdrop-blur-md">
      <h3 className="body-large font-700 text-[#837BBD]">문제 API</h3>

      <div className="body-medium font-500 whitespace-pre-wrap text-[#0F172A]">
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

        <p className="font-600 font-bold">Request Body (예시)</p>

        <pre className="mt-1 rounded-[12px] border border-white/65 bg-white/45 p-3 text-sm overflow-x-auto font-bold">
          {requestBodyExample}
        </pre>
      </div>
    </div>
  );
}
