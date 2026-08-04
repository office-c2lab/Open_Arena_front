import React from 'react';

export default function ChatInput({
  inputValue,
  setInputValue,
  handleSend,
  SendIcon,
  isDisabled,
  disabledPlaceholder,
  sessionStatus,
  compact = false,
}) {
  // 상태 정규화
  const normalizedStatus = sessionStatus?.toLowerCase();

  // ❗ 전체 성공 여부를 제거 — 현재 세션 상태만 체크
  const isSessionClosed = normalizedStatus === 'success' || normalizedStatus === 'fail';

  if (isSessionClosed) {
    const isSuccess = normalizedStatus === 'success';

    return (
      <div
        className={`glass-subtle flex w-full flex-col items-center justify-center rounded-[20px] px-4 text-center ${
          compact ? 'h-[82px]' : 'h-[120px] md:h-[133px]'
        }`}
      >
        <p className="text-gray-600 text-body md:text-body-lg">
          {isSuccess ? (
            <>
              이 대화는 이미 <b className="text-green-600">성공</b>하여 더 이상 대화를 이어갈 수
              없습니다.
            </>
          ) : (
            <>
              이 대화는 이미 <b className="text-red-500">실패</b>하여 더 이상 대화를 이어갈 수
              없습니다.
            </>
          )}
        </p>

        {isSuccess ? (
          <p className="text-gray-600 text-label md:text-body mt-2">
            하단의 <b>‘새로운 대화 시작’</b> 버튼을 클릭하여 새로 시도할 수 있습니다.
          </p>
        ) : (
          <p className="text-gray-600 text-label md:text-body mt-2">
            하단의 <b>‘새로운 대화 시작’</b> 버튼을 클릭하여 새로 시도할 수 있습니다.
          </p>
        )}
      </div>
    );
  }

  // 기본 입력창
  return (
    <div
      className={`glass-subtle relative flex w-full items-start rounded-[20px] ${
        compact ? 'h-[76px] p-3' : 'h-[120px] p-3 md:h-[133px] md:p-4'
      }`}
    >
      <textarea
        className={`no-scrollbar h-full w-full resize-none overflow-y-auto bg-transparent text-[#0F172A] placeholder:text-[#8A93A5] focus:outline-none ${
          compact ? 'pr-10 text-body' : 'text-body-lg pr-12'
        }`}
        placeholder={
          isDisabled
            ? disabledPlaceholder || '전송 중입니다...'
            : '프롬프트를 입력하세요 (Shift + Enter로 줄바꿈)'
        }
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        disabled={isDisabled}
      />

      <button
        className={`flex-shrink-0 ${compact ? 'h-8 w-8' : 'h-10 w-10'} ${
          inputValue.trim()
            ? 'bg-[#FF4854] hover:bg-[#FF4854]/90 cursor-pointer shadow-[0_3px_8px_rgba(255,72,84,0.16)]'
            : 'bg-[#D9DADB]'
        } rounded-full flex justify-center items-center absolute ${compact ? 'bottom-3 right-3' : 'bottom-4 right-4'} transition-all duration-200 ${
          isDisabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={!inputValue.trim() || isDisabled}
        onClick={handleSend}
      >
        <img src={SendIcon} alt="Send" className={compact ? 'h-4 w-4' : 'h-5 w-5'} />
      </button>
    </div>
  );
}
