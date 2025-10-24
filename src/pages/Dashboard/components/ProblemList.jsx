// src/components/ProblemList/ProblemList.jsx (아이템 중앙 정렬 추가)

import React from 'react';
import ProblemItem from './ProblemItem';
import { problemData } from '../data/problemData';

// 아이템 너비: 238px
const ItemWidth = 238;

export default function ProblemList() {
  // 4열 레이아웃에 필요한 최대 너비: 1028px (4*238 + 3*10 + 2*23)
  const MAX_WIDTH_4_COL = '1028px'; // 1. 컨테이너 스타일 (4열 간격 유지)

  const containerStyle = {
    // 고정 width 대신 max-width를 사용하고, height를 제거합니다.
    maxWidth: MAX_WIDTH_4_COL,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    backdropFilter: 'blur(5px)',
  }; // 2. 레이아웃 계산 (간격 유지)

  const horizontalGap = '10px';
  const verticalGap = '10px';
  const listPaddingX = '23px';
  const listPaddingTop = '29px';

  return (
    <div className="rounded-[10px] overflow-hidden mx-auto" style={containerStyle}>
      {/* 문제 아이템 리스트 */}
      <div // 💡 justify-center 클래스를 추가하여 줄바꿈된 아이템들을 중앙에 정렬합니다.
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
        {problemData.map(problem => (
          <ProblemItem
            key={problem.id}
            problem={problem}
            itemStyle={{ flexBasis: `${ItemWidth}px`, flexShrink: 0, flexGrow: 0 }}
          />
        ))}
      </div>
    </div>
  );
}
