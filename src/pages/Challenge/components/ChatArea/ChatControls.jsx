import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSessionStore } from '@/stores/useSessionStore'; // ✅ 상태 가져오기

export default function ChatControls({
  ResetIcon,
  openResetModal,
  openSubmitModal,
  clearSession,
  isDisabled,
  sessionId,
}) {
  const queryClient = useQueryClient();
  const { sessionStatus } = useSessionStore(); // ✅ 세션 상태 가져오기

  // ✅ 성공한 세션은 문제 다시 풀기 비활성화
  const isResetDisabled = sessionStatus === 'success';

  return (
    <div className="flex justify-between flex-shrink-0 gap-16">
      {/* ✅ 문제 다시 풀기 */}
      <button
        className={`flex items-center justify-center flex-1 h-[44px] rounded-lg gap-2 transition-colors ${
          isResetDisabled
            ? 'bg-[#E5E5E5] text-[#A0A0A0] cursor-not-allowed'
            : 'bg-[#D9DADB] hover:bg-[#BFC0C4]'
        }`}
        onClick={() => {
          if (isResetDisabled) return; // ✅ 성공 세션이면 클릭 방지
          clearSession();
          queryClient.removeQueries({ queryKey: ['chatMessages'] });
          openResetModal();
        }}
        disabled={isResetDisabled}
      >
        <img
          src={ResetIcon}
          alt="Reset"
          className={`w-4 h-4 ${isResetDisabled ? 'opacity-40' : ''}`}
        />
        <span className="heading-3 font-700 leading-[26px]">
          {isResetDisabled ? '다시 풀기 불가' : '문제 다시 풀기'}
        </span>
      </button>

      {/* ✅ 제출하기 버튼 */}
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
