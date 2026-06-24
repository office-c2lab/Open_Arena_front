// src/features/Challenge/components/ChallengeInfoPanel.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import ApiInfoPanel from './ApiInfoPanel';
import Skeleton from '../../../components/Skeleton/Skeleton';
import leftGreenBg from '@/assets/images/leftgreen.png';
import leftYellowBg from '@/assets/images/leftyellow.png';
import leftPinkBg from '@/assets/images/leftpink.png';
import leftPurpleBg from '@/assets/images/leftpurple.png';

const CATEGORY_BACKGROUND_MAP = {
  군사: leftGreenBg,
  법률: leftYellowBg,
  사회: leftPinkBg,
  일반: leftPurpleBg,
};

const CATEGORY_TITLE_COLOR_MAP = {
  군사: 'text-[#079C4C]',
  법률: 'text-[#E6AA02]',
  사회: 'text-[#E6007E]',
  일반: 'text-[#837BBD]',
};

const TAB_ACCENT_COLOR_MAP = {
  description: '#837BBD',
  goal: '#E6AA02',
  success: '#079C4C',
  failure: '#FF4854',
};

const ChallengeInfoPanelSkeleton = ({ TABS, handleTabClick, activeTab }) => (
  <div className="flex flex-col flex-shrink-0 w-[295px] h-full animate-pulse">
    <div className="bg-white shadow-xl rounded-[20px] overflow-hidden flex flex-col h-full">
      <div className="flex flex-col p-4 h-[110px] shadow-sm bg-white rounded-t-[20px] flex-shrink-0">
        <Skeleton className="h-6 w-3/4 rounded mb-3" />
        <Skeleton className="h-4 w-full rounded mb-3" />
        <Skeleton className="h-4 w-full rounded mb-3" />
      </div>
      <div className="w-full flex-shrink-0 flex flex-col bg-white border-t border-gray-200 flex-grow">
        <div className="flex justify-center p-4 gap-2 border-b border-gray-200 flex-shrink-0">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={e => handleTabClick(e, tab.id)}
              className={`py-2 px-2 body-large font-500 rounded-lg transition-colors duration-200 cursor-pointer
                text-gray-500 border border-gray-300 bg-gray-50 hover:bg-gray-100 whitespace-nowrap`}
            >
              {tab.title}
            </button>
          ))}
        </div>
        <div className="p-4 flex-grow flex flex-col space-y-4">
          <Skeleton className="h-4 w-1/2 rounded mb-4" />
          <Skeleton className="h-1/2 w-full rounded mb-4" />
          <ApiInfoPanel isLoading={true} />
        </div>
      </div>
    </div>
  </div>
);

