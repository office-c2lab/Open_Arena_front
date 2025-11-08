// src/features/challenge/ChallengeModals/SuccessModal.jsx

import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import useModalStore from '@/stores/useModalStore';
import { useSessionStore } from '@/stores/useSessionStore';
import { SuccessSummaryPanel, FailedSummaryPanel } from './SummaryPanels';

const SUCCESS_COLOR_PRIMARY = '#04B07B';

export default function SuccessModal() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clearSession = useSessionStore(state => state.clearSession);
  const isSuccessModalOpen = useModalStore(state => state.isSuccessModalOpen);
  const challengeResults = useModalStore(state => state.challengeResults);
  const { closeSuccessModal, resetChatAction } = useModalStore();

  // ✅ 챌린지 화면으로 돌아가기
  const handleRestart = useCallback(() => {
    closeSuccessModal();
    resetChatAction();
    clearSession();
    queryClient.invalidateQueries(['problemBundle']);
  }, [closeSuccessModal, resetChatAction, clearSession, queryClient]);

  // ✅ 다른 문제 풀기
  const handleContinue = useCallback(() => {
    closeSuccessModal();
    clearSession();
    queryClient.invalidateQueries(['problemBundle']);
    navigate('/kategorie');
  }, [closeSuccessModal, clearSession, queryClient, navigate]);

  if (!isSuccessModalOpen) return null;

  // ✅ 상태 정규화 (passed / success / fail 등 대응)
  const normalizedPanels = challengeResults.map(result => {
    const normalizedStatus = result.status?.toLowerCase();
    const isSuccess = normalizedStatus === 'passed' || normalizedStatus === 'success';
    const verdictLabel = isSuccess ? '성공' : '실패';

    return {
      ...result,
      normalizedStatus,
      isSuccess,
      verdictLabel,
    };
  });

  // ✅ 순서 고정 (서버 응답 순서 그대로 표시)
  const displayPanels = normalizedPanels;

  return (
    <div className="fixed inset-0 bg-[rgba(1,1,1,0.6)] flex justify-center items-center z-[1000]">
      <div className="w-[990px] h-[680px] bg-[#FAFAFA] rounded-[30px] flex flex-col items-center shadow-lg">
        <div className="h-[30px]" />

        {/* === 결과 패널 목록 === */}
        <div className="flex flex-col gap-4 w-[877px]">
          {displayPanels.map((result, index) => {
            const data = result.data;
            const Component = result.isSuccess ? SuccessSummaryPanel : FailedSummaryPanel;

            return (
              <Component
                key={index}
                imageSrc={data.imageSrc}
                animalName={data.animalName}
                description={data.description}
                imageStyle={data.imageStyle}
                isFirstPanel={data.isFirstPanel}
                title={data.title}
                verdict={result.verdictLabel} // ✅ 성공/실패 텍스트 일치
              />
            );
          })}
        </div>

        {/* === 버튼 그룹 === */}
        <div className="flex justify-between w-[862px] mt-10">
          <button
            type="button"
            onClick={handleRestart}
            className="w-[400px] h-[61px] bg-[#D9DADB] rounded-[20px] hover:bg-[#BFC0C4]"
          >
            <span className="heading-2 font-500 text-[#515151]">챌린지 화면으로 돌아가기</span>
          </button>

          <button
            type="button"
            onClick={handleContinue}
            className="w-[400px] h-[61px] rounded-[20px] hover:opacity-90"
            style={{ backgroundColor: SUCCESS_COLOR_PRIMARY }}
          >
            <span className="heading-2 font-500 text-white">다른 문제 풀기</span>
          </button>
        </div>

        <div className="h-[25px]" />
      </div>
    </div>
  );
}
