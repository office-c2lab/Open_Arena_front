// src/features/Challenge/components/ChatArea.jsx
import React, { useState, useEffect, useRef } from 'react';
import ChatBubble from './ChatBubble';
import useModalStore from '@/stores/useModalStore';

export default function ChatArea({ ArenaIcon, SendIcon, ResetIcon, inputDisabled, problemId }) {
  const { openResetModal, openSubmitModal } = useModalStore();
  const [inputValue, setInputValue] = useState('');
  const [localMessages, setLocalMessages] = useState([]);
  const chatEndRef = useRef(null);

  const sendButtonColorClass = inputValue.trim()
    ? 'bg-[#FF6289] cursor-pointer hover:bg-[#e6597c]'
    : 'bg-[#D9DADB]';
  const flexibleIconClasses = 'max-w-[246px] max-h-[361px] w-[40vw] h-[40vh] object-contain';

  // 🔹 메시지 전송 (UI용)
  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    console.log(problemId);
    const userMessage = {
      id: `temp-user-${Date.now()}`,
      role: 'user',
      content: trimmed,
    };

    const aiLoadingMessage = {
      id: `temp-ai-${Date.now()}`,
      role: 'assistant',
      content: 'AI가 응답을 생성 중입니다...',
      isTyping: true,
    };

    setLocalMessages((prev) => [...prev, userMessage, aiLoadingMessage]);
    setInputValue('');

    // 🔹 서버 전송 대신 1.5초 후 AI 응답 예시 추가
    setTimeout(() => {
      setLocalMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiLoadingMessage.id
            ? { ...msg, content: 'AI 응답이 여기에 표시됩니다.', isTyping: false }
            : msg
        )
      );
    }, 1500);
  };

  // 🔹 자동 스크롤
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [localMessages]);

  return (
    <div className="flex flex-col flex-grow h-full">
      <div className="flex-1 bg-white shadow-xl rounded-[20px] flex flex-col overflow-hidden h-full">
        {/* Chat Display Area */}
        <div className="flex-1 p-6 relative overflow-hidden">
          {localMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <img src={ArenaIcon} alt="ARENA Logo" className={`${flexibleIconClasses} mb-4`} />
              <p className="heading-3 font-300 text-[#000000] mt-4">
                AI와 대화를 시작하세요. <br /> 프롬프트를 입력하여 챌린지를 시작하세요.
              </p>
            </div>
          ) : (
            <>
              <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                <img
                  src={ArenaIcon}
                  alt="ARENA Logo"
                  className={`${flexibleIconClasses} opacity-30`}
                />
              </div>
              <div className="relative z-10 pt-4 h-full overflow-y-auto">
                {localMessages.map((msg) => (
                  <ChatBubble
                    key={msg.id}
                    role={msg.role}
                    content={msg.content}
                    isTyping={msg.isTyping || false}
                  />
                ))}
                <div ref={chatEndRef} />
              </div>
            </>
          )}
        </div>

        {/* Input & Action Area */}
        <div className="h-[210px] md:h-[237px] p-4 md:p-6 bg-purple-50/20 shadow-[0px_-3px_10px_rgba(0,0,0,0.25)] rounded-b-[20px] flex flex-col justify-end gap-3 flex-shrink-0">
          <div className="w-full h-[130px] md:h-[153px] bg-white shadow-[0px_0px_4px_rgba(0,0,0,0.25)] rounded-[20px] p-3 md:p-4 flex items-start relative">
            <textarea
              className="w-full h-full resize-none focus:outline-none body-large text-[#6B6B6B] pr-12 overflow-y-auto"
              placeholder="프롬프트를 입력하세요 (Shift + Enter로 줄바꿈)"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={inputDisabled}
            />
            <button
              className={`flex-shrink-0 w-10 h-10 ${sendButtonColorClass} rounded-full flex justify-center items-center absolute right-4 bottom-4 transition-colors duration-200 ${
                inputDisabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={!inputValue.trim() || inputDisabled}
              onClick={handleSend}
            >
              <img src={SendIcon} alt="Send" className="w-5 h-5" />
            </button>
          </div>

          <div className="flex justify-between flex-shrink-0 gap-16">
            <button
              className={`flex items-center justify-center flex-1 h-[44px] bg-[#D9DADB] hover:bg-[#BFC0C4] rounded-lg gap-2 cursor-pointer ${
                inputDisabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={openResetModal}
              disabled={inputDisabled}
            >
              <img src={ResetIcon} alt="Reset" className="w-4 h-4" />
              <span className="heading-3 font-700 text-[#515151] leading-[26px] ">
                대화 내용 초기화
              </span>
            </button>

            <button
              className={`flex-1 h-[44px] bg-[#FF6289] hover:bg-[#e6597c] rounded-lg flex justify-center items-center cursor-pointer ${
                inputDisabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={openSubmitModal}
              disabled={inputDisabled}
            >
              <span className="heading-3 font-700 text-white leading-[26px] ">제출하기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
