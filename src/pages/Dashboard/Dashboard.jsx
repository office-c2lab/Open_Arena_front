// src/pages/Dashboard/Dashboard.jsx (간단 렌더링으로 수정)

import React from 'react';
// Banner 컴포넌트 임포트
import Banner from '../../components/Banner/Banner';

// 💡 더미 데이터 정의 제거

const Dashboard = () => {
  return (
    <div className="w-full h-full flex flex-col items-center p-6 gap-8">
      <div className="w-full max-w-[1069px] flex justify-center">
        <Banner />
      </div>
      {/* 2. 대시보드 다른 내용 (예시) */}
      <h1 className="text-2xl font-bold mt-4">대시보드 주요 콘텐츠</h1>
      <div className="text-gray-600">
        여기에 차트, 통계, 빠른 링크 등의 대시보드 요소가 들어갑니다.
      </div>
    </div>
  );
};

export default Dashboard;
