// src/features/challenge/ChallengeModals/SubmitModal.jsx

import React, { useCallback } from 'react';
// 💡 Zustand 스토어 임포트
import useModalStore from '@/stores/useModalStore';

// === 아이콘 import ===
import CancelSvg from '../../../assets/icons/cancel.svg';
import ArenaSvg from '../../../assets/icons/Arena.svg'; // 💡 메인 아이콘으로 사용
// ===================

// 닫기 버튼 컴포넌트: onClick prop을 받음 (피그마 명세: 42px)
const CancelIcon = (
  { onClick } // 피그마 명세: left: 345px, top: 17px, width/height: 42px
) => (
  <div
    onClick={onClick}
    className="absolute top-[30px] right-[30px] w-[18px] h-[18px] cursor-pointer"
  >
    <img src={CancelSvg} alt="닫기" className="w-full h-full" />
  </div>
);

/**
 * 챌린지 제출 확인 모달 컴포넌트
 */
const SubmitModal = () => {
  // --------------------------------------------------------
  // 💡 1. Zustand 스토어에서 상태, 닫기 액션, 로딩 모달 액션 가져오기
  // --------------------------------------------------------
  const isSubmitModalOpen = useModalStore(state => state.isSubmitModalOpen); // 💡 submitAction 대신, 로딩 모달 액션을 가져와 바로 호출합니다.
  const { closeSubmitModal, openLoadingModal, submitAction } = useModalStore(); // '제출하기' 버튼 클릭 핸들러

  const handleSubmit = useCallback(() => {
    // 1. 제출 모달 닫기
    closeSubmitModal();

    // 2. 로딩 모달 열기
    openLoadingModal();

    // 3. Challenge.jsx에 등록된 실제 비동기 제출 로직 실행
    // 💡 이 함수는 비동기 로직(3초 대기 후 실패 모달 열기)을 담당합니다.
    submitAction();
  }, [closeSubmitModal, openLoadingModal, submitAction]); // --------------------------------------------------------
  // 💡 2. 스토어 상태로 조건부 렌더링
  // --------------------------------------------------------

  if (!isSubmitModalOpen) return null;

  return (
    // Overlay: z-[1000]로 최상단에 위치
    <div className="fixed inset-0 bg-[rgba(1,1,1,0.6)] flex justify-center items-center z-[1000]">
      <div // Modal Container (피그마 명세: 403.65px x 586.46px)
        className="relative w-[403.65px] h-[586.46px] bg-white rounded-[16px] box-border"
      >
        {/* 닫기 버튼: closeSubmitModal 액션 연결 */}
        <CancelIcon onClick={closeSubmitModal} />
        {/* Group 448 (ARENA 로고/헤더 영역) */}
        <div className="absolute left-[30px] top-[17px] w-[105px] h-[42px] flex items-center">
          {/* Vector 18 (빨간색 바)는 ArenaSvg로 대체 */}
          <div className="w-[29px] h-[42px] flex justify-center items-center">
            <img src={ArenaSvg} alt="ARENA 로고" className="w-full h-full" />
          </div>

          <span className="ml-[9px] heading-3 font-700 text-[#FF084A]">ARENA</span>
        </div>
        {/* 메인 아이콘: Arena.svg에 투명도 30% 적용 */}
        <div // 피그마 Frame 2087327787 영역: left: 128px, top: 105px, width: 148px, height: 218px
          className="absolute top-[105px] left-1/2 -translate-x-1/2 w-[148px] h-[218px] 
          flex justify-center items-center"
        >
          {/* 💡 Arena.svg에 opacity-30 적용 */}
          <img src={ArenaSvg} alt="제출 아이콘" className="w-full h-full opacity-30" />
        </div>
        {/* 경고 메시지 */}
        <p // 피그마 명세: left: 41px, top: 324px, width: 321px
          className="absolute w-[321px] left-[41px] top-[324px]
      text-center heading-3 font-500  
      text-black m-0 whitespace-pre-wrap"
        >
          <p>제출하면 세 개의 JUDGE AI 모델이 각각 판단하여 성공/실패 결과를 제공합니다.</p>{' '}
          <p>대화 내용은 저장되어 챌린지 화면 우측에서 확인 하실 수 있습니다.</p>
        </p>
        {/* 제출하기 버튼 (Frame 2087327751) */}
        <button
          type="button"
          onClick={handleSubmit} // 피그마 명세: width: 343.2px, height: 60.45px, left: 30.22px, top: 496.28px, bg: #FF6289
          className="absolute w-[343.2px] h-[60.45px] left-[30.22px] top-[496.28px]
      flex justify-center items-center 
      bg-[#FF6289] rounded-[29.25px] cursor-pointer 
      hover:bg-pink-600 transition duration-200"
        >
          <span className="heading-3 font-500  text-white">제출하기</span>
        </button>
      </div>
    </div>
  );
};

export default SubmitModal;
