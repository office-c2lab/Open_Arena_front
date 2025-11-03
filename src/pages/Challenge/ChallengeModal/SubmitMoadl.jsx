// src/features/challenge/ChallengeModals/SubmitModal.jsx (최종 코드)

import React, { useCallback } from 'react';
import useModalStore from '@/stores/useModalStore';

// === 아이콘 import ===
import CancelSvg from '../../../assets/icons/cancel.svg';
import ArenaSvg from '../../../assets/icons/Arena.svg'; 
// ===================

// 닫기 버튼 컴포넌트
const CancelIcon = ({ onClick }) => (
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
 
 const isSubmitModalOpen = useModalStore(state => state.isSubmitModalOpen); 
 const { closeSubmitModal, openLoadingModal, submitAction } = useModalStore(); 

 const handleSubmit = useCallback(() => {
  // 1. 제출 모달 닫기
  closeSubmitModal();

  // 2. 로딩 모달 열기
  openLoadingModal();

  // 3. Challenge.jsx에 등록된 실제 비동기 제출 로직 실행 (Judge API 호출)
  submitAction();
 }, [closeSubmitModal, openLoadingModal, submitAction]); 

 if (!isSubmitModalOpen) return null;

 return (
  // Overlay: z-[1000]로 최상단에 위치
  <div className="fixed inset-0 bg-[rgba(1,1,1,0.6)] flex justify-center items-center z-[1000]">
   <div // Modal Container 
    className="relative w-[403.65px] h-[586.46px] bg-white rounded-[16px] box-border"
   >
    {/* 닫기 버튼 */}
    <CancelIcon onClick={closeSubmitModal} />
    {/* Group 448 (ARENA 로고/헤더 영역) */}
    <div className="absolute left-[30px] top-[17px] w-[105px] h-[42px] flex items-center">
     <div className="w-[29px] h-[42px] flex justify-center items-center">
      <img src={ArenaSvg} alt="ARENA 로고" className="w-full h-full" />
     </div>

     <span className="ml-[9px] heading-3 font-700 text-[#FF084A]">ARENA</span>
    </div>
    {/* 메인 아이콘: Arena.svg에 투명도 30% 적용 */}
    <div 
     className="absolute top-[105px] left-1/2 -translate-x-1/2 w-[148px] h-[218px] 
     flex justify-center items-center"
    >
     <img src={ArenaSvg} alt="제출 아이콘" className="w-full h-full opacity-30" />
    </div>
   {/* 경고 메시지 */}
  <div // 💡 [수정됨] <p> 중첩 오류 방지를 위해 <div> 사용
  className="absolute w-[340px] left-[31px] top-[324px]
 text-center heading-3 font-500 
 text-black m-0 whitespace-pre-wrap"
  >
  <p>제출하면 세 개의 JUDGE AI 모델이 각각 판단하여 성공/실패 결과를 제공합니다.</p>{' '}
  <p>대화 내용은 저장되어 챌린지 화면 우측에서 확인 하실 수 있습니다.</p>
  </div>
  {/* 제출하기 버튼 (Frame 2087327751) */}
    <button
     type="button"
     onClick={handleSubmit} 
     className="absolute w-[343.2px] h-[60.45px] left-[30.22px] top-[496.28px]
   flex justify-center items-center 
   bg-[#FF6289] rounded-[29.25px] cursor-pointer 
   hover:bg-pink-600 transition duration-200"
    >
     <span className="heading-3 font-700 text-white">제출하기</span>
    </button>
   </div>
  </div>
 );
};

export default SubmitModal;