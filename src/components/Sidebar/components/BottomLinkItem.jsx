// src/components/Sidebar/components/BottomLinkItem.jsx

import React from 'react';

/**
 * 하단 링크 항목 컴포넌트 (Help, Logout 등)
 * @param {object} item - 링크 항목 데이터
 */
export default function BottomLinkItem({ item }) {
  return (
    <a
      className={`flex items-center px-3 py-2 gap-3 w-full ${item.heightClass} rounded-[8px] transition-colors cursor-pointer hover:bg-gray-100`}
      onMouseEnter={() => item.setHovered(true)}
      onMouseLeave={() => item.setHovered(false)}
    >
      {/* 아이콘 색상/투명도 조정 스타일 */}
      <img
        src={item.icon}
        alt={item.label}
        className={item.iconSize}
        style={
          !item.isHovered && item.label !== 'Login Account'
            ? { opacity: 0.5 }
            : item.label === 'Login Account' && !item.isHovered
              ? { opacity: 0.8 }
              : {}
        }
      />
      {/* 텍스트 색상 조정 스타일 */}
      <span className={item.isHovered ? item.hoverTextClass : item.textClass}>{item.label}</span>
    </a>
  );
}
