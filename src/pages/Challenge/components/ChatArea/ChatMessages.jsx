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
        <p className="text-card-title font-medium text-[#0F172A] mt-4 mb-6">
          AI와 대화를 시작하세요. <br /> 아래 입력창에 메시지를 입력해보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-0 flex-1 overflow-hidden p-6">
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none"></div>
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
