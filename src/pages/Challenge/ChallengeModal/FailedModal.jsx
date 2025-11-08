// src/features/challenge/ChallengeModals/FailedModal.jsx

import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // ⭐ 추가
import useModalStore from '@/stores/useModalStore';
import { useSessionStore } from '@/stores/useSessionStore';
import { SuccessSummaryPanel, FailedSummaryPanel } from './SummaryPanels';

/**
 * 챌린지 실패 결과 모달 컴포넌트
 */
export default function FailedModal() {
  const navigate = useNavigate(); // ⭐ navigate 훅
  const isFailedModalOpen = useModalStore(state => state.isFailedModalOpen);
  const challengeResults = useModalStore(state => state.challengeResults);
  const { closeFailedModal, resetChatAction } = useModalStore();
  const clearSession = useSessionStore(state => state.clearSession);

  // 💡 문제 다시 풀기
  const handleRestart = useCallback(() => {
    closeFailedModal();
    resetChatAction();
    clearSession(); // 세션 초기화
  }, [closeFailedModal, resetChatAction, clearSession]);

  // 💡 다른 문제 풀기 → /kategorie 이동
  const handleContinue = useCallback(() => {
    closeFailedModal();
    clearSession();
    navigate('/kategorie'); // ⭐ 경로 이동
  }, [closeFailedModal, clearSession, navigate]);

  if (!isFailedModalOpen) return null;

  const sortedPanels = [
    ...challengeResults.filter(result => result.status !== 'success'),
    ...challengeResults.filter(result => result.status === 'success'),
  ];

  return (
    <div className="fixed inset-0 bg-[rgba(1,1,1,0.6)] flex justify-center items-center z-[1000]">
      <div
        className="w-[990px] h-[680px] bg-[#FAFAFA] rounded-[30px] flex flex-col items-center"
        style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}
      >
        <div className="h-[30px] w-full" />

        {/* === 패널 목록 === */}
        <div className="flex flex-col gap-4 w-[877px]">
          {sortedPanels.map((result, index) => {
            const data = result.data;
            const Component =
              result.status === 'success' ? SuccessSummaryPanel : FailedSummaryPanel;

            return (
              <Component
                key={index}
                imageSrc={data.imageSrc}
                animalName={data.animalName}
                description={data.description}
                imageStyle={data.imageStyle}
                isFirstPanel={data.isFirstPanel}
                title={data.title}
                verdict={result.status}
              />
            );
          })}
        </div>

        {/* === 액션 버튼 그룹 === */}
        <div className="flex justify-between w-[862px] mt-10">
          {/* 문제 다시 풀기 */}
          <button
            type="button"
            onClick={handleRestart}
            className="flex items-center justify-center w-[400px] h-[61px]  rounded-[20px]
              border border-[#E4E8F0] bg-[#D9DADB] hover:bg-[#BFC0C4] transition duration-200 cursor-pointer"
            style={{ padding: '12px 42px' }}
          >
            <span className="heading-2 font-500 text-[#515151]">문제 다시 풀기</span>
          </button>

          {/* 다른 문제 풀기 */}
          <button
            type="button"
            onClick={handleContinue}
            className="flex items-center justify-center w-[400px] h-[61px]  bg-[#FF6289] rounded-[20px]
              hover:bg-[#e6597c] transition duration-200 cursor-pointer"
            style={{ padding: '12px' }}
          >
            <span className="heading-2 font-500 text-white">다른 문제 풀기</span>
          </button>
        </div>

        <div className="h-[25px] w-full" />
      </div>
    </div>
  );
}
