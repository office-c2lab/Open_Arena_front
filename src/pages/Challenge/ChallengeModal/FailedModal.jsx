import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import useModalStore from '@/stores/useModalStore';
import { useSessionStore } from '@/stores/useSessionStore';
import { SuccessSummaryPanel, FailedSummaryPanel } from './SummaryPanels';

export default function FailedModal({
  isOpen,
  onClose,
  previewMode = false,
  previewResults,
  embeddedPreview = false,
  embeddedFill = false,
  previewScaleClassName = '',
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isFailedModalOpen = useModalStore(state => state.isFailedModalOpen);
  const challengeResults = useModalStore(state => state.challengeResults);
  const { closeFailedModal, resetChatAction } = useModalStore();
  const clearSession = useSessionStore(state => state.clearSession);

  // 💡 새로운 대화 시작
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

  const shouldOpen = previewMode ? isOpen : isFailedModalOpen;

  const handlePreviewClose = useCallback(() => {
    if (onClose) onClose();
  }, [onClose]);

  if (!shouldOpen) return null;

  const modalResults = previewMode ? (previewResults ?? []) : challengeResults;
  const sortedPanels = [
    ...modalResults.filter(result => result.status !== 'success'),
    ...modalResults.filter(result => result.status === 'success'),
  ];
  const wrapperClassName = embeddedPreview
    ? embeddedFill
      ? 'absolute inset-0 bg-[rgba(1,1,1,0.6)] flex justify-center items-center z-[20]'
      : 'relative flex justify-center items-center'
    : 'fixed inset-0 bg-[rgba(1,1,1,0.6)] flex justify-center items-center z-[1000]';
  const restartHandler = previewMode ? handlePreviewClose : handleRestart;
  const continueHandler = previewMode ? handlePreviewClose : handleContinue;

  return (
    <div className={wrapperClassName}>
      <div
        className={`flex max-h-[calc(100vh-32px)] w-[min(990px,calc(100vw-32px))] flex-col items-center overflow-hidden rounded-[30px] border border-[#EEF0F4] bg-white py-6 shadow-[0_18px_40px_rgba(15,23,42,0.16)] sm:py-8 ${previewScaleClassName}`}
      >
        {/* === 결과 패널 === */}
        <div className="no-scrollbar flex w-full max-w-[877px] flex-1 flex-col gap-4 overflow-y-auto px-4 sm:px-0">
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
        <div className="mt-6 flex w-full max-w-[862px] flex-col gap-3 px-4 sm:mt-8 sm:flex-row sm:justify-between sm:px-0">
          <button
            type="button"
            onClick={restartHandler}
            className="flex h-[56px] w-full cursor-pointer items-center justify-center rounded-[18px] bg-[#D9DADB] transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#BFC0C4] sm:h-[61px] sm:w-[400px]"
          >
            <span className="heading-2 font-700 text-[#515151]">새로운 대화 시작</span>
          </button>
          <button
            type="button"
            onClick={continueHandler}
            className="flex h-[56px] w-full cursor-pointer items-center justify-center rounded-[18px] bg-[#FF4854] shadow-[0_3px_8px_rgba(255,72,84,0.16)] transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#FF4854]/90 hover:shadow-[0_5px_12px_rgba(255,72,84,0.18)] sm:h-[61px] sm:w-[400px]"
          >
            <span className="heading-2 font-700 text-white">다른 문제 풀기</span>
          </button>
        </div>
      </div>
    </div>
  );
}
