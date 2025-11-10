import React from 'react';
import { useSessionStore } from '@/stores/useSessionStore';

export default function ChatControls({
  ResetIcon,
  openResetModal,
  openSubmitModal,
  isDisabled,
  sessionId,
  hasSuccessSession = false, // ✅ 전체 문제 성공 여부
}) {
  const { sessionStatus } = useSessionStore();

  // ✅ 현재 세션이 성공했거나 다른 세션 중 성공한 게 있는 경우 모두 잠금
  const isSuccess = sessionStatus === 'success' || hasSuccessSession;

  return (
    <div className="flex justify-between flex-shrink-0 gap-16">
      {/* 문제 다시 풀기 버튼 */}
      <button
        className={`flex items-center justify-center flex-1 h-[44px] rounded-lg gap-2 transition-colors
          ${isSuccess ? 'bg-gray-200 cursor-not-allowed' : 'bg-[#D9DADB] hover:bg-[#BFC0C4]'}`}
        onClick={() => {
          if (isSuccess) return; // ✅ 성공 문제는 클릭 막기
          openResetModal(); // ✅ 이제 여기서는 모달만 띄운다
        }}
        disabled={isSuccess}
      >
        <img src={ResetIcon} alt="Reset" className="w-4 h-4" />
        <span className="heading-3 font-700 text-[#515151] leading-[26px]">
          문제 다시 풀기
        </span>
      </button>

      {/* 제출하기 버튼 */}
      <button
        className={`flex-1 h-[44px] bg-[#FF6289] rounded-lg flex justify-center items-center transition-opacity ${
          isDisabled || !sessionId
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-[#e6597c]'
        }`}
        onClick={openSubmitModal}
        disabled={isDisabled || !sessionId}
      >
        <span className="heading-3 font-700 text-white leading-[26px]">
          제출하기
        </span>
      </button>
    </div>
  );
}
