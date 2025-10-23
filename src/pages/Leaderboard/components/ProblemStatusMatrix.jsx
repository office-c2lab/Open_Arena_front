// src/pages/Leaderboard/components/ProblemStatusMatrix.jsx (문제 번호 셀 경계선 추가)

import React from 'react';
import { PROBLEM_STATUS_DATA } from '../data/problemStatusData';

const NUM_PROBLEMS = 20;
const problemNumbers = Array.from({ length: NUM_PROBLEMS }, (_, i) => i + 1);

const TEAM_COL_WIDTH = '120px';
const PROBLEM_CELL_WIDTH = '45px';
const HEADER_HEIGHT = '94px';

const ProblemStatusMatrix = () => {
  const data = PROBLEM_STATUS_DATA;
  const baseTextStyle =
    "text-[16px] leading-[24px] font-['Noto Sans KR'] font-light text-[#010101]";

  const Header = () => (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `${TEAM_COL_WIDTH} repeat(${NUM_PROBLEMS}, ${PROBLEM_CELL_WIDTH})`,
        height: HEADER_HEIGHT,
        borderBottom: '2px solid #010101',
      }}
    >
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
        <span className={`${baseTextStyle} self-start mt-[40px] mr-1`} style={{}}>
          문제
        </span>
      </div>

      {problemNumbers.map(p => (
        <div
          key={p}
          className={`${baseTextStyle} flex items-end justify-center pb-2`}
          style={{
            height: HEADER_HEIGHT,
            // 🎯 문제 번호 셀에 왼쪽 경계선 추가
            borderLeft: '1px solid #E0E0E0',
          }}
        >
          C{p}
        </div>
      ))}
    </div>
  );

  const DataRow = ({ teamName, status }) => {
    const rowHeight = '42.47px';

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

  return (
    <div
      className="relative w-[1027px] h-[640px] bg-white/80 rounded-[10px] p-2 overflow-auto"
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
