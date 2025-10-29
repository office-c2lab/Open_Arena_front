// src/features/Challenge/components/AttemptHistoryPanel.jsx (최종 수정 전체 코드)

import React, { useState, useRef, useEffect, useCallback } from 'react';
import AttemptHistoryCard, { AttemptHistoryCardSkeleton } from './AttemptHistoryCard'; // 💡 스켈레톤 import
import PointInfoCard from './PointInfoCard';
import useModalStore from '@/stores/useModalStore';
import HelpIcon from '@/assets/icons/helpModal.svg';
import { DUMMY_ATTEMPTS } from '@/pages/Challenge/data/dummyAttempts';
import Skeleton from '../../../components/Skeleton/Skeleton'; // 💡 Skeleton import 가정

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

export default function AttemptHistoryPanel({ PurpleDownIcon, isLoading }) { // 💡 isLoading prop 추가
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState(FILTER_OPTIONS[0]);
    const dropdownRef = useRef(null);

    const { openDebugModal } = useModalStore();
    const handleHelpClick = () => {
        openDebugModal();
    };

    const filteredAttempts = DUMMY_ATTEMPTS.filter(attempt => {
        if (selectedFilter.key === 'ALL') return true;
        return attempt.filterKey === selectedFilter.key;
    });

    const toggleDropdown = useCallback(() => {
        setIsDropdownOpen(prev => !prev);
    }, []);

    const handleFilterSelect = useCallback(filter => {
        setSelectedFilter(filter);
        setIsDropdownOpen(false);
        console.log(`필터 선택됨: ${filter.label}`);
    }, []);

    const handleCardClick = useCallback(attempt => {
        console.log(`${attempt.attemptNumber}번째 시도 기록 보기`);
    }, []);

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
                    isLoading={isLoading} // ✅ 스켈레톤 유지 (데이터 영역)
                />
            </div>
            {/* 2. 최근 시도 패널 (남은 공간 모두 차지) */}
            <div className="flex flex-col shadow-xl rounded-[20px] overflow-hidden flex-1 bg-[rgba(235,232,254,0.1)] h-full">
                {/* Header - flex-shrink-0 */}
                <div className="w-full h-[70px] p-3 md:p-4 shadow-sm bg-white rounded-t-[20px] flex items-center justify-between flex-shrink-0">
                    {/* ❌ "최근 시도" 제목 스켈레톤 제거 */}
                    <span className="heading-2 font-500 text-[#837BBD]">최근 시도</span>
                    
                    {/* ❌ "관리자 호출" 버튼 스켈레톤 제거 */}
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
                    {/* ❌ 드롭다운 스켈레톤 제거 -> 항상 원본 드롭다운 렌더링 */}
                    <div
                        className="flex items-center justify-between w-[126px] h-[39px] px-4 py-[10px] bg-white shadow-[0px_0px_2px_rgba(0,0,0,0.25)] rounded-[10px] cursor-pointer flex-shrink-0"
                        onClick={toggleDropdown}
                        // 💡 로딩 중에는 클릭을 막을 수 있음 (선택 사항)
                        // disabled={isLoading} 
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
                        // ✅ 시도 기록 목록은 API 데이터 로딩의 핵심 영역이므로 스켈레톤 유지
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
                                onClick={() => handleCardClick(attempt)}
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