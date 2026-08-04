import React, { useState, useEffect, useRef } from 'react';
import { ThinkingOrb } from 'thinking-orbs';

export default function ChatBubble({
  role,
  content,
  isTyping = false,
  compact = false,
  animateOnMount = false,
  typingDelayMs = 0,
  typingSpeedMs = 14,
}) {
  const [displayedText, setDisplayedText] = useState(animateOnMount ? '' : content);
  const [isVisible, setIsVisible] = useState(!animateOnMount);
  const prevContentRef = useRef(content);

  useEffect(() => {
    if (animateOnMount && !isTyping) {
      setDisplayedText('');
      setIsVisible(false);

      let interval = null;
      const delayTimer = setTimeout(() => {
        setIsVisible(true);

        let index = 0;
        interval = setInterval(() => {
          setDisplayedText(content.slice(0, index));
          index += 1;

          if (index > content.length) clearInterval(interval);
        }, typingSpeedMs);

        prevContentRef.current = content;
      }, typingDelayMs);

      return () => {
        clearTimeout(delayTimer);
        if (interval) clearInterval(interval);
      };
    }

    if (role === 'assistant' && content !== prevContentRef.current && !isTyping) {
      prevContentRef.current = content;
      setDisplayedText('');
      setIsVisible(true);
      let index = 0;
      const interval = setInterval(() => {
        setDisplayedText(content.slice(0, index));
        index += 1;
        if (index > content.length) clearInterval(interval);
      }, typingSpeedMs);
      return () => clearInterval(interval);
    }

    setIsVisible(true);
    setDisplayedText(content);
  }, [animateOnMount, content, role, isTyping, typingDelayMs, typingSpeedMs]);

  if (isTyping && role === 'assistant') {
    return (
      <div className="mb-4 flex justify-start">
        <div className="flex min-h-[80px] items-center gap-3 overflow-visible px-3 py-2">
          <ThinkingOrb
            state="composing"
            size={64}
            theme="light"
            aria-label="AI가 응답을 생성 중입니다"
          />
          <span className="thinking-text body-large font-500">AI가 답변을 생성 중입니다...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'} mb-4 transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      }`}
    >
      <div
        className={`max-w-[80%] p-3 rounded-2xl backdrop-blur-md ${
          role === 'user'
            ? 'bg-[#FF4854] text-white rounded-l-2xl rounded-tr-2xl shadow-[0_3px_8px_rgba(255,72,84,0.16)]'
            : 'border border-[#323746] bg-[#222632] text-white rounded-r-2xl rounded-tl-2xl shadow-[0_3px_8px_rgba(15,23,42,0.10)]'
        }`}
      >
        <p
          className={`font-500 whitespace-pre-wrap ${
            compact ? 'text-sm leading-6' : 'body-large leading-7'
          }`}
        >
          {displayedText}
        </p>
      </div>
    </div>
  );
}
