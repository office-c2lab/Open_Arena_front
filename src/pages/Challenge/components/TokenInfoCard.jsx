// src/features/Challenge/components/TokenInfoCard.jsx
import React from 'react';
import TokenSvg from '../../../assets/icons/Token.svg';

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
        rounded-[20px] border border-white/65 bg-white/48
        shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_6px_18px_rgba(15,23,42,0.07)]
        backdrop-blur-md`}
    >
      <div className="flex items-center">       
        <div className={`flex flex-row items-center flex-1 justify-between ${compact ? '' : 'ml-4'}`}>
          <span
            className={`${compact ? 'body-large font-700 text-[#0F172A]' : 'heading-3 font-500 text-black'}`}
          >
            사용한 토큰
          </span>

          <div className="flex items-baseline">
            {!isReady || isLoading ? (
              <span
                className={`${compact ? 'body-large font-700 text-[#64748B]' : 'heading-1 font-700 text-gray-400'}`}
              >
                0
              </span>
            ) : (
              <span
                className={`${compact ? 'body-large font-700 text-[#0F172A]' : 'heading-1 font-700 text-black'}`}
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
