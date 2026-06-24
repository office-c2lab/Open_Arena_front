// src/features/Challenge/components/TokenInfoCard.jsx
import React from 'react';
import TokenSvg from '../../../assets/icons/Token.svg';

import { useSessionStore } from '@/stores/useSessionStore';
import { useTokenUsage } from '@/hooks/useTokenUsage';

const TokenInfoCard = ({ problemId, teamId }) => {
  const { sessionId } = useSessionStore();

  const isReady = !!teamId && !!problemId && !!sessionId;

  // Hook은 항상 호출
  const { data, isLoading } = useTokenUsage(teamId, problemId, sessionId, {
    enabled: isReady,
  });

  // 숫자만 로딩 처리
  const usedToken = isReady ? (data?.token_used ?? 0) : null;

  return (
    <div
      className="
        w-full 
        h-[80px]          
        flex flex-col justify-center 
        p-4 flex-shrink-0
        rounded-[20px] border border-white/65 bg-white/48
        shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_6px_18px_rgba(15,23,42,0.07)]
        backdrop-blur-md
      "
    >
      <div className="flex items-center">
        {/* 아이콘 */}
        <div
          className="
            w-[49px] h-[49px] 
            flex justify-center items-center 
            rounded-[10px] flex-shrink-0 
            bg-black
          "
        >
          <img src={TokenSvg} alt="Token Icon" className="w-[28px] h-[28px]" />
        </div>

        {/* 텍스트 */}
        <div className="flex flex-row ml-4 items-center flex-1 justify-between">
          <span className="heading-3 font-500 text-black">사용한 토큰</span>

          <div className="flex items-baseline">
            {!isReady || isLoading ? (
              <span className="heading-1 font-700 text-gray-400">0</span>
            ) : (
              <span className="heading-1 font-700 text-black">{usedToken}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenInfoCard;
