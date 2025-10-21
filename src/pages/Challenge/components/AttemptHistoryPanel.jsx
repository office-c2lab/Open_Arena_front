// src/features/Challenge/components/AttemptHistoryPanel.jsx

import React from 'react';

export default function AttemptHistoryPanel({ PurpleDownIcon }) {
  return (
    <div className="flex flex-col flex-shrink-0 w-[240px] lg:w-[295px] h-full">
      <div className="flex flex-col shadow-xl rounded-[20px] overflow-hidden h-full bg-[rgba(235,232,254,0.1)]">
        {/* Header */}
        <div className="w-full h-[70px] p-3 md:p-4 shadow-sm bg-white rounded-t-[20px] flex items-center justify-between flex-shrink-0">
          <span className="text-[24px] font-medium text-[#837BBD]">최근 시도</span>
        </div>

        {/* Dropdown/Filter */}
        <div className="p-3 md:p-4 flex justify-end flex-shrink-0 bg-[rgba(235,232,254,0.1)]">
          <div className="flex items-center justify-end w-[126px] h-[39px] px-4 py-[10px] gap-7 bg-white shadow-[0px_0px_2px_rgba(0,0,0,0.25)] rounded-[10px] cursor-pointer flex-shrink-0">
            <span className="text-[16px] font-semibold text-[#837BBD]">전체</span>
            <img src={PurpleDownIcon} alt="Dropdown" className="w-3 h-2" />
          </div>
        </div>

        {/* Content/Placeholder */}
        <div className="flex flex-1 justify-center items-center text-center overflow-y-auto">
          <p className="text-[16px] font-medium text-[#000000]">아직 시도 기록이 없습니다.</p>
        </div>
      </div>
    </div>
  );
}
