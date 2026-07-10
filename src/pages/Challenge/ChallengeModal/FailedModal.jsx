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
      <div className="w-[990px] h-[680px] bg-white rounded-[30px] border border-[#EEF0F4] flex flex-col items-center shadow-[0_18px_40px_rgba(15,23,42,0.16)]">
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
            className="w-[400px] h-[61px] bg-[#D9DADB] rounded-[18px] hover:bg-[#BFC0C4] transition-all duration-200 hover:-translate-y-[1px] cursor-pointer"
          >
            <span className="heading-2 font-700 text-[#515151]">문제 다시 풀기</span>
          </button>
          <button
            type="button"
            onClick={handleContinue}
            className="w-[400px] h-[61px] bg-[#FF4854] rounded-[18px] shadow-[0_3px_8px_rgba(255,72,84,0.16)] hover:-translate-y-[1px] hover:bg-[#FF4854]/90 hover:shadow-[0_5px_12px_rgba(255,72,84,0.18)] transition-all duration-200 cursor-pointer"
          >
            <span className="heading-2 font-700 text-white">다른 문제 풀기</span>
          </button>
        </div>
      </div>
    </div>
  );
}
