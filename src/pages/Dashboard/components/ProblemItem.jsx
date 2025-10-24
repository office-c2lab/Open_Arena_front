// src/components/ProblemList/ProblemItem.jsx (미제출 텍스트 중앙 정렬 수정)

import React from 'react';
// Lock.svg 파일을 import합니다. (경로는 프로젝트 구조에 맞게 조정하세요)
import LockIconSvg from '@/assets/icons/Lock.svg';

// === UI 상수 정의 ===
const BaseTextStyle = 'body-medium font-500 truncate';
const ItemWidth = '238px';
const ItemHeight = '52px';
const StatusBoxWidth = '88px';

// === 상태별 색상 정의 (컴포넌트 내에 하드코딩) ===
const STATUS_COLORS = {
  // SUCCESS 상태
  SUCCESS_DEFAULT: '#2ECC71',
  SUCCESS_SOLVED: '#00B654', // UNSUBMITTED 상태 (새로운 디자인 색상 적용)
  UNSUBMITTED_BORDER: '#FFBA57',
  UNSUBMITTED_TEXT: '#FFBA57', // LOCKED 상태 (이전 상태 유지)
  LOCKED_BACKGROUND: 'rgba(53, 53, 53, 0.4)',
  LOCKED_BORDER: '#353535',
};

const ProblemItem = ({ problem }) => {
  const { id, title, status, result } = problem; // ----------------------------------------------------
  // 1. SUCCESS (성공/SOLVED!) 상태 (변경 없음)
  // ----------------------------------------------------

  if (status === 'SUCCESS') {
    // SOLVED! (9번 문제)는 특별한 색상을 가지므로 result로 구분
    const successColor =
      result === 'SOLVED!' ? STATUS_COLORS.SUCCESS_SOLVED : STATUS_COLORS.SUCCESS_DEFAULT; // Frame 2087327822의 Auto Layout 속성을 기반으로 구조화

    return (
      <div // Frame 2087327822: flex-row, justify-between, items-center
        className={`relative flex items-center justify-between p-[16px_12px] rounded-[20px] overflow-hidden cursor-pointer`}
        style={{
          width: ItemWidth,
          height: ItemHeight,
          backgroundColor: successColor, // Rectangle 23952 배경
        }}
      >
        {/* 배경과 흰색 상태 박스 Group 446 */} {/* 흰색 상태 박스 Rectangle 23953 */}
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
        {/* 문제 제목 (Inside auto layout: flex-grow: 0, order: 1) */}
        <span className={`${BaseTextStyle} text-white z-20`} style={{ flexGrow: 0, width: 'auto' }}>
          #{id} {title}
        </span>
        {/* 성공 텍스트 (Inside auto layout: flex-grow: 0, order: 2) */}
        <span
          className={`heading-3 font-700 z-20`}
          style={{ color: successColor, flexGrow: 0, marginRight: '16px' }} // padding 16px 12px에 gap 19px을 고려하여 최종 텍스트 위치 조정
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
      <div // 💡 justify-start, gap-[19px] 제거하고 justify-center로 변경합니다.
        className={`flex items-center justify-center rounded-[20px] cursor-pointer`}
        style={{
          width: ItemWidth,
          height: ItemHeight,
          backgroundColor: '#FFFFFF',
          border: `1px solid ${unsubmittedBorder}`, // Figma CSS의 padding 16px 12px 대신 중앙 정렬을 위해 padding을 제거하거나 조정합니다.
          padding: '0 12px',
        }}
      >
        {/* 문제 제목 (텍스트 색상 변경 및 중앙 정렬) */}
        <span
          // 💡 w-full 및 text-center를 추가하여 전체 너비 사용 및 텍스트 중앙 정렬
          className={`${BaseTextStyle} w-full text-center`}
          style={{ color: unsubmittedText }}
        >
          #{id} {title}
        </span>
      </div>
    );
  } else if (status === 'LOCKED') {
    // ----------------------------------------------------
    // 3. LOCKED (잠금) 상태 (이전 디자인 유지)
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
