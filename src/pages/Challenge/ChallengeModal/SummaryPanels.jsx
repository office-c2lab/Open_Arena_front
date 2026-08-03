// /src/features/challenge/ChallengeModals/SummaryPanels.jsx

import React from 'react';

// 성공 테마 색상
const SUCCESS_COLOR_PRIMARY = '#04B07B';
const SUCCESS_COLOR_BACKGROUND = 'rgba(4, 176, 123, 0.16)';

// 실패 테마 색상
const FAILED_COLOR_PRIMARY = '#E60513';
const FAILED_COLOR_BACKGROUND = 'rgba(255, 8, 74, 0.16)';

// 💡 [추가] REVIEW (재검토/오류) 테마 색상
const REVIEW_COLOR_PRIMARY = '#FFA500'; // 주황색
const REVIEW_COLOR_BACKGROUND = 'rgba(255, 165, 0, 0.16)';

// === 단일 성공 요약 패널 컴포넌트 ===
/**
 * 챌린지 성공 결과 중, 3개 AI 모델 각각의 성공 내용을 보여주는 패널
 */
export const SuccessSummaryPanel = ({ imageSrc, animalName, title, description, imageStyle }) => {
  const animalNameColor = SUCCESS_COLOR_PRIMARY;

  return (
    <div className="flex min-h-[150px] w-full max-w-[877px] overflow-hidden rounded-[20px] border border-[#EEF0F4] bg-white shadow-[0_8px_22px_rgba(15,23,42,0.08)] sm:min-h-[160px]">
      {/* 1. 좌측 초록색 영역 (160px x 160px) - Flex Item 1 */}
      <div
        className="z-0 flex w-[118px] shrink-0 flex-col items-center justify-between border-r border-[#EEF0F4] py-[14px] sm:w-[160px] sm:py-[16px]"
        style={{
          backgroundColor: SUCCESS_COLOR_BACKGROUND, // 초록 배경
        }}
      >
        {/* 3. 동물 이미지 그룹 */}
        <div
          className="flex h-[74px] w-[68px] items-center justify-center overflow-hidden rounded-full border border-white bg-white shadow-[0_6px_14px_rgba(15,23,42,0.07)] sm:h-[90px] sm:w-[80px]"
        >
          <img
            src={imageSrc}
            alt={animalName}
            style={{
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
          성공
        </p>
      </div>
      {/* 2. 우측 흰색 내용 박스 (717px x 160px) - Flex Item 2 */}
      <div className="z-0 flex min-w-0 flex-1 flex-col items-center bg-white">
        {/* 5. 동물 이름 (모델명) */}
        <p
          className="heading-3 font-700 mt-[14px] w-full px-3 text-center"
          style={{ color: animalNameColor }}
        >
          {title} {/* 💡 Success에서는 title이 모델명입니다. */}
        </p>
        {/* 6. 설명 텍스트 - 중앙 배치 */}
        <p className="no-scrollbar body-large font-500 mt-5 max-h-[82px] w-full overflow-auto px-4 text-center leading-7 text-[#0F172A] sm:mt-[36px] sm:max-h-[90px] sm:px-6">
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
 * @param {string} verdict - 'FAILED', 'REVIEW' 등의 상태를 나타냅니다.
 */
export const FailedSummaryPanel = ({
  imageSrc,
  animalName,
  description,
  imageStyle,
  title, // 모델명
  verdict, // 💡 [추가] 상태를 받습니다.
}) => {
  // --------------------------------------------------------
  // 💡 1. 상태에 따른 스타일 및 텍스트 설정
  // --------------------------------------------------------
  const isReview = verdict === 'REVIEW';

  const panelTheme = {
    primaryColor: isReview ? REVIEW_COLOR_PRIMARY : FAILED_COLOR_PRIMARY,
    backgroundColor: isReview ? REVIEW_COLOR_BACKGROUND : FAILED_COLOR_BACKGROUND,
    statusText: isReview ? '재검토' : '실패',
  };

  const animalNameColor = panelTheme.primaryColor;

  return (
    <div className="flex min-h-[150px] w-full max-w-[877px] overflow-hidden rounded-[20px] border border-[#EEF0F4] bg-white shadow-[0_8px_22px_rgba(15,23,42,0.08)] sm:min-h-[160px]">
      {/* 1. 좌측 색상 영역 */}
      <div
        className="z-0 flex w-[118px] shrink-0 flex-col items-center justify-between border-r border-[#EEF0F4] py-[14px] sm:w-[160px] sm:py-[16px]"
        style={{
          backgroundColor: panelTheme.backgroundColor, // 동적 배경색
        }}
      >
        {/* 3. 동물 이미지 그룹 */}
        <div
          className="flex h-[74px] w-[68px] items-center justify-center overflow-hidden rounded-full border border-white bg-white shadow-[0_6px_14px_rgba(15,23,42,0.07)] sm:h-[90px] sm:w-[80px]"
        >
          <img
            src={imageSrc}
            alt={animalName}
            style={{
              ...imageStyle.img,
              width: imageStyle.img?.width ? `calc(${imageStyle.img.width} * 0.7)` : 'auto',
              height: imageStyle.img?.height ? `calc(${imageStyle.img.height} * 0.7)` : 'auto',
              position: 'relative',
            }}
            className={'object-cover'}
          />
        </div>
        {/* 4. '실패/재검토' 텍스트 (동적 표시) */}
        <p
          className={`heading-2 font-700`}
          style={{ marginBottom: '0px', color: panelTheme.primaryColor }} // 동적 텍스트 색상
        >
          {panelTheme.statusText} {/* '실패' 또는 '재검토' */}
        </p>
      </div>
      {/* 2. 우측 흰색 내용 박스 */}
      <div className="z-0 flex min-w-0 flex-1 flex-col items-center bg-white">
        {/* 5. 모델 이름 (title) */}
        <p
          className="heading-3 font-700 mt-[14px] w-full px-3 text-center"
          style={{ color: animalNameColor }}
        >
          {title} {/* 💡 [수정] 모델명 사용 */}
        </p>
        {/* 6. 설명 텍스트 */}
        <p className="no-scrollbar body-large font-500 mt-[10px] max-h-[96px] w-full overflow-auto px-4 text-center leading-7 text-[#0F172A] sm:max-h-[100px] sm:px-6">
          {description}
        </p>
      </div>
    </div>
  );
};
