import React from 'react';

export default function ChatInput({
  inputValue,
  setInputValue,
  handleSend,
  SendIcon,
  isDisabled,
  sessionStatus,
}) {
  // 상태 정규화
  const normalizedStatus = sessionStatus?.toLowerCase();

  // ❗ 전체 성공 여부를 제거 — 현재 세션 상태만 체크
  const isSessionClosed = normalizedStatus === 'success' || normalizedStatus === 'fail';

  if (isSessionClosed) {
    const isSuccess = normalizedStatus === 'success';

    return (
      <div className="w-full h-[130px] md:h-[153px] rounded-[20px] border border-white/65 bg-white/52 shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_4px_14px_rgba(15,23,42,0.06)] backdrop-blur-md flex flex-col items-center justify-center px-4 text-center">
        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
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
          <p className="text-gray-600 text-xs md:text-sm mt-2">
            하단의 <b>‘문제 다시 풀기’</b> 버튼을 클릭하여 새로 시도할 수 있습니다.
          </p>
        ) : (
          <p className="text-gray-600 text-xs md:text-sm mt-2">
            하단의 <b>‘문제 다시 풀기’</b> 버튼을 클릭하여 새로 시도할 수 있습니다.
          </p>
        )}
      </div>
    );
  }

  // 기본 입력창
  return (
    <div className="w-full h-[130px] md:h-[153px] rounded-[20px] border border-white/65 bg-white/52 shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_4px_14px_rgba(15,23,42,0.06)] backdrop-blur-md p-3 md:p-4 flex items-start relative">
      <textarea
        className="w-full h-full resize-none bg-transparent focus:outline-none body-large text-[#0F172A] placeholder:text-[#8A93A5] pr-12 overflow-y-auto"
        placeholder={
          isDisabled ? '전송 중입니다...' : '프롬프트를 입력하세요 (Shift + Enter로 줄바꿈)'
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
        className={`flex-shrink-0 w-10 h-10 ${
          inputValue.trim()
            ? 'bg-[#FF4854] hover:bg-[#FF4854]/90 cursor-pointer shadow-[0_8px_18px_rgba(255,72,84,0.18)]'
            : 'bg-[#D9DADB]'
        } rounded-full flex justify-center items-center absolute right-4 bottom-4 transition-all duration-200 ${
          isDisabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={!inputValue.trim() || isDisabled}
        onClick={handleSend}
      >
        <img src={SendIcon} alt="Send" className="w-5 h-5" />
      </button>
    </div>
  );
}
