import React, { useState, useEffect } from 'react';
import ChatBubble from './ChatBubble';
import useModalStore from '@/stores/useModalStore';
import { useSendMessage } from '@/hooks/useChat';

export default function ChatArea({
  ArenaIcon,
  SendIcon,
  ResetIcon,
  chatMessages,       // 서버에서 내려주는 확정 메시지
  chatEndRef,
  inputValue,
  handleInputChange,
  sessionId,
  setSessionId,
  teamId,
  problemId,
  className = '',
  isMessagesLoading,
  inputDisabled,
}) {
  const { openResetModal, openSubmitModal } = useModalStore();

  const [localMessages, setLocalMessages] = useState([]);

  const { mutate: mutateSendMessage, isPending: isSending } = useSendMessage(
    sessionId,
    (newSessionId) => {
      if (newSessionId && setSessionId) setSessionId(newSessionId);
    }
  );

  const sendButtonColorClass = inputValue.trim()
    ? 'bg-[#FF6289] cursor-pointer hover:bg-[#e6597c]'
    : 'bg-[#D9DADB]';
  const flexibleIconClasses = 'max-w-[246px] max-h-[361px] w-[40vw] h-[40vh] object-contain';

  // 🔹 메시지 전송
  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isSending) return;

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

    // 사용자 메시지 + AI 로딩 메시지 추가
    setLocalMessages((prev) => [...prev, userMessage, aiLoadingMessage]);

    handleInputChange({ target: { value: '' } });

    // 서버 전송
    mutateSendMessage({
      session_id: sessionId,
      content: trimmed,
      role: 'user',
      team_id: teamId,
      problem_id: problemId,
    });
  };

  // 🔹 서버 메시지 수신 시 로딩 메시지 제거 후 교체
  useEffect(() => {
    if (!chatMessages) return;

    const serverMessagesWithUniqueId = chatMessages.map((msg) => ({
      ...msg,
      id: `server-${msg.id}`,
    }));

    setLocalMessages(serverMessagesWithUniqueId);
  }, [chatMessages]);

  // 🔹 localMessages 변경 시 자동 스크롤
  useEffect(() => {
    if (chatEndRef?.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [localMessages, chatEndRef]);

  return (
    <div className={`flex flex-col flex-grow h-full ${className}`}>
      <div className="flex-1 bg-white shadow-xl rounded-[20px] flex flex-col overflow-hidden h-full">
        {/* Chat Display Area */}
        <div className="flex-1 p-6 relative overflow-hidden">
          {isMessagesLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <p className="heading-3 font-700 text-[#FF6289]">메시지를 불러오는 중입니다...</p>
              <p className="body-medium text-[#6B6B6B] mt-2">잠시만 기다려 주세요.</p>
            </div>
          ) : localMessages.length === 0 ? (
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
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={inputDisabled || isSending}
            />
            <button
              className={`flex-shrink-0 w-10 h-10 ${sendButtonColorClass} rounded-full flex justify-center items-center absolute right-4 bottom-4 transition-colors duration-200 ${
                inputDisabled || isSending ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={!inputValue.trim() || inputDisabled || isSending}
              onClick={handleSend}
            >
              <img src={SendIcon} alt="Send" className="w-5 h-5" />
            </button>
          </div>

          <div className="flex justify-between flex-shrink-0 gap-16">
            <button
              className={`flex items-center justify-center flex-1 h-[44px] bg-[#D9DADB] hover:bg-[#BFC0C4] rounded-lg gap-2 cursor-pointer ${
                inputDisabled || isSending ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={openResetModal}
              disabled={inputDisabled || isSending}
            >
              <img src={ResetIcon} alt="Reset" className="w-4 h-4" />
              <span className="heading-3 font-700 text-[#515151] leading-[26px] ">
                대화 내용 초기화
              </span>
            </button>

            <button
              className={`flex-1 h-[44px] bg-[#FF6289] hover:bg-[#e6597c] rounded-lg flex justify-center items-center cursor-pointer ${
                inputDisabled || isSending ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={openSubmitModal}
              disabled={inputDisabled || isSending}
            >
              <span className="heading-3 font-700 text-white leading-[26px] ">제출하기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
