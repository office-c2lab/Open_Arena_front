// src/components/Sidebar/components/BottomLinkItem.jsx

import React from 'react';
import { Link } from 'react-router-dom';

/**
 * 하단 링크 항목 컴포넌트 (Link 기반)
 */
export default function BottomLinkItem({ item }) {
  // isHovered 상태와 setHovered 액션이 item 객체에 포함되어 있음을 가정
  const isHovered = item.isHovered;

  return (
    <Link
      to={item.path}
      className={`flex items-center px-3 py-2 gap-3 w-full ${item.heightClass} rounded-[8px] transition-colors cursor-pointer hover:bg-gray-100`}
      onMouseEnter={() => item.setHovered(true)}
      onMouseLeave={() => item.setHovered(false)}
    >
      <img
        src={item.icon}
        alt={item.label}
        className={item.iconSize}
        style={
          // 계정 로그인 항목의 텍스트와 아이콘 색상을 구분하여 opacity를 조정합니다.
          !isHovered && item.label !== '계정 로그인'
            ? { opacity: 0.5 }
            : item.label === '계정 로그인' && !isHovered
              ? { opacity: 0.8 }
              : {}
        }
      />
      <span className={isHovered ? item.hoverTextClass : item.textClass}>{item.label}</span>
    </Link>
  );
}
