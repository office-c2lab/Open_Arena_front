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

  // 💡 문제 다시 풀기
  const handleRestart = useCallback(() => {
    closeFailedModal();
    resetChatAction();
    clearSession();
    queryClient.invalidateQueries(['problemBundle']);
  }, [closeFailedModal, resetChatAction, clearSession, queryClient]);

  // 💡 다른 문제 풀기
  const handleContinue = useCallback(() => {
    closeFailedModal();
    clearSession();
    queryClient.invalidateQueries(['problemBundle']);
    navigate('/kategorie');
  }, [closeFailedModal, clearSession, queryClient, navigate]);

  if (!isFailedModalOpen) return null;

  const sortedPanels = [
    ...challengeResults.filter(result => result.status !== 'success'),
    ...challengeResults.filter(result => result.status === 'success'),
  ];

  return (
    <div className="fixed inset-0 bg-[rgba(1,1,1,0.6)] flex justify-center items-center z-[1000]">
      <div className="w-[990px] h-[680px] bg-[#FAFAFA] rounded-[30px] flex flex-col items-center shadow-lg">
        <div className="h-[30px]" />

        {/* === 결과 패널 === */}
        <div className="flex flex-col gap-4 w-[877px]">
          {sortedPanels.map((result, index) => {
            const data = result.data;
            const verdict = (result.status || '').toUpperCase(); // ✅ 대문자 통일

            const Component =
              verdict === 'SUCCESS' || verdict === 'PASSED'
                ? SuccessSummaryPanel
                : FailedSummaryPanel;

            return (
              <Component
                key={index}
                imageSrc={data.imageSrc}
                animalName={data.animalName}
                description={data.description}
                imageStyle={data.imageStyle}
                isFirstPanel={data.isFirstPanel}
                title={data.title}
                verdict={verdict} // ✅ 'FAILED' or 'REVIEW' 전달
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
            <span className="heading-2 font-500 text-[#515151]">문제 다시 풀기</span>
          </button>
          <button
            type="button"
            onClick={handleContinue}
            className="w-[400px] h-[61px] bg-[#FF6289] rounded-[20px] hover:bg-[#e6597c]"
          >
            <span className="heading-2 font-500 text-white">다른 문제 풀기</span>
          </button>
        </div>
      </div>
    </div>
  );
}
