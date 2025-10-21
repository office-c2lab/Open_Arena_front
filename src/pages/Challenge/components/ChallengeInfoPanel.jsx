// src/features/Challenge/components/ChallengeInfoPanel.jsx

import React from 'react';
import DifficultyTag from '../../../components/Tag/DifficultyTag';
import CategoryTag from '../../../components/Tag/CategoryTag';

export default function ChallengeInfoPanel({
  TABS,
  activeTab,
  activeTabContent,
  handleTabClick,
  CHALLENGE_DETAILS, // 💡 새로운 prop 추가
}) {
  return (
    <div className="flex flex-col flex-shrink-0 w-[240px] lg:w-[295px] h-full">
      <div className="bg-white shadow-xl rounded-[20px] overflow-hidden flex flex-col h-full">
        {/* Challenge Header */}
        <div className="flex flex-col p-3 md:p-4 h-[110px] shadow-sm bg-white rounded-t-[20px] flex-shrink-0">
          <div className="flex justify-between items-start">
            {/* 💡 데이터 사용 */}
            <span className="text-[24px] font-medium text-[#34C759]">
              {CHALLENGE_DETAILS.title}
            </span>
            <div className="flex gap-2">
              {/* 💡 데이터 사용 */}
              <DifficultyTag>{CHALLENGE_DETAILS.difficulty}</DifficultyTag>
              <CategoryTag>{CHALLENGE_DETAILS.category}</CategoryTag>
            </div>
          </div>
          {/* 💡 데이터 사용 */}
          <span className="text-[16px] font-medium text-[#010101]">
            {CHALLENGE_DETAILS.subtitle}
          </span>
        </div>

        {/* Challenge Description */}
        <div className="p-3 md:p-4 flex-grow overflow-y-auto bg-[rgba(235,232,254,0.1)]">
          <h3 className="text-[20px] font-medium text-[#010101] mb-2">설명</h3>
          <p className="text-[16px] font-medium text-[#4C4C4C] whitespace-pre-wrap">
            {/* 💡 데이터 사용 */}
            {CHALLENGE_DETAILS.description}
          </p>
        </div>

        {/* Tabs (Goal, Success, Failure) - 기존 TABS 데이터 사용 */}
        <div className="w-full flex-shrink-0 flex flex-col bg-white border-t border-gray-200">
          <div className="flex justify-around p-3 md:p-4 gap-2 border-b border-gray-200">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={e => handleTabClick(e, tab.id)}
                className={`flex-1 py-2 px-1 text-[16px] font-bold rounded-lg transition-colors duration-200 ${
                  activeTab === tab.id
                    ? `${tab.titleColor} border border-2 ${tab.borderColor} ${tab.bgColor} shadow-md`
                    : 'text-gray-500 border border-gray-300 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                {tab.title}
              </button>
            ))}
          </div>
          {activeTabContent && (
            <div
              className={`p-3 md:p-4 ${activeTabContent.bgColor} border-b-4 ${activeTabContent.borderColor} overflow-y-auto`}
            >
              <span className={`text-[18px] font-bold ${activeTabContent.titleColor}`}>
                {activeTabContent.title}
              </span>
              <p className="text-[16px] leading-6 font-medium text-[#4C4C4C] whitespace-pre-wrap mt-2">
                {activeTabContent.content}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
