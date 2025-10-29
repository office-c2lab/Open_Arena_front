// src/components/TeamInfoSection/TeamInfoSection.jsx

import React from 'react';
import TeamInfoCard from './TeamInfoCard';

// 💡 isLoading prop 추가
export default function TeamInfoSection({ isLoading = false }) {
  
  // 챌린지 카드 데이터
  const challengeData = {
    title: '해결한 챌린지',
    value: '20',
    unit: '개',
    iconType: 'ai',
    valueColor: '#0EA5E9',
    style: {
      marginRight: '27px',
    },
  };

  // 점수 카드 데이터
  const scoreData = {
    title: '획득 점수',
    value: '1100',
    unit: '점',
    iconType: 'coin', 
    valueColor: '#FF93AC',
    style: {
    },
  };

  return (
    <div className="flex justify-center w-full max-w-[1027px] mx-auto">
      <TeamInfoCard
        title={challengeData.title}
        value={challengeData.value}
        iconType={challengeData.iconType}
        valueColor={challengeData.valueColor}
        cardStyle={challengeData.style}
        isLoading={isLoading} // 💡 로딩 상태 전달
      />
      <TeamInfoCard
        title={scoreData.title}
        value={scoreData.value}
        iconType={scoreData.iconType}
        valueColor={scoreData.valueColor}
        cardStyle={scoreData.style}
        isLoading={isLoading} // 💡 로딩 상태 전달
      />
    </div>
  );
}