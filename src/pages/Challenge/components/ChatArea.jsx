// src/features/Challenge/components/ChatArea.jsx (수정)

import React from 'react';
import ChatBubble from './ChatBubble';
import useModalStore from '@/stores/useModalStore';

export default function ChatArea({
  ArenaIcon,
  SendIcon,
  ResetIcon,
  chatMessages,
  chatEndRef,
  inputValue,
  handleInputChange,
  handleSendMessage,
  className = '',
}) {
  const { openResetModal, openSubmitModal } = useModalStore();

  const sendButtonColorClass = inputValue.trim() ? 'bg-[#FF6289] cursor-pointer' : 'bg-[#D9DADB]'; // 💡 유동적인 아이콘 크기 클래스 정의

  const flexibleIconClasses = 'max-w-[246px] max-h-[361px] w-[40vw] h-[40vh] object-contain'; // max-width/height로 최대 크기 제한, vw/vh로 유동성 부여

  return (
    <div className={`flex flex-col flex-grow h-full ${className}`}>
      <div className="flex-1 bg-white shadow-xl rounded-[20px] flex flex-col overflow-hidden h-full">
        {/* Chat Display Area (남은 공간) - flex-1 & overflow-y-auto */}
        <div className="flex-1 p-6 relative overflow-y-auto">
          {chatMessages.length === 0 ? (
            // 1. 메시지가 없을 때 (Empty State)
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <img
                src={ArenaIcon}
                alt="ARENA Logo"
                // 💡 [수정]: 유동적인 크기 클래스 적용
                className={`${flexibleIconClasses} mb-4`}
              />

              <p className="heading-3 font-300 text-[#000000] mt-4">
                AI와 대화를 시작하세요. <br /> 프롬프트를 입력하여 챌린지를 시작하세요.
              </p>
            </div>
          ) : (
            <>
              {/* 2. 메시지가 있을 때 (Background) */}
              <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                <img
                  src={ArenaIcon}
                  alt="ARENA Logo" // 💡 [수정]: 유동적인 크기 클래스 적용 및 투명도 유지
                  className={`${flexibleIconClasses} opacity-30`}
                />
              </div>

              <div className="relative z-10 pt-4">
                {chatMessages.map(msg => (
                  <ChatBubble key={msg.id} sender={msg.sender} content={msg.content} />
                ))}
                <div ref={chatEndRef} />
              </div>
            </>
          )}
        </div>
        {/* Input and Action Area (고정 높이) - flex-shrink-0 */}
        <div className="h-[210px] md:h-[237px] p-4 md:p-6 bg-purple-50/20 shadow-[0px_-3px_10px_rgba(0,0,0,0.25)] rounded-b-[20px] flex flex-col justify-end gap-3 flex-shrink-0">
          {/* Textarea and Send Button */}
          <div className="w-full h-[130px] md:h-[153px] bg-white shadow-[0px_0px_4px_rgba(0,0,0,0.25)] rounded-[20px] p-3 md:p-4 flex items-start relative">
            <textarea
              className="w-full h-full resize-none focus:outline-none body-large text-[#6B6B6B] pr-12 overflow-y-auto"
              placeholder="프롬프트를 입력하세요 (Shift + Enter로 줄바꿈)"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            ></textarea>

            <button
              className={`flex-shrink-0 w-10 h-10 ${sendButtonColorClass} rounded-full flex justify-center items-center absolute right-4 bottom-4 transition-colors duration-200`}
              disabled={!inputValue.trim()}
              onClick={handleSendMessage}
            >
              <img src={SendIcon} alt="Send" className="w-5 h-5" />
            </button>
          </div>
          {/* Reset and Submit Buttons */}
          <div className="flex justify-between flex-shrink-0 gap-16">
            <button
              className="flex items-center justify-center flex-1 h-[44px] bg-[#D9DADB] rounded-lg gap-2"
              onClick={openResetModal}
            >
              <img src={ResetIcon} alt="Reset" className="w-4 h-4" />
              <span className="heading-3 font-700 text-white leading-[26px]">대화 내용 초기화</span>
            </button>

            <button
              className="flex-1 h-[44px] bg-[#FF6289] rounded-lg flex justify-center items-center"
              onClick={openSubmitModal}
            >
              <span className="heading-3 font-700 text-white leading-[26px]">제출하기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
