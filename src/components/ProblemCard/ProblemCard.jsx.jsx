// src/components/ProblemCard/ProblemCard.jsx

import React, { useState } from 'react';
import medicalImage from '../../assets/images/medical.png';
import counselImage from '../../assets/images/counsel.png';
import codingImage from '../../assets/images/coding.png';
import generalImage from '../../assets/images/general.png';
import financeImage from '../../assets/images/finance.png';

import SolveProblemButton from '../Button/SolveProblemButton';
import DifficultyTag from '../Tag/DifficultyTag';
import CategoryTag from '../Tag/CategoryTag';
import Skeleton from '../Skeleton/Skeleton'; // Skeleton 컴포넌트 import

const getCategoryImage = category => {
 switch (category) {
  case '의료':
   return medicalImage;
  case '상담':
   return counselImage;
  case '코딩':
   return codingImage;
  case '일반':
   return generalImage;
  case '금융':
   return financeImage;
  default:
   return generalImage;
 }
};

// ====================================================
// ProblemCardSkeleton 컴포넌트 (생략 없이 그대로 유지)
// ====================================================
const ProblemCardSkeleton = () => {
 const cardClasses = `w-[339px] bg-white shadow-xl rounded-xl flex flex-col overflow-hidden relative`;
 const imageContainerClasses = `relative w-full h-[198px] overflow-hidden`;
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
    {/* 태그 영역 스켈레톤 */}
    <div className={tagsContainerClasses.trim()}>
     <Skeleton className="h-6 w-16 rounded-full" /> 
     <Skeleton className="h-6 w-16 rounded-full" /> 
    </div>
    
    {/* 제목 영역 스켈레톤 */}
    <div className="flex flex-col gap-2">
     <Skeleton className="h-6 w-11/12" />
    </div>
    
    {/* 버튼 영역 스켈레톤 */}
    <Skeleton className="h-10 w-full mt-2 rounded-lg" />
   </div>
  </div>
 );
};
// ====================================================


const ProblemCard = ({ challenge, onSolveClick, isLoading = false }) => {
 
 // 1. 조건부 렌더링: 로딩 중이면 스켈레톤 반환
 if (isLoading) {
  return <ProblemCardSkeleton />;
 }

 // 2. 실제 데이터 렌더링 로직
 // ⭐️ sub_description을 challenge 객체에서 구조 분해 할당으로 받습니다.
 const { title, difficulty, category, sub_description } = challenge;

 const [isHovered, setIsHovered] = useState(false);

 const handleMouseEnter = () => setIsHovered(true);
 const handleMouseLeave = () => setIsHovered(false);

 const currentImageSrc = getCategoryImage(category);

 const cardClasses = `w-[339px] bg-white shadow-xl rounded-xl flex flex-col overflow-hidden relative`;
 const imageContainerClasses = `relative w-full h-[198px] overflow-hidden`;

 const imageClasses = `w-full h-full object-cover 
            transition-transform duration-300 ease-in-out 
            ${isHovered ? 'scale-220' : 'scale-200'}`;

 const contentClasses = `p-6 flex flex-col gap-2.5`;
 const tagsContainerClasses = `flex space-x-1.5 items-start`;
 const titleClasses = `heading-3 font-500 line-clamp-2`;

 const overlayClasses = `absolute inset-0 flex flex-col justify-start p-6 text-white pointer-events-none transition-opacity duration-300 bg-black/40`;
 const textBlock1Classes = `body-medium font-300 text-gray-200`;
 const textBlock2Classes = ` body-medium font-700 text-red-500 mt-10`;

 return (
  <div
   className={cardClasses.trim()}
   onMouseEnter={handleMouseEnter}
   onMouseLeave={handleMouseLeave}
  >
   {/* 🖼️ Image Area & Overlay Container */}
   <div className={imageContainerClasses.trim()}>
    <img
     src={currentImageSrc}
     alt={`문제 ${title}의 ${category} 이미지`}
     className={imageClasses.trim()}
    />

    {/* 💡 Hover Overlay */}
    {isHovered && (
     <div className={overlayClasses}>
                {/* ⭐️ API에서 받은 sub_description을 그대로 표시합니다. */}
      <p className={textBlock1Classes}>
       {sub_description}
      </p>

                {/* ⭐️ 목표 문구는 title을 활용하여 동적으로 생성했습니다. */}
      <p className={textBlock2Classes}>
       AI에게 “{title} 도전 성공!” 이라는 문구를 출력하도록 만드세요.
      </p>
     </div>
    )}
   </div>

   {/* 📝 Content Area */}
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