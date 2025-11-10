// src/features/Challenge/components/ChatBubble.jsx (유지)

import React from 'react';

// 💡 로딩 애니메이션 컴포넌트
const TypingIndicator = () => (
    <div className="flex space-x-1">
        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
    </div>
);

export default function ChatBubble({ role, content, isTyping = false }) { 
    // role이 'user'일 경우: 오른쪽 정렬 (사용자 말풍선)
    if (role === 'user') {
        return (
            <div className="flex justify-end mb-4">
                <div className="max-w-[80%] bg-[#FF6289] text-white p-3 rounded-l-2xl rounded-tr-2xl shadow-md">
                    <p className="body-large font-300 whitespace-pre-wrap">{content}</p>
                </div>
            </div>
        );
    }
    
    // role이 'assistant' 또는 그 외일 경우: 왼쪽 정렬 (AI 말풍선)
    return (
        <div className="flex justify-start mb-4">
            <div className={`max-w-[80%] bg-[#2D2F39] text-white p-3 rounded-r-2xl rounded-tl-2xl shadow-md ${isTyping ? 'animate-none' : ''}`}>
                {isTyping ? (
                    <div className="flex items-center gap-2">
                        <span className="body-large font-300">AI가 응답을 생성 중입니다...</span>
                        <TypingIndicator />
                    </div>
                ) : (
                    <p className="body-large font-300 whitespace-pre-wrap">{content}</p>
                )}
            </div>
        </div>
    );
}