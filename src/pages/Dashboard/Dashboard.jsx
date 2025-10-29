// src/pages/Dashboard/Dashboard.jsx (최종 수정)

import React, { useState, useEffect } from 'react'; // 💡 useState, useEffect 임포트
import TeamInfoSection from './components/TeamInfoSection';
import ProblemList from './components/ProblemList';
import Banner from '../../components/Banner/Banner';

const Dashboard = () => {
  // 💡 1. 로딩 상태 정의: 초기에는 true
  const [isLoading, setIsLoading] = useState(true);

  // 💡 2. 데이터 로드 시뮬레이션 및 로딩 상태 변경
  useEffect(() => {
    // 실제 환경에서는 여기에 팀 정보와 문제 리스트를 불러오는 API 호출 로직이 들어갑니다.
    // 모든 데이터 로드가 완료되었을 때 setIsLoading(false)를 호출합니다.
    
    // 임시 로딩 지연 (2초)
    const timer = setTimeout(() => {
      setIsLoading(false); 
    }, 2000);

    return () => clearTimeout(timer);
  }, []); // 컴포넌트 마운트 시 한 번 실행

  return (
    <div className="w-full h-full flex flex-col items-center p-6 gap-8">
      {/* 1. Banner 영역 */}
      <div>
        <Banner />
      </div>
      
      {/* 2. 팀 정보 섹션: 제목과 컴포넌트를 묶어 왼쪽 정렬 */}
      <div className="w-full max-w-[1027px] flex flex-col items-start mx-auto">
        <h1 className="heading-1 font-700 mb-5" style={{ color: '#FF4854' }}>
          TEAM A
        </h1>
        {/* 💡 TeamInfoSection에 isLoading prop 전달 */}
        <TeamInfoSection isLoading={isLoading} /> 
      </div>
      
      {/* 3. ProblemList 렌더링 */}
      <div className="w-full flex justify-center">
        {/* 💡 ProblemList에 isLoading prop 전달 */}
        <ProblemList isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Dashboard;