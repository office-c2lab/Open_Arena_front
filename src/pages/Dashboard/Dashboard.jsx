// src/pages/Dashboard/Dashboard.jsx (수정된 버전)

import React from 'react';
import TeamInfoSection from './components/TeamInfoSection';
import ProblemList from './components/ProblemList';
import Banner from '../../components/Banner/Banner';

const Dashboard = () => {
  return (
    <div className="w-full h-full flex flex-col items-center p-6 gap-8">
      {/* 1. Banner 영역 */}
      <div className="w-full max-w-[1069px] flex justify-center">
        <Banner />
      </div>
      {/* 💡 2. 팀 정보 섹션: 제목과 컴포넌트를 묶어 왼쪽 정렬 */}
      <div className="w-full max-w-[1027px] flex flex-col items-start mx-auto">
        {/*
          변경 사항:
          1. w-full max-w-[1027px]로 너비를 제한하여 ProblemList/TeamInfoSection과 너비를 맞춥니다.
          2. mx-auto로 이 <div>를 중앙 정렬합니다. (Dashboard의 items-center 역할을 대신)
          3. items-start로 이 <div> 안의 모든 내용을 왼쪽 정렬합니다.
        */}
        <h1 className="heading-1 font-700 mb-5" style={{ color: '#FF4854' }}>
          TEAM A
        </h1>
        <TeamInfoSection />
      </div>
      {/* 3. ProblemList 렌더링 (TeamInfoSection 아래로 옮겨 일관성 유지) */}
      <div className="w-full flex justify-center">
        <ProblemList />
      </div>
    </div>
  );
};

export default Dashboard;
