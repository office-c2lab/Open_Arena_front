import React from 'react';

export default function ChatControls({
  ResetIcon,
  openResetModal,
  openSubmitModal,
  openJudgeResult,
  isDisabled,
  sessionId,
  sessionStatus,
}) {
  const normalizedSessionStatus = sessionStatus?.toLowerCase();
  const hasJudgeResult =
    normalizedSessionStatus === 'success' ||
    normalizedSessionStatus === 'fail' ||
    normalizedSessionStatus === 'failed';
  const isSubmitDisabled = !hasJudgeResult && (isDisabled || !sessionId);

  return (
    <div className="flex justify-between flex-shrink-0 gap-4 md:gap-16">
      {/* 새로운 대화 시작 버튼 — 항상 활성화! */}
      <button
        className="glass-subtle flex h-[44px] flex-1 cursor-pointer items-center justify-center gap-2 rounded-[12px] transition-all duration-200 hover:-translate-y-[1px] hover:bg-white/75"
        onClick={() => {
          openResetModal(); // 무조건 새 대화 가능
        }}
      >
        <img src={ResetIcon} alt="Reset" className="w-4 h-4" />
        <span
          className="
            font-strong text-[#515151]
            text-label sm:text-body md:text-body-lg lg:text-card-title
          "
        >
          새로운 대화 시작
        </span>
      </button>

      {/* 제출하기 버튼 */}
      <button
        className={`flex-1 h-[44px] bg-[#FF4854] rounded-[12px] flex justify-center items-center shadow-[0_3px_8px_rgba(255,72,84,0.16)] transition-all duration-200 ${
          isSubmitDisabled
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:-translate-y-[1px] hover:bg-[#FF4854]/90 hover:shadow-[0_5px_12px_rgba(255,72,84,0.18)] cursor-pointer'
        }`}
        onClick={hasJudgeResult ? openJudgeResult : openSubmitModal}
        disabled={isSubmitDisabled}
      >
        <span
          className="
            font-strong text-white
            text-label sm:text-body md:text-body-lg lg:text-card-title
          "
        >
          {hasJudgeResult ? '저지 결과 보기' : '제출하기'}
        </span>
      </button>
    </div>
  );
}
