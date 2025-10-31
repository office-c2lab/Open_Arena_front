// src/pages/Leaderboard/components/ProblemStatusMatrix.jsx

import React from 'react';
import { PROBLEM_STATUS_DATA } from '../data/problemStatusData';
import Skeleton from '../../../components/Skeleton/Skeleton'; // Skeleton import

const NUM_PROBLEMS = 20;
const problemNumbers = Array.from({ length: NUM_PROBLEMS }, (_, i) => i + 1);

const TEAM_COL_WIDTH = '120px';
const PROBLEM_CELL_WIDTH = '45px';
const HEADER_HEIGHT = '94px';

// 🧩 실제 데이터용 Header
const Header = () => {
	const baseTextStyle =
		"text-[16px] leading-[24px] font-['Noto Sans KR'] font-light text-[#010101]";
        
	return (
		<div
			className="grid"
			style={{
				gridTemplateColumns: `${TEAM_COL_WIDTH} repeat(${NUM_PROBLEMS}, ${PROBLEM_CELL_WIDTH})`,
				height: HEADER_HEIGHT,
				borderBottom: '2px solid #010101',
			}}
		>
			{/* 팀/문제 텍스트 */}
			<div
				className="relative flex justify-between p-2"
				style={{
					height: HEADER_HEIGHT,
					borderRight: '2px solid #010101',
				}}
			>
				<div
					className="absolute w-full h-0 border-t border-[#010101] origin-top-left"
					style={{
						top: '94px',
						left: '0',
						transform: 'rotate(23.9deg) translateX(-10px) translateY(-50px)',
					}}
				/>
				<span className={`${baseTextStyle} self-end mb-1 ml-1`}>팀</span>
				<span className={`${baseTextStyle} self-start mt-[40px] mr-1`}>문제</span>
			</div>

			{/* 문제 번호 */}
			{problemNumbers.map(p => (
				<div
					key={p}
					className={`${baseTextStyle} flex items-end justify-center pb-2`}
					style={{
						height: HEADER_HEIGHT,
						borderLeft: '1px solid #E0E0E0',
					}}
				>
					C{p}
				</div>
			))}
		</div>
	);
};

// 🧩 스켈레톤 전용 Header (팀/문제 텍스트는 그대로, 문제 번호만 Skeleton)
const HeaderSkeleton = () => {
	const baseTextStyle =
		"text-[16px] leading-[24px] font-['Noto Sans KR'] font-light text-[#010101]";
	return (
		<div
			className="grid"
			style={{
				gridTemplateColumns: `${TEAM_COL_WIDTH} repeat(${NUM_PROBLEMS}, ${PROBLEM_CELL_WIDTH})`,
				height: HEADER_HEIGHT,
				borderBottom: '2px solid #010101',
			}}
		>
			{/* 팀/문제 텍스트 (그대로 표시) */}
			<div
				className="relative flex justify-between p-2"
				style={{
					height: HEADER_HEIGHT,
					borderRight: '2px solid #010101',
				}}
			>
				<div
					className="absolute w-full h-0 border-t border-[#010101] origin-top-left"
					style={{
						top: '94px',
						left: '0',
						transform: 'rotate(23.9deg) translateX(-10px) translateY(-50px)',
					}}
				/>
				<span className={`${baseTextStyle} self-end mb-1 ml-1`}>팀</span>
				<span className={`${baseTextStyle} self-start mt-[40px] mr-1`}>문제</span>
			</div>

			{/* 문제 번호는 Skeleton으로 표시 */}
			{problemNumbers.map(p => (
				<div
					key={p}
					className="flex items-end justify-center pb-2"
					style={{
						height: HEADER_HEIGHT,
						borderLeft: '1px solid #E0E0E0',
					}}
				>
					<Skeleton className="h-4 w-6" />
				</div>
			))}
		</div>
	);
};

const DataRow = ({ teamName, status }) => {
	const rowHeight = '42.47px';
	const baseTextStyle =
		"text-[16px] leading-[24px] font-['Noto Sans KR'] font-light text-[#010101]";

	return (
		<div
			className={`grid`}
			style={{
				gridTemplateColumns: `${TEAM_COL_WIDTH} repeat(${NUM_PROBLEMS}, ${PROBLEM_CELL_WIDTH})`,
				height: rowHeight,
				borderBottom: '1px solid #E0E0E0',
			}}
		>
			<div
				className={`flex items-center justify-center ${baseTextStyle} font-medium`}
				style={{ borderRight: '2px solid #010101' }}
			>
				{teamName}
			</div>

			{status.map((solved, idx) => (
				<div
					key={idx}
					className={`flex items-center justify-center ${baseTextStyle}`}
					style={{ borderLeft: '1px solid #E0E0E0' }}
				>
					<span
						style={{
							color: solved ? '#10B981' : '#EF4444',
							fontWeight: 'bold',
						}}
					>
						{solved ? 'O' : 'X'}
					</span>
				</div>
			))}
		</div>
	);
};

const ProblemStatusMatrixSkeleton = ({ rows = 15 }) => {
	const ROW_HEIGHT = '42.47px';
	const skeletonRows = Array.from({ length: rows }, (_, i) => i);

	return (
		<div
			className="relative w-full max-w-[1027px] h-[640px] bg-white/80 rounded-[10px] p-2 overflow-auto"
			style={{
				boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
				backdropFilter: 'blur(5px)',
			}}
		>
			{/* ✅ 헤더 스켈레톤 (팀/문제 텍스트는 그대로, 번호만 스켈레톤) */}
			<HeaderSkeleton />

			<div className="relative">
				{skeletonRows.map((_, index) => (
					<div
						key={index}
						className={`grid`}
						style={{
							gridTemplateColumns: `${TEAM_COL_WIDTH} repeat(${NUM_PROBLEMS}, ${PROBLEM_CELL_WIDTH})`,
							height: ROW_HEIGHT,
							borderBottom: '1px solid #E0E0E0',
						}}
					>
						{/* 팀 이름 스켈레톤 */}
						<div
							className={`flex items-center justify-center`}
							style={{ borderRight: '2px solid #010101' }}
						>
							<Skeleton className="h-4 w-3/4" />
						</div>

						{/* 문제 상태 셀 스켈레톤 */}
						{problemNumbers.map(p => (
							<div
								key={p}
								className={`flex items-center justify-center`}
								style={{ borderLeft: '1px solid #E0E0E0' }}
							>
								<Skeleton className="h-4 w-4 rounded-full" />
							</div>
						))}
					</div>
				))}
			</div>
		</div>
	);
};

const ProblemStatusMatrix = ({ isLoading = false }) => {
	const data = PROBLEM_STATUS_DATA;

	if (isLoading) {
		return <ProblemStatusMatrixSkeleton />;
	}
	
	return (
		<div
			className="relative w-full max-w-[1027px] h-[640px] bg-white/80 rounded-[10px] p-2 overflow-auto"
			style={{
				boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
				backdropFilter: 'blur(5px)',
			}}
		>
			<Header />
			<div className="relative">
				{data.map((row, index) => (
					<DataRow key={index} teamName={row.team} status={row.status} />
				))}
			</div>
		</div>
	);
};

export default ProblemStatusMatrix;
