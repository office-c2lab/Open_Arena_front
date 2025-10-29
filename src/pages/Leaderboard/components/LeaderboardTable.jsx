// src/pages/Leaderboard/components/LeaderboardTable.jsx

import React from 'react';
import medalGold from '../../../assets/icons/medal_gold.svg';
import medalSilver from '../../../assets/icons/medal_silver.svg';
import medalBronze from '../../../assets/icons/medal_bronze.svg';
import { LEADERBOARD_DATA } from '../data/leaderboardData';
import Skeleton from '../../../components/Skeleton/Skeleton'; // Skeleton import

const MEDAL_ICON_MAP = {
	1: medalGold,
	2: medalSilver,
	3: medalBronze,
};

const COL_WIDTHS = {
	rank: 'w-[11%]',
	team: 'w-[24%]',
	score: 'w-[30%]',
	solved: 'flex-1',
};

const HEADER = [
	{ label: '순위', key: 'rank' },
	{ label: '팀명', key: 'team' },
	{ label: '획득한 점수', key: 'score' },
	{ label: '해결한 챌린지', key: 'solved' },
];

// 💡 LeaderboardTableSkeleton 컴포넌트 정의
const LeaderboardTableSkeleton = ({ rows = 8 }) => {
    const ROW_HEIGHT = '79px';
    const skeletonRows = Array.from({ length: rows }, (_, i) => i);

    return (
        <div 
            className="relative w-[1027px] h-auto rounded-[10px] bg-white/80 z-20"
            style={{ filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))' }}
        >
            <div 
                className="absolute inset-0 rounded-[10px] z-0"
                style={{ background: 'rgba(255,255,255,0.8)' }}
            />
            <div className="relative z-10 p-0">
                {/* 헤더 행: 고정 데이터 유지 */}
                {[
                    { isHeader: true, ...HEADER }
                ].map((row, idx) => (
                    <div 
                        key={idx}
                        className={`flex items-center h-[79px] heading-3 border-b border-[#FF4854] text-[#FF4854] font-500`}
                    >
                        <div className={`${COL_WIDTHS.rank} flex justify-center items-center`}>순위</div>
                        <div className={`${COL_WIDTHS.team} text-center`}>팀명</div>
                        <div className={`${COL_WIDTHS.score} text-center`}>획득한 점수</div>
                        <div className={`${COL_WIDTHS.solved} text-center`}>해결한 챌린지</div>
                    </div>
                ))}
                
                {/* 스켈레톤 데이터 행 */}
                {skeletonRows.map((_, idx) => (
                    <div
                        key={idx}
                        className={`flex items-center h-[${ROW_HEIGHT}] border-b border-[#FF4854] p-3`}
                    >
                        {/* 순위 스켈레톤 */}
                        <div className={`${COL_WIDTHS.rank} flex justify-center`}>
                            <Skeleton className="h-6 w-6 rounded-full" />
                        </div>

                        {/* 팀명 스켈레톤 */}
                        <div className={`${COL_WIDTHS.team} flex justify-center`}>
                            <Skeleton className="h-6 w-3/4" />
                        </div>

                        {/* 점수 스켈레톤 */}
                        <div className={`${COL_WIDTHS.score} flex justify-center`}>
                            <Skeleton className="h-6 w-2/3" />
                        </div>

                        {/* 해결한 챌린지 스켈레톤 */}
                        <div className={`${COL_WIDTHS.solved} flex justify-center`}>
                            <Skeleton className="h-6 w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


const LeaderboardTable = ({ isLoading = false }) => {
	// 💡 로딩 중일 때 스켈레톤 렌더링
    if (isLoading) {
        return <LeaderboardTableSkeleton />;
    }
    
	return (
		<div
			className="relative w-[1027px] h-auto rounded-[10px] bg-white/80 z-20"
			style={{ filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))' }}
		>
			<div
				className="absolute inset-0 rounded-[10px] z-0"
				style={{ background: 'rgba(255,255,255,0.8)' }}
			/>
			<div className="relative z-10 p-0">
				{/* 전체 데이터: 헤더 포함 */}
				{[{ isHeader: true, ...HEADER }, ...LEADERBOARD_DATA].map((row, idx) => (
					<div
						key={idx}
						className={`flex items-center h-[79px] heading-3 
						border-b border-[#FF4854] ${row.isHeader ? 'text-[#FF4854] font-500' : 'text-[#010101] font-700'}`}
					>
						{/* 순위 */}
						<div className={`${COL_WIDTHS.rank} flex justify-center items-center`}>
							{row.isHeader ? (
								'순위'
							) : row.rank <= 3 ? (
								<img
									src={MEDAL_ICON_MAP[row.rank]}
									alt={`Rank ${row.rank} Medal`}
									className="w-[45px] h-[45px]"
								/>
							) : (
								<span>{row.rank}</span>
							)}
						</div>

						{/* 팀명 */}
						<div
							className={`${COL_WIDTHS.team} text-center`}
							style={{ color: row.isHeader ? undefined : row.color }}
						>
							{row.isHeader ? '팀명' : row.team}
						</div>

						{/* 점수 */}
						<div className={`${COL_WIDTHS.score} text-center`}>
							{row.isHeader ? '획득한 점수' : row.score}
						</div>

						{/* 해결한 챌린지 */}
						<div className={`${COL_WIDTHS.solved} text-center`}>
							{row.isHeader ? '해결한 챌린지' : row.solved}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default LeaderboardTable;