// src/features/Challenge/components/ChatArea.jsx (수정)

import React from 'react';
import ChatBubble from './ChatBubble';
import useModalStore from '@/stores/useModalStore';

// 💡 [수정] isSending prop 추가
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
    isMessagesLoading,
    inputDisabled, // 💡 inputDisabled prop이 isSending 상태를 포함함
}) {
    const { openResetModal, openSubmitModal } = useModalStore();

    // inputDisabled가 isSending을 포함하므로, isSending 상태를 따로 prop으로 받지 않고
    // inputDisabled 상태를 활용하여 로딩 말풍선을 조건부 렌더링 할 수 있습니다. 
    // 하지만, isMessagesLoading (초기 로딩)과 isSending (전송 중)을 명확히 분리하기 위해
    // Challenge.jsx에서 isSending을 직접 prop으로 전달하거나, 
    // isInputDisabled가 isSending만을 의미하도록 조정하는 것이 좋습니다.

    // 🚀 [가정] Challenge.jsx에서 inputDisabled가 isSending 상태를 포함하고, 
    // isMessagesLoading은 초기 로딩만 담당한다고 가정하고,
    // 채팅 전송 중인 상태를 'isSendingOnly'로 분리하여 사용합니다.

    // isMessagesLoading이 true가 아니면서 inputDisabled가 true인 경우 (대부분 isSending 때문)
    const isSendingOnly = inputDisabled && !isMessagesLoading; 


    const sendButtonColorClass = inputValue.trim()
        ? 'bg-[#FF6289] cursor-pointer hover:bg-[#e6597c]'
        : 'bg-[#D9DADB]';
    const flexibleIconClasses = 'max-w-[246px] max-h-[361px] w-[40vw] h-[40vh] object-contain';

    return (
        <div className={`flex flex-col flex-grow h-full ${className}`}>
            <div className="flex-1 bg-white shadow-xl rounded-[20px] flex flex-col overflow-hidden h-full">
                {/* Chat Display Area (남은 공간) - flex-1 & overflow-y-auto */}
                <div className="flex-1 p-6 relative overflow-hidden">
                    
                    {/* 💡 [수정] 메시지 로딩 중일 때 로딩 UI 표시 */}
                    {isMessagesLoading ? (
                        <div className="flex flex-col items-center justify-center h-full text-center p-4">
                            <p className="heading-3 font-700 text-[#FF6289]">
                                메시지를 불러오는 중입니다...
                            </p>
                            <p className="body-medium text-[#6B6B6B] mt-2">잠시만 기다려 주세요.</p>
                        </div>
                    ) : chatMessages.length === 0 ? (
                        // 1. 메시지가 없을 때 (Empty State)
                        <div className="flex flex-col items-center justify-center h-full text-center p-4">
                            <img src={ArenaIcon} alt="ARENA Logo" className={`${flexibleIconClasses} mb-4`} />

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
                                    alt="ARENA Logo"
                                    className={`${flexibleIconClasses} opacity-30`}
                                />
                            </div>
                            <div className="relative z-10 pt-4 h-full overflow-y-auto">
                                {chatMessages.map(msg => (
                                    <ChatBubble key={msg.id} role={msg.role} content={msg.content} />
                                ))}

                                {/* 🚀 [핵심 추가] AI 응답 대기 중일 때 로딩 버블 표시 */}
                                {isSendingOnly && (
                                    <ChatBubble role="assistant" content="AI가 응답을 생성 중입니다..." isTyping={true} />
                                )}
                                
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
                            disabled={inputDisabled} // 💡 isMessagesLoading 또는 isSending일 때 비활성화
                        ></textarea>

                        <button
                            className={`flex-shrink-0 w-10 h-10 ${sendButtonColorClass} rounded-full flex justify-center items-center absolute right-4 bottom-4 transition-colors duration-200 ${inputDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={!inputValue.trim() || inputDisabled} // 💡 비활성화 상태 추가
                            onClick={handleSendMessage}
                        >
                            <img src={SendIcon} alt="Send" className="w-5 h-5" />
                        </button>
                    </div>
                    {/* Reset and Submit Buttons */}
                    <div className="flex justify-between flex-shrink-0 gap-16">
                        <button
                            className={`flex items-center justify-center flex-1 h-[44px] bg-[#D9DADB] hover:bg-[#BFC0C4] rounded-lg gap-2 cursor-pointer ${inputDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={openResetModal}
                            disabled={inputDisabled} // 💡 비활성화 상태 추가
                        >
                            <img src={ResetIcon} alt="Reset" className="w-4 h-4" />
                            <span className="heading-3 font-700 text-[#515151] leading-[26px] ">
                                대화 내용 초기화
                            </span>
                        </button>

                        <button
                            className={`flex-1 h-[44px] bg-[#FF6289] hover:bg-[#e6597c] rounded-lg flex justify-center items-center cursor-pointer ${inputDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={openSubmitModal}
                            disabled={inputDisabled} // 💡 비활성화 상태 추가
                        >
                            <span className="heading-3 font-700 text-white leading-[26px] ">제출하기</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}