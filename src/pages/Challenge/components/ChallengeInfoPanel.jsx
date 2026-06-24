// src/features/Challenge/components/ChallengeInfoPanel.jsx
import React, { useRef, useState } from 'react';
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
  튜토리얼: leftPinkBg,
  일반: leftPurpleBg,
};

const LEFT_PANEL_BACKGROUNDS = [leftGreenBg, leftYellowBg, leftPinkBg, leftPurpleBg];

if (typeof document !== 'undefined') {
  LEFT_PANEL_BACKGROUNDS.forEach(src => {
    const isAlreadyPreloaded = document.head.querySelector(`link[rel="preload"][href="${src}"]`);
    if (isAlreadyPreloaded) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
}

const CATEGORY_TITLE_COLOR_MAP = {
  군사: 'text-[#079C4C]',
  법률: 'text-[#E6AA02]',
  사회: 'text-[#E6007E]',
  튜토리얼: 'text-[#E6007E]',
  일반: 'text-[#837BBD]',
};

const TAB_ACCENT_COLOR_MAP = {
  description: '#837BBD',
  goal: '#E6AA02',
  success: '#079C4C',
  failure: '#FF4854',
};

const TAB_TITLE_COLOR_CLASS_MAP = {
  description: 'text-[#837BBD]',
  goal: 'text-[#E6AA02]',
  success: 'text-[#079C4C]',
  failure: 'text-[#FF4854]',
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
  const [hoveredTab, setHoveredTab] = useState(null);
  const panelRef = useRef(null);
  const gap = 1.15;
  const padding = 1.2;
  const lineHeight = 1.75;
  const category = CHALLENGE_HEADER_INFO?.category || '일반';
  const headerTitleColor = CATEGORY_TITLE_COLOR_MAP[category] || 'text-[#E6007E]';
  const panelBackground = CATEGORY_BACKGROUND_MAP[category] || leftPurpleBg;

  if (isLoading) {
    return (
      <div ref={panelRef} className="relative w-[340px]">
        <ChallengeInfoPanelSkeleton
          TABS={TABS}
          handleTabClick={handleTabClick}
          activeTab={activeTab}
        />
      </div>
    );
  }

  return (
    <div
      ref={panelRef}
      className="relative flex h-full min-h-0 w-[340px] flex-col flex-shrink-0"
    >
      <div
        className="relative shadow-[0_10px_28px_rgba(15,23,42,0.10)] rounded-[30px] overflow-hidden flex min-h-0 flex-col h-full border border-white/55 bg-cover bg-center backdrop-blur-xl"
        style={{ backgroundImage: `url(${panelBackground})` }}
      >
        <div className="pointer-events-none absolute inset-0 rounded-[30px] bg-white/16 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]" />
        {/* 문제 헤더 */}
        <div
          className="relative flex min-h-[108px] flex-col justify-center overflow-hidden flex-shrink-0 px-4 pt-4 pb-3"
        >
          <div className="relative flex w-full items-center gap-3 rounded-[18px] border border-white/65 bg-white/42 px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_4px_14px_rgba(15,23,42,0.06)] backdrop-blur-md">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="group flex h-9 w-7 flex-shrink-0 cursor-pointer items-center justify-center"
              aria-label="뒤로가기"
            >
              <ChevronLeft
                className="h-7 w-7 text-[#6B6B6B] transition-colors group-hover:text-[#FF4854]"
                strokeWidth={2}
              />
            </button>
            <span className={`min-w-0 line-clamp-2 heading-2 font-700 ${headerTitleColor}`}>
              {CHALLENGE_HEADER_INFO?.title}
            </span>
          </div>
        </div>

        {/* 탭 영역 */}
        <div className="relative w-full flex flex-col flex-grow min-h-0 px-4 pb-4">
          <div
            className="flex justify-between flex-shrink-0 rounded-[18px] border border-white/65 bg-white/42 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_4px_14px_rgba(15,23,42,0.06)] backdrop-blur-md"
            style={{
              gap: `${Math.min(gap, 1)}rem`,
              padding: `0 ${padding * 0.75}rem`,
              transition: 'all 0.2s ease',
            }}
          >
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={e => handleTabClick(e, tab.id)}
                onMouseEnter={() => setHoveredTab(tab.id)}
                onMouseLeave={() => setHoveredTab(null)}
                className={`relative h-[58px] px-1 body-large font-700 transition-colors duration-200 cursor-pointer whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab.id || hoveredTab === tab.id
                    ? TAB_TITLE_COLOR_CLASS_MAP[tab.id]
                    : 'text-[#0F172A]'
                }`}
              >
                {tab.title}
                {activeTab === tab.id ? (
                  <span
                    className="absolute bottom-0 left-0 h-[5px] w-full rounded-t-full shadow-[0_0_12px_rgba(131,123,189,0.35)]"
                    style={{ backgroundColor: TAB_ACCENT_COLOR_MAP[tab.id] }}
                  />
                ) : null}
              </button>
            ))}
          </div>

          {/* 탭 콘텐츠 */}
          {activeTabContent && (
            <div
              className="flex-grow min-h-0 overflow-hidden pt-4"
              style={{
                transition: 'all 0.2s ease',
              }}
            >
              <div className="flex h-full min-h-0 flex-col overflow-y-auto pr-1">
                <div className="rounded-[24px] border border-white/65 bg-white/46 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_6px_18px_rgba(15,23,42,0.07)] backdrop-blur-md">
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
    </div>
  );
}
