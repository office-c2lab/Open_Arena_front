// src/features/challenge/ChallengeModals/FailedModal.jsx (최종 수정 - 데이터 경로 변경)

import React, { useCallback } from 'react';
// 💡 Zustand 스토어 임포트
import useModalStore from '@/stores/useModalStore';
import { failedPanelsData } from '../data/challengeModalData';
// 💡 데이터 파일 임포트 경로 수정

// === 단일 실패 요약 패널 컴포넌트 ===
/**
 * 챌린지 실패 결과 중, 3개 AI 모델 각각의 실패 내용을 보여주는 패널
 */
const FailedSummaryPanel = ({ imageSrc, animalName, description, imageStyle, isFirstPanel }) => {
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
          style={{
            transform: isFirstPanel ? 'scaleX(-1)' : 'none',
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
        {/* 4. '실패' 텍스트 */}
        <p
          className={`font-['Noto Sans KR'] font-bold text-[36px] leading-[44px] text-[#E60513]`}
          style={{ fontWeight: 700, marginBottom: '0px' }}
        >
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
          className="font-['Noto Sans KR'] font-medium text-[20px] leading-[26px] text-center w-full mt-[15px]"
          style={{ fontWeight: 500, color: animalNameColor }}
        >
          {animalName}
        </p>
        {/* 6. 설명 텍스트 */}
        <p
          className="font-['Noto Sans KR'] font-[350] text-[16px] leading-[24px] text-center text-black w-[603px] h-[120px] overflow-auto mt-[8px] px-4"
          style={{
            fontWeight: 350,
          }}
        >
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
  // 💡 1. Zustand 스토어에서 상태와 액션을 직접 가져오기
  // --------------------------------------------------------
  const isFailedModalOpen = useModalStore(state => state.isFailedModalOpen);
  const { closeFailedModal, resetChatAction, openDebugModal } = useModalStore();
  // --------------------------------------------------------
  // 💡 2. 액션 핸들러 정의
  // --------------------------------------------------------

  const handleRestart = useCallback(() => {
    // 1. 실패 모달 닫기
    closeFailedModal();
    // 2. 채팅 초기화
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

  // panelsData를 외부 파일에서 가져옴
  const panelsData = failedPanelsData;

  return (
    // Overlay: Flexbox를 사용하여 중앙 배치
    <div className="fixed inset-0 bg-[rgba(1,1,1,0.6)] flex justify-center items-center z-[1000]">
      <div // Modal Container: (990px x 849px). 중앙 정렬을 위한 Flex-col 유지
        className="w-[990px] h-[849px] bg-[#FAFAFA] rounded-[30px] flex flex-col items-center"
        style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}
      >
        {/* 상단 여백 (34px) */}
        <div className="h-[34px] w-full" />
        {/* === 3개 실패 요약 패널 그룹 (중앙 배치) === */} {/* 간격: gap-4 (16px) */}
        <div className="flex flex-col gap-4 w-[877px]">
          {panelsData.map((data, index) => (
            <FailedSummaryPanel
              key={index}
              imageSrc={data.imageSrc}
              animalName={data.animalName}
              description={data.description}
              imageStyle={data.imageStyle}
              isFirstPanel={data.isFirstPanel}
            />
          ))}
        </div>
        {/* === 액션 버튼 그룹 (Flexbox) - 중앙 배치 === */}
        {/* 패널과 버튼 사이 간격 추가: mt-8 (32px) */}
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
            <span className="font-['Noto Sans KR'] font-[350] text-2xl leading-[36px] text-[#515151]">
              챌린지 재시작
            </span>
          </button>
          {/* 2. 대화 계속 하기 (Frame 2087327751) */}
          <button
            onClick={handleContinue}
            className="flex items-center justify-center w-[278px] h-[61px] bg-[#FF6289] rounded-[20px]
              hover:bg-[#e6597c] transition duration-200"
            style={{ padding: '12px' }}
          >
            <span className="font-['Noto Sans KR'] font-[350] text-2xl leading-[36px] text-white">
              대화 계속 하기
            </span>
          </button>
          {/* 3. 도움 요청 (Frame 2087327752) */}
          <button
            onClick={handleHelp}
            className="flex items-center justify-center w-[278px] h-[61px] rounded-[20px] box-border
              border border-[#FF6289] bg-white hover:bg-pink-50 transition duration-200"
            style={{ padding: '12px 36px' }}
          >
            <span className="font-['Noto Sans KR'] font-[350] text-2xl leading-[36px] text-[#FF6289]">
              도움 요청
            </span>
          </button>
        </div>
        {/* 하단 여백 (총 높이 849px를 맞추기 위해 30px 조정) */}
        <div className="h-[30px] w-full" />
      </div>
    </div>
  );
}
