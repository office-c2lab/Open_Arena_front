// src/features/Challenge/components/AttemptHistoryPanel.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';
import AttemptHistoryCard, { AttemptHistoryCardSkeleton } from './AttemptHistoryCard';
import PointInfoCard from './PointInfoCard';
import useModalStore from '@/stores/useModalStore';
import { useSessionStore } from '@/stores/useSessionStore';
import TokenInfoCard from './TokenInfoCard';

const SKELETON_CARD_COUNT = 4;

const FILTER_OPTIONS = [
  { key: 'ALL', label: '전체' },
  { key: 'SUCCESS', label: '성공' },
  { key: 'FAILED', label: '실패' },
  { key: 'NOT_SUBMITTED', label: '미제출' },
];

export default function AttemptHistoryPanel({
  isLoading,
  sessions = [],
  problemId,
  teamId,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(FILTER_OPTIONS[0]);
  const dropdownRef = useRef(null);

  const { openDebugModal } = useModalStore();
  const { sessionId: currentActiveSessionId, setSessionId, setSessionStatus } = useSessionStore();

  const totalAttempts = sessions.length;

  const filteredAttempts = sessions
    .map((session, index) => {
      const status = session.status?.toLowerCase() || 'unsubmitted';
      let filterKey, isSubmitted, isSuccess, promptSummary;

      switch (status) {
        case 'success':
          filterKey = 'SUCCESS';
          isSubmitted = true;
          isSuccess = true;
          promptSummary = session.title || '성공한 시도';
          break;
        case 'fail':
        case 'failed':
          filterKey = 'FAILED';
          isSubmitted = true;
          isSuccess = false;
          promptSummary =
            session.judge_reason?.split('\n')[0]?.slice(0, 50) || session.title || '실패한 시도';
          break;
        default:
          filterKey = 'NOT_SUBMITTED';
          isSubmitted = false;
          isSuccess = false;
          promptSummary =
            session.judge_reason?.split('\n')[0]?.slice(0, 50) || session.title || '새로운 대화';
      }

      return {
        id: session.id,
        status,
        title: session.title,
        attemptNumber: totalAttempts - index,
        isSubmitted,
        isSuccess,
        promptSummary,
        isActive: session.id === currentActiveSessionId,
        filterKey,
      };
    })
    .filter(attempt => {
      if (selectedFilter.key === 'ALL') return true;
      return attempt.filterKey === selectedFilter.key;
    });

  const toggleDropdown = useCallback(() => setIsDropdownOpen(prev => !prev), []);
  const handleFilterSelect = useCallback(filter => {
    setSelectedFilter(filter);
    setIsDropdownOpen(false);
  }, []);

  const handleCardClick = useCallback(
    (clickedSessionId, clickedStatus) => {
      if (!problemId) return;

      if (clickedSessionId !== currentActiveSessionId) {
        setSessionId(clickedSessionId);
        setSessionStatus(clickedStatus === 'failed' ? 'fail' : clickedStatus);
      }
    },
    [currentActiveSessionId, setSessionId, setSessionStatus, problemId]
  );

  useEffect(() => {
    const handleClickOutside = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex h-full w-[295px] flex-col flex-shrink-0">
      {/* 포인트 카드 */}
      <div className="flex-shrink-0 w-full mb-3">
        <PointInfoCard isLoading={isLoading} />
      </div>

      {/* ⭐ 토큰 카드 */}
      <div className="flex-shrink-0 w-full mb-3">
        <TokenInfoCard problemId={problemId} teamId={teamId} />
      </div>

      {/* 시도 기록 */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[24px] border border-white/65 bg-white/42 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_4px_14px_rgba(15,23,42,0.06)] backdrop-blur-md">
        <div className="w-full h-[70px] p-3 md:p-4 flex items-center justify-between border-b border-white/50 bg-white/35">
          <span className="heading-2 font-500 text-[#475569]">최근 시도 ({sessions.length})</span>
        </div>

        <div className="p-3 md:p-4 flex justify-end relative" ref={dropdownRef}>
          <div
            className="flex items-center justify-between w-[126px] h-[39px] px-4 py-[10px] rounded-[12px] border border-white/65 bg-white/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_4px_12px_rgba(15,23,42,0.06)] backdrop-blur-md cursor-pointer"
            onClick={toggleDropdown}
          >
            <span className="body-large font-700 text-[#475569]">{selectedFilter.label}</span>
            <ChevronDown
              className={`h-4 w-4 text-[#475569] transition-transform ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
              strokeWidth={2.4}
            />
          </div>

          {isDropdownOpen && (
            <div className="absolute top-[60px] right-[16px] z-10 w-[132px] overflow-hidden rounded-[14px] border border-white/65 bg-white/92 p-1.5 shadow-[0_8px_22px_rgba(15,23,42,0.12)] backdrop-blur-md">
              {FILTER_OPTIONS.map(option => (
                <button
                  type="button"
                  key={option.key}
                  className={`flex w-full cursor-pointer items-center justify-between rounded-[10px] px-3.5 py-2.5 text-left body-large font-700 text-[#475569] transition-colors hover:bg-[#F8FAFC] ${
                    option.key === selectedFilter.key ? 'bg-[#F1F5F9]' : ''
                  }`}
                  onClick={() => handleFilterSelect(option)}
                >
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col items-center overflow-y-auto px-4 py-2 gap-5">
          {isLoading ? (
            [...Array(SKELETON_CARD_COUNT)].map((_, i) => <AttemptHistoryCardSkeleton key={i} />)
          ) : filteredAttempts.length > 0 ? (
            filteredAttempts.map(attempt => (
              <AttemptHistoryCard
                key={attempt.id}
                attemptNumber={attempt.attemptNumber}
                isSubmitted={attempt.isSubmitted}
                isSuccess={attempt.isSuccess}
                promptSummary={attempt.promptSummary}
                isActive={attempt.isActive}
                attemptNumberVariant="text"
                onClick={() => handleCardClick(attempt.id, attempt.status)}
              />
            ))
          ) : (
            <div className="flex flex-1 justify-center items-center text-center">
              <p className="body-large font-500 text-[#000000]">
                {selectedFilter.key === 'ALL'
                  ? '아직 시도 기록이 없습니다.'
                  : `${selectedFilter.label} 기록이 없습니다.`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
