// src/features/challenge/ChallengeModals/SuccessModal.jsx
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useModalStore from '@/stores/useModalStore';
import { useSessionStore } from '@/stores/useSessionStore'; // ⭐ 세션 스토어
import { SuccessSummaryPanel, FailedSummaryPanel } from './SummaryPanels';

const SUCCESS_COLOR_PRIMARY = '#04B07B';

export default function SuccessModal() {
  const navigate = useNavigate();
  const clearSession = useSessionStore(state => state.clearSession); // ⭐ 세션 초기화 액션
  const isSuccessModalOpen = useModalStore(state => state.isSuccessModalOpen);
  const challengeResults = useModalStore(state => state.challengeResults);
  const { closeSuccessModal, resetChatAction } = useModalStore();

  // ✅ 챌린지 화면으로 돌아가기
  const handleRestart = useCallback(() => {
    closeSuccessModal();
    resetChatAction();
    clearSession(); // ⭐ 세션 초기화 추가
  }, [closeSuccessModal, resetChatAction, clearSession]);

  // ✅ 다른 문제 풀기
  const handleContinue = useCallback(() => {
    closeSuccessModal();
    clearSession();
    navigate('/kategorie');
  }, [closeSuccessModal, clearSession, navigate]);

  if (!isSuccessModalOpen) return null;

  const sortedPanels = [
    ...challengeResults.filter(result => result.status.toLowerCase() === 'passed'),
    ...challengeResults.filter(result => result.status.toLowerCase() !== 'passed'),
  ];

  return (
    <div className="fixed inset-0 bg-[rgba(1,1,1,0.6)] flex justify-center items-center z-[1000]">
      <div
        className="w-[990px] h-[680px] bg-[#FAFAFA] rounded-[30px] flex flex-col items-center"
        style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}
      >
        <div className="h-[30px] w-full" />
        <div className="flex flex-col gap-4 w-[877px]">
          {sortedPanels.map((result, index) => {
            const data = result.data;
            const Component =
              result.status.toLowerCase() === 'passed' ? SuccessSummaryPanel : FailedSummaryPanel;

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

        <div className="flex justify-between w-[862px] mt-10">
          {/* 챌린지 화면으로 돌아가기 */}
          <button
            type="button"
            onClick={handleRestart}
            className="flex items-center justify-center w-[400px] h-[61px] rounded-[20px]
            border border-[#E4E8F0] bg-[#D9DADB] hover:bg-[#BFC0C4] transition duration-200 cursor-pointer"
            style={{ padding: '12px 42px' }}
          >
            <span className="heading-2 font-500 text-[#515151]">챌린지 화면으로 돌아가기</span>
          </button>

          {/* 다른 문제 풀기 */}
          <button
            type="button"
            onClick={handleContinue}
            className="flex items-center justify-center w-[400px] h-[61px] rounded-[20px]
            hover:opacity-90 transition duration-200 cursor-pointer"
            style={{ padding: '12px', backgroundColor: SUCCESS_COLOR_PRIMARY }}
          >
            <span className="heading-2 font-500 text-white">다른 문제 풀기</span>
          </button>
        </div>

        <div className="h-[25px] w-full" />
      </div>
    </div>
  );
}
