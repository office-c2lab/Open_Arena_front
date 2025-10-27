// /src/features/challenge/ChallengeModals/SummaryPanels.jsx

import React from 'react';

// 성공 테마 색상
const SUCCESS_COLOR_PRIMARY = '#04B07B';
const SUCCESS_COLOR_BACKGROUND = 'rgba(4, 176, 123, 0.2)'; // #04B07B, opacity 0.2

// 실패 테마 색상
const FAILED_COLOR_PRIMARY = '#E60513';
const FAILED_COLOR_BACKGROUND = 'rgba(255, 8, 74, 0.2)'; // #FF084A, opacity 0.2

// === 단일 성공 요약 패널 컴포넌트 ===
/**
 * 챌린지 성공 결과 중, 3개 AI 모델 각각의 성공 내용을 보여주는 패널
 */
export const SuccessSummaryPanel = ({ imageSrc, animalName, title, description, imageStyle }) => {
  const animalNameColor = SUCCESS_COLOR_PRIMARY;

  return (
    <div className="w-[877px] h-[160px] flex shadow-lg rounded-[20px]">
      {/* 1. 좌측 초록색 영역 (160px x 160px) - Flex Item 1 */}
      <div
        className="w-[160px] h-full flex flex-col justify-between items-center py-[16px] rounded-l-[20px] z-0"
        style={{
          backgroundColor: SUCCESS_COLOR_BACKGROUND, // 초록 배경
          boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* 3. 동물 이미지 그룹 (조정: w-[60px] h-[70px]) */}
        <div
          className={`w-[80px] h-[90px] flex justify-center items-center rounded-full shadow-md overflow-hidden bg-white`} // 💡 [수정] 이미지 그룹 크기 조정
        >
          <img
            src={imageSrc}
            alt={animalName}
            style={{
              // 💡 [수정] imageStyle 내부의 이미지 크기도 조정 (기존 대비 약 0.75배)
              ...imageStyle.img,
              width: imageStyle.img?.width ? `calc(${imageStyle.img.width} * 0.7)` : 'auto',
              height: imageStyle.img?.height ? `calc(${imageStyle.img.height} * 0.7)` : 'auto',
              position: 'relative',
            }}
            className={'object-cover'}
          />
        </div>
        {/* 4. '성공' 텍스트 */}
        <p
          className={`heading-2 font-700`}
          style={{ marginBottom: '0px', color: SUCCESS_COLOR_PRIMARY }}
        >
          {title}
        </p>
      </div>
      {/* 2. 우측 흰색 내용 박스 (717px x 160px) - Flex Item 2 */}
      <div
        className="w-[717px] h-full bg-white flex flex-col items-center rounded-r-[20px] z-0"
        style={{
          boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* 5. 동물 이름 - top: 10px */}
        <p
          className="heading-3 font-500 text-center w-full mt-[10px]"
          style={{ color: animalNameColor }}
        >
          {animalName}
        </p>
        {/* 6. 설명 텍스트 - 중앙 배치 */}
        <p className="body-large font-700 text-center text-black w-[680px] h-[90px] overflow-auto mt-[10px] px-4">
          {description}
        </p>
      </div>
    </div>
  );
};
// ===========================================

// === 단일 실패 요약 패널 컴포넌트 ===
/**
 * 챌린지 실패 결과 중, 3개 AI 모델 각각의 실패 내용을 보여주는 패널
 */
export const FailedSummaryPanel = ({
  imageSrc,
  animalName,
  description,
  imageStyle,
  isFirstPanel,
}) => {
  // isFirstPanel prop은 FailedModal에서는 사용하지 않아도 되지만, SuccessSummaryPanel과 통일성을 위해 유지
  const animalNameColor = FAILED_COLOR_PRIMARY;

  return (
    <div className="w-[877px] h-[160px] flex shadow-lg rounded-[20px]">
      {/* 1. 좌측 빨간색 영역 */}
      <div
        className="w-[160px] h-full flex flex-col justify-between items-center py-[16px] rounded-l-[20px] z-0"
        style={{
          backgroundColor: FAILED_COLOR_BACKGROUND,
          boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* 3. 동물 이미지 그룹 (조정: w-[60px] h-[70px]) */}
        <div
          className={`w-[80px] h-[90px] flex justify-center items-center rounded-full shadow-md overflow-hidden bg-white`} // 💡 [수정] 이미지 그룹 크기 조정
        >
          <img
            src={imageSrc}
            alt={animalName}
            style={{
              // 💡 [수정] imageStyle 내부의 이미지 크기도 조정 (기존 대비 약 0.75배)
              ...imageStyle.img,
              width: imageStyle.img?.width ? `calc(${imageStyle.img.width} * 0.7)` : 'auto',
              height: imageStyle.img?.height ? `calc(${imageStyle.img.height} * 0.7)` : 'auto',
              position: 'relative',
            }}
            className={'object-cover'}
          />
        </div>
        {/* 4. '실패' 텍스트 */}
        <p className={`heading-2 font-700 text-[#E60513]`} style={{ marginBottom: '0px' }}>
          실패
        </p>
      </div>
      {/* 2. 우측 흰색 내용 박스 */}
      <div
        className="w-[717px] h-full bg-white flex flex-col items-center rounded-r-[20px] z-0"
        style={{
          boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* 5. 동물 이름 */}
        <p
          className="heading-3 font-500 text-center w-full mt-[10px]"
          style={{ color: animalNameColor }}
        >
          {animalName}
        </p>
        {/* 6. 설명 텍스트 */}
        <p className="body-large font-300 text-center text-black w-[680px] h-[90px] overflow-auto mt-[10px] px-4">
          {description}
        </p>
      </div>
    </div>
  );
};
