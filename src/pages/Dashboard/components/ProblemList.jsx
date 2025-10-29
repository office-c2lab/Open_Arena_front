// src/components/ProblemList/ProblemList.jsx

import React from 'react';
import ProblemItem from './ProblemItem';
import { problemData } from '../data/problemData'; // problemData 임포트

const SKELETON_COUNT = 20; // 표시할 스켈레톤 개수 (예시)

// 아이템 너비: 238px
const ItemWidth = 238;

// 💡 isLoading prop 추가
export default function ProblemList({ isLoading = false }) { 
  
  // 4열 레이아웃에 필요한 최대 너비
  const MAX_WIDTH_4_COL = '1028px'; 

  const containerStyle = {
    maxWidth: MAX_WIDTH_4_COL,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    backdropFilter: 'blur(5px)',
  }; 

  const horizontalGap = '10px';
  const verticalGap = '10px';
  const listPaddingX = '23px';
  const listPaddingTop = '29px';

  // 💡 렌더링할 아이템 목록 결정
  const itemsToRender = isLoading 
    ? [...Array(SKELETON_COUNT)] 
    : problemData; 

  return (
    <div className="rounded-[10px] overflow-hidden mx-auto" style={containerStyle}>
      {/* 문제 아이템 리스트 */}
      <div 
        className="flex flex-wrap content-start justify-center"
        style={{
          paddingTop: listPaddingTop,
          paddingLeft: listPaddingX,
          paddingRight: listPaddingX,
          columnGap: horizontalGap,
          rowGap: verticalGap,
          paddingBottom: listPaddingTop,
        }}
      >
        {itemsToRender.map((problem, index) => (
          <ProblemItem
            // 로딩 중일 때는 index를 key로, 아닐 때는 problem.id를 key로 사용
            key={isLoading ? `skeleton-${index}` : problem.id} 
            problem={problem} 
            itemStyle={{ flexBasis: `${ItemWidth}px`, flexShrink: 0, flexGrow: 0 }}
            isLoading={isLoading} // 로딩 상태 전달
          />
        ))}
      </div>
    </div>
  );
}