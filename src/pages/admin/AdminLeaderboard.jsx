// src/pages/Leaderboard/Leaderboard.jsx

import React, { useState, useEffect } from 'react'; // 💡 useState, useEffect 임포트
import Banner from '../../components/Banner/Banner';
import ProblemStatusMatrix from '../Leaderboard/components/ProblemStatusMatrix';
import PointChart from '../Leaderboard/components/PointChart';
import LeaderboardTable from '../Leaderboard/components/LeaderboardTable';


// =======================================================
// 메인 리더보드 페이지
// =======================================================

const Leaderboard = () => {
    // 💡 1. 로딩 상태 정의: 초기에는 true
    const [isLoading, setIsLoading] = useState(true);

    // 💡 2. 데이터 로드 시뮬레이션 및 로딩 상태 변경
    useEffect(() => {
        // 실제 API 호출 로직 (데이터 로드가 완료되면 false로 변경)
        const timer = setTimeout(() => {
            setIsLoading(false); 
        }, 2000); // 2초 로딩 시뮬레이션

        return () => clearTimeout(timer);
    }, []); // 컴포넌트 마운트 시 한 번 실행

    return (
        <div className="w-full h-full flex flex-col items-center p-6 gap-[40px]">
            {/* 1. Banner 컴포넌트 렌더링 (Banner는 일반적으로 스켈레톤을 따로 적용하지 않아 prop 전달 X) */}
            <div>
                <Banner />
            </div>

            {/* 2. 팀별 문제풀이 현황 (ProblemStatusMatrix) */}
            <div className="w-full max-w-[1069px] flex flex-col items-start gap-4">
                <h1 className="heading-1 font-700 mb-5" style={{ color: '#FF4854' }}>
                    팀별 문제풀이 현황
                </h1>
                {/* 💡 isLoading prop 전달 */}
                <ProblemStatusMatrix isLoading={isLoading} />
            </div>
            
            {/* 3. 팀별 점수 차트 */}
            <div className="w-full max-w-[1069px] flex flex-col items-start gap-4">
                <h1 className="heading-1 font-700 mb-5" style={{ color: '#FF4854' }}>
                    팀별 점수 차트
                </h1>
                {/* 💡 isLoading prop 전달 */}
                <PointChart isLoading={isLoading} />
            </div>
            
            {/* 4. 팀별 순위 현황 (순위표) */}
            <div className="w-full max-w-[1069px] flex flex-col items-start gap-4">
                <h1 className="heading-1 font-700 mb-5" style={{ color: '#FF4854' }}>
                    팀별 순위 현황
                </h1>
                {/* 💡 isLoading prop 전달 */}
                <LeaderboardTable isLoading={isLoading} />
            </div>
        </div>
    );
};

export default Leaderboard;