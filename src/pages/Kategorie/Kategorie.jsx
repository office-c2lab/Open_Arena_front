import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // 💡 페이지 이동을 위해 import

// 모달 컴포넌트 import
import DebugModal from '../Challenge/ChallengeModal/DebugModal.jsx';
import ResetModal from '../Challenge/ChallengeModal/ResetModal.jsx';
import LoadingModal from '../../components/Loading/LoadingModal.jsx';
import FailedModal from '../Challenge/ChallengeModal/FailedModal.jsx';
import SuccessModal from '../Challenge/ChallengeModal/SuccesModal.jsx';
import ProblemCard from '../../components/ProblemCard/ProblemCard.jsx.jsx';
import Banner from '../../components/Banner/Banner.jsx';

const Kategorie = () => {
  const navigate = useNavigate(); // 💡 useNavigate 훅 호출

  // --- 모달 상태 관리 (기존 코드 유지) ---
  const [isDebugModalOpen, setIsDebugModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);
  const [isFailedModalOpen, setIsFailedModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // --- 모달 핸들러 정의 (기존 코드를 기반으로, 모든 close 함수 포함) ---
  const closeAllModals = useCallback(() => {
    setIsDebugModalOpen(false);
    setIsResetModalOpen(false);
    setIsFailedModalOpen(false);
    setIsSuccessModalOpen(false);
  }, []);

  // 💡 closeDebugModal 정의 (에러 방지 및 명시적 사용을 위해)
  const closeDebugModal = useCallback(() => setIsDebugModalOpen(false), []);
  const openDebugModal = useCallback(() => {
    closeAllModals();
    setIsDebugModalOpen(true);
  }, [closeAllModals]);

  // 💡 closeResetModal 정의 (에러 방지 및 명시적 사용을 위해)
  const closeResetModal = useCallback(() => setIsResetModalOpen(false), []);
  const openResetModal = useCallback(() => {
    closeAllModals();
    setIsResetModalOpen(true);
  }, [closeAllModals]);

  const openLoadingModal = useCallback(() => {
    closeAllModals();
    setIsLoadingModalOpen(true);
  }, [closeAllModals]);
  const handleLoadingFinish = useCallback(() => setIsLoadingModalOpen(false), []);

  const closeFailedModal = useCallback(() => setIsFailedModalOpen(false), []);
  const openFailedModal = useCallback(() => {
    closeAllModals();
    setIsFailedModalOpen(true);
  }, [closeAllModals]);

  const closeSuccessModal = useCallback(() => setIsSuccessModalOpen(false), []);
  const openSuccessModal = useCallback(() => {
    closeAllModals();
    setIsSuccessModalOpen(true);
  }, [closeAllModals]);

  // --- ProblemCard Solve 버튼 액션 핸들러 (라우팅으로 변경) ---
  const handleSolveProblem = useCallback(() => {
    console.log('ProblemCard: 문제풀기 버튼이 클릭되었습니다! /solve 페이지로 이동합니다.');
    // 💡 성공 모달 대신 /solve 경로로 이동
    navigate('/challenge');
  }, [navigate]);

  // --- 나머지 Failed/Success Modal 핸들러 ---
  const handleRestart = useCallback(() => {
    console.log('재시작');
    closeFailedModal();
  }, [closeFailedModal]);
  const handleContinue = useCallback(() => {
    console.log('계속');
    closeFailedModal();
  }, [closeFailedModal]);
  const handleHelp = useCallback(() => {
    console.log('도움');
    closeFailedModal();
  }, [closeFailedModal]);
  const handleSuccessRestart = useCallback(() => {
    console.log('성공 재시작');
    closeSuccessModal();
  }, [closeSuccessModal]);
  const handleSuccessContinue = useCallback(() => {
    console.log('성공 계속');
    closeSuccessModal();
  }, [closeSuccessModal]);
  const handleSuccessHelp = useCallback(() => {
    console.log('성공 도움');
    closeSuccessModal();
  }, [closeSuccessModal]);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-6 gap-8">
      <div className="w-full max-w-[1069px] flex justify-center">
        <Banner />
      </div>
      <h1 className="text-4xl font-extrabold text-gray-800">Challenge 진행 화면</h1>

      {/* === 모달을 여는 버튼 그룹 === */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={openDebugModal}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          디버그 모달
        </button>
        <button
          onClick={openResetModal}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          초기화 모달
        </button>
        <button
          onClick={openLoadingModal}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
        >
          로딩 모달
        </button>
        <button
          onClick={openFailedModal}
          className="px-4 py-2 bg-pink-700 text-white rounded-lg hover:bg-pink-800"
        >
          🔴 실패 모달
        </button>
        <button
          onClick={openSuccessModal}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          🟢 성공 모달
        </button>
      </div>

      {/* 💡 문제 카드 컴포넌트 렌더링 */}
      <div className="border border-dashed border-gray-400 p-8">
        <h2 className="text-xl font-semibold mb-4">문제 카드 테스트 영역</h2>
        <ProblemCard
          difficulty="초급"
          category="의료"
          title="The Infinite Loop: 무한 루프의 이해"
          onSolveClick={handleSolveProblem} // 💡 라우팅 함수 연결
        />
      </div>

      {/* 모달 렌더링 영역 */}
      <DebugModal isOpen={isDebugModalOpen} onClose={closeDebugModal} />
      <ResetModal isOpen={isResetModalOpen} onClose={closeResetModal} />
      {isLoadingModalOpen && <LoadingModal onFinish={handleLoadingFinish} />}
      <FailedModal
        isOpen={isFailedModalOpen}
        onClose={closeFailedModal}
        onRestart={handleRestart}
        onContinue={handleContinue}
        onHelp={handleHelp}
      />
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={closeSuccessModal}
        onRestart={handleSuccessRestart}
        onContinue={handleSuccessContinue}
        onHelp={handleSuccessHelp}
      />
    </div>
  );
};

export default Kategorie;
