// src/components/TeamInfoSection/TeamInfoSection.jsx

import React from 'react';
import TeamInfoCard from './TeamInfoCard'; // 💡 변경된 컴포넌트 이름 임포트

export default function TeamInfoSection() {
  // 챌린지 카드 데이터
  const challengeData = {
    title: '해결한 챌린지',
    value: '20',
    unit: '개',
    iconType: 'ai',
    valueColor: '#0EA5E9',
    style: {
      // 500px 카드 너비, 27px 간격, 500px 카드 너비 -> 총 1027px
      marginRight: '27px',
    },
  };

  // 점수 카드 데이터
  const scoreData = {
    title: '획득 점수',
    value: '1100',
    unit: '점',
    iconType: 'coin', // 포인트 아이콘
    valueColor: '#FF93AC',
    style: {
      // 별도의 마진 없음
    },
  };

  return (
    // max-w-[1027px]로 설정하여 두 카드가 나란히 배치되도록 합니다.
    <div className="flex justify-center w-full max-w-[1027px] mx-auto">
      <TeamInfoCard
        title={challengeData.title}
        value={challengeData.value}
        iconType={challengeData.iconType}
        valueColor={challengeData.valueColor}
        cardStyle={challengeData.style}
      />
      <TeamInfoCard
        title={scoreData.title}
        value={scoreData.value}
        iconType={scoreData.iconType}
        valueColor={scoreData.valueColor}
        cardStyle={scoreData.style}
      />
    </div>
  );
}
