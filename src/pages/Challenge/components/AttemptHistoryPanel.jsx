// src/features/Challenge/components/AttemptHistoryPanel.jsx

import React, { useState, useRef, useEffect, useCallback } from 'react';
import AttemptHistoryCard, { AttemptHistoryCardSkeleton } from './AttemptHistoryCard';
import PointInfoCard from './PointInfoCard';
import useModalStore from '@/stores/useModalStore';
import useChatSessionStore from '@/stores/useChatSessionStore'; 
import HelpIcon from '@/assets/icons/helpModal.svg';
import Skeleton from '../../../components/Skeleton/Skeleton';

const SKELETON_CARD_COUNT = 4; // 로딩 시 표시할 스켈레톤 카드 개수

const FILTER_OPTIONS = [
    { key: 'ALL', label: '전체' },
    { key: 'SUCCESS', label: '성공' },
    { key: 'FAILED', label: '실패' },
    { key: 'NOT_SUBMITTED', label: '미제출' },
];

const DUMMY_BALANCE = {
    currentToken: 70,
    maxToken: 100,
    currentPoint: 150,
};

// 💡 sessions, problemId, teamId prop 추가
export default function AttemptHistoryPanel({ PurpleDownIcon, isLoading, sessions = [], problemId, teamId }) { 
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState(FILTER_OPTIONS[0]);
    const dropdownRef = useRef(null);
    
    const { openDebugModal } = useModalStore();
    const { setSessionId, sessionId: currentActiveSessionId } = useChatSessionStore(); 
    
    const handleHelpClick = () => {
        openDebugModal();
    };

    // 💡 sessions prop을 사용하여 카드 데이터 매핑
    const totalAttempts = sessions.length; // 총 시도 횟수를 미리 계산

    const filteredAttempts = sessions
        // 세션 목록을 최신순으로 정렬 (id가 높은 것이 최신이라고 가정)
        .map((session, index) => ({
            id: session.id,
            title: session.title,
            // ✅ 수정: 최신이 N번, 오래됨이 1번이 되도록 번호를 매깁니다.
            // sessions가 이미 [최신, ..., 오래됨] 순서라고 가정합니다.
            attemptNumber: totalAttempts - index, 
            // 🚨 백엔드 데이터에 isSubmitted/isSuccess 정보가 없으므로 임시 값 사용
            isSubmitted: false, 
            isSuccess: false, 
            promptSummary: session.title || '새로운 세션',
            isActive: session.id === currentActiveSessionId,
            filterKey: 'NOT_SUBMITTED', // 임시 필터 키
        }))
        // 🚨 필터링 로직 (현재 sessions 데이터로는 ALL만 의미 있음)
        .filter(attempt => {
            if (selectedFilter.key === 'ALL') return true;
            // 실제 필터링 로직은 백엔드 데이터가 확정되면 구현 필요
            return attempt.filterKey === selectedFilter.key;
        }); // 💡 .reverse()를 제거합니다. 목록은 이미 최신 순서입니다.


    const toggleDropdown = useCallback(() => {
        setIsDropdownOpen(prev => !prev);
    }, []);

    const handleFilterSelect = useCallback(filter => {
        setSelectedFilter(filter);
        setIsDropdownOpen(false);
        console.log(`필터 선택됨: ${filter.label}`);
    }, []);

    // 💡 카드 클릭 시 세션 ID를 변경하고, 변경된 세션 ID와 함께 로컬 스토리지에 저장합니다.
    const handleCardClick = useCallback((sessionIdToActivate) => {
        if (!problemId || !teamId) {
            console.error("Problem ID or Team ID is missing for session activation.");
            return;
        }

        if (sessionIdToActivate !== currentActiveSessionId) {
            // setSessionId(PROBLEM_KEY, sessionId, teamId) 호출
            setSessionId(`problem-${problemId}`, sessionIdToActivate, teamId);
            console.log(`✅ 세션 ID 전환: ${currentActiveSessionId} -> ${sessionIdToActivate} (Problem: ${problemId}, Team: ${teamId})`);
        } else {
            console.log(`❕ 세션 ID: ${sessionIdToActivate} (이미 활성화됨)`);
        }
    }, [currentActiveSessionId, setSessionId, problemId, teamId]); 

    useEffect(() => {
        const handleClickOutside = event => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="flex flex-col flex-shrink-0 w-[240px] lg:w-[295px] h-full">
            {/* 1. 토큰/포인트 정보 카드 렌더링 (고정 높이) */}
            <div className="flex-shrink-0 w-full mb-4">
                <PointInfoCard 
                    currentBalance={DUMMY_BALANCE.currentPoint}
                    isLoading={isLoading}
                />
            </div>
            {/* 2. 최근 시도 패널 (남은 공간 모두 차지) */}
            <div className="flex flex-col shadow-xl rounded-[20px] overflow-hidden flex-1 bg-[rgba(235,232,254,0.1)] h-full">
                {/* Header - flex-shrink-0 */}
                <div className="w-full h-[70px] p-3 md:p-4 shadow-sm bg-white rounded-t-[20px] flex items-center justify-between flex-shrink-0">
                    <span className="heading-2 font-500 text-[#837BBD]">최근 시도 ({sessions.length})</span>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleHelpClick}
                            className="h-10 px-2 bg-[#837BBD] rounded-[5px] flex items-center justify-center gap-1 shadow-md transition-colors hover:bg-[#837BBD]/90 cursor-pointer"
                            aria-label="도움말 열기"
                        >
                            <img src={HelpIcon} alt="Help Icon" className="w-4 h-4" />
                            <span className="text-white body-medium font-500">관리자 호출</span>
                        </button>
                    </div>
                </div>
                {/* Dropdown - flex-shrink-0 */}
                <div
                    className="p-3 md:p-4 flex justify-end flex-shrink-0 bg-[rgba(235,232,254,0.1)] relative"
                    ref={dropdownRef}
                >
                    <div
                        className="flex items-center justify-between w-[126px] h-[39px] px-4 py-[10px] bg-white shadow-[0px_0px_2px_rgba(0,0,0,0.25)] rounded-[10px] cursor-pointer flex-shrink-0"
                        onClick={toggleDropdown}
                    >
                        <span className="body-large font-700 text-[#837BBD]">{selectedFilter.label}</span>
                        <img
                            src={PurpleDownIcon}
                            alt="Dropdown"
                            className={`w-3 h-2 transition-transform duration-200 ${
                                isDropdownOpen ? 'transform rotate-180' : ''
                            }`}
                        />
                    </div>

                    {isDropdownOpen && (
                        <div className="absolute top-[60px] right-[16px] w-[126px] bg-white shadow-lg rounded-[10px] border border-[#EBE8FE] z-10">
                            {FILTER_OPTIONS.map(option => (
                                <div
                                    key={option.key}
                                    className={`px-4 py-[10px] body-large font-700 text-[#837BBD] cursor-pointer 
                                        hover:bg-[#F5F4FF] transition-colors duration-100 ${
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
                {/* Attempts list - flex-1 & overflow-y-auto */}
                <div className="flex flex-1 flex-col items-center overflow-y-auto px-4 py-1 gap-4">
                    {isLoading ? (
                        [...Array(SKELETON_CARD_COUNT)].map((_, index) => (
                            <AttemptHistoryCardSkeleton key={index} />
                        ))
                    ) : filteredAttempts.length > 0 ? (
                        filteredAttempts.map(attempt => (
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