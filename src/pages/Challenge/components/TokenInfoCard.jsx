// src/features/Challenge/components/TokenInfoCard.jsx
import React from 'react';

import { useSessionStore } from '@/stores/useSessionStore';
import { useTokenUsage } from '@/hooks/useTokenUsage';

const TokenInfoCard = ({ problemId, teamId, tokenUsed, compact = false }) => {
  const { sessionId } = useSessionStore();

  const hasPreviewToken = typeof tokenUsed === 'number';
  const shouldFetchToken = !!teamId && !!problemId && !!sessionId;
  const isReady = hasPreviewToken || shouldFetchToken;

  // Hook은 항상 호출
  const { data, isLoading } = useTokenUsage(teamId, problemId, sessionId, {
    enabled: shouldFetchToken,
  });

  // 숫자만 로딩 처리
  const usedToken = hasPreviewToken ? tokenUsed : isReady ? (data?.token_used ?? 0) : null;

  return (
    <div
      className={`w-full 
        ${compact ? 'h-[58px]' : 'h-[80px]'}
        flex flex-col justify-center
        ${compact ? 'p-2.5' : 'p-4'} flex-shrink-0
        glass-panel rounded-[20px]`}
    >
      <div className="flex items-center">
        <div
          className={`flex flex-row items-center flex-1 justify-between ${compact ? '' : 'ml-4'}`}
        >
          <span
            className={`${compact ? 'text-body-lg font-strong text-[#0F172A]' : 'text-card-title font-medium text-black'}`}
          >
            사용한 토큰
          </span>

          <div className="flex items-baseline">
            {!isReady || isLoading ? (
              <span
                className={`${compact ? 'text-body-lg font-strong text-[#64748B]' : 'text-page-title font-strong text-gray-400'}`}
              >
                0
              </span>
            ) : (
              <span
                className={`${compact ? 'text-body-lg font-strong text-[#0F172A]' : 'text-page-title font-strong text-black'}`}
              >
                {usedToken}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenInfoCard;
