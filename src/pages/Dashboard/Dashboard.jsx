// src/pages/Dashboard/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 리디렉션을 위해 import
import TeamInfoSection from './components/TeamInfoSection';
import ProblemList from './components/ProblemList';
import Banner from '../../components/Banner/Banner';
import { useAuthStore } from '@/stores/authStore'; 

const Dashboard = () => {
  const navigate = useNavigate(); // 리디렉션 훅
  
  // 1. Zustand 스토어에서 로그인 정보 추출
  const teamName = useAuthStore((state) => state.teamInfo?.teamname);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  // 2. 로딩 상태 정의: 초기에는 true (데이터 로드 + Hydration 시간)
  const [isLoading, setIsLoading] = useState(true); 
  
  // 3. 데이터 로드 및 인증 체크
  useEffect(() => {
    // 💡 A. 비로그인 상태일 경우 리디렉션 (권한 체크)
    // 이 로직은 persist가 정보를 로드한 후에도 isLoggedIn이 false일 경우 실행됩니다.
    if (!isLoggedIn) {
        // console.warn("비로그인 상태입니다. 로그인 페이지로 이동합니다.");
        // navigate('/login'); // 👈 실제 환경에서 리디렉션 처리
        
        // 데이터 로드를 진행하지 않고 로딩 상태를 종료
        setIsLoading(false); 
        return;
    }

    // 💡 B. 데이터 로드 시뮬레이션 (실제로는 React Query 호출 로직으로 대체)
    // TeamInfoSection이나 ProblemList에 필요한 API 호출을 여기서 처리하고,
    // 모든 호출이 완료되었을 때 setIsLoading(false)를 호출합니다.
    
    // 임시 로딩 지연 (데이터 로드 시뮬레이션)
    const timer = setTimeout(() => {
      setIsLoading(false); 
    }, 1000); // 1초 정도의 로딩 시간을 줍니다.

    return () => clearTimeout(timer);
  }, [isLoggedIn, navigate]); // isLoggedIn과 navigate를 의존성 배열에 추가

  // 4. 대시보드 제목을 동적으로 설정
  const displayTeamName = teamName || '로그인 필요';
  
  // 💡 비로그인 시 UI: (선택) 로그인 페이지로 리디렉션 대신 메시지 표시
  if (!isLoggedIn && !isLoading) {
      return (
        <div className="w-full h-full flex justify-center items-center p-6 text-2xl font-bold text-gray-500 min-h-[500px]">
            대시보드에 접근하려면 로그인이 필요합니다.
        </div>
      );
  }

  return (
    <div className="w-full h-full flex flex-col items-center p-6 gap-8">
      {/* 1. Banner 영역 */}
      <div>
        <Banner />
      </div>
      
      {/* 2. 팀 정보 섹션: 제목과 컴포넌트를 묶어 왼쪽 정렬 */}
      <div className="w-full max-w-[1027px] flex flex-col items-start mx-auto">
        <h1 className="heading-1 font-700 mb-5" style={{ color: '#FF4854' }}>
          {/* 🔑 로그인 후 팀명으로 대체 */}
          {displayTeamName}
        </h1>
        {/* TeamInfoSection에 isLoading prop 전달 */}
        <TeamInfoSection isLoading={isLoading} /> 
      </div>
      
      {/* 3. ProblemList 렌더링 */}
      <div className="w-full flex justify-center">
        {/* ProblemList에 isLoading prop 전달 */}
        <ProblemList isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Dashboard;