export default function ChallengeInfoPanel({
  TABS,
  activeTab,
  activeTabContent,
  handleTabClick,
  CHALLENGE_HEADER_INFO,
  isLoading,

  // ⭐ 추가된 props (problem_api 정보)
  problemApiUrl,
  problemApiMethod,
  problemApiHeaderName,
  problemApiKey,
  problemCode,
}) {
  const navigate = useNavigate();
  const [width, setWidth] = useState(340);
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = e => {
      if (!isResizing) return;
      const min = 320;
      const max = 500;
      const rect = panelRef.current.getBoundingClientRect();
      const newWidth = Math.min(Math.max(e.clientX - rect.left, min), max);
      setWidth(newWidth);
    };
    const stopResize = () => setIsResizing(false);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', stopResize);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', stopResize);
    };
  }, [isResizing]);

  const gap = Math.min((width - 295) / 50 + 0.25, 2);
  const padding = Math.min((width - 295) / 100 + 0.75, 1.5);
  const lineHeight = Math.min((width - 295) / 200 + 1.6, 1.9);
  const category = CHALLENGE_HEADER_INFO?.category || '일반';
  const headerTitleColor = CATEGORY_TITLE_COLOR_MAP[category] || 'text-[#E6007E]';
  const panelBackground = CATEGORY_BACKGROUND_MAP[category] || leftPurpleBg;

  if (isLoading) {
    return (
      <div ref={panelRef} style={{ width }} className="relative">
        <ChallengeInfoPanelSkeleton
          TABS={TABS}
          handleTabClick={handleTabClick}
          activeTab={activeTab}
        />
        <div
          onMouseDown={() => setIsResizing(true)}
          className={`absolute right-0 top-0 w-[10px] h-full cursor-ew-resize bg-gray-400 transition-colors rounded-r-[16px] flex items-center justify-center`}
        >
          <div className="flex flex-col items-center justify-center gap-[5px]">
            <span className="w-[2px] h-[8px] bg-white rounded-full" />
            <span className="w-[2px] h-[8px] bg-white rounded-full" />
            <span className="w-[2px] h-[8px] bg-white rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={panelRef}
      style={{ '--panel-width': `${width}px`, transition: isResizing ? 'none' : 'width 0.2s ease' }}
      className="relative flex h-full flex-col flex-shrink-0 w-[var(--panel-width)]"
    >
      <div
        className="shadow-xl rounded-[20px] overflow-hidden flex flex-col h-full border border-[#E5E7EB] bg-cover bg-center"
        style={{ backgroundImage: `url(${panelBackground})` }}
      >
        {/* 문제 헤더 */}
        <div
          className="relative flex min-h-[96px] flex-col justify-center overflow-hidden rounded-t-[20px] flex-shrink-0 border-b border-[#E5E7EB] bg-white/80 backdrop-blur-[1px]"
          style={{ padding: `${padding * 0.95}rem ${padding * 1.15}rem` }}
        >
          <div className="relative flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="group flex h-8 w-8 flex-shrink-0 cursor-pointer items-center justify-center rounded-md transition hover:bg-white/60"
              aria-label="뒤로가기"
            >
              <ChevronLeft
                className="h-6 w-6 text-[#6B6B6B] transition-colors group-hover:text-[#FF4854]"
                strokeWidth={2}
              />
            </button>
            <span className={`min-w-0 line-clamp-2 heading-2 font-700 ${headerTitleColor}`}>
              {CHALLENGE_HEADER_INFO?.title}
            </span>
          </div>
        </div>

        {/* 탭 영역 */}
        <div className="w-full flex-shrink-0 flex flex-col flex-grow min-h-0 bg-white/70 backdrop-blur-[1px]">
          <div
            className="flex justify-between border-b border-[#E5E7EB] flex-shrink-0 bg-white/85"
            style={{
              gap: `${Math.min(gap, 1)}rem`,
              padding: `0 ${padding * 1.2}rem`,
              transition: 'all 0.2s ease',
            }}
          >
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={e => handleTabClick(e, tab.id)}
                className={`relative h-[58px] px-1 body-large font-700 transition-colors duration-200 cursor-pointer whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab.id ? tab.titleColor : 'text-[#0F172A] hover:text-[#837BBD]'
                }`}
              >
                {tab.title}
                {activeTab === tab.id ? (
                  <span
                    className="absolute bottom-0 left-0 h-[4px] w-full rounded-t-full"
                    style={{ backgroundColor: TAB_ACCENT_COLOR_MAP[tab.id] }}
                  />
                ) : null}
              </button>
            ))}
          </div>

          {/* 탭 콘텐츠 */}
          {activeTabContent && (
            <div
              className="flex-grow min-h-0 p-4"
              style={{
                padding: `${padding * 1.05}rem`,
                transition: 'all 0.2s ease',
              }}
            >
              <div className="flex h-full flex-col overflow-y-auto pr-2">
                <div className="rounded-[8px] border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_14px_rgba(15,23,42,0.06)]">
                  <span className={`heading-3 font-700 ${activeTabContent.titleColor} block mb-6`}>
                    {activeTabContent.title}
                  </span>

                  {activeTab === 'description' && CHALLENGE_HEADER_INFO?.subtitle ? (
                    <p className="mb-6 body-large font-700 leading-7 text-[#0F172A]">
                      {CHALLENGE_HEADER_INFO.subtitle}
                    </p>
                  ) : null}

                  <p
                    className="body-large font-500 text-[#0F172A] whitespace-pre-wrap"
                    style={{ lineHeight }}
                  >
                    {activeTabContent.content}
                  </p>
                </div>

                {/* ⭐ API 패널 — 문제 설명 탭에서 표시 */}
                {activeTab === 'description' && problemApiUrl && (
                  <div className="mt-4">
                    <ApiInfoPanel
                      isLoading={false}
                      apiUrl={problemApiUrl}
                      method={problemApiMethod}
                      headerName={problemApiHeaderName}
                      apiKey={problemApiKey}
                      problemCode={problemCode}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 리사이즈 핸들 */}
      <div
  onMouseDown={() => setIsResizing(true)}
  className={`absolute right-0 top-0 w-[14px] h-full cursor-ew-resize
    ${isResizing ? 'bg-gray-500' : 'bg-gray-400 hover:bg-gray-500'}
    transition-colors rounded-r-[16px] flex items-center justify-center
    translate-x-[10px]`}
>

        <div className="flex flex-col items-center justify-center gap-[5px]">
          <span className="w-[2px] h-[8px] bg-white rounded-full" />
          <span className="w-[2px] h-[8px] bg-white rounded-full" />
          <span className="w-[2px] h-[8px] bg-white rounded-full" />
        </div>
      </div>
    </div>
  );
}
