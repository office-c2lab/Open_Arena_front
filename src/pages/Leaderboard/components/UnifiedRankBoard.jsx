// src/pages/Leaderboard/components/UnifiedRankBoard.jsx

import React from "react";
import { oxGradientMap } from "@/styles/oxGradientMap";
import {
  mockProblemScores,
  mockHackingBoard,
} from "@/hooks/mock/arenaMockData";

const colorMap = {
  green: "success",
  gray: "pending",
};

export default function UnifiedRankBoard() {
  const problemData = mockProblemScores;
  const board = mockHackingBoard;

  if (!problemData || !board) {
    return (
      <div className="text-white text-center py-10 text-[20px]">
        Loading...
      </div>
    );
  }

  const problemScores = problemData.scores;
  const teamNames = board.map((item) => item.username);
  const results = board.map((item) =>
    item.colors.map((c) => colorMap[c] || "pending")
  );

  const PROBLEM_COUNT = results[0]?.length || 0;

  const safeScores =
    PROBLEM_COUNT === problemScores.length
      ? problemScores
      : [
          ...problemScores,
          ...Array(Math.max(PROBLEM_COUNT - problemScores.length, 0)).fill("-"),
        ];

  return (
    <div className="w-full flex justify-center py-10 overflow-x-auto">
      <div
        className="
          min-w-[1400px] max-w-[2000px]
          mx-auto p-12 rounded-[40px]
          bg-[#0B021C]/80 border-[3px] border-[#FF4854]
          shadow-[0_0_55px_rgba(255,72,84,0.8)]
        "
      >
        {/* =============================== */}
        {/*            GRID LAYOUT           */}
        {/* =============================== */}
        <div
          className="grid gap-[6px]"
          style={{
            gridTemplateColumns: `200px repeat(${PROBLEM_COUNT}, minmax(28px, 1fr))`,
          }}
        >
          {/* ------------------------------- */}
          {/*        문제번호 Row             */}
          {/* ------------------------------- */}
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

          {Array.from({ length: PROBLEM_COUNT }).map((_, i) => (
            <div
              key={i}
              className="
                text-[#C56CFF] text-[16px] font-bold
                flex items-center justify-center
                bg-[#2A063B]/50 rounded-[10px] h-[50px]
                shadow-[0_0_10px_rgba(197,108,255,0.3)]
              "
            >
              {String(i + 1).padStart(2, "0")}
            </div>
          ))}

          {/* ------------------------------- */}
          {/*            배점 Row             */}
          {/* ------------------------------- */}
          <div
            className="
              text-[#FF4854] font-extrabold text-[22px]
              flex items-center justify-center
              bg-[#3A0A2A]/60 border border-[#FF4854]/50
              rounded-[14px] h-[50px]
              shadow-[0_0_14px_rgba(255,72,84,0.5)]
            "
          >
            배점
          </div>

          {safeScores.map((score, i) => (
            <div
              key={i}
              className="
                text-white text-[15px] font-bold
                flex items-center justify-center
                bg-[#1A0B15]/40 rounded-[10px] h-[50px]
                border border-[#FF4854]/25
              "
            >
              {score}
            </div>
          ))}

          {/* ------------------------------- */}
          {/*            팀별 Rows            */}
          {/* ------------------------------- */}
          {teamNames.map((team, tIdx) => (
            <React.Fragment key={`team-row-${tIdx}`}>
              {/* 팀명 박스 */}
              <div
                className="
                  text-white text-[18px] font-bold
                  h-[44px] flex items-center justify-center
                  bg-[#1A0B15]/70 border border-[#FF4854]/40 rounded-[12px]
                  shadow-[0_0_12px_rgba(255,72,84,0.3)]
                "
              >
                {team}
              </div>

              {/* 문제 dot들 */}
              {results[tIdx].map((state, pIdx) => (
                <div
                  key={`dot-${tIdx}-${pIdx}`}
                  className="flex justify-center items-center"
                >
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      ...(oxGradientMap[state] || oxGradientMap.pending),
                      boxShadow: "0 0 6px rgba(255,255,255,0.25)",
                    }}
                  />
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
