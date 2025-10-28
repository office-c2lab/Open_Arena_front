// src/components/ProblemCard/ProblemCard.jsx (수정)

import React, { useState } from 'react';
import tutorialImage from '../../assets/images/tutorial.png';

import SolveProblemButton from '../Button/SolveProblemButton';
import DifficultyTag from '../Tag/DifficultyTag';
import CategoryTag from '../Tag/CategoryTag';

const ProblemCard = ({ challenge, onSolveClick }) => {
  const { title, difficulty, category } = challenge;

  // 1. 호버 상태 관리 추가
  const [isHovered, setIsHovered] = useState(false);

  // 2. 이벤트 핸들러 정의
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  // Tailwind 클래스 정의 (기존 코드 유지 및 추가)
  // 💡 cardClasses에 relative 추가
  const cardClasses = `w-[339px] bg-white shadow-xl rounded-xl flex flex-col overflow-hidden relative`;

  // 💡 imageContainerClasses: 이미지와 오버레이를 감싸는 컨테이너
  const imageContainerClasses = `relative w-full h-[198px]`;
  // 💡 imageClasses: 투명도 조절 클래스 제거 (opacity-50 제거)
  const imageClasses = `w-full h-full object-cover`;

  const contentClasses = `p-6 flex flex-col gap-2.5`;
  const tagsContainerClasses = `flex space-x-1.5 items-start`;
  const titleClasses = `heading-3 font-500 line-clamp-2`;

  // 💡 오버레이 텍스트 클래스 정의 (요청하신 스타일 기반)

  // 오버레이 컨테이너 클래스: 이미지 위에 덮고, 반투명 검은색 배경 추가 (bg-black/40)
  // pointer-events-none 추가하여 버튼 클릭 방해 방지
  const overlayClasses = `absolute inset-0 flex flex-col justify-start p-6 text-white pointer-events-none transition-opacity duration-300 bg-black/40`;

  // 첫 번째 텍스트 블록
  const textBlock1Classes = `body-medium font-300 text-gray-200`;
  // 💡 요청하신 색상(#D9DADB)에 가장 가까운 Tailwind 클래스인 text-gray-200 사용

  // 두 번째 텍스트 블록
  const textBlock2Classes = ` body-medium font-700 text-red-500 mt-10`;
  // 💡 요청하신 색상(#FF4854)에 가장 가까운 Tailwind 클래스인 text-red-500 사용

  return (
    // 💡 호버 이벤트 핸들러 추가
    <div
      className={cardClasses.trim()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 🖼️ Image Area & Overlay Container */}
      <div className={imageContainerClasses.trim()}>
        <img src={tutorialImage} alt={`문제 ${title}의 이미지`} className={imageClasses.trim()} />

        {/* 💡 Hover Overlay (호버 시에만 렌더링) */}
        {isHovered && (
          // 💡 오버레이에 반투명 배경 (bg-black/40) 추가
          <div className={overlayClasses}>
            {/* 첫 번째 텍스트 블록 */}
            <p className={textBlock1Classes}>
              이 AI는 사용자의 입력을 받아 응답을 생성합니다. 하지만 AI는 특정 단어를 출력하지
              않도록 프로그래밍되어 있습니다. 프롬프트 인젝션 기법을 사용하여 AI의 제약을
              우회하세요.
            </p>

            {/* 두 번째 텍스트 블록 */}
            <p className={textBlock2Classes}>
              AI에게 “해킹 성공!” 이라는 문구를 출력하도록 만드세요.
            </p>
          </div>
        )}
      </div>

      {/* 📝 Content Area (나머지 부분 유지) */}
      <div className={contentClasses.trim()}>
        <div className={tagsContainerClasses.trim()}>
          <DifficultyTag>{difficulty}</DifficultyTag>
          <CategoryTag>{category}</CategoryTag>
        </div>
        <h3 className={titleClasses.trim()}>{title}</h3>
        <SolveProblemButton onClick={onSolveClick} />
      </div>
    </div>
  );
};

export default ProblemCard;
