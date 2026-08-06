// src/features/Challenge/components/ChallengeInfoPanel.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronLeft } from 'lucide-react';
import ApiInfoPanel from './ApiInfoPanel';
import AttemptHistoryCard from './AttemptHistoryCard';
import Skeleton from '../../../components/Skeleton/Skeleton';
import TokenInfoCard from './TokenInfoCard';
import { useSessionStore } from '@/stores/useSessionStore';

const OVERVIEW_DOT_COLOR_CLASS_MAP = {
  description: 'bg-[#475569]',
  goal: 'bg-[#E6AA02]',
  success: 'bg-[#079C4C]',
  failure: 'bg-[#FF4854]',
};

const HISTORY_STATUS_FILTERS = [
  { value: 'all', label: '전체' },
  { value: 'success', label: '성공' },
  { value: 'failed', label: '실패' },
  { value: 'unsubmitted', label: '미제출' },
];

const ChallengeInfoPanelSkeleton = ({ TABS, handleTabClick }) => (
  <div className="flex flex-col flex-shrink-0 w-[340px] h-full animate-pulse">
    <div className="glass-panel flex h-full flex-col overflow-hidden rounded-[30px]">
      <div className="flex flex-col p-4 h-[110px] border-b border-white/60 bg-white/45 rounded-t-[30px] flex-shrink-0">
        <Skeleton className="h-6 w-3/4 rounded mb-3" />
        <Skeleton className="h-4 w-full rounded mb-3" />
        <Skeleton className="h-4 w-full rounded mb-3" />
      </div>
      <div className="w-full flex-shrink-0 flex flex-col bg-white/30 flex-grow">
        <div className="mx-4 mt-1 grid flex-shrink-0 grid-cols-2 rounded-[18px] bg-[#F1F1F3] p-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={e => handleTabClick(e, tab.id)}
              className="h-10 w-full cursor-pointer rounded-[14px] bg-white px-2 text-body-lg font-medium text-gray-400 shadow-[0_2px_8px_rgba(15,23,42,0.10)] whitespace-nowrap"
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
  const panelRef = useRef(null);
  const filterDropdownRef = useRef(null);
  const [historyStatusFilter, setHistoryStatusFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { sessionId: currentSessionId, setSessionId, setSessionStatus } = useSessionStore();
  const lineHeight = 1.75;
  const selectedStatusFilter =
    HISTORY_STATUS_FILTERS.find(filter => filter.value === historyStatusFilter) ??
    HISTORY_STATUS_FILTERS[0];

  useEffect(() => {
    const handleClickOutside = event => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const historyItems = useMemo(
    () =>
      sessions.map((session, index) => {
        const rawStatus = session.status?.toLowerCase() || 'unsubmitted';
        const status =
          rawStatus === 'success'
            ? 'success'
            : rawStatus === 'fail' || rawStatus === 'failed'
              ? 'failed'
              : 'unsubmitted';
        const isSubmitted = status !== 'unsubmitted';

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
  const filteredHistoryItems = useMemo(
    () =>
      historyStatusFilter === 'all'
        ? historyItems
        : historyItems.filter(item => item.status === historyStatusFilter),
    [historyItems, historyStatusFilter]
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
            className="grid flex-shrink-0 grid-cols-2 rounded-[18px] bg-[#F1F1F3] p-1"
            role="tablist"
            aria-label="챌린지 정보"
          >
            {TABS.map(tab => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={e => handleTabClick(e, tab.id)}
                className={`h-10 w-full cursor-pointer rounded-[14px] px-3 text-body-lg font-medium whitespace-nowrap transition-[background-color,color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4854]/35 ${
                  activeTab === tab.id
                    ? 'bg-white text-[#202832] shadow-[0_2px_8px_rgba(15,23,42,0.10)]'
                    : 'text-[#747474] hover:text-[#30343B]'
                }`}
              >
                {tab.title}
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
                        <h2 className="flex items-center gap-3 text-card-title font-strong text-[#202832]">
                          <span
                            className={`h-2.5 w-2.5 shrink-0 rounded-full ${OVERVIEW_DOT_COLOR_CLASS_MAP[section.id] ?? 'bg-[#475569]'}`}
                            aria-hidden="true"
                          />
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
                    <div className="mb-3 flex flex-shrink-0 justify-end">
                      <div className="relative w-1/2" ref={filterDropdownRef}>
                        <button
                          type="button"
                          onClick={() => setIsFilterOpen(open => !open)}
                          aria-haspopup="listbox"
                          aria-expanded={isFilterOpen}
                          className="glass-subtle flex h-11 w-full cursor-pointer items-center justify-between rounded-[14px] px-3 text-body-lg font-strong text-[#475569] transition-colors hover:text-[#202832]"
                        >
                          <span>{selectedStatusFilter.label}</span>
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`}
                            strokeWidth={2.4}
                            aria-hidden="true"
                          />
                        </button>

                        {isFilterOpen ? (
                          <div
                            className="glass-overlay absolute right-0 top-[52px] z-20 w-full overflow-hidden rounded-[18px] p-1"
                            role="listbox"
                            aria-label="도전 기록 상태 필터"
                          >
                            {HISTORY_STATUS_FILTERS.map(filter => (
                              <button
                                key={filter.value}
                                type="button"
                                role="option"
                                aria-selected={historyStatusFilter === filter.value}
                                onClick={() => {
                                  setHistoryStatusFilter(filter.value);
                                  setIsFilterOpen(false);
                                }}
                                className={`flex h-11 w-full cursor-pointer items-center rounded-[14px] px-3 text-left text-body-lg font-strong text-[#475569] transition-colors hover:bg-[#F8FAFC] ${
                                  historyStatusFilter === filter.value ? 'bg-[#F1F5F9]' : ''
                                }`}
                              >
                                {filter.label}
                              </button>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="no-scrollbar flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
                      {filteredHistoryItems.length > 0 ? (
                        filteredHistoryItems.map(item => (
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
                            {historyItems.length > 0
                              ? '해당 상태의 도전 기록이 없습니다.'
                              : '아직 시도 기록이 없습니다.'}
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
