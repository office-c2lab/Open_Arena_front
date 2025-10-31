// src/pages/Leaderboard/components/PointChart.jsx

import React from 'react';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from 'recharts';
import { CHART_TIME_SERIES_DATA, TEAM_COLORS } from '../data/leaderboardData';
import Skeleton from '../../../components/Skeleton/Skeleton'; // Skeleton import

// 💡 PointChartSkeleton 컴포넌트 정의 (수정)
const PointChartSkeleton = () => {
    // 💡 범례 및 X축 레이블 스켈레톤을 10개로 통일
    const SKELETON_COUNT = 10;
    const skeletons = Array.from({ length: SKELETON_COUNT }, (_, i) => i);
    
    return (
        <div // 실제 차트 컨테이너 크기 사용
            className="w-full max-w-[1027px] h-[595px] rounded-[10px] z-20 p-6 bg-white/80 shadow-lg flex flex-col"
        >
            {/* 중앙: 차트 본체 스켈레톤 (가장 큰 영역) */}
            <div className="flex-1 p-4 border border-gray-300 rounded-md flex items-center justify-center">
                {/* 차트 영역 전체를 덮는 스켈레톤 */}
                <Skeleton className="w-full h-full" />
            </div>

            {/* 💡 하단: X축 레이블 스켈레톤 - 10개 생성 */}
            <div className="flex justify-between mt-4">
                {/* X축 레이블은 끝에 맞춰 균등 배치 */}
                {skeletons.map((_, index) => (
                    <Skeleton key={`xaxis-${index}`} className="h-3 w-8" />
                ))}
            </div>
        </div>
    );
};


const PointChart = ({ isLoading = false }) => {
    const teamKeys = Object.keys(TEAM_COLORS);
    const sortedTeamKeys = teamKeys.sort();

    // 💡 로딩 중일 때 스켈레톤 렌더링
    if (isLoading) {
        // 이제 PointChartSkeleton은 prop 없이 10개의 스켈레톤을 렌더링합니다.
        return <PointChartSkeleton />; 
    }
    
    return (
        <div // Tailwind 클래스 수정: drop-shadow 스타일을 shadow-lg로 대체
            className="w-full max-w-[1027px] h-[595px] rounded-[10px] z-20 p-6 bg-white/80 shadow-lg"
        >
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={CHART_TIME_SERIES_DATA}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    {sortedTeamKeys.map(key => (
                        <Line
                            key={key}
                            type="monotone"
                            dataKey={key}
                            name={key.replace('_', ' ')}
                            stroke={TEAM_COLORS[key]}
                            activeDot={{ r: 6 }}
                            strokeWidth={3}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PointChart;