// src/features/challenge/ChallengeModals/FailedModal.jsx (전체 결과 렌더링하도록 수정)

import React, { useCallback } from 'react';
import useModalStore from '@/stores/useModalStore';
// 💡 SuccessSummaryPanel을 사용하기 위해 SuccessModal.jsx에서 가져와야 하지만,
// 현재 파일 구조상 독립된 컴포넌트로 간주하고,
// 여기서는 FailedSummaryPanel의 복제본을 SuccessSummaryPanel로 가정하거나,
// 두 컴포넌트가 모두 동일한 파일에 정의되어 있다고 가정하고 진행합니다.
// 실제 프로젝트에서는 SummaryPanel.jsx 등으로 분리하는 것이 좋습니다.
// 여기서는 코드 복잡성을 줄이기 위해 FailedModal에 SuccessSummaryPanel 정의를 추가합니다.

// 성공 테마 색상 (SuccessSummaryPanel에 필요)
const SUCCESS_COLOR_PRIMARY = '#04B07B';
const SUCCESS_COLOR_BACKGROUND = 'rgba(4, 176, 123, 0.2)';

// === 단일 실패 요약 패널 컴포넌트 ===
/**
 * 챌린지 실패 결과 중, 3개 AI 모델 각각의 실패 내용을 보여주는 패널
 */
const FailedSummaryPanel = ({ imageSrc, animalName, description, imageStyle, isFirstPanel }) => {
  // isFirstPanel은 이 컴포넌트의 첫 번째 패널이 아니라, 원래 데이터의 첫 번째 모델 여부입니다.
  const animalNameColor = isFirstPanel ? '#FF084A' : '#E60513';

  return (
    <div className="w-[877px] h-[220px] flex shadow-lg rounded-[20px]">
      {/* 1. 좌측 빨간색 영역 */}
      <div
        className="w-[220px] h-full flex flex-col justify-between items-center py-[24px] rounded-l-[20px] z-0"
        style={{
          backgroundColor: 'rgba(255, 8, 74, 0.2)',
          boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* 3. 동물 이미지 그룹 */}
        <div
          className={`w-[112px] h-[140px] flex justify-center items-center rounded-full shadow-md overflow-hidden bg-white`}
        >
          <img
            src={imageSrc}
            alt={animalName}
            style={{
              ...imageStyle.img,
              position: 'relative',
            }}
            className={'object-cover'}
          />
        </div>
        {/* 4. '실패' 텍스트 */}
        <p className={`heading-1 font-700 text-[#E60513]`} style={{ marginBottom: '0px' }}>
          실패
        </p>
      </div>
      {/* 2. 우측 흰색 내용 박스 */}
      <div
        className="w-[657px] h-full bg-white flex flex-col items-center rounded-r-[20px] z-0"
        style={{
          boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* 5. 동물 이름 */}
        <p
          className="heading-3 font-500 text-center w-full mt-[15px]"
          style={{ color: animalNameColor }}
        >
          {animalName}
        </p>
        {/* 6. 설명 텍스트 */}
        <p className="body-large font-300 text-center text-black w-[603px] h-[120px] overflow-auto mt-[8px] px-4">
          {description}
        </p>
      </div>
    </div>
  );
};
// ===========================================

// === 단일 성공 요약 패널 컴포넌트 (FailedModal 내부에 정의하여 사용) ===
const SuccessSummaryPanel = ({
  imageSrc,
  animalName,
  title,
  description,
  imageStyle,
  isFirstPanel,
}) => {
  const animalNameColor = SUCCESS_COLOR_PRIMARY;

  return (
    <div className="w-[877px] h-[220px] flex shadow-lg rounded-[20px]">
      {/* 1. 좌측 초록색 영역 (220px x 220px) - Flex Item 1 */}
      <div
        className="w-[220px] h-full flex flex-col justify-between items-center py-[24px] rounded-l-[20px] z-0"
        style={{
          backgroundColor: SUCCESS_COLOR_BACKGROUND, // 초록 배경
          boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* 3. 동물 이미지 그룹 (112px x 140px) */}
        <div
          className={`w-[112px] h-[140px] flex justify-center items-center rounded-full shadow-md overflow-hidden bg-white`}
          style={{
            transform: 'none',
          }}
        >
          <img
            src={imageSrc}
            alt={animalName}
            style={{
              ...imageStyle.img,
              position: 'relative',
            }}
            className={'object-cover'}
          />
        </div>
        {/* 4. '성공' 텍스트 */}
        <p
          className={`heading-1 font-700`}
          style={{ marginBottom: '0px', color: SUCCESS_COLOR_PRIMARY }}
        >
          {title}
        </p>
      </div>
      {/* 2. 우측 흰색 내용 박스 (657px x 220px) - Flex Item 2 */}
      <div
        className="w-[657px] h-full bg-white flex flex-col items-center rounded-r-[20px] z-0"
        style={{
          boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* 5. 동물 이름 - top: 15px */}
        <p
          className="heading-3 font-500 text-center w-full mt-[15px]"
          style={{ fontWeight: 500, color: animalNameColor }}
        >
          {animalName}
        </p>
        {/* 6. 설명 텍스트 - top: 49px */}
        <p className="heading-3 font-700 text-center text-black  w-[603px] h-[120px] overflow-auto mt-[60px] px-4">
          {description}
        </p>
      </div>
    </div>
  );
};
// ===========================================

/**
 * 챌린지 실패 결과 모달 컴포넌트
 */
export default function FailedModal() {
  // --------------------------------------------------------
  // 💡 1. Zustand 스토어에서 상태, 액션, 결과를 가져오기
  // --------------------------------------------------------
  const isFailedModalOpen = useModalStore(state => state.isFailedModalOpen);
  const challengeResults = useModalStore(state => state.challengeResults);
  const { closeFailedModal, resetChatAction, openDebugModal } = useModalStore();
  // --------------------------------------------------------
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
  }, [closeFailedModal, openDebugModal]);

  // (이하 렌더링 코드)
  if (!isFailedModalOpen) return null;

  // 💡 실패 모달: 실패한 패널을 먼저 보여주고, 성공한 패널을 나중에 보여줍니다.
  const sortedPanels = [
    ...challengeResults.filter(result => result.status === 'failed'),
    ...challengeResults.filter(result => result.status === 'success'),
  ];

  return (
    // Overlay: Flexbox를 사용하여 중앙 배치
    <div className="fixed inset-0 bg-[rgba(1,1,1,0.6)] flex justify-center items-center z-[1000]">
      <div // Modal Container: (990px x 849px). 중앙 정렬을 위한 Flex-col 유지
        className="w-[990px] h-[849px] bg-[#FAFAFA] rounded-[30px] flex flex-col items-center"
        style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}
      >
        {/* 상단 여백 (34px) */}
        <div className="h-[34px] w-full" />
        {/* === 3개 요약 패널 그룹 (중앙 배치) === */} {/* 간격: gap-4 (16px) */}
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
                // SuccessSummaryPanel에 필요한 title prop을 추가합니다.
                title={data.title}
              />
            );
          })}
        </div>
        {/* === 액션 버튼 그룹 (Flexbox) - 중앙 배치 === */}
        <div className={`flex justify-between w-[862px] mt-8`}>
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
        {/* 하단 여백 (총 높이 849px를 맞추기 위해 30px 조정) */}
        <div className="h-[30px] w-full" />
      </div>
    </div>
  );
}
