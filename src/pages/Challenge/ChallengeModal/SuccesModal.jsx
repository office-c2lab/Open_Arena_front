// src/features/challenge/ChallengeModals/SuccessModal.jsx

import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import useModalStore from '@/stores/useModalStore';
import { useSessionStore } from '@/stores/useSessionStore';
import ArenaGreen from '@/assets/icons/arenagreen.svg';

const SUCCESS_COLOR_PRIMARY = '#04B07B';

export default function SuccessModal({
  isOpen,
  onClose,
  previewMode = false,
  embeddedPreview = false,
  embeddedFill = false,
  previewRewardPoints,
  previewScaleClassName = '',
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clearSession = useSessionStore(state => state.clearSession);
  const isSuccessModalOpen = useModalStore(state => state.isSuccessModalOpen);
  const challengeRewardPoints = useModalStore(state => state.challengeRewardPoints);
  const { closeSuccessModal, resetChatAction } = useModalStore();

  const shouldOpen = previewMode ? isOpen : isSuccessModalOpen;

  const handleRestart = useCallback(async () => {
    closeSuccessModal();
    await resetChatAction();
    queryClient.invalidateQueries({ queryKey: ['problemBundle'] });
  }, [closeSuccessModal, resetChatAction, queryClient]);

  const handleContinue = useCallback(() => {
    closeSuccessModal();
    clearSession();
    queryClient.invalidateQueries({ queryKey: ['problemBundle'] });
    navigate('/kategorie');
  }, [closeSuccessModal, clearSession, queryClient, navigate]);

  const handlePreviewClose = useCallback(() => {
    if (onClose) onClose();
  }, [onClose]);

  if (!shouldOpen) return null;

  const wrapperClassName = embeddedPreview
    ? embeddedFill
      ? 'absolute inset-0 bg-black/60 flex justify-center items-center z-[20]'
      : 'relative flex justify-center items-center'
    : 'fixed inset-0 bg-black/60 flex justify-center items-center z-[1000]';
  const restartHandler = previewMode ? handlePreviewClose : handleRestart;
  const continueHandler = previewMode ? handlePreviewClose : handleContinue;
  const rewardPoints =
    previewMode && typeof previewRewardPoints === 'number'
      ? previewRewardPoints
      : challengeRewardPoints;

  return (
    <div className={wrapperClassName}>
      <div
        className={`w-[990px] bg-white rounded-[30px] border border-[#EEF0F4] flex flex-col items-center shadow-[0_18px_40px_rgba(15,23,42,0.16)] py-10 ${previewScaleClassName}`}
      >
        {/* === 최종 성공 박스 === */}
        <div
          className="w-full max-w-[877px] bg-white rounded-[20px] flex flex-col items-center 
                     justify-center border px-10 py-8 gap-4 shadow-[0_8px_22px_rgba(15,23,42,0.08)]"
          style={{ borderColor: 'rgba(4, 176, 123, 0.24)' }}
        >
          <h2 className="text-page-title font-strong" style={{ color: SUCCESS_COLOR_PRIMARY }}>
            챌린지 성공!
          </h2>

          <img src={ArenaGreen} alt="성공 아이콘" className="w-[250px] h-[250px] opacity-95" />

          <p className="text-body-lg font-medium text-[#444] text-center">
            제출한 대화가 챌린지의 성공 조건을 충족했습니다.
            <br />
            획득한 포인트를 확인하고 다음 챌린지에도 도전해보세요!
          </p>

          {typeof rewardPoints === 'number' ? (
            <div className="flex items-baseline gap-2 rounded-[14px]  px-5 py-3">
              <span className="text-section-title font-strong text-[#047857]">획득 포인트</span>
              <span className="text-section-title font-strong text-[#04B07B]">
                {rewardPoints.toLocaleString()}포인트
              </span>
            </div>
          ) : null}
        </div>

        {/* === 버튼 그룹 === */}
        <div className="w-full max-w-[862px] flex justify-between mt-12">
          <button
            type="button"
            onClick={restartHandler}
            className="w-[48%] h-[61px] bg-[#D9DADB] rounded-[18px] 
                       hover:-translate-y-[1px] hover:bg-[#BFC0C4] transition-all duration-200 flex items-center justify-center cursor-pointer"
          >
            <span className="text-section-title font-strong text-[#515151]">
              챌린지 화면으로 돌아가기
            </span>
          </button>

          <button
            type="button"
            onClick={continueHandler}
            className="w-[48%] h-[61px] rounded-[18px] flex items-center justify-center 
                       text-white shadow-[0_3px_8px_rgba(4,176,123,0.16)] transition-all duration-200 hover:-translate-y-[1px] hover:opacity-90 hover:shadow-[0_5px_12px_rgba(4,176,123,0.18)] cursor-pointer"
            style={{ backgroundColor: SUCCESS_COLOR_PRIMARY }}
          >
            <span className="text-section-title font-strong">다른 챌린지 도전하기</span>
          </button>
        </div>
      </div>
    </div>
  );
}
