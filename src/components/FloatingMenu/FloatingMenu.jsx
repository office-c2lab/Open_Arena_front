import React, { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { MoreVertical, LogOut } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { adminLogoutApi } from '@/api/auth';
import { appToast } from '@/components/Toast/appToast';

export default function FloatingMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const adminLogout = useAuthStore(state => state.adminLogout);

  // 버튼 목록 (🔥 빨간 테마)
  const buttons = [
    { label: '사용자', path: '/admin/user-management', fontSize: '12px' },
    { label: '문제관리', path: '/admin/problems', fontSize: '12px' },
    { label: '채팅관리', path: '/admin/users', fontSize: '12px' },
    { label: '저지관리', path: '/admin/judge', fontSize: '12px' },
    { label: '운영관리', path: '/admin/operations', fontSize: '11px' },

    // 🔥 로그아웃 버튼 추가
    { label: '로그아웃', path: '/admin/logout', fontSize: '11px', isLogout: true },
  ];

  const gap = 75;

  const handleNavigate = async btn => {
    setIsOpen(false);

    if (btn.isLogout) {
      try {
        await adminLogoutApi();
      } catch (error) {
        appToast.error(error.message || '관리자 로그아웃 요청에 실패했습니다.');
      } finally {
        adminLogout();
        navigate('/admin/login');
      }
      return;
    }

    navigate(btn.path);
  };

  return (
    <div className="fixed bottom-8 right-12 flex flex-col items-center z-[9999]">
      <AnimatePresence>
        {isOpen &&
          buttons.map((btn, index) => {
            const reversedIndex = buttons.length - (index + 1);
            const isActive = location.pathname === btn.path;
            const isLogout = btn.isLogout;

            return (
              <Motion.button
                key={btn.label}
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: -(reversedIndex + 1) * gap }}
                exit={{ opacity: 0, y: 0 }}
                transition={{ duration: 0.15, delay: index * 0.02, ease: 'easeOut' }}
                onClick={() => handleNavigate(btn)}
                whileHover={{
                  scale: 1.12,
                  boxShadow: isLogout
                    ? '0px 0px 18px 3px rgba(255,0,0,0.6)'
                    : '0px 0px 18px 3px rgba(255,72,84,0.6)',
                }}
                whileTap={{ scale: 0.95 }}
                className="absolute w-[60px] h-[60px] rounded-full flex items-center justify-center cursor-pointer transition-transform"
                style={{
                  background: isActive ? '#FF4854' : isLogout ? '#FFFFFF' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : isLogout ? '#D80027' : '#FF4854',
                  fontFamily: "'Black Ops One', sans-serif",
                  fontSize: btn.fontSize,
                  fontWeight: 400,
                  lineHeight: '1',
                  boxShadow: isActive
                    ? '0px 0px 20px 5px rgba(255,72,84,0.6)'
                    : '0px 2px 5px rgba(0,0,0,0.2)',
                }}
              >
                {/* 로그아웃 아이콘 */}
                {btn.isLogout ? <LogOut size={20} color="#D80027" /> : btn.label}
              </Motion.button>
            );
          })}
      </AnimatePresence>

      {/* 🔥 메인 토글 버튼 */}
      <Motion.button
        onClick={() => setIsOpen(prev => !prev)}
        whileHover={{
          scale: 1.1,
          boxShadow: '0px 0px 15px 3px rgba(255, 72, 84, 0.5)',
        }}
        whileTap={{ scale: 0.9 }}
        className="relative w-[60px] h-[60px] rounded-full bg-[#FF4854] flex items-center justify-center cursor-pointer shadow-[0_0_10px_rgba(255,72,84,0.4)] transition-all"
      >
        <MoreVertical size={26} color="#fff" />
      </Motion.button>
    </div>
  );
}
