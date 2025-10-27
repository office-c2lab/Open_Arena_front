// src/features/challenge/ChallengeModals/FailedModal.jsx

import React, { useCallback } from 'react';
import useModalStore from '@/stores/useModalStore';
import { SuccessSummaryPanel, FailedSummaryPanel } from './SummaryPanels'; // 💡 [수정] 분리된 파일에서 import

/**
 * 챌린지 실패 결과 모달 컴포넌트
 */
export default function FailedModal() {
  // --------------------------------------------------------
  // 💡 1. Zustand 스토어에서 상태, 액션, 결과를 가져오기
  // --------------------------------------------------------
  const isFailedModalOpen = useModalStore(state => state.isFailedModalOpen);
  const challengeResults = useModalStore(state => state.challengeResults);
  const { closeFailedModal, resetChatAction, openDebugModal } = useModalStore(); // --------------------------------------------------------
  // 💡 2. 액션 핸들러 정의
  // --------------------------------------------------------
  const handleRestart = useCallback(() => {
    closeFailedModal();
    resetChatAction();
  }, [closeFailedModal, resetChatAction]);

  const handleContinue = useCallback(() => {
    closeFailedModal();
  }, [closeFailedModal]);

  const handleHelp = useCallback(() => {
    closeFailedModal();
    openDebugModal();
  }, [closeFailedModal, openDebugModal]); // (이하 렌더링 코드)

  if (!isFailedModalOpen) return null; // 💡 실패 모달: 실패한 패널을 먼저 보여주고, 성공한 패널을 나중에 보여줍니다.

  const sortedPanels = [
    ...challengeResults.filter(result => result.status === 'failed'),
    ...challengeResults.filter(result => result.status === 'success'),
  ];

  return (
    // Overlay: Flexbox를 사용하여 중앙 배치
    <div className="fixed inset-0 bg-[rgba(1,1,1,0.6)] flex justify-center items-center z-[1000]">
      <div // Modal Container: (990px x 680px). 중앙 정렬을 위한 Flex-col 유지
        className="w-[990px] h-[680px] bg-[#FAFAFA] rounded-[30px] flex flex-col items-center"
        style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}
      >
        {/* 상단 여백 (30px) */}
        <div className="h-[30px] w-full" />
        {/* === 3개 요약 패널 그룹 (중앙 배치) === */}
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
                isFirstPanel={data.isFirstPanel} // SuccessSummaryPanel에 필요한 title prop을 추가합니다.
                title={data.title}
              />
            );
          })}
        </div>
        {/* === 액션 버튼 그룹 (Flexbox) - 중앙 배치 === */}
        <div className={`flex justify-between w-[862px] mt-10`}>
          {/* 1. 챌린지 재시작 (Frame 2087327750) */}
          <button
            onClick={handleRestart}
            className="flex items-center justify-center w-[278px] h-[61px] rounded-[20px] box-border
      border border-[#E4E8F0] hover:bg-gray-100 transition duration-200"
            style={{
              background: 'rgba(228, 232, 240, 0.4)',
              padding: '12px 42px',
            }}
          >
            <span className="heading-2 font-300 text-[#515151]">챌린지 재시작</span>
          </button>
          {/* 2. 대화 계속 하기 (Frame 2087327751) */}
          <button
            onClick={handleContinue}
            className="flex items-center justify-center w-[278px] h-[61px] bg-[#FF6289] rounded-[20px]
      hover:bg-[#e6597c] transition duration-200"
            style={{ padding: '12px' }}
          >
            <span className="heading-2 font-300 text-white">대화 계속 하기</span>
          </button>
          {/* 3. 도움 요청 (Frame 2087327752) */}
          <button
            onClick={handleHelp}
            className="flex items-center justify-center w-[278px] h-[61px] rounded-[20px] box-border
      border border-[#FF6289] bg-white hover:bg-pink-50 transition duration-200"
            style={{ padding: '12px 36px' }}
          >
            <span className="heading-2 font-300 text-[#FF6289]">도움 요청</span>
          </button>
        </div>
        {/* 하단 여백 (25px) */}
        <div className="h-[25px] w-full" />
      </div>
    </div>
  );
}
