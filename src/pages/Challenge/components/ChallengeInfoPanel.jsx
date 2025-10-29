// src/features/Challenge/components/ChallengeInfoPanel.jsx (수정된 전체 코드)

import React from 'react';
import ApiInfoPanel from './ApiInfoPanel';
import Skeleton from '../../../components/Skeleton/Skeleton'; // 💡 Skeleton import 가정

// ------------------------------------------------------------------
// 💡 ChallengeInfoPanel Skeleton 정의 (탭 버튼 스켈레톤 제거)
// ------------------------------------------------------------------
const ChallengeInfoPanelSkeleton = ({ TABS, handleTabClick, activeTab }) => {
    return (
        <div className="flex flex-col flex-shrink-0 w-[240px] lg:w-[295px] h-full animate-pulse">
            <div className="bg-white shadow-xl rounded-[20px] overflow-hidden flex flex-col h-full">
                {/* 헤더 및 태그 스켈레톤 영역 (데이터 영역 - 유지) */}
                <div className="flex flex-col p-3 md:p-4 h-[110px] shadow-sm bg-white rounded-t-[20px] flex-shrink-0">
                    <Skeleton className="h-6 w-3/4 rounded mb-3" />
                    <Skeleton className="h-4 w-full rounded mb-3" />
                    <Skeleton className="h-4 w-full rounded mb-3" />
                </div>
                
                {/* 탭 및 내용 스켈레톤 영역 */}
                <div className="w-full flex-shrink-0 flex flex-col bg-white border-t border-gray-200 flex-grow">
                    
                    {/* ❌ 탭 버튼 스켈레톤 대신 원본 탭 버튼 렌더링 시작 */}
                    <div className="flex justify-center p-3 md:p-4 gap-1 lg:gap-2 border-b border-gray-200 flex-shrink-0">
                        {/* 💡 원본 탭 버튼 로직을 그대로 복사하여 삽입합니다. */}
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={e => handleTabClick(e, tab.id)}
                                // 로딩 중에도 클릭 가능하며 디자인 유지
                                className={`py-2 px-2 body-large font-500 rounded-lg transition-colors duration-200 cursor-pointer
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
                    {/* ❌ 원본 탭 버튼 렌더링 끝 */}
                    
                    {/* 탭 내용 스켈레톤 영역 (데이터 영역 - 유지) */}
                    <div className={`p-3 md:p-4 flex-grow flex flex-col space-y-4`}>
                        <Skeleton className="h-1/14 w-1/2 rounded mb-4" />
                        <Skeleton className="h-1/2 w-full rounded mb-4" />
                        
                        {/* ApiInfoPanel 스켈레톤 (ApiInfoPanel 내부에서 처리) */}
                        <ApiInfoPanel isLoading={true} /> 
                    </div>
                </div>
            </div>
        </div>
    );
};
// ------------------------------------------------------------------


export default function ChallengeInfoPanel({
    TABS,
    activeTab,
    activeTabContent, // 현재 활성화된 탭의 콘텐츠 객체
    handleTabClick,
    CHALLENGE_HEADER_INFO,
    isLoading, // 💡 isLoading prop 추가
}) {
    if (isLoading) {
        // 💡 Skeleton 컴포넌트 호출 시 handleTabClick과 activeTab을 전달하여, 
        // 로딩 중에도 탭이 클릭 가능하도록 합니다.
        return <ChallengeInfoPanelSkeleton TABS={TABS} handleTabClick={handleTabClick} activeTab={activeTab} />;
    }
    
    return (
        <div className="flex flex-col flex-shrink-0 w-[240px] lg:w-[295px] h-full">
            <div className="bg-white shadow-xl rounded-[20px] overflow-hidden flex flex-col h-full">
                {/* Challenge Header (제목 및 태그) - flex-shrink-0 */}
                <div className="flex flex-col p-3 md:p-4 h-[110px] shadow-sm bg-white rounded-t-[20px] flex-shrink-0">
                    <div className="flex justify-between items-start">
                        <span className="heading-2 font-500 text-[#34C759] mb-2">
                            {CHALLENGE_HEADER_INFO.title}
                        </span>
                    </div>

                    <span className="body-large font-500 text-[#010101]">
                        {CHALLENGE_HEADER_INFO.subtitle}
                    </span>
                </div>
                {/* Tabs & Content Container - flex-grow */}
                <div className="w-full flex-shrink-0 flex flex-col bg-white border-t border-gray-200 flex-grow">
                    {/* ✅ 탭 버튼 영역 (원본) - flex-shrink-0 */}
                    <div className="flex justify-center p-3 md:p-4 gap-1 lg:gap-2 border-b border-gray-200 flex-shrink-0">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={e => handleTabClick(e, tab.id)}
                                className={`py-2 px-2 body-large font-500 rounded-lg transition-colors duration-200 cursor-pointer
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
                    {/* 탭 내용 영역 (높이 상속 경로) */}
                    {activeTabContent && (
                        <div
                            className={`p-3 md:p-4 ${activeTabContent.bgColor} border-b-4 ${activeTabContent.borderColor} flex-grow flex flex-col h-full`}
                        >
                            {/* 탭 내용 내부 컨테이너 (스크롤 적용 및 내용 배치) */}
                            <div className={`flex flex-col flex-grow overflow-y-auto justify-between`}>
                                {/* 묶음 #1 : 제목 + 설명문 (늘어나지 않게 설정) */}
                                <div className="flex flex-col flex-shrink-0">
                                    <span
                                        className={`heading-3 font-500 ${activeTabContent.titleColor} block mb-1 flex-shrink-0`}
                                    >
                                        {activeTabContent.title}
                                    </span>

                                    <p className="body-large font-500 text-[#4C4C4C] whitespace-pre-wrap">
                                        {activeTabContent.content}
                                    </p>
                                </div>
                                {/* 묶음 #2 : API Panel (하단 고정) */}
                                {activeTab === 'description' && <ApiInfoPanel isLoading={false} />}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}