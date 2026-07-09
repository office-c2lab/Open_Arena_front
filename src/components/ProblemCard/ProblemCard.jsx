import { useState } from 'react';
import tutorialImage from '../../assets/images/tutorial.png';
import challengeImage from '../../assets/images/challenge.png';

import SolveProblemButton from '../Button/SolveProblemButton';
import CategoryTag from '../Tag/CategoryTag';
import ScoreTag from '../Tag/ScoreTag';
import Skeleton from '../Skeleton/Skeleton'; // Skeleton 컴포넌트 import
import { normalizeProblemCategory } from '@/utils/problemCategory';

const GLASS_CARD_CLASS =
  'border border-white/65 bg-white/48 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_6px_18px_rgba(15,23,42,0.07)] backdrop-blur-md';

const getProblemCardImage = category => {
  if (category === '챌린지') {
    return challengeImage;
  }

  return tutorialImage;
};

// ====================================================
// ProblemCardSkeleton 컴포넌트
// ====================================================
const ProblemCardSkeleton = () => {
  const cardClasses = `w-[339px] rounded-[20px] flex flex-col overflow-hidden relative ${GLASS_CARD_CLASS}`;
  const imageContainerClasses = `relative w-full h-[176px] overflow-hidden`;
  const contentClasses = `p-6 flex flex-col gap-2.5`;
  const tagsContainerClasses = `flex space-x-1.5 items-start`;

  return (
    <div className={cardClasses.trim()}>
      {/* 이미지 영역 스켈레톤 */}
      <div className={imageContainerClasses.trim()}>
        <Skeleton className="w-full h-full" />
      </div>

      {/* 내용 영역 스켈레톤 */}
      <div className={contentClasses.trim()}>
        <div className={tagsContainerClasses.trim()}>
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-11/12" />
        </div>
        <Skeleton className="h-10 w-full mt-2 rounded-lg" />
      </div>
    </div>
  );
};

// ====================================================
// ProblemCard 본체
// ====================================================
const ProblemCard = ({ challenge, onSolveClick, isLoading = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (isLoading) {
    return <ProblemCardSkeleton />;
  }

  // ✅ score 필드 사용
  const { title, category, sub_description, goal, score } = challenge;
  const normalizedCategory = normalizeProblemCategory(category);
  const currentImage = getProblemCardImage(normalizedCategory);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const cardClasses = `group w-[339px] rounded-[20px] flex flex-col overflow-hidden relative transition-all duration-200 hover:-translate-y-[1px] hover:bg-white/64 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_10px_22px_rgba(15,23,42,0.10)] ${GLASS_CARD_CLASS}`;
  const imageContainerClasses = `relative w-full h-[190px] overflow-hidden`;
  const imageClasses = `w-full h-full object-cover transition-transform duration-300 ease-in-out ${
    isHovered ? 'scale-[1.08]' : 'scale-[1.03]'
  }`;
  const contentClasses = `p-6 flex flex-col gap-2.5`;
  const tagsContainerClasses = `flex space-x-1.5 items-start`;
  const titleClasses = `heading-3 font-500 line-clamp-2 text-[#0F172A]`;
  const overlayClasses = `absolute inset-0 flex flex-col justify-start p-6 text-white pointer-events-none transition-opacity duration-300 bg-black/45 backdrop-blur-[2px]`;
  const textBlock1Classes = `body-medium font-500 text-white/90`;
  const textBlock2Classes = `body-medium font-700 text-[#FFB4BA] mt-2`;

  return (
    <div
      className={cardClasses.trim()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 🖼️ 이미지 영역 */}
      <div className={imageContainerClasses.trim()}>
        <img
          src={currentImage}
          alt={`문제 ${title}의 ${normalizedCategory} 이미지`}
          className={imageClasses.trim()}
        />

        {isHovered && (
          <div className={overlayClasses}>
            <p className={textBlock1Classes}>{sub_description}</p>
            <p className={textBlock2Classes}>{goal}</p>
          </div>
        )}
      </div>

      {/* 📝 내용 영역 */}
      <div className={contentClasses.trim()}>
        <div className={tagsContainerClasses.trim()}>
          <CategoryTag>{normalizedCategory}</CategoryTag>
          <ScoreTag score={score} />
        </div>

        <h3 className={titleClasses.trim()}>{title}</h3>
        <SolveProblemButton
          onClick={onSolveClick}
          className="rounded-[12px] bg-[#FF4854] font-700 shadow-[0_8px_18px_rgba(255,72,84,0.16)] hover:-translate-y-[1px] hover:bg-[#FF4854]/90 hover:shadow-[0_10px_22px_rgba(255,72,84,0.20)]"
        />
      </div>
    </div>
  );
};

export default ProblemCard;
