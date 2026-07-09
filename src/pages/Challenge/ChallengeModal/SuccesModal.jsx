// src/features/challenge/ChallengeModals/SuccessModal.jsx

import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import useModalStore from '@/stores/useModalStore';
import { useSessionStore } from '@/stores/useSessionStore';
import ArenaGreen from '@/assets/icons/arenagreen.svg';
import confetti from 'canvas-confetti';

const SUCCESS_COLOR_PRIMARY = '#04B07B';

export default function SuccessModal() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clearSession = useSessionStore(state => state.clearSession);
  const isSuccessModalOpen = useModalStore(state => state.isSuccessModalOpen);
  const { closeSuccessModal, resetChatAction } = useModalStore();

  // 🎉 모달 열릴 때 confetti 실행 (모달 위 canvas 생성)
  useEffect(() => {
    if (!isSuccessModalOpen) return;

    // 1) 모달 위에서 confetti 터지게 canvas 생성
    const canvas = document.createElement('canvas');
    canvas.id = 'success-confetti-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = 2000; // ★ 모달보다 위에서 confetti 터짐

    document.body.appendChild(canvas);

    // 2) confetti 인스턴스 생성
    const myConfetti = confetti.create(canvas, { resize: true });

    // 3) 짧고 화려하게 터지는 애니메이션
    const duration = 5000;
    const end = Date.now() + duration;

    (function frame() {
      myConfetti({
        particleCount: 10,
        angle: 60,
        spread: 60,
        origin: { x: 0 },
        colors: ['#04B07B', '#ffffff', '#00D4A6'],
      });

      myConfetti({
        particleCount: 10,
        angle: 120,
        spread: 60,
        origin: { x: 1 },
        colors: ['#04B07B', '#ffffff', '#00D4A6'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    // 4) confetti 끝나면 canvas 자동 삭제
    setTimeout(() => {
      canvas.remove();
    }, duration + 300);

    return () => {
      canvas.remove();
    };
  }, [isSuccessModalOpen]);

  const handleRestart = useCallback(() => {
    closeSuccessModal();
    resetChatAction();
    clearSession();
    queryClient.invalidateQueries(['problemBundle']);
  }, [closeSuccessModal, resetChatAction, clearSession, queryClient]);

  const handleContinue = useCallback(() => {
    closeSuccessModal();
    clearSession();
    queryClient.invalidateQueries(['problemBundle']);
    navigate('/kategorie');
  }, [closeSuccessModal, clearSession, queryClient, navigate]);

  if (!isSuccessModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[1000]">
      <div className="w-[990px] bg-white rounded-[30px] border border-[#EEF0F4] flex flex-col items-center shadow-[0_18px_40px_rgba(15,23,42,0.16)] py-10">
        {/* === 최종 성공 박스 === */}
        <div
          className="w-full max-w-[877px] bg-white rounded-[20px] flex flex-col items-center 
                     justify-center border px-10 py-8 gap-4 shadow-[0_8px_22px_rgba(15,23,42,0.08)]"
          style={{ borderColor: 'rgba(4, 176, 123, 0.24)' }}
        >
          <h2 className="heading-1 font-700" style={{ color: SUCCESS_COLOR_PRIMARY }}>
            챌린지 성공!
          </h2>

          <img src={ArenaGreen} alt="성공 아이콘" className="w-[250px] h-[250px] opacity-95" />

          <p className="body-large font-500 text-[#444] text-center leading-relaxed">
            3개의 Judge AI 중 2개 이상이 성공으로 판단했습니다.
            <br />
            다음 문제에도 도전해보세요!
          </p>
        </div>

        {/* === 버튼 그룹 === */}
        <div className="w-full max-w-[862px] flex justify-between mt-12">
          <button
            type="button"
            onClick={handleRestart}
            className="w-[48%] h-[61px] bg-[#D9DADB] rounded-[18px] 
                       hover:-translate-y-[1px] hover:bg-[#BFC0C4] transition-all duration-200 flex items-center justify-center cursor-pointer"
          >
            <span className="heading-2 font-700 text-[#515151]">챌린지 화면으로 돌아가기</span>
          </button>

          <button
            type="button"
            onClick={handleContinue}
            className="w-[48%] h-[61px] rounded-[18px] flex items-center justify-center 
                       text-white shadow-[0_8px_18px_rgba(4,176,123,0.18)] transition-all duration-200 hover:-translate-y-[1px] hover:opacity-90 hover:shadow-[0_10px_22px_rgba(4,176,123,0.22)] cursor-pointer"
            style={{ backgroundColor: SUCCESS_COLOR_PRIMARY }}
          >
            <span className="heading-2 font-700">다른 문제 풀기</span>
          </button>
        </div>
      </div>
    </div>
  );
}
