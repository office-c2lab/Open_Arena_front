// src/features/challenge/ChallengeModals/ResetModal.jsx
import React, { useCallback } from 'react';

// === 아이콘 import (SVG를 URL/경로로 임포트) ===
import CancelSvg from '../../../assets/icons/cancel.svg';
import ArenaSvg from '../../../assets/icons/Arena.svg'; // 로고 아이콘 추가
import DangerSvg from '../../../assets/icons/danger.svg'; // 경고 아이콘 추가
// ===========================================

// 닫기 버튼 컴포넌트: <img> 태그 사용 (42px * 42px)
const CancelIcon = ({ onClick }) => (
  <div
    onClick={onClick}
    // 명세: width: 42px, height: 42px, left: 345px, top: 17px. (403.65px 너비 기준)
    className="absolute top-[28px] right-[28px] w-[18px] h-[18px] cursor-pointer"
  >
    <img src={CancelSvg} alt="닫기" className="w-full h-full" />
  </div>
);

/**
 * 챌린지 리셋/초기화 경고 모달 컴포넌트
 */
const ResetModal = ({ isOpen, onClose }) => {
  // '대화 내용 초기화' 버튼 클릭 핸들러
  const handleReset = useCallback(() => {
    if (window.confirm('정말로 모든 내용을 초기화하시겠습니까? 되돌릴 수 없습니다.')) {
      // 실제 초기화 로직 (API 호출 등)
      alert('대화 내용이 초기화되었습니다.');
      onClose();
    }
  }, [onClose]);

  if (!isOpen) return null;

  return (
    // Overlay: fixed, full size, bg-[#010101] 투명도 60%, flex center
    <div className="fixed inset-0 bg-[rgba(1,1,1,0.6)] flex justify-center items-center z-[1000]">
      <div
        // Modal Container ('Help'): 403.65px x 586.46px, bg-white, rounded-xl(16px)
        className="relative w-[403.65px] h-[586.46px] bg-white rounded-[16px] p-[30px] box-border"
      >
        {/* 닫기 버튼 */}
        <CancelIcon onClick={onClose} />

        {/* Group 448 (ARENA 로고/헤더 영역) */}
        <div className="absolute left-[30px] top-[17px] w-[105px] h-[42px] flex items-center">
          {/* Vector 18 (빨간색 바) -> Arena 로고로 대체 또는 옆에 배치 */}
          {/* Arena.svg를 Vector 18 (29x42px) 영역에 배치 */}
          <div className="w-[29px] h-[42px] flex justify-center items-center">
            <img src={ArenaSvg} alt="ARENA 로고" className="w-full h-full" />
          </div>

          {/* ARENA 텍스트 */}
          <span className="ml-[9px] font-['Noto Sans KR'] font-bold text-xl leading-[26px] text-[#FF084A]">
            ARENA
          </span>
        </div>

        {/* 메인 경고 아이콘 (danger.svg 적용) */}
        <div
          // 중앙 배치 및 크기 조정 (아이콘 자체 크기 명세가 없어 70px로 유지)
          className="absolute top-[215px] left-1/2 -translate-x-1/2 w-[70px] h-[70px] flex justify-center items-center"
        >
          <img src={DangerSvg} alt="위험 경고" className="w-full h-full" />
        </div>

        {/* 경고 메시지 */}
        <p
          className="absolute w-[301.76px] left-1/2 -translate-x-1/2 top-[334.91px] 
                               text-center font-['Noto Sans KR'] font-medium text-[17.55px] leading-[21px] 
                               text-black m-0"
        >
          현재 입력한 내용과 진행 중인 모든 작업이 즉시 삭제되며, 되돌릴 수 없습니다.
        </p>

        {/* 대화 내용 초기화 버튼 (Frame 2087327751) */}
        <button
          type="button"
          onClick={handleReset}
          className="absolute w-[343.2px] h-[60.45px] left-[30.22px] top-[496.28px]
                               flex justify-center items-center gap-[4.88px] 
                               bg-[#FF4854] rounded-[29.25px] cursor-pointer 
                               hover:bg-red-600 transition duration-200"
        >
          <span className="font-['Noto Sans KR'] font-normal text-[17.55px] leading-[21px] text-white">
            대화 내용 초기화
          </span>
          {/* 필요하다면 버튼 내부 아이콘도 여기에 추가할 수 있습니다. */}
        </button>
      </div>
    </div>
  );
};

export default ResetModal;
