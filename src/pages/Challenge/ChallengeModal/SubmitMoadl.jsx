import React, { useCallback } from 'react';
import useModalStore from '@/stores/useModalStore';
import { useSessionStore } from '@/stores/useSessionStore'; 
import api from '@/api/axiosInstance';

// 💡 패널 데이터 (이미지 및 동물 이름 포함)
import { successPanelsData, failedPanelsData } from '../data/challengeModalData'; 

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

  // ⭐️ useModalStore에서 필요한 모든 액션을 가져옵니다.
  const { 
    closeSubmitModal, 
    openLoadingModal, 
    closeLoadingModal, 
    openSuccessModal, 
    openFailedModal, 
    setChallengeResults 
  } = useModalStore();

  // 세션 ID 가져오기
  const { sessionId } = useSessionStore(); 

  console.log(`[SubmitModal 렌더링 확인] 현재 sessionId: ${sessionId}`);

  // 제출 로직
  const submitForJudgement = useCallback(async () => {
    const validSessionId =
      typeof sessionId === 'number' || typeof sessionId === 'string' ? sessionId : null;

    if (!validSessionId) { 
      console.error('세션 ID가 유효하지 않습니다. (SubmitModal) - 제출 중단');
      alert('제출할 채팅 세션 정보가 없습니다.');
      closeSubmitModal();
      return;
    }

    const endpoint = `/judge/sessions/${validSessionId}/submit`; 
    console.log(`[API 요청 시작] Endpoint: ${endpoint}`);
    
    try {
      // 1️⃣ 모달 닫기 + 로딩 표시
      closeSubmitModal();
      openLoadingModal();

      // 2️⃣ 실제 API 호출
      const res = await api.post(endpoint, {}); 
      const resultData = res.data;

      console.log('✅ 제출 API 호출 성공');
      console.log('✅ 제출 결과:', resultData);
      
      // 3️⃣ 로딩 닫기
      closeLoadingModal();

      // 4️⃣ 결과 데이터 가공 및 저장
      const results = (resultData.results || []).map((vote, index) => {
        const isSuccess = vote.verdict.toLowerCase() === 'passed';

        // 성공/실패 패널 데이터 매핑
        const baseData = isSuccess
          ? successPanelsData[index % successPanelsData.length]
          : failedPanelsData[index % failedPanelsData.length];

        return {
          status: vote.verdict, // "PASSED" or "FAILED"
          data: {
            ...baseData,
            title: baseData.animalName, // 💡 동물 이름 그대로 표시
            modelName: vote.model, // 💡 모델명 따로 저장
            description: vote.output || baseData.description, // 모델 output 있으면 덮어쓰기
          },
        };
      });

      // Zustand Store에 저장
      setChallengeResults(results);

      // 5️⃣ 결과 모달 열기
      if (resultData.status === 'success') {
        openSuccessModal();
        console.log('✅ Success Modal 열기 함수 호출됨');
      } else {
        openFailedModal();
        console.log('❌ Failed Modal 열기 함수 호출됨. API Status:', resultData.status);
      }

    } catch (err) {
      console.error('❌ 제출 실패', err);
      closeLoadingModal();
      openFailedModal(); 
      alert(`제출 실패: ${err.message}`);
    }
  }, [
    sessionId,
    closeSubmitModal,
    openLoadingModal,
    closeLoadingModal,
    openSuccessModal,
    openFailedModal,
    setChallengeResults
  ]);

  if (!isSubmitModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(1,1,1,0.6)] flex justify-center items-center z-[1000]">
      <div className="relative w-[403.65px] h-[586.46px] bg-white rounded-[16px] box-border">
        {/* 닫기 버튼 */}
        <CancelIcon onClick={closeSubmitModal} />

        {/* 헤더 로고 */}
        <div className="absolute left-[30px] top-[17px] w-[105px] h-[42px] flex items-center">
          <div className="w-[29px] h-[42px] flex justify-center items-center">
            <img src={ArenaSvg} alt="ARENA 로고" className="w-full h-full" />
          </div>
          <span className="ml-[9px] heading-3 font-700 text-[#FF084A]">ARENA</span>
        </div>

        {/* 중앙 아이콘 */}
        <div className="absolute top-[105px] left-1/2 -translate-x-1/2 w-[148px] h-[218px] flex justify-center items-center">
          <img src={ArenaSvg} alt="제출 아이콘" className="w-full h-full opacity-30" />
        </div>

        {/* 안내 문구 */}
        <div className="absolute w-[340px] left-[31px] top-[324px] text-center heading-3 font-500 text-black m-0 whitespace-pre-wrap">
          <p>제출하면 세 개의 JUDGE AI 모델이 각각 판단하여 성공/실패 결과를 제공합니다.</p>
          <p>대화 내용은 저장되어 챌린지 화면 우측에서 확인하실 수 있습니다.</p>
        </div>

        {/* 제출 버튼 */}
        <button
          type="button"
          onClick={submitForJudgement}
          className={`absolute w-[343.2px] h-[60.45px] left-[30.22px] top-[496.28px]
          flex justify-center items-center 
          bg-[#FF6289] rounded-[29.25px] cursor-pointer 
          hover:bg-pink-600 transition duration-200 ${
            !sessionId ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={!sessionId}
        >
          <span className="heading-3 font-700 text-white">제출하기</span>
        </button>
      </div>
    </div>
  );
};

export default SubmitModal;
