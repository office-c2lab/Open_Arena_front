import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSessionStore } from '@/stores/useSessionStore';

export default function ChatControls({
  ResetIcon,
  openResetModal,
  openSubmitModal,
  isDisabled,
  sessionId,
}) {
  const queryClient = useQueryClient();
  const { clearSession, sessionStatus } = useSessionStore(); // ✅ 상태 가져오기

  // ✅ 성공한 문제는 다시 풀기 금지
  const isSuccess = sessionStatus === 'success';

  return (
    <div className="flex justify-between flex-shrink-0 gap-16">
      {/* 문제 다시 풀기 버튼 */}
      <button
        className={`flex items-center justify-center flex-1 h-[44px] rounded-lg gap-2 transition-colors
          ${isSuccess ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#D9DADB] hover:bg-[#BFC0C4]'}`}
        onClick={() => {
          if (isSuccess) return; // 성공 문제는 클릭 막기
          clearSession();
          queryClient.removeQueries({ queryKey: ['chatMessages'] });
          queryClient.invalidateQueries(['problemBundle']);
          openResetModal();
        }}
        disabled={isSuccess}
      >
        <img src={ResetIcon} alt="Reset" className="w-4 h-4" />
        <span className="heading-3 font-700 text-[#515151] leading-[26px]">문제 다시 풀기</span>
      </button>

      {/* 제출하기 버튼 */}
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
