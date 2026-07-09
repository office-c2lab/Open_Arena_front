import React, { useState, useEffect, useRef } from 'react';

// 💡 로딩 애니메이션 (3개의 점이 bounce)
const TypingIndicator = () => (
  <div className="flex space-x-1 ml-2">
    <div
      className="w-2 h-2 bg-white rounded-full animate-bounce"
      style={{ animationDelay: '0s' }}
    ></div>
    <div
      className="w-2 h-2 bg-white rounded-full animate-bounce"
      style={{ animationDelay: '0.2s' }}
    ></div>
    <div
      className="w-2 h-2 bg-white rounded-full animate-bounce"
      style={{ animationDelay: '0.4s' }}
    ></div>
  </div>
);

export default function ChatBubble({ role, content, isTyping = false }) {
  const [displayedText, setDisplayedText] = useState(content);
  const prevContentRef = useRef(content);

  // 🪄 글자 타이핑 애니메이션 (새 메시지일 때만 실행)
  useEffect(() => {
    if (role === 'assistant' && content !== prevContentRef.current && !isTyping) {
      prevContentRef.current = content;
      setDisplayedText('');
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText(content.slice(0, i));
        i++;
        if (i > content.length) clearInterval(interval);
      }, 1);
      return () => clearInterval(interval);
    } else {
      setDisplayedText(content);
    }
  }, [content, role, isTyping]);

  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] p-3 rounded-2xl backdrop-blur-md ${
          role === 'user'
            ? 'bg-[#FF4854] text-white rounded-l-2xl rounded-tr-2xl shadow-[0_8px_18px_rgba(255,72,84,0.16)]'
            : 'border border-white/55 bg-[#2D2F39]/88 text-white rounded-r-2xl rounded-tl-2xl shadow-[0_8px_18px_rgba(15,23,42,0.12)]'
        }`}
      >
        {isTyping && role === 'assistant' ? (
          <div className="flex items-center">
            <span className="body-large font-300">AI가 응답을 생성 중입니다</span>
            <TypingIndicator />
          </div>
        ) : (
          <p className="body-large font-300 whitespace-pre-wrap">{displayedText}</p>
        )}
      </div>
    </div>
  );
}
