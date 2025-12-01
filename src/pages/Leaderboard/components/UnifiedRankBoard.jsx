// src/pages/Leaderboard/components/UnifiedRankBoard.jsx

import React from "react";
import { oxGradientMap } from "@/styles/oxGradientMap";
import { useSolveMatrix } from "@/hooks/useSolveMatrix";
import { useMatrixPublicSetting } from "@/hooks/useMatrixPublicSetting";

const stateMap = {
  true: "success",
  false: "pending",
};

export default function UnifiedRankBoard() {
  // 🔥 1) 공개 여부 조회
  const {
    data: publicSetting,
    isLoading: isSettingLoading,
    isError: isSettingError,
  } = useMatrixPublicSetting();

  // 🔥 2) Solve Matrix 조회
  const { data, isLoading, isError } = useSolveMatrix();

  // ============================
  //  A. 공개 여부 체크
  // ============================
  if (isSettingLoading) {
    return (
      <div className="text-white text-center py-10 text-[20px]">
        리더보드 활성화 여부 확인 중...
      </div>
    );
  }

  if (isSettingError || !publicSetting) {
    return (
      <div className="text-red-400 text-center py-10 text-[20px]">
        공개 여부 확인 실패
      </div>
    );
  }

  if (!publicSetting.enabled) {
    return (
      <div className="text-gray-300 text-center py-10 text-[22px] font-bold">
        공용 리더보드가 현재 비공개 상태입니다.
      </div>
    );
  }

  // ============================
  //  B. 매트릭스 데이터 로딩
  // ============================
  if (isLoading) {
    return (
      <div className="text-white text-center py-10 text-[20px]">
        Loading...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="text-red-400 text-center py-10 text-[20px]">
        Failed to load leaderboard.
      </div>
    );
  }

  // ============================
  //  C. 정상 데이터 출력
  // ============================
  const { teams, problems, matrix } = data;

  const PROBLEM_COUNT = problems.length;
  const teamNames = teams.map((t) => t.name);

  const results = matrix.map((row) =>
    row.map((state) => stateMap[state] || "pending")
  );

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

          {/* 배점 */}
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

          {problems.map((p) => (
            <div
              key={p.id}
              className="
                text-white text-[15px] font-bold
                flex items-center justify-center
                bg-[#1A0B15]/40 rounded-[10px] h-[50px]
                border border-[#FF4854]/25
              "
            >
              {p.score}
            </div>
          ))}

          {/* 팀 rows */}
          {teamNames.map((team, tIdx) => (
            <React.Fragment key={`team-row-${tIdx}`}>
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

              {results[tIdx].map((state, pIdx) => (
                <div key={`dot-${tIdx}-${pIdx}`} className="flex justify-center items-center">
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
