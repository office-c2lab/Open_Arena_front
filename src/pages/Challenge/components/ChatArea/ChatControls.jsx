import React from 'react';

export default function ChatControls({
  ResetIcon,
  openResetModal,
  openSubmitModal,
  isDisabled,
  sessionId,
}) {
  return (
    <div className="flex justify-between flex-shrink-0 gap-4 md:gap-16">
      {/* 새로운 대화 시작 버튼 — 항상 활성화! */}
      <button
        className="flex items-center justify-center flex-1 h-[44px] rounded-[12px] gap-2 border border-white/65 bg-white/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_4px_12px_rgba(15,23,42,0.06)] backdrop-blur-md transition-all duration-200 hover:-translate-y-[1px] hover:bg-white/66 cursor-pointer"
        onClick={() => {
          openResetModal(); // 무조건 새 대화 가능
        }}
      >
        <img src={ResetIcon} alt="Reset" className="w-4 h-4" />
        <span
          className="
            font-700 text-[#515151] leading-[26px]
            text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px]
          "
        >
          새로운 대화 시작
        </span>
      </button>

      {/* 제출하기 버튼 */}
      <button
        className={`flex-1 h-[44px] bg-[#FF4854] rounded-[12px] flex justify-center items-center shadow-[0_8px_18px_rgba(255,72,84,0.18)] transition-all duration-200 ${
          isDisabled || !sessionId
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:-translate-y-[1px] hover:bg-[#FF4854]/90 hover:shadow-[0_10px_22px_rgba(255,72,84,0.22)] cursor-pointer'
        }`}
        onClick={openSubmitModal}
        disabled={isDisabled || !sessionId}
      >
        <span
          className="
            font-700 text-white leading-[26px]
            text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px]
          "
        >
          제출하기
        </span>
      </button>
    </div>
  );
}
