// src/features/challenge/ChallengeModals/FailedModal.jsx

import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import useModalStore from '@/stores/useModalStore';
import { useSessionStore } from '@/stores/useSessionStore';
import { SuccessSummaryPanel, FailedSummaryPanel } from './SummaryPanels';

export default function FailedModal() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isFailedModalOpen = useModalStore(state => state.isFailedModalOpen);
  const challengeResults = useModalStore(state => state.challengeResults);
  const { closeFailedModal, resetChatAction } = useModalStore();
  const clearSession = useSessionStore(state => state.clearSession);

  // ✅ 문제 다시 풀기
  const handleRestart = useCallback(() => {
    closeFailedModal();
    resetChatAction();
    clearSession();
    queryClient.invalidateQueries(['problemBundle']); // 리렌더 유도
  }, [closeFailedModal, resetChatAction, clearSession, queryClient]);

  // ✅ 다른 문제 풀기
  const handleContinue = useCallback(() => {
    closeFailedModal();
    clearSession();
    queryClient.invalidateQueries(['problemBundle']);
    navigate('/kategorie');
  }, [closeFailedModal, clearSession, queryClient, navigate]);

  if (!isFailedModalOpen) return null;

  // ✅ 상태 정규화 및 올바른 컴포넌트 매핑
  const normalizedPanels = challengeResults.map(result => {
    const normalizedStatus = result.status?.toLowerCase();

    const isSuccess = normalizedStatus === 'success' || normalizedStatus === 'passed';
    const isRecheck =
      normalizedStatus === 'unsubmitted' ||
      normalizedStatus === 'pending' ||
      normalizedStatus === 'review';

    let verdictLabel = '실패';
    if (isSuccess) verdictLabel = '성공';
    else if (isRecheck) verdictLabel = '재검토';

    return {
      ...result,
      normalizedStatus,
      isSuccess,
      isRecheck,
      verdictLabel,
    };
  });

  // ✅ 순서 고정 (정렬 없이 그대로 표시)
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
                verdict={result.verdictLabel} // ✅ "성공 / 실패 / 재검토"
              />
            );
          })}
        </div>

        {/* === 버튼 그룹 === */}
        <div className="flex justify-between w-[862px] mt-10">
          <button
            type="button"
            onClick={handleRestart}
            className="w-[400px] h-[61px] bg-[#D9DADB] rounded-[20px] hover:bg-[#BFC0C4] transition duration-200"
          >
            <span className="heading-2 font-500 text-[#515151]">문제 다시 풀기</span>
          </button>

          <button
            type="button"
            onClick={handleContinue}
            className="w-[400px] h-[61px] bg-[#FF6289] rounded-[20px] hover:bg-[#e6597c] transition duration-200"
          >
            <span className="heading-2 font-500 text-white">다른 문제 풀기</span>
          </button>
        </div>

        <div className="h-[25px]" />
      </div>
    </div>
  );
}
