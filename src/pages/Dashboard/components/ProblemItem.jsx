// src/components/ProblemList/ProblemItem.jsx

import React from 'react';
import LockIconSvg from '@/assets/icons/Lock.svg';
import Skeleton from '@/components/Skeleton/Skeleton'; // 💡 Skeleton 컴포넌트 import

// === UI 상수 정의 ===
const BaseTextStyle = 'body-medium font-500 truncate';
const ItemWidth = '238px';
const ItemHeight = '52px';
const StatusBoxWidth = '88px';

// === 상태별 색상 정의 ===
const STATUS_COLORS = {
  // SUCCESS 상태
  SUCCESS_DEFAULT: '#2ECC71',
  SUCCESS_SOLVED: '#00B654', // UNSUBMITTED 상태
  UNSUBMITTED_BORDER: '#FFBA57',
  UNSUBMITTED_TEXT: '#FFBA57', // LOCKED 상태
  LOCKED_BACKGROUND: 'rgba(53, 53, 53, 0.4)',
  LOCKED_BORDER: '#353535',
};

// 💡 ProblemItemSkeleton 컴포넌트 (높이 조정 완료)
const ProblemItemSkeleton = () => {
    return (
        <div 
          className="rounded-[20px] p-[16px_12px] flex items-center justify-between"
          style={{
              width: ItemWidth,
              height: ItemHeight,
              backgroundColor: '#FFFFFF', 
              border: '1px solid #DEDEDE', 
          }}
        >
            {/* 제목 스켈레톤: body-medium (line-height 16px)에 맞춰 h-4 (16px) 사용 */}
            <Skeleton className="w-full h-full" /> 
            
            
        </div>
    );
};


const ProblemItem = ({ problem, isLoading = false }) => {
    // 💡 로딩 중일 때 스켈레톤 렌더링
    if (isLoading) {
        return <ProblemItemSkeleton />;
    }

    // 로딩 완료 후 실제 콘텐츠 렌더링
    const { id, title, status, result } = problem; 
    
    // ----------------------------------------------------
    // 1. SUCCESS (성공/SOLVED!) 상태
    // ----------------------------------------------------
    if (status === 'SUCCESS') {
      const successColor =
        result === 'SOLVED!' ? STATUS_COLORS.SUCCESS_SOLVED : STATUS_COLORS.SUCCESS_DEFAULT;

      return (
        <div 
          className={`relative flex items-center justify-between p-[16px_12px] rounded-[20px] overflow-hidden cursor-pointer`}
          style={{
            width: ItemWidth,
            height: ItemHeight,
            backgroundColor: successColor, 
          }}
        >
          {/* 흰색 상태 박스 Rectangle 23953 */}
          <div
            className="absolute h-full bg-white z-10"
            style={{
              width: StatusBoxWidth,
              right: '0',
              top: '0',
              borderRadius: '0px 20px 20px 0px',
              borderStyle: 'solid',
              borderColor: successColor,
              borderWidth: '1px 1px 1px 0px',
            }}
          />
          {/* 문제 제목 */}
          <span className={`${BaseTextStyle} text-white z-20`} style={{ flexGrow: 0, width: 'auto' }}>
            #{id} {title}
          </span>
          {/* 성공 텍스트 */}
          <span
            className={`heading-3 font-700 z-20`}
            style={{ color: successColor, flexGrow: 0, marginRight: '16px' }}
          >
            {result}
          </span>
        </div>
      );
    } else if (status === 'UNSUBMITTED') {
      // ----------------------------------------------------
      // 2. UNSUBMITTED (미제출) 상태 - Group 447
      // ----------------------------------------------------
      const unsubmittedBorder = STATUS_COLORS.UNSUBMITTED_BORDER;
      const unsubmittedText = STATUS_COLORS.UNSUBMITTED_TEXT;

      return (
        <div 
          className={`flex items-center justify-center rounded-[20px] cursor-pointer`}
          style={{
            width: ItemWidth,
            height: ItemHeight,
            backgroundColor: '#FFFFFF',
            border: `1px solid ${unsubmittedBorder}`,
            padding: '0 12px',
          }}
        >
          {/* 문제 제목 (텍스트 색상 변경 및 중앙 정렬) */}
          <span
            className={`${BaseTextStyle} w-full text-center`}
            style={{ color: unsubmittedText }}
          >
            #{id} {title}
          </span>
        </div>
      );
    } else if (status === 'LOCKED') {
      // ----------------------------------------------------
      // 3. LOCKED (잠금) 상태
      // ----------------------------------------------------
      const lockedBackground = STATUS_COLORS.LOCKED_BACKGROUND;
      const lockedBorder = STATUS_COLORS.LOCKED_BORDER;

      return (
        <div
          className={`relative flex items-center h-[${ItemHeight}] rounded-[20px] border border-solid cursor-not-allowed`}
          style={{
            width: ItemWidth,
            backgroundColor: lockedBackground,
            borderColor: lockedBorder,
            padding: '18px',
            gap: '16px',
          }}
        >
          <span className={`${BaseTextStyle} text-white/80 flex-1`}>
            #{id} {title}
          </span>
          {/* Lock.svg 사용 */}
          <img
            src={LockIconSvg}
            alt="Lock Icon"
            className="absolute right-[12px] top-1/2 -translate-y-1/2 z-10 w-[24px] h-[24px]"
          />
        </div>
      );
    } // 기본 (상태 오류)

    return (
      <div
        className={`flex items-center h-[${ItemHeight}] rounded-[20px] bg-red-500 p-4`}
        style={{ width: ItemWidth }}
      >
        <span className={`${BaseTextStyle} text-white`}>
          #{id} {title} (상태 오류)
        </span>
      </div>
    );
};

export default ProblemItem;