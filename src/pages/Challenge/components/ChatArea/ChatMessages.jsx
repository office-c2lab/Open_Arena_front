import React from 'react';
import ChatBubble from '../ChatBubble';

export default function ChatMessages({
  messages,
  isLoading,
  isInitialState,
  ArenaIcon,
  chatEndRef,
}) {
  if (isInitialState) {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center text-center p-4">
        {ArenaIcon ? (
          <img
            src={ArenaIcon}
            alt="ARENA"
            className="mb-4 h-[min(32vh,300px)] w-[32vw] max-h-[300px] max-w-[220px] object-contain"
          />
        ) : null}
        <p className="mx-auto mb-6 mt-4 w-full text-center text-card-title font-medium text-[#0F172A]">
          AI와 대화를 시작하세요. <br /> 아래 입력창에 메시지를 입력해보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-0 flex-1 overflow-hidden p-6">
      {ArenaIcon ? (
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          aria-hidden="true"
        >
          <img
            src={ArenaIcon}
            alt=""
            className="h-[40vh] max-h-[361px] w-[40vw] max-w-[246px] object-contain opacity-20"
          />
        </div>
      ) : null}
      <div className="no-scrollbar relative z-10 h-full overflow-y-auto pt-4">
        {isLoading ? (
          <div className="text-center p-4 text-gray-500">메시지를 불러오는 중...</div>
        ) : (
          messages.map(msg => (
            <ChatBubble
              key={msg.id || `${msg.role}-${msg.timestamp}`}
              role={msg.role}
              content={msg.content}
              isTyping={msg.isTyping || false}
            />
          ))
        )}
        <div ref={chatEndRef} />
      </div>
    </div>
  );
}
