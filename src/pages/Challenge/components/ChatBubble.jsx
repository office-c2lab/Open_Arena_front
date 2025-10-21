// src/features/Challenge/components/ChatBubble.jsx

import React from 'react';

export default function ChatBubble({ sender, content }) {
  if (sender === 'user') {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[80%] bg-[#FF6289] text-white p-3 rounded-l-2xl rounded-tr-2xl shadow-md">
          <p className="text-[16px] font-light leading-6 whitespace-pre-wrap">{content}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[80%] bg-[#2D2F39] text-white p-3 rounded-r-2xl rounded-tl-2xl shadow-md">
        <p className="text-[16px] font-light leading-6 whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
}
