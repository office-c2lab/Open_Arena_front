import React, { useState, useRef, useEffect, useCallback } from 'react';
import AttemptHistoryCard, { AttemptHistoryCardSkeleton } from './AttemptHistoryCard';
import PointInfoCard from './PointInfoCard';
import useModalStore from '@/stores/useModalStore';
import { useSessionStore } from '@/stores/useSessionStore';
import HelpIcon from '@/assets/icons/helpModal.svg';

const SKELETON_CARD_COUNT = 4;

const FILTER_OPTIONS = [
  { key: 'ALL', label: '전체' },
  { key: 'SUCCESS', label: '성공' },
  { key: 'FAILED', label: '실패' },
  { key: 'NOT_SUBMITTED', label: '미제출' },
];

const DUMMY_BALANCE = { currentToken: 70, maxToken: 100, currentPoint: 150 };

export default function AttemptHistoryPanel({ PurpleDownIcon, isLoading, sessions = [], problemId, teamId }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(FILTER_OPTIONS[0]);
  const dropdownRef = useRef(null);

  const { openDebugModal } = useModalStore();
  const { sessionId: currentActiveSessionId, setSessionId } = useSessionStore();

  const handleHelpClick = () => openDebugModal();

  const totalAttempts = sessions.length;

  const filteredAttempts = sessions
    .map((session, index) => ({
      id: session.id,
      title: session.title,
      attemptNumber: totalAttempts - index,
      isSubmitted: false,
      isSuccess: false,
      promptSummary: session.title || '새로운 세션',
      isActive: session.id === currentActiveSessionId,
      filterKey: 'NOT_SUBMITTED',
    }))
    .filter((attempt) => {
      if (selectedFilter.key === 'ALL') return true;
      return attempt.filterKey === selectedFilter.key;
    });

  const toggleDropdown = useCallback(() => setIsDropdownOpen((prev) => !prev), []);
  const handleFilterSelect = useCallback((filter) => {
    setSelectedFilter(filter);
    setIsDropdownOpen(false);
  }, []);

  const handleCardClick = useCallback((clickedSessionId) => {
    if (!problemId || !teamId) return;
    if (clickedSessionId !== currentActiveSessionId) {
      setSessionId(clickedSessionId);
      console.log(`✅ 세션 ID 전환: ${currentActiveSessionId} -> ${clickedSessionId}`);
    }
  }, [currentActiveSessionId, setSessionId, problemId, teamId]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col flex-shrink-0 w-[240px] lg:w-[295px] h-full">
      <div className="flex-shrink-0 w-full mb-4">
        <PointInfoCard currentBalance={DUMMY_BALANCE.currentPoint} isLoading={isLoading} />
      </div>

      <div className="flex flex-col shadow-xl rounded-[20px] overflow-hidden flex-1 bg-[rgba(235,232,254,0.1)] h-full">
        {/* 헤더 */}
        <div className="w-full h-[70px] p-3 md:p-4 shadow-sm bg-white rounded-t-[20px] flex items-center justify-between">
          <span className="heading-2 font-500 text-[#837BBD]">최근 시도 ({sessions.length})</span>
          {/* <button
            onClick={handleHelpClick}
            className="h-10 px-2 bg-[#837BBD] rounded-[5px] flex items-center justify-center gap-1 shadow-md hover:bg-[#837BBD]/90"
          >
            <img src={HelpIcon} alt="Help" className="w-4 h-4" />
            <span className="text-white body-medium font-500">관리자 호출</span>
          </button> */}
        </div>

        {/* 필터 */}
        <div className="p-3 md:p-4 flex justify-end relative" ref={dropdownRef}>
          <div
            className="flex items-center justify-between w-[126px] h-[39px] px-4 py-[10px] bg-white shadow rounded-[10px] cursor-pointer"
            onClick={toggleDropdown}
          >
            <span className="body-large font-700 text-[#837BBD]">{selectedFilter.label}</span>
            <img src={PurpleDownIcon} alt="Dropdown" className={`w-3 h-2 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </div>

          {isDropdownOpen && (
            <div className="absolute top-[60px] right-[16px] w-[126px] bg-white shadow-lg rounded-[10px] border border-[#EBE8FE] z-10">
              {FILTER_OPTIONS.map((option) => (
                <div
                  key={option.key}
                  className={`px-4 py-[10px] body-large font-700 text-[#837BBD] cursor-pointer hover:bg-[#F5F4FF] ${
                    option.key === selectedFilter.key ? 'bg-[#EBE8FE] font-bold' : ''
                  }`}
                  onClick={() => handleFilterSelect(option)}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 카드 목록 */}
        <div className="flex flex-1 flex-col items-center overflow-y-auto px-4 py-1 gap-4">
          {isLoading
            ? [...Array(SKELETON_CARD_COUNT)].map((_, i) => <AttemptHistoryCardSkeleton key={i} />)
            : filteredAttempts.length > 0
            ? filteredAttempts.map((attempt) => (
                <AttemptHistoryCard
                  key={attempt.id}
                  attemptNumber={attempt.attemptNumber}
                  isSubmitted={attempt.isSubmitted}
                  isSuccess={attempt.isSuccess}
                  promptSummary={attempt.promptSummary}
                  isActive={attempt.isActive}
                  onClick={() => handleCardClick(attempt.id)}
                />
              ))
            : (
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
