// src/features/challenge/ChallengeModals/SuccessModal.jsx

import React, { useCallback } from 'react';
import useModalStore from '@/stores/useModalStore';
import { SuccessSummaryPanel, FailedSummaryPanel } from './SummaryPanels'; // 💡 [수정] 분리된 파일에서 import

// 성공 테마 색상 (버튼에 필요)
const SUCCESS_COLOR_PRIMARY = '#04B07B';

/**
 * 챌린지 성공 결과 모달 컴포넌트
 */
export default function SuccessModal() {
  // --------------------------------------------------------
  // 💡 1. Zustand 스토어에서 상태, 액션, 결과를 가져오기
  // --------------------------------------------------------
  const isSuccessModalOpen = useModalStore(state => state.isSuccessModalOpen);
  const challengeResults = useModalStore(state => state.challengeResults);
  const { closeSuccessModal, resetChatAction } = useModalStore(); // 💡 액션 핸들러 정의

  const handleRestart = useCallback(() => {
    closeSuccessModal();
    resetChatAction();
  }, [closeSuccessModal, resetChatAction]);

  const handleContinue = useCallback(() => {
    closeSuccessModal();
  }, [closeSuccessModal]); // (이하 렌더링 코드)

  if (!isSuccessModalOpen) return null; // 💡 성공 모달: 성공한 패널을 먼저 보여주고, 실패한 패널을 나중에 보여줍니다.

  const sortedPanels = [
    ...challengeResults.filter(result => result.status === 'success'),
    ...challengeResults.filter(result => result.status === 'failed'),
  ];

  return (
    // Overlay: Flexbox를 사용하여 중앙 배치
    <div className="fixed inset-0 bg-[rgba(1,1,1,0.6)] flex justify-center items-center z-[1000]">
      <div // Modal Container: (990px x 680px)
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
        {/* 패널과 버튼 사이 간격 (mt-6 = 24px) */}
        <div className={`flex justify-between w-[862px] mt-10`}>
          {/* 1. 챌린지 화면으로 돌아가기 */}
          <button
            onClick={handleRestart}
            className="flex items-center justify-center w-[400px] h-[61px] rounded-[20px] box-border
      border border-[#E4E8F0] bg-[#D9DADB] hover:bg-[#BFC0C4] transition duration-200 cursor-pointer"
            style={{
              padding: '12px 42px',
            }}
          >
            <span className="heading-2 font-500 text-[#515151]">챌린지 화면으로 돌아가기</span>
          </button>
          {/* 2. 다른 문제 풀기 */}
          <button
            onClick={handleContinue}
            className="flex items-center justify-center w-[400px] h-[61px] rounded-[20px]
      hover:opacity-90 transition duration-200 cursor-pointer"
            style={{ padding: '12px', backgroundColor: SUCCESS_COLOR_PRIMARY }}
          >
            <span className="heading-2 font-500 text-white">다른 문제 풀기</span>
          </button>
        </div>
        {/* 하단 여백 (25px) */}
      </div>
    </div>
  );
}
