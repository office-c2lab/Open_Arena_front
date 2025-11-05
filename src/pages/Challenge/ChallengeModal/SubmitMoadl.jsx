// src/features/challenge/ChallengeModals/SubmitModal.jsx

import React, { useCallback } from 'react';
import useModalStore from '@/stores/useModalStore';
import { useSessionStore } from '@/stores/useSessionStore'; // useSessionStore 임포트
import api from '@/api/axiosInstance'; // axios 인스턴스

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
// 💡 closeLoadingModal을 추가했습니다. (API 요청 실패/성공 시 닫기 위해 필요)
// 💡 openResultModal도 필요하다면 여기서 추가해야 합니다.
const { closeSubmitModal, openLoadingModal, closeLoadingModal /* , openResultModal */ } = useModalStore();

// ⭐️ 세션 ID를 가져옵니다.
const { sessionId } = useSessionStore(); 

// 🔴🔴🔴 디버깅 로그 추가 🔴🔴🔴
console.log(`[SubmitModal 렌더링 확인] 현재 sessionId: ${sessionId}`);
 
// 제출 API 호출
const submitForJudgement = useCallback(async () => {
 // ⭐️ 방어 로직: 이제 'sessionId'를 확인합니다.
 if (!sessionId) { 
 console.error('세션 ID가 없습니다. (SubmitModal) - 제출 중단');
 return;
 }

 // 🟢 API 요청 정보 콘솔 출력
 const endpoint = `/judge/sessions/${sessionId}/submit`;
 console.log(`[API 요청 시작] Endpoint: ${endpoint}`);
 console.log(`[API 요청 시작] Session ID: ${sessionId}`);

 try {
 // 1. 제출 모달 닫기
 closeSubmitModal();

 // 2. 로딩 모달 열기
 openLoadingModal();

 // 3. 실제 API 호출
 const res = await api.post(endpoint, {}); // ⭐️ sessionId 사용
 
 // 4. API 호출 성공 확인 및 결과 출력
 console.log('✅ 제출 API 호출 성공');
 console.log('✅ 제출 결과:', res.data);

 // 5. 로딩 모달 닫기
 closeLoadingModal();

 // 6. TODO: **여기에 결과 모달을 여는 로직을 추가해야 합니다.**
 // openResultModal(res.data); // 예시: useModalStore에 openResultModal이 정의되어 있다면

 } catch (err) {
 console.error('❌ 제출 실패', err);
 // 7. 실패 시에도 로딩 모달 닫기
 closeLoadingModal();
 // TODO: toast, alert 등으로 사용자에게 알림
 }
}, [sessionId, closeSubmitModal, openLoadingModal, closeLoadingModal /*, openResultModal*/]); // 디펜던시 배열 수정

if (!isSubmitModalOpen) return null;

return (
 // Overlay: z-[1000]로 최상단에 위치
 <div className="fixed inset-0 bg-[rgba(1,1,1,0.6)] flex justify-center items-center z-[1000]">
 <div className="relative w-[403.65px] h-[586.46px] bg-white rounded-[16px] box-border">
  {/* 닫기 버튼 */}
  <CancelIcon onClick={closeSubmitModal} />

  {/* ARENA 로고/헤더 영역 */}
  <div className="absolute left-[30px] top-[17px] w-[105px] h-[42px] flex items-center">
  <div className="w-[29px] h-[42px] flex justify-center items-center">
   <img src={ArenaSvg} alt="ARENA 로고" className="w-full h-full" />
  </div>
  <span className="ml-[9px] heading-3 font-700 text-[#FF084A]">ARENA</span>
  </div>

  {/* 메인 아이콘 */}
  <div
  className="absolute top-[105px] left-1/2 -translate-x-1/2 w-[148px] h-[218px] 
  flex justify-center items-center"
  >
  <img src={ArenaSvg} alt="제출 아이콘" className="w-full h-full opacity-30" />
  </div>

  {/* 경고 메시지 */}
  <div
  className="absolute w-[340px] left-[31px] top-[324px]
  text-center heading-3 font-500 text-black m-0 whitespace-pre-wrap"
  >
  <p>제출하면 세 개의 JUDGE AI 모델이 각각 판단하여 성공/실패 결과를 제공합니다.</p>
  <p>대화 내용은 저장되어 챌린지 화면 우측에서 확인 하실 수 있습니다.</p>
  </div>

  {/* 제출하기 버튼 */}
  <button
  type="button"
  onClick={submitForJudgement}
  className={`absolute w-[343.2px] h-[60.45px] left-[30.22px] top-[496.28px]
  flex justify-center items-center 
  bg-[#FF6289] rounded-[29.25px] cursor-pointer 
  hover:bg-pink-600 transition duration-200 ${!sessionId ? 'opacity-50 cursor-not-allowed' : ''}`}
  disabled={!sessionId} // 세션 ID가 없으면 모달 내 버튼도 비활성화
  >
  <span className="heading-3 font-700 text-white">제출하기</span>
  </button>
 </div>
 </div>
);
};

export default SubmitModal;

// Note: 이 부분은 SubmitModal.jsx와는 다른 파일(예: src/api/axiosInstance.js 또는 src/api/judgement.js)에
// 별도로 정의된 것으로 보입니다.

/**
 * 챌린지 제출 요청
 * @param {number} sessionId - 현재 챌린지 세션 ID
 * @param {object} body - 추가 제출 데이터 (필요 시)
 * @returns {Promise}
 */
// export const submitForJudgement = (sessionId, body = {}) => {
//   return api.post(`/judge/sessions/${sessionId}/submit`, body)
//     .then(res => res.data);
// };