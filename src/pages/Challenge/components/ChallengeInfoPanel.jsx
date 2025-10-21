// src/features/Challenge/components/ChallengeInfoPanel.jsx

import React from 'react';
import DifficultyTag from '../../../components/Tag/DifficultyTag';
import CategoryTag from '../../../components/Tag/CategoryTag';
// 경로는 기존 구조를 따릅니다.

export default function ChallengeInfoPanel({
  TABS,
  activeTab,
  activeTabContent,
  handleTabClick,
  CHALLENGE_HEADER_INFO, // 헤더 정보 prop 사용
}) {
  return (
    <div className="flex flex-col flex-shrink-0 w-[240px] lg:w-[295px] h-full">
      <div className="bg-white shadow-xl rounded-[20px] overflow-hidden flex flex-col h-full">
        {/* Challenge Header (제목 및 태그) */}
        <div className="flex flex-col p-3 md:p-4 h-[110px] shadow-sm bg-white rounded-t-[20px] flex-shrink-0">
          <div className="flex justify-between items-start">
            <span className="text-[24px] font-medium text-[#34C759]">
              {CHALLENGE_HEADER_INFO.title}
            </span>
            <div className="flex gap-2">
              <DifficultyTag>{CHALLENGE_HEADER_INFO.difficulty}</DifficultyTag>
              <CategoryTag>{CHALLENGE_HEADER_INFO.category}</CategoryTag>
            </div>
          </div>
          <span className="text-[16px] font-medium text-[#010101]">
            {CHALLENGE_HEADER_INFO.subtitle}
          </span>
        </div>

        {/* Tabs (Description, Goal, Success, Failure) */}
        <div className="w-full flex-shrink-0 flex flex-col bg-white border-t border-gray-200 flex-grow">
          {/* 탭 버튼 영역 - justify-center로 중앙 정렬하고, 버튼의 크기를 내용에 맞춥니다. */}
          <div className="flex justify-center p-3 md:p-4 gap-1 lg:gap-2 border-b border-gray-200 flex-shrink-0">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={e => handleTabClick(e, tab.id)}
                className={`py-2 px-2 text-[13px] lg:text-[16px] font-bold rounded-lg transition-colors duration-200
                  ${tab.titleColor} 
                  ${
                    activeTab === tab.id
                      ? `border border-2 ${tab.borderColor} ${tab.bgColor} shadow-md`
                      : 'text-gray-500 border border-gray-300 bg-gray-50 hover:bg-gray-100'
                  } 
                  // 💡 flex-1 제거하고, 내용 길이에 맞게 조절되도록 flex-shrink-0만 유지
                  whitespace-nowrap flex-shrink-0`}
                title={tab.title}
              >
                {tab.title}
              </button>
            ))}
          </div>

          {/* 탭 내용 영역 */}
          {activeTabContent && (
            <div
              className={`p-3 md:p-4 ${activeTabContent.bgColor} border-b-4 ${activeTabContent.borderColor} overflow-y-auto flex-grow`}
            >
              <span className={`text-[18px] font-bold ${activeTabContent.titleColor} block mb-2`}>
                {activeTabContent.title}
              </span>

              <p className="text-[16px] leading-6 font-medium text-[#4C4C4C] whitespace-pre-wrap">
                {activeTabContent.content}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
