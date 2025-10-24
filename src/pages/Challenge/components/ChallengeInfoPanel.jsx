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
            <span className="heading-2 font-500 text-[#34C759] mb-2">
              {CHALLENGE_HEADER_INFO.title}
            </span>

            {/* 카테고리 태그 제거 
            <div className="flex gap-2">
              <DifficultyTag>{CHALLENGE_HEADER_INFO.difficulty}</DifficultyTag>
              <CategoryTag>{CHALLENGE_HEADER_INFO.category}</CategoryTag>
            </div> */}
          </div>

          <span className="body-large font-500 text-[#010101]">
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
                className={`py-2 px-2 body-large font-500 rounded-lg transition-colors duration-200
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
              {/* ✅ flex 컨테이너 (제목 + 설명 한 묶음 + API) */}
              <div className={`flex flex-col  flex-grow`}>
                {/* ✅ 묶음 #1 : 제목 + 설명문 */}
                <div className="flex flex-col mb-2">
                  <span
                    className={`heading-3 font-500 ${activeTabContent.titleColor} block mb-1 flex-shrink-0`}
                  >
                    {activeTabContent.title}
                  </span>
                  <p className="body-large font-500 text-[#4C4C4C] whitespace-pre-wrap mb-35">
                    {activeTabContent.content}
                  </p>
                </div>

                {/* ✅ 묶음 #2 : API Panel */}
                {activeTab === 'description' && <ApiInfoPanel />}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
