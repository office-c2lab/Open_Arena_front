import React from 'react';
// 💡 이미지 경로 확인
import tutorialImage from '../../assets/images/tutorial.png';

// 💡 필수 수정 사항: 분리된 태그 컴포넌트 import
// 파일 경로가 './DifficultyTag'와 './CategoryTag'라고 가정합니다. (경로 확인 필수)

// SolveProblemButton 컴포넌트 import (경로 확인 필수)
import SolveProblemButton from '../Button/SolveProblemButton';
import DifficultyTag from '../Tag/DifficultyTag';
import CategoryTag from '../Tag/CategoryTag';

const ProblemCard = ({ difficulty, category, title, onSolveClick }) => {
  // Tailwind 클래스 정의 (기존 코드 유지)
  const cardClasses = `w-[339px] bg-white shadow-xl rounded-xl flex flex-col overflow-hidden`;
  const imageClasses = `w-full h-[198px] object-cover`;
  const contentClasses = `p-6 flex flex-col gap-2.5`;
  const tagsContainerClasses = `flex space-x-1.5 items-start`;
  const titleClasses = `text-lg font-medium text-[#0F172A] font-['Source Code Pro'] h-[23px]`;

  return (
    <div className={cardClasses.trim()}>
      {/* 🖼️ Image Area */}
      <img src={tutorialImage} alt={`문제 ${title}의 이미지`} className={imageClasses.trim()} />

      {/* 📝 Content Area */}
      <div className={contentClasses.trim()}>
        {/* 🏷️ Tags (난이도 및 카테고리) */}
        <div className={tagsContainerClasses.trim()}>
          {/* 🔴 난이도: DifficultyTag 컴포넌트 사용 */}
          <DifficultyTag>{difficulty}</DifficultyTag>

          {/* 🔵 카테고리: CategoryTag 컴포넌트 사용 */}
          <CategoryTag>{category}</CategoryTag>

          {/* 참고: 이전에 'Tag variant="md"'로 사용하려던 부분은 삭제했습니다. */}
        </div>

        {/* 💡 Title */}
        <h3 className={titleClasses.trim()}>{title}</h3>

        {/* 🚀 Solve Button */}
        <SolveProblemButton onClick={onSolveClick} />
      </div>
    </div>
  );
};

export default ProblemCard;
