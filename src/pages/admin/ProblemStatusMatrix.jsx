import React from 'react';
import Skeleton from '../../components/Skeleton/Skeleton';
import { useSolveMatrixQuery } from '@/hooks/useSolveMatrixQuery';

const TEAM_COL_WIDTH = '160px'; // 🔥 더 넓게
const PROBLEM_CELL_WIDTH = '120px';
const HEADER_HEIGHT = '60px';
const ROW_HEIGHT = '48px';

// 🔹 Header (팀 / 문제)
const Header = ({ problems }) => {
  return (
    <div
      className="grid sticky top-0 z-20 bg-[#F7F7F7]"
      style={{
        gridTemplateColumns: `${TEAM_COL_WIDTH} repeat(${problems.length}, ${PROBLEM_CELL_WIDTH})`,
        minWidth: `calc(${TEAM_COL_WIDTH} + ${problems.length} * ${PROBLEM_CELL_WIDTH})`,
        height: HEADER_HEIGHT,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      {/* 팀 */}
      <div
        className="flex items-center justify-center font-bold text-[18px] text-[#333] sticky left-0 bg-[#F7F7F7] z-30"
        style={{
          borderRight: '2px solid #000',
        }}
      >
        팀
      </div>

      {/* 문제 헤더들 */}
      {problems.map((p, idx) => (
        <div
          key={p.id}
          className="flex items-center justify-center text-[16px] font-semibold text-[#444]"
          style={{
            borderLeft: '1px solid #D0D0D0',
            borderRight:
              idx === problems.length - 1 ? '1px solid #D0D0D0' : 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {p.label}
        </div>
      ))}
    </div>
  );
};

// 🔹 각 팀 행
const DataRow = ({ teamName, status }) => {
  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `${TEAM_COL_WIDTH} repeat(${status.length}, ${PROBLEM_CELL_WIDTH})`,
        height: ROW_HEIGHT,
        minWidth: `calc(${TEAM_COL_WIDTH} + ${status.length} * ${PROBLEM_CELL_WIDTH})`,
      }}
    >
      {/* 팀 이름 (Sticky Left) */}
      <div
        className="flex items-center justify-center font-bold text-[16px] sticky left-0 bg-white z-10"
        style={{
          borderRight: '2px solid #000',
          padding: '0 10px',
        }}
      >
        {teamName}
      </div>

      {/* O/X */}
      {status.map((solved, idx) => (
        <div
          key={idx}
          className="flex items-center justify-center"
          style={{
            borderLeft: '1px solid #E0E0E0',
            borderRight:
              idx === status.length - 1 ? '1px solid #E0E0E0' : 'none',
          }}
        >
          <div
            className={`flex items-center justify-center w-[28px] h-[28px] rounded-full text-white font-bold ${
              solved ? 'bg-[#10B981]' : 'bg-[#EF4444]'
            }`}
          >
            {solved ? 'O' : 'X'}
          </div>
        </div>
      ))}
    </div>
  );
};

// 🔹 Skeleton
const ProblemStatusMatrixSkeleton = ({ rows = 10, cols = 20 }) => {
  return (
    <div className="relative w-full h-[700px] bg-white rounded-[12px] overflow-auto p-4 shadow-lg">
      <Skeleton className="h-10 w-full mb-4" />
      <Skeleton className="h-10 w-full mb-4" />
      <Skeleton className="h-10 w-full mb-4" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full mb-3" />
      ))}
    </div>
  );
};

// 🔹 메인 컴포넌트
export default function ProblemStatusMatrix() {
  const { data, isLoading, error } = useSolveMatrixQuery('title');

  if (isLoading) return <ProblemStatusMatrixSkeleton />;
  if (error)
    return (
      <div className="text-red-500 text-center mt-10">
        데이터를 불러오는 중 오류가 발생했습니다.
      </div>
    );

  const { teams, problems, matrix } = data;

  return (
    <div className="relative w-full h-[700px] bg-white rounded-[12px] overflow-auto p-4 shadow-lg">
      <Header problems={problems} />

      {/* 행 스트라이프 효과 */}
      {teams.map((team, index) => (
        <div
          key={team.id}
          className={index % 2 === 0 ? 'bg-[#FAFAFA]' : 'bg-white'}
        >
          <DataRow
            teamName={team.name}
            status={matrix[index]}
          />
        </div>
      ))}
    </div>
  );
}
