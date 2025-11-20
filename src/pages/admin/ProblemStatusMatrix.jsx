import React from 'react';
import Skeleton from '../../components/Skeleton/Skeleton';
import { useSolveMatrixQuery } from '@/hooks/useSolveMatrixQuery';

const TEAM_COL_WIDTH = '120px';
const PROBLEM_CELL_WIDTH = '130px';
const HEADER_HEIGHT = '60px';
const ROW_HEIGHT = '42.47px';

// 🔹 Header (팀=왼쪽 아래, 문제=오른쪽 위)
const Header = ({ problems }) => {
  const baseTextStyle =
    "text-[16px] leading-[24px] font-['Noto Sans KR'] font-light text-[#010101]";
  const totalWidth = `calc(${TEAM_COL_WIDTH} + ${problems.length} * ${PROBLEM_CELL_WIDTH})`;

  return (
    <div className="relative" style={{ minWidth: totalWidth }}>
      {/* 헤더 영역 */}
      <div
        className="grid relative"
        style={{
          gridTemplateColumns: `${TEAM_COL_WIDTH} repeat(${problems.length}, ${PROBLEM_CELL_WIDTH})`,
          height: HEADER_HEIGHT,
        }}
      >
        {/* 팀/문제 셀 */}
        <div
          className="relative"
          style={{
            height: HEADER_HEIGHT,
            borderRight: '2px solid #010101',
          }}
        >
          {/* 사선 */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="calc(100% + 4px)"
            height="100%"
            viewBox="0 0 110 100"
            preserveAspectRatio="none"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              pointerEvents: 'none',
            }}
          >
            <line
              x1="6"
              y1="0"
              x2="106"
              y2="100"
              stroke="#010101"
              strokeWidth="2"
            />
          </svg>
          {/* 텍스트 */}
          <span
            className={`${baseTextStyle} absolute left-[10px] bottom-[6px] font-medium`}
          >
            팀
          </span>
          <span
            className={`${baseTextStyle} absolute right-[10px] top-[6px] font-medium text-right`}
          >
            문제
          </span>
        </div>

        {/* 문제 제목 */}
        {problems.map((p, idx) => (
          <div
            key={p.id}
            className={`${baseTextStyle} flex items-center justify-center text-center px-2`}
            style={{
              height: HEADER_HEIGHT,
              borderLeft: '1px solid #E0E0E0',
              borderRight:
                idx === problems.length - 1 ? '1px solid #E0E0E0' : 'none',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
            title={p.label}
          >
            {p.label}
          </div>
        ))}
      </div>

      {/* ✅ 문제 아래쪽 전체 선 */}
      <div
        className="absolute left-0 border-b-2 border-[#010101]"
        style={{
          top: HEADER_HEIGHT,
          width: totalWidth,
        }}
      />
    </div>
  );
};

// 🔹 각 팀 행 (O/X 표시)
const DataRow = ({ teamName, status, problemsLength }) => {
  const baseTextStyle =
    "text-[16px] leading-[24px] font-['Noto Sans KR'] font-light text-[#010101]";
  const totalWidth = `calc(${TEAM_COL_WIDTH} + ${problemsLength} * ${PROBLEM_CELL_WIDTH})`;

  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `${TEAM_COL_WIDTH} repeat(${status.length}, ${PROBLEM_CELL_WIDTH})`,
        height: ROW_HEIGHT,
        borderBottom: '1px solid #E0E0E0',
        minWidth: totalWidth,
      }}
    >
      <div
        className={`flex items-center justify-center ${baseTextStyle} font-medium`}
        style={{
          borderRight: '2px solid #010101',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
        }}
      >
        {teamName}
      </div>

      {status.map((solved, idx) => (
        <div
          key={idx}
          className={`flex items-center justify-center ${baseTextStyle}`}
          style={{
            borderLeft: '1px solid #E0E0E0',
            borderRight:
              idx === status.length - 1 ? '1px solid #E0E0E0' : 'none',
          }}
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

// 🔹 스켈레톤 (복원!)
const ProblemStatusMatrixSkeleton = ({ rows = 10, cols = 20 }) => {
  const skeletonRows = Array.from({ length: rows });
  const totalWidth = `calc(${TEAM_COL_WIDTH} + ${cols} * ${PROBLEM_CELL_WIDTH})`;

  return (
    <div
      className="relative w-full h-[640px] bg-white/80 rounded-[10px] overflow-auto"
      style={{
        padding: '8px',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        backdropFilter: 'blur(5px)',
      }}
    >
      {/* 헤더 (Skeleton 버전) */}
      <div className="relative" style={{ minWidth: totalWidth }}>
        <div
          className="grid relative"
          style={{
            gridTemplateColumns: `${TEAM_COL_WIDTH} repeat(${cols}, ${PROBLEM_CELL_WIDTH})`,
            height: HEADER_HEIGHT,
          }}
        >
          <div
            className="relative"
            style={{
              height: HEADER_HEIGHT,
              borderRight: '2px solid #010101',
            }}
          >
            {/* 사선 */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="calc(100% + 4px)"
              height="100%"
              viewBox="0 0 110 100"
              preserveAspectRatio="none"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                pointerEvents: 'none',
              }}
            >
              <line x1="6" y1="0" x2="106" y2="100" stroke="#010101" strokeWidth="2" />
            </svg>

            {/* 텍스트 */}
            <span className="absolute left-[10px] bottom-[6px] text-[16px] font-medium text-[#010101]">
              팀
            </span>
            <span className="absolute right-[10px] top-[6px] text-[16px] font-medium text-[#010101] text-right">
              문제
            </span>
          </div>

          {Array.from({ length: cols }).map((_, idx) => (
            <div
              key={idx}
              className="flex items-center justify-center"
              style={{
                borderLeft: '1px solid #E0E0E0',
                borderRight: idx === cols - 1 ? '1px solid #E0E0E0' : 'none',
              }}
            >
              <Skeleton className="h-4 w-10" />
            </div>
          ))}
        </div>

        {/* ✅ 헤더 아래 검정선 */}
        <div
          className="absolute left-0 border-b-2 border-[#010101]"
          style={{
            top: HEADER_HEIGHT,
            width: totalWidth,
          }}
        />
      </div>

      {/* 본문 Skeleton */}
      {skeletonRows.map((_, i) => (
        <div
          key={i}
          className="grid"
          style={{
            gridTemplateColumns: `${TEAM_COL_WIDTH} repeat(${cols}, ${PROBLEM_CELL_WIDTH})`,
            height: ROW_HEIGHT,
            borderBottom: '1px solid #E0E0E0',
            minWidth: totalWidth,
          }}
        >
          <div
            className="flex items-center justify-center"
            style={{ borderRight: '2px solid #010101' }}
          >
            <Skeleton className="h-4 w-16" />
          </div>
          {Array.from({ length: cols }).map((_, idx) => (
            <div
              key={idx}
              className="flex items-center justify-center"
              style={{
                borderLeft: '1px solid #E0E0E0',
                borderRight: idx === cols - 1 ? '1px solid #E0E0E0' : 'none',
              }}
            >
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

// 🔹 메인 컴포넌트
export default function ProblemStatusMatrix() {
  const { data, isLoading, error } = useSolveMatrixQuery('title');

  if (isLoading) return <ProblemStatusMatrixSkeleton />;
  if (error)
    return <div className="text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</div>;

  const { teams, problems, matrix } = data;
  const totalWidth = `calc(${TEAM_COL_WIDTH} + ${problems.length} * ${PROBLEM_CELL_WIDTH})`;

  return (
    <div
      className="relative w-full h-[640px] bg-white/80 rounded-[10px] overflow-auto"
      style={{
        padding: '8px',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        backdropFilter: 'blur(5px)',
      }}
    >
      <div style={{ minWidth: totalWidth }}>
        <Header problems={problems} />
        {teams.map((team, index) => (
          <DataRow
            key={team.id}
            teamName={team.name}
            status={matrix[index]}
            problemsLength={problems.length}
          />
        ))}
      </div>
    </div>
  );
}
