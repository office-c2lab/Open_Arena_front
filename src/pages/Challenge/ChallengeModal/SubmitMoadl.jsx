import React, { useCallback } from 'react';
import useModalStore from '@/stores/useModalStore';
import { useSessionStore } from '@/stores/useSessionStore';
import api from '@/api/axiosInstance';
import { successPanelsData, failedPanelsData } from '../data/challengeModalData';
import CancelSvg from '../../../assets/icons/cancel.svg';
import ArenaSvg from '../../../assets/icons/Arena.svg';

const CancelIcon = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute top-[30px] right-[30px] w-[18px] h-[18px] cursor-pointer"
  >
    <img src={CancelSvg} alt="닫기" className="w-full h-full" />
  </div>
);

const SubmitModal = ({ setProgress }) => {
  const isSubmitModalOpen = useModalStore(state => state.isSubmitModalOpen);
  const {
    closeSubmitModal,
    openLoadingModal,
    closeLoadingModal,
    openSuccessModal,
    openFailedModal,
    setChallengeResults,
  } = useModalStore();
  const { sessionId } = useSessionStore();

  const submitForJudgement = useCallback(async () => {
    if (!sessionId) {
      alert('제출할 세션 정보가 없습니다.');
      return closeSubmitModal();
    }

    try {
      closeSubmitModal();
      openLoadingModal();
      setProgress(0);

      // ✅ “가짜 진행률” 타이머 시작
      let fake = 0;
      const interval = setInterval(() => {
        fake += 0.02; // 2%씩 증가
        setProgress(Math.min(fake, 0.95)); // 최대 95%까지만
      }, 100);

      const endpoint = `/judge/sessions/${sessionId}/submit`;
      const res = await api.post(endpoint, {});

      clearInterval(interval); // 요청 완료 시 타이머 종료
      setProgress(1); // 100%

      const resultData = res.data;
      closeLoadingModal();

      // ✅ 결과 데이터 매핑
      const results = (resultData.results || []).map((vote, index) => {
        const isSuccess = vote.verdict.toLowerCase() === 'passed';
        const baseData = isSuccess
          ? successPanelsData[index % successPanelsData.length]
          : failedPanelsData[index % failedPanelsData.length];

        return {
          status: vote.verdict,
          data: {
            ...baseData,
            title: baseData.animalName,
            modelName: vote.model,
            description: vote.output || baseData.description,
          },
        };
      });

      setChallengeResults(results);

      // ✅ 결과 모달 열기
      if (resultData.status === 'success') openSuccessModal();
      else openFailedModal();

    } catch (err) {
      console.error('❌ 제출 실패', err);
      setProgress(0);
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
    setChallengeResults,
    setProgress,
  ]);

  if (!isSubmitModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(1,1,1,0.6)] flex justify-center items-center z-[1000]">
      <div className="relative w-[403.65px] h-[586.46px] bg-white rounded-[16px] box-border">
        <CancelIcon onClick={closeSubmitModal} />

        <div className="absolute left-[30px] top-[17px] w-[105px] h-[42px] flex items-center">
          <div className="w-[29px] h-[42px] flex justify-center items-center">
            <img src={ArenaSvg} alt="ARENA 로고" className="w-full h-full" />
          </div>
          <span className="ml-[9px] heading-3 font-700 text-[#FF084A]">ARENA</span>
        </div>

        <div className="absolute top-[105px] left-1/2 -translate-x-1/2 w-[148px] h-[218px] flex justify-center items-center">
          <img src={ArenaSvg} alt="제출 아이콘" className="w-full h-full opacity-30" />
        </div>

        <div className="absolute w-[340px] left-[31px] top-[324px] text-center heading-3 font-500 text-black m-0 whitespace-pre-wrap">
          <p>제출하면 세 개의 JUDGE AI 모델이 각각 판단하여 성공/실패 결과를 제공합니다.</p>
          <p>대화 내용은 저장되어 챌린지 화면 우측에서 확인하실 수 있습니다.</p>
        </div>

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
