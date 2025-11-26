// src/components/Sidebar/components/BottomLinkItem.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { logoutApi } from '@/api/auth'; // ⭐ 추가!

export default function BottomLinkItem({ item, isCollapsed }) {
  const navigate = useNavigate();
  const logout = useAuthStore(state => state.logout);

  const handleClick = async e => {
    if (item.label === '로그아웃') {
      e.preventDefault(); // 기본 이동 막기

      try {
        // 🔥 1) 백엔드에 실제 로그아웃 요청 (쿠키 삭제)
        await logoutApi();
      } catch (err) {
        console.error('백엔드 로그아웃 실패:', err);
      }

      // 🔥 2) 클라이언트 상태 초기화
      logout();

      // 🔥 3) 로그인/홈으로 이동
      navigate('/login');
      return;
    }
  };

  return (
    <Link
      to={item.path}
      onClick={handleClick}
      className={`flex items-center w-full ${item.heightClass} rounded-[8px] transition-colors cursor-pointer hover:bg-gray-100
        ${isCollapsed ? 'justify-center px-0 gap-0' : 'px-3 gap-3'}
      `}
      onMouseEnter={() => item.setHovered(true)}
      onMouseLeave={() => item.setHovered(false)}
    >
      <img
        src={item.icon}
        alt={item.label}
        className={`${item.iconSize} flex-shrink-0`}
        style={
          !item.isHovered && item.label !== '계정 로그인'
            ? { opacity: 0.5 }
            : item.label === '계정 로그인' && !item.isHovered
              ? { opacity: 0.8 }
              : {}
        }
      />

      {!isCollapsed && (
        <span className={item.isHovered ? item.hoverTextClass : item.textClass}>{item.label}</span>
      )}
    </Link>
  );
}
