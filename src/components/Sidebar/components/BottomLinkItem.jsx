import React from 'react';
import { Link } from 'react-router-dom';

/**
 * 하단 링크 항목 컴포넌트 (Link 기반)
 */
export default function BottomLinkItem({ item, isCollapsed }) {
  // isHovered 상태와 setHovered 액션이 item 객체에 포함되어 있음을 가정
  const isHovered = item.isHovered;

  return (
    <Link
      to={item.path}
      className={`flex items-center w-full ${item.heightClass} rounded-[8px] transition-colors cursor-pointer hover:bg-gray-100
        ${isCollapsed ? 'justify-center px-0 gap-0' : 'px-3 gap-3'} // 💡 [핵심 수정] isCollapsed일 때 px-0, gap-0 적용
      `}
      onMouseEnter={() => item.setHovered(true)}
      onMouseLeave={() => item.setHovered(false)}
    >
      {/* flex-shrink-0는 유지 */}
      <img
        src={item.icon}
        alt={item.label}
        className={`${item.iconSize} flex-shrink-0`}
        style={
          // ... (style 로직 유지)
          !isHovered && item.label !== '계정 로그인'
            ? { opacity: 0.5 }
            : item.label === '계정 로그인' && !isHovered
              ? { opacity: 0.8 }
              : {}
        }
      />
      {/* isCollapsed가 아닐 때만 텍스트 표시 */}
      {!isCollapsed && (
        <span className={isHovered ? item.hoverTextClass : item.textClass}>{item.label}</span>
      )}
    </Link>
  );
}
