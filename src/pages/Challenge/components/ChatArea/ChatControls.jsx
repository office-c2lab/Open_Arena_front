import React from 'react';
import { useQueryClient } from '@tanstack/react-query';

export default function ChatControls({
  ResetIcon,
  openResetModal,
  openSubmitModal,
  clearSession,
  isDisabled,
  sessionId,
}) {
  const queryClient = useQueryClient(); // <- 여기서 가져오기

  return (
    <div className="flex justify-between flex-shrink-0 gap-16">
      <button
        className={`flex items-center justify-center flex-1 h-[44px] bg-[#D9DADB] rounded-lg gap-2 transition-opacity ${
          isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#BFC0C4]'
        }`}
        onClick={() => {
          clearSession();
          queryClient.removeQueries({ queryKey: ['chatMessages'] }); // 정상 동작
          openResetModal();
        }}
        disabled={isDisabled}
      >
        <img src={ResetIcon} alt="Reset" className="w-4 h-4" />
        <span className="heading-3 font-700 text-[#515151] leading-[26px]">대화 내용 초기화</span>
      </button>

      <button
        className={`flex-1 h-[44px] bg-[#FF6289] rounded-lg flex justify-center items-center transition-opacity ${
          isDisabled || !sessionId ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#e6597c]'
        }`}
        onClick={openSubmitModal}
        disabled={isDisabled || !sessionId}
      >
        <span className="heading-3 font-700 text-white leading-[26px]">제출하기</span>
      </button>
    </div>
  );
}
