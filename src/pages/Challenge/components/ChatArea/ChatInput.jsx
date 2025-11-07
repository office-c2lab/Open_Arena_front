import React from 'react';

export default function ChatInput({ inputValue, setInputValue, handleSend, SendIcon, isDisabled }) {
  return (
    <div className="w-full h-[130px] md:h-[153px] bg-white shadow-[0_0_4px_rgba(0,0,0,0.25)] rounded-[20px] p-3 md:p-4 flex items-start relative">
      <textarea
        className="w-full h-full resize-none focus:outline-none body-large text-[#6B6B6B] pr-12 overflow-y-auto"
        placeholder={isDisabled ? '전송 중입니다...' : '프롬프트를 입력하세요 (Shift + Enter로 줄바꿈)'}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        disabled={isDisabled}
      />
      <button
        className={`flex-shrink-0 w-10 h-10 ${
          inputValue.trim() ? 'bg-[#FF6289] hover:bg-[#e6597c]' : 'bg-[#D9DADB]'
        } rounded-full flex justify-center items-center absolute right-4 bottom-4 transition-colors duration-200 ${
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
