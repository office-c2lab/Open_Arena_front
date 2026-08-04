// src/features/Challenge/components/ChallengeInfoPanel.jsx
import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import ApiInfoPanel from './ApiInfoPanel';
import AttemptHistoryCard from './AttemptHistoryCard';
import Skeleton from '../../../components/Skeleton/Skeleton';
import TokenInfoCard from './TokenInfoCard';
import { useSessionStore } from '@/stores/useSessionStore';

const TAB_ACCENT_COLOR_MAP = {
  overview: '#475569',
  history: '#FF4854',
};

const TAB_TITLE_COLOR_CLASS_MAP = {
  overview: 'text-[#475569]',
  history: 'text-[#FF4854]',
};

const OVERVIEW_TITLE_COLOR_CLASS_MAP = {
  description: 'text-[#475569]',
  goal: 'text-[#E6AA02]',
  success: 'text-[#079C4C]',
  failure: 'text-[#FF4854]',
};

const ChallengeInfoPanelSkeleton = ({ TABS, handleTabClick }) => (
  <div className="flex flex-col flex-shrink-0 w-[340px] h-full animate-pulse">
    <div className="glass-panel flex h-full flex-col overflow-hidden rounded-[30px]">
      <div className="flex flex-col p-4 h-[110px] border-b border-white/60 bg-white/45 rounded-t-[30px] flex-shrink-0">
        <Skeleton className="h-6 w-3/4 rounded mb-3" />
        <Skeleton className="h-4 w-full rounded mb-3" />
        <Skeleton className="h-4 w-full rounded mb-3" />
      </div>
      <div className="w-full flex-shrink-0 flex flex-col bg-white/30 flex-grow">
        <div className="grid grid-cols-2 gap-2 border-b border-white/60 p-4 flex-shrink-0">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={e => handleTabClick(e, tab.id)}
              className={`w-full py-2 px-2 text-body-lg font-medium rounded-lg transition-colors duration-200 cursor-pointer
                text-gray-500 border border-white/65 bg-white/45 hover:bg-white/65 whitespace-nowrap`}
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
  overviewSections = [],
  sessions = [],
  handleTabClick,
  CHALLENGE_HEADER_INFO,
  isLoading,
  problemApiUrl,
  problemApiMethod,
  problemApiHeaderName,
  problemApiKey,
  problemCode,
  problemId,
  teamId,
  tokenUsed,
  onBackClick,
}) {
  const navigate = useNavigate();
  const [hoveredTab, setHoveredTab] = useState(null);
  const panelRef = useRef(null);
  const { sessionId: currentSessionId, setSessionId, setSessionStatus } = useSessionStore();
  const lineHeight = 1.75;

  const historyItems = useMemo(
    () =>
      sessions.map((session, index) => {
        const status = session.status?.toLowerCase() || 'unsubmitted';
        const isSubmitted = ['success', 'fail', 'failed'].includes(status);

        return {
          id: session.id,
          status,
          attemptNumber: sessions.length - index,
          isSubmitted,
          isSuccess: status === 'success',
          isActive: session.id === currentSessionId,
          promptSummary:
            session.judge_reason?.split('\n')[0]?.slice(0, 50) ||
            session.title ||
            (isSubmitted ? '제출한 시도' : '새로운 대화'),
        };
      }),
    [currentSessionId, sessions]
  );

  const handleHistoryClick = item => {
    if (!problemId || item.id === currentSessionId) return;

    setSessionId(item.id);
    setSessionStatus(item.status === 'failed' ? 'fail' : item.status);
  };

  if (isLoading) {
    return (
      <div ref={panelRef} className="relative w-[340px]">
        <ChallengeInfoPanelSkeleton TABS={TABS} handleTabClick={handleTabClick} />
      </div>
    );
  }

  return (
    <div ref={panelRef} className="relative flex h-full min-h-0 w-[340px] flex-col flex-shrink-0">
      <div className="glass-panel relative flex h-full min-h-0 flex-col overflow-hidden rounded-[30px]">
        <div className="pointer-events-none absolute inset-0 rounded-[30px] bg-white/16 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]" />
        {/* 문제 헤더 */}
        <div className="relative flex flex-col justify-center overflow-hidden flex-shrink-0 px-4 pt-4 pb-3">
          <div className="glass-subtle relative flex w-full items-center gap-3 rounded-[18px] px-3 py-2.5">
            <button
              type="button"
              onClick={onBackClick ?? (() => navigate(-1))}
              className="group flex h-9 w-7 flex-shrink-0 cursor-pointer items-center justify-center"
              aria-label="뒤로가기"
            >
              <ChevronLeft
                className="h-7 w-7 text-[#6B6B6B] transition-colors group-hover:text-[#FF4854]"
                strokeWidth={2}
              />
            </button>
            <span className="min-w-0 line-clamp-2 text-section-title font-strong text-[#2E3338]">
              {CHALLENGE_HEADER_INFO?.title}
            </span>
          </div>
        </div>

        {/* 탭 영역 */}
        <div className="relative w-full flex flex-col flex-grow min-h-0 px-4 pb-3">
          <div
            className="glass-subtle grid flex-shrink-0 grid-cols-2 rounded-[18px]"
            style={{
              transition: 'all 0.2s ease',
            }}
          >
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={e => handleTabClick(e, tab.id)}
                onMouseEnter={() => setHoveredTab(tab.id)}
                onMouseLeave={() => setHoveredTab(null)}
                className={`relative h-[58px] w-full px-1 text-body-lg font-strong transition-colors duration-200 cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id || hoveredTab === tab.id
                    ? TAB_TITLE_COLOR_CLASS_MAP[tab.id]
                    : 'text-[#0F172A]'
                }`}
              >
                {tab.title}
                {activeTab === tab.id ? (
                  <span
                    className="absolute bottom-0 left-1/2 h-[3px] w-12 -translate-x-1/2 rounded-t-full shadow-[0_2px_6px_rgba(131,123,189,0.20)]"
                    style={{ backgroundColor: TAB_ACCENT_COLOR_MAP[tab.id] }}
                  />
                ) : null}
              </button>
            ))}
          </div>

          {/* 탭 콘텐츠 */}
          <div className="min-h-0 flex-grow overflow-hidden pt-4">
            <div className="flex h-full min-h-0 flex-col pr-1">
              <div
                className={`relative flex h-full min-h-0 flex-col overflow-hidden rounded-[18px] ${
                  activeTab === 'overview' ? 'glass-subtle p-6' : 'p-0'
                }`}
              >
                {activeTab === 'overview' ? (
                  <div className="no-scrollbar min-h-0 flex-1 space-y-9 overflow-y-auto pr-1">
                    {overviewSections.map(section => (
                      <section key={section.id}>
                        <h2
                          className={`text-card-title font-strong ${OVERVIEW_TITLE_COLOR_CLASS_MAP[section.id]}`}
                        >
                          {section.title}
                        </h2>

                        {section.id === 'description' && CHALLENGE_HEADER_INFO?.subtitle ? (
                          <p className="mt-4 text-body-lg font-strong text-[#0F172A]">
                            {CHALLENGE_HEADER_INFO.subtitle}
                          </p>
                        ) : null}

                        <p
                          className="mt-4 whitespace-pre-wrap text-body-lg font-medium text-[#0F172A]"
                          style={{ lineHeight }}
                        >
                          {section.content}
                        </p>

                        {section.id === 'description' && problemApiUrl ? (
                          <div className="mt-5">
                            <ApiInfoPanel
                              isLoading={false}
                              apiUrl={problemApiUrl}
                              method={problemApiMethod}
                              headerName={problemApiHeaderName}
                              apiKey={problemApiKey}
                              problemCode={problemCode}
                            />
                          </div>
                        ) : null}
                      </section>
                    ))}
                  </div>
                ) : (
                  <div className="flex min-h-0 flex-1 flex-col">
                    <div className="no-scrollbar flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
                      {historyItems.length > 0 ? (
                        historyItems.map(item => (
                          <AttemptHistoryCard
                            key={item.id}
                            attemptNumber={item.attemptNumber}
                            isSubmitted={item.isSubmitted}
                            isSuccess={item.isSuccess}
                            promptSummary={item.promptSummary}
                            isActive={item.isActive}
                            attemptNumberVariant="text"
                            compactSurface
                            onClick={() => handleHistoryClick(item)}
                          />
                        ))
                      ) : (
                        <div className="flex flex-1 items-center justify-center text-center">
                          <p className="text-body-lg font-medium text-[#475569]">
                            아직 시도 기록이 없습니다.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {problemId ? (
          <div className="relative flex-shrink-0 px-4 pb-4">
            <TokenInfoCard problemId={problemId} teamId={teamId} tokenUsed={tokenUsed} compact />
          </div>
        ) : null}
      </div>
    </div>
  );
}
