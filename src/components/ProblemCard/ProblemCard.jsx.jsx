// src/components/ProblemCard/ProblemCard.jsx (수정)

import React from 'react';
// 💡 이미지 경로 확인
import tutorialImage from '../../assets/images/tutorial.png';

// 💡 필수 수정 사항: 분리된 태그 컴포넌트 import
import SolveProblemButton from '../Button/SolveProblemButton';
import DifficultyTag from '../Tag/DifficultyTag'; // 💡 복구
import CategoryTag from '../Tag/CategoryTag';

// 💡 prop에서 difficulty 다시 받도록 변경
const ProblemCard = ({ challenge, onSolveClick }) => {
  // 💡 difficulty 추출 복구
  const { title, difficulty, category } = challenge; // Tailwind 클래스 정의 (기존 코드 유지)

  const cardClasses = `w-[339px] bg-white shadow-xl rounded-xl flex flex-col overflow-hidden`;
  const imageClasses = `w-full h-[198px] object-cover`;
  const contentClasses = `p-6 flex flex-col gap-2.5`;
  const tagsContainerClasses = `flex space-x-1.5 items-start`;
  const titleClasses = `heading-3 font-500 line-clamp-2`;

  return (
    <div className={cardClasses.trim()}>
      {/* 🖼️ Image Area */}
      <img src={tutorialImage} alt={`문제 ${title}의 이미지`} className={imageClasses.trim()} />
      {/* 📝 Content Area */}
      <div className={contentClasses.trim()}>
        {/* 🏷️ Tags (난이도 및 카테고리 복구) */}
        <div className={tagsContainerClasses.trim()}>
          {/* 🔴 난이도: DifficultyTag 컴포넌트 사용 💡 복구 */}
          <DifficultyTag>{difficulty}</DifficultyTag>
          {/* 🔵 카테고리: CategoryTag 컴포넌트 사용 */}
          <CategoryTag>{category}</CategoryTag>
        </div>
        {/* 💡 Title */} <h3 className={titleClasses.trim()}>{title}</h3>
        {/* 🚀 Solve Button */}
        <SolveProblemButton onClick={onSolveClick} />
      </div>
    </div>
  );
};

export default ProblemCard;
