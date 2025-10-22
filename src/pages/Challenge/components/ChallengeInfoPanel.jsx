// src/features/Challenge/components/ChallengeInfoPanel.jsx

import React from 'react';
import DifficultyTag from '../../../components/Tag/DifficultyTag';
import CategoryTag from '../../../components/Tag/CategoryTag';
import ApiInfoPanel from './ApiInfoPanel';

export default function ChallengeInfoPanel({
  TABS,
  activeTab,
  activeTabContent, // 현재 활성화된 탭의 콘텐츠 객체
  handleTabClick,
  CHALLENGE_HEADER_INFO,
}) {
  return (
    <div className="flex flex-col flex-shrink-0 w-[240px] lg:w-[295px] h-full">
      <div className="bg-white shadow-xl rounded-[20px] overflow-hidden flex flex-col h-full">
        {/* Challenge Header (제목 및 태그) - 생략 */}
        <div className="flex flex-col p-3 md:p-4 h-[110px] shadow-sm bg-white rounded-t-[20px] flex-shrink-0">
          <div className="flex justify-between items-start">
            <span className="text-[24px] font-medium text-[#34C759]">
              {CHALLENGE_HEADER_INFO.title}
            </span>

            {/* 카테고리 태그 제거 
            <div className="flex gap-2">
              <DifficultyTag>{CHALLENGE_HEADER_INFO.difficulty}</DifficultyTag>
              <CategoryTag>{CHALLENGE_HEADER_INFO.category}</CategoryTag>
            </div> */}
          </div>

          <span className="text-[16px] font-medium text-[#010101]">
            {CHALLENGE_HEADER_INFO.subtitle}
          </span>
        </div>
        {/* Tabs & Content Container */}
        <div className="w-full flex-shrink-0 flex flex-col bg-white border-t border-gray-200 flex-grow">
          {/* 탭 버튼 영역 - 생략 */}
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
    whitespace-nowrap flex-shrink-0`}
                title={tab.title}
              >
                {tab.title}
              </button>
            ))}
          </div>
          {/* 탭 내용 영역 */}
          {activeTabContent && (
            <div // 이 div는 패딩과 색상을 담당하며, Flex 컨테이너 역할을 합니다.
              className={`p-3 md:p-4 ${activeTabContent.bgColor} border-b-4 ${activeTabContent.borderColor} overflow-y-auto flex-grow flex flex-col`}
            >
              <span
                className={`text-[18px] font-bold ${activeTabContent.titleColor} block mb-2 flex-shrink-0`}
              >
                {activeTabContent.title}
              </span>
              {/* 💡 [수정됨] 설명 문단과 API 패널을 감싸는 Flex 컨테이너 */}
              <div
                className={`flex flex-col ${activeTab === 'description' ? 'justify-around' : 'justify-start'} flex-grow`}
              >
                <p className="text-[16px] leading-6 font-medium text-[#4C4C4C] whitespace-pre-wrap mb-4">
                  {activeTabContent.content}
                </p>

                {activeTab === 'description' && (
                  // ApiInfoPanel 내부에는 mt-4가 있으므로, 별도의 추가 마진은 불필요할 수 있습니다.
                  <ApiInfoPanel />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
