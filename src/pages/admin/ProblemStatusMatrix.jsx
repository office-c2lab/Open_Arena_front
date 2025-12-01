import React from 'react';
import Skeleton from '../../components/Skeleton/Skeleton';
import { useSolveMatrixQuery } from '@/hooks/useSolveMatrixQuery';
import { oxGradientMap } from '@/styles/oxGradientMap';

const stateMap = {
  true: 'success',
  false: 'pending',
};

// 🔹 Skeleton
const ProblemStatusMatrixSkeleton = ({ rows = 12 }) => {
  return (
    <div className="w-full flex justify-center py-10">
      <div className="board-scale-wrapper">
        <div className="min-w-[1400px] max-w-[2000px] mx-auto p-12 rounded-[40px] bg-[#0B021C]/80 border-[3px] border-[#FF4854] shadow-[0_0_55px_rgba(255,72,84,0.8)]">
          <Skeleton className="h-[50px] w-full mb-[6px] bg-[#3A0A4C]/60" />
          <Skeleton className="h-[50px] w-full mb-[6px] bg-[#3A0A2A]/60" />
          {Array.from({ length: rows }).map((_, i) => (
            <Skeleton key={i} className="h-[44px] w-full mb-[6px] bg-[#1A0B15]/70" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default function ProblemStatusMatrix() {
  const { data, isLoading, error } = useSolveMatrixQuery("title");

  if (isLoading) return <ProblemStatusMatrixSkeleton />;
  if (error)
    return (
      <div className="text-red-400 text-center py-10 text-[20px]">
        데이터를 불러오는 중 오류가 발생했습니다.
      </div>
    );
  // console.log("📌 Solve Matrix API data:", data);

  const { teams, problems, matrix } = data;

  const PROBLEM_COUNT = problems.length;
  const teamNames = teams.map((t) => t.name);

  const results = matrix.map((row) =>
    row.map((state) => stateMap[String(state)] || state || "pending")
  );

  return (
    <div className="w-full flex justify-center py-10 px-10 overflow-x-auto">
      <div className="board-scale-wrapper">
        <div
          className="
            min-w-[1400px] max-w-[2000px]
            mx-auto p-12 rounded-[40px]
            bg-[#0B021C]/80 border-[3px] border-[#FF4854]
            shadow-[0_0_55px_rgba(255,72,84,0.8)]
          "
        >
          <div
            className="grid gap-[6px]"
            style={{
              gridTemplateColumns: `200px repeat(${PROBLEM_COUNT}, minmax(28px, 1fr))`,
            }}
          >
            {/* 문제번호 */}
            <div
              className="
                text-[#C56CFF] font-extrabold text-[22px]
                flex items-center justify-center
                bg-[#3A0A4C]/60 border border-[#C56CFF]/50
                rounded-[14px] h-[50px]
                shadow-[0_0_14px_rgba(197,108,255,0.5)]
              "
            >
              문제번호
            </div>

            {problems.map((p, idx) => (
              <div
                key={p.id}
                className="
                  text-[#C56CFF] text-[16px] font-bold
                  flex items-center justify-center
                  bg-[#2A063B]/50 rounded-[10px] h-[50px]
                  shadow-[0_0_10px_rgba(197,108,255,0.3)]
                "
              >
                {String(idx + 1).padStart(2, "0")}
              </div>
            ))}

            {/* 문제 이름 (현재 사용하지 않음 — 주석 유지)
            <div
              className="
                text-[#FF4854] font-extrabold text-[22px]
                flex items-center justify-center
                bg-[#3A0A2A]/60 border border-[#FF4854]/50
                rounded-[14px] min-h-[60px]
                shadow-[0_0_14px_rgba(255,72,84,0.5)]
              "
            >
              문제 이름
            </div>

            {problems.map((p) => (
              <div
                key={p.id}
                className="
                  text-white text-[15px] font-bold
                  flex items-center justify-center text-center
                  bg-[#1A0B15]/40 rounded-[10px]
                  border border-[#FF4854]/25 px-2 py-2
                  whitespace-normal break-words
                  min-h-[60px]
                "
              >
                {p.label}
              </div>
            ))} */}

            {/* 팀 / 문제 dot */}
            {teamNames.map((team, tIdx) => {
              // 🔥 solved_count 백엔드 값 사용
              const solvedCount = teams[tIdx]?.solved_count ?? 0;

              return (
                <React.Fragment key={`team-row-${tIdx}`}>
                  <div
                    className="
                      text-white text-[18px] font-bold
                      h-[44px] flex items-center justify-between
                      bg-[#1A0B15]/70 border border-[#FF4854]/40 rounded-[12px]
                      shadow-[0_0_12px_rgba(255,72,84,0.3)] px-3
                    "
                  >
                    <span className="truncate">{team}</span>

                    {/* solved_count 표시 */}
                    <span className="text-sm font-semibold text-[#10B981] bg-gray-800/50 px-2 py-0.5 rounded-full border border-[#10B981]/50">
                      {solvedCount}
                    </span>
                  </div>

                  {results[tIdx].map((state, pIdx) => (
                    <div key={`dot-${tIdx}-${pIdx}`} className="flex justify-center items-center">
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          ...(oxGradientMap[state] || oxGradientMap.pending),
                        }}
                      />
                    </div>
                  ))}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
