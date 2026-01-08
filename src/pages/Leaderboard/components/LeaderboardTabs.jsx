import React from "react";

const tabs = ["팀별 점수 차트", "통합 랭크보드"];

export default function LeaderboardTabs({ activeTab, onChange }) {
  return (
    <div className="flex justify-center mb-10">
      <div
        className="
          flex px-3 py-2 gap-3
          rounded-full 
          bg-[#1A0B15]/70
          backdrop-blur-md
          border border-[#FF4854]/40
          shadow-[0_0_25px_rgba(255,72,84,0.35)]
        "
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab;

          return (
            <button
              key={tab}
              onClick={() => onChange(tab)}
              className={`
                px-6 py-2 rounded-full text-sm font-semibold 
                transition-all duration-200 cursor-pointer
                ${
                  isActive
                    ? `
                      bg-[#FF4854]
                      text-white 
                      shadow-[0_0_12px_rgba(255,72,84,0.7)]
                      border border-[#FF7A85]
                    `
                    : `
                      text-[#FF4854]
                      border border-[#FF4854]/40
                      hover:bg-[#FF4854]/20
                      hover:shadow-[0_0_10px_rgba(255,72,84,0.4)]
                    `
                }
              `}
              style={{
                fontFamily: "Black Han Sans",
                letterSpacing: "0.5px",
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </div>
  );
}
