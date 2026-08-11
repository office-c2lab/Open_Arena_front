// src/pages/Leaderboard/AdminTotalGraphToggle.jsx
import React from 'react';
import { useTotalGraphSetting } from '@/hooks/useTotalGraphSetting';

export default function AdminTotalGraphToggle() {
  const { setting, isLoading, isPending, toggle } = useTotalGraphSetting();

  if (isLoading) {
    return <div className="px-5 py-3 bg-gray-300 rounded-lg text-white">설정 불러오는 중...</div>;
  }

  return (
    <div className="flex items-center gap-4">
      {/* 설명 텍스트 */}
      <span className="text-[#030102] text-card-title font-bold whitespace-nowrap">
        토탈 그래프 공개 설정
      </span>

      {/* Toggle Switch */}
      <button
        type="button"
        disabled={isPending}
        onClick={toggle}
        aria-pressed={setting}
        aria-label="토탈 그래프 공개 설정"
        className={`relative w-[60px] h-[32px] rounded-full transition-all flex items-center
          ${setting ? 'bg-[#e13a47]' : 'bg-gray-300'}
          ${isPending ? 'opacity-50' : 'hover:brightness-110'}
        `}
      >
        <div
          className={`absolute w-[26px] h-[26px] bg-white rounded-full shadow-md transition-all
            ${setting ? 'translate-x-[30px]' : 'translate-x-[4px]'}
          `}
        ></div>
      </button>

      {/* 상태 텍스트 */}
      <p className="text-body text-[#616161] whitespace-nowrap">
        {isPending ? '변경 중...' : setting ? '공개됨' : '비공개'}
      </p>
    </div>
  );
}
