// src/features/challenge/ChallengeModals/SuccessModal.jsx (최종 수정 - 데이터 경로 변경)

import React from 'react';
import { successPanelsData } from '../data/challengeModalData';
// 💡 데이터 파일 임포트 경로 수정

// 성공 테마 색상 (초록 계열)
const SUCCESS_COLOR_PRIMARY = '#04B07B';
const SUCCESS_COLOR_BACKGROUND = 'rgba(4, 176, 123, 0.2)'; // #04B07B, opacity 0.2

// === 단일 성공 요약 패널 컴포넌트 (877px X 220px - 가로 Flow-based 레이아웃) ===
/**
 * 챌린지 성공 결과 중, 3개 AI 모델 각각의 성공 내용을 보여주는 패널
 */
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
        <p className="heading-3 font-700 text-center text-black  w-[603px] h-[120px] overflow-auto mt-[60px] px-4">
          {description}
        </p>
      </div>
    </div>
  );
};
// ===========================================

/**
 * 챌린지 성공 결과 모달 컴포넌트
 */
export default function SuccessModal({ isOpen, onRestart, onContinue, onHelp }) {
  if (!isOpen) return null;

  // panelsData를 외부 파일에서 가져옴
  const panelsData = successPanelsData;

  const handleAction = (handler, message) => {
    if (handler) {
      handler();
    } else {
      console.warn(message);
    }
  };

  return (
    // Overlay: Flexbox를 사용하여 중앙 배치
    <div className="fixed inset-0 bg-[rgba(1,1,1,0.6)] flex justify-center items-center z-[1000]">
      <div
        // Modal Container: (990px x 849px)
        className="w-[990px] h-[849px] bg-[#FAFAFA] rounded-[30px] flex flex-col items-center"
        style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}
      >
        {/* 상단 여백 (34px) */}
        <div className="h-[34px] w-full" />

        {/* === 3개 성공 요약 패널 그룹 (중앙 배치) === */}
        <div className="flex flex-col gap-4 w-[877px]">
          {panelsData.map((data, index) => (
            <SuccessSummaryPanel
              key={index}
              imageSrc={data.imageSrc}
              animalName={data.animalName}
              title={data.title}
              description={data.description}
              imageStyle={data.imageStyle}
              isFirstPanel={data.isFirstPanel}
            />
          ))}
        </div>

        {/* 패널과 버튼 사이 간격 (mt-8 = 32px) */}
        <div className={`flex justify-between w-[862px] mt-8`}>
          {/* 1. 챌린지 화면으로 돌아가기 (이전 '챌린지 재시작' 버튼 위치 및 스타일) */}
          <button
            onClick={() => handleAction(onRestart, '챌린지 화면으로 돌아가기 핸들러가 없습니다.')}
            // w-[400px]로 너비 조정
            className="flex items-center justify-center w-[400px] h-[61px] rounded-[20px] box-border
              border border-[#E4E8F0] hover:bg-gray-100 transition duration-200"
            style={{
              background: 'rgba(228, 232, 240, 0.4)',
              padding: '12px 42px',
            }}
          >
            <span className="heading-2 font-300 text-[#515151]">챌린지 화면으로 돌아가기</span>
          </button>

          {/* 2. 다른 문제 풀기 (이전 '대화 계속 하기' 버튼 위치 및 스타일) - 초록색 */}
          <button
            onClick={() => handleAction(onContinue, '다른 문제 풀기 핸들러가 없습니다.')}
            // w-[400px]로 너비 조정
            className="flex items-center justify-center w-[400px] h-[61px] rounded-[20px]
              hover:opacity-90 transition duration-200"
            style={{ padding: '12px', backgroundColor: SUCCESS_COLOR_PRIMARY }}
          >
            <span className="heading-2 font-300 text-white">다른 문제 풀기</span>
          </button>
        </div>

        {/* 하단 여백 (30px) */}
        <div className="h-[30px] w-full" />
      </div>
    </div>
  );
}
