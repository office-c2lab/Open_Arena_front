// src/features/challenge/ChallengeModals/ResetModal.jsx

import React, { useCallback } from 'react';
// 💡 Zustand 스토어 임포트
import useModalStore from '@/stores/useModalStore';

// === 아이콘 import ===
import CancelSvg from '../../../assets/icons/cancel.svg';
import ArenaSvg from '../../../assets/icons/Arena.svg';
import DangerSvg from '../../../assets/icons/danger.svg';
// ===================

// 닫기 버튼 컴포넌트: onClick prop을 받음
const CancelIcon = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute top-[28px] right-[28px] w-[18px] h-[18px] cursor-pointer"
  >
    <img src={CancelSvg} alt="닫기" className="w-full h-full" />
  </div>
);

/**
 * 챌린지 리셋/초기화 경고 모달 컴포넌트
 */
const ResetModal = () => {
  // --------------------------------------------------------
  // 💡 1. Zustand 스토어에서 상태, 닫기 액션, 그리고 등록된 초기화 함수 가져오기
  // --------------------------------------------------------
  const isResetModalOpen = useModalStore(state => state.isResetModalOpen);
  // resetChatAction을 가져와 초기화 버튼 클릭 시 실행합니다.
  const { closeResetModal, resetChatAction } = useModalStore();

  // '대화 내용 초기화' 버튼 클릭 핸들러
  const handleReset = useCallback(() => {
    // 💡 Challenge.jsx에서 등록된 실제 초기화 로직 실행
    resetChatAction();

    // 초기화 버튼 클릭 후 모달 닫기
    closeResetModal();
  }, [closeResetModal, resetChatAction]); // 의존성 배열에 resetChatAction 추가

  // --------------------------------------------------------
  // 💡 2. 스토어 상태로 조건부 렌더링
  // --------------------------------------------------------
  if (!isResetModalOpen) return null;

  return (
    // Overlay: z-[1000]로 최상단에 위치
    <div className="fixed inset-0 bg-[rgba(1,1,1,0.6)] flex justify-center items-center z-[1000]">
      <div
        // Modal Container
        className="relative w-[403.65px] h-[586.46px] bg-white rounded-[16px] p-[30px] box-border"
      >
        {/* 닫기 버튼: closeResetModal 액션 연결 */}
        <CancelIcon onClick={closeResetModal} />

        {/* Group 448 (ARENA 로고/헤더 영역) */}
        <div className="absolute left-[30px] top-[17px] w-[105px] h-[42px] flex items-center">
          <div className="w-[29px] h-[42px] flex justify-center items-center">
            <img src={ArenaSvg} alt="ARENA 로고" className="w-full h-full" />
          </div>

          <span className="ml-[9px] font-['Noto Sans KR'] font-bold text-xl leading-[26px] text-[#FF084A]">
            ARENA
          </span>
        </div>

        {/* 메인 경고 아이콘 */}
        <div className="absolute top-[215px] left-1/2 -translate-x-1/2 w-[70px] h-[70px] flex justify-center items-center">
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

        {/* 대화 내용 초기화 버튼 */}
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
        </button>
      </div>
    </div>
  );
};

export default ResetModal;
