import React, { useState, useCallback } from 'react';

// 모달 컴포넌트 import
import DebugModal from './ChallengeModal/DebugModal';
import ResetModal from './ChallengeModal/ResetModal';
import LoadingModal from '../../components/Loading/LoadingModal';
import FailedModal from './ChallengeModal/FailedModal';
// ✅ SuccessModal 추가 (경로를 './ChallengeModal/SuccessModal'로 가정)
import SuccessModal from './ChallengeModal/SuccesModal';

const Challenge = () => {
  // 1. DebugModal의 열림 상태
  const [isDebugModalOpen, setIsDebugModalOpen] = useState(false);
  // 2. ResetModal의 열림 상태
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  // 3. LoadingModal의 열림 상태
  const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);
  // 4. FailedModal의 열림 상태
  const [isFailedModalOpen, setIsFailedModalOpen] = useState(false);
  // 5. SuccessModal의 열림 상태 (새로 추가)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // --- 모든 모달 닫기 유틸리티 함수 ---
  const closeAllModals = useCallback(() => {
    setIsDebugModalOpen(false);
    setIsResetModalOpen(false);
    setIsFailedModalOpen(false);
    setIsSuccessModalOpen(false); // SuccessModal 추가
  }, []);

  // --- DebugModal 핸들러 ---
  const closeDebugModal = useCallback(() => setIsDebugModalOpen(false), []);
  const openDebugModal = useCallback(() => {
    closeAllModals();
    setIsDebugModalOpen(true);
  }, [closeAllModals]);

  // --- ResetModal 핸들러 ---
  const closeResetModal = useCallback(() => setIsResetModalOpen(false), []);
  const openResetModal = useCallback(() => {
    closeAllModals();
    setIsResetModalOpen(true);
  }, [closeAllModals]);

  // --- LoadingModal 핸들러 ---
  const openLoadingModal = useCallback(() => setIsLoadingModalOpen(true), []);
  const handleLoadingFinish = useCallback(() => {
    setIsLoadingModalOpen(false);
    console.log('로딩이 완료되어 로딩 모달이 닫혔습니다.');
  }, []);

  // --- FailedModal 핸들러 ---
  const closeFailedModal = useCallback(() => setIsFailedModalOpen(false), []);
  const openFailedModal = useCallback(() => {
    closeAllModals();
    setIsFailedModalOpen(true);
  }, [closeAllModals]);

  const handleRestart = useCallback(() => {
    console.log('실패 모달: 챌린지 재시작 로직 실행');
    closeFailedModal();
  }, [closeFailedModal]);

  const handleContinue = useCallback(() => {
    console.log('실패 모달: 대화 계속 하기 로직 실행');
    closeFailedModal();
  }, [closeFailedModal]);

  const handleHelp = useCallback(() => {
    console.log('실패 모달: 도움 요청 로직 실행');
    closeFailedModal();
  }, [closeFailedModal]);

  // --- SuccessModal 핸들러 (새로 추가) ---
  const closeSuccessModal = useCallback(() => setIsSuccessModalOpen(false), []);
  const openSuccessModal = useCallback(() => {
    closeAllModals();
    setIsSuccessModalOpen(true);
  }, [closeAllModals]);

  const handleSuccessRestart = useCallback(() => {
    console.log('성공 모달: 챌린지 재시작 로직 실행');
    closeSuccessModal();
  }, [closeSuccessModal]);

  const handleSuccessContinue = useCallback(() => {
    console.log('성공 모달: 대화 계속 하기 로직 실행');
    closeSuccessModal();
  }, [closeSuccessModal]);

  const handleSuccessHelp = useCallback(() => {
    console.log('성공 모달: 도움 요청 로직 실행');
    closeSuccessModal();
  }, [closeSuccessModal]);
  // ------------------------------------

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-6 p-10">
      <h1 className="text-4xl font-extrabold text-gray-800">Challenge 진행 화면</h1>

      {/* === 모달을 여는 버튼 그룹 === */}
      <div className="flex gap-4">
        {/* 1. DebugModal을 여는 버튼 */}
        <button
          onClick={openDebugModal}
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
        >
          디버그 도움 요청 모달
        </button>
        {/* 2. ResetModal을 여는 버튼 */}
        <button
          onClick={openResetModal}
          className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-300"
        >
          대화 초기화 모달
        </button>
        {/* 3. LoadingModal을 여는 버튼 */}
        <button
          onClick={openLoadingModal}
          className="px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-gray-900 transition duration-300"
        >
          로딩 모달 (4.5초)
        </button>
        {/* 4. FailedModal을 여는 버튼 */}
        <button
          onClick={openFailedModal}
          className="px-6 py-3 bg-pink-700 text-white font-semibold rounded-lg shadow-md hover:bg-pink-800 transition duration-300"
        >
          🔴 실패 모달 테스트
        </button>
        {/* 5. SuccessModal을 여는 버튼 (새로 추가) */}
        <button
          onClick={openSuccessModal}
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300"
        >
          🟢 성공 모달 테스트
        </button>
      </div>
      {/* ============================== */}

      {/* 모달 렌더링 영역 */}
      <DebugModal isOpen={isDebugModalOpen} onClose={closeDebugModal} />
      <ResetModal isOpen={isResetModalOpen} onClose={closeResetModal} />
      {isLoadingModalOpen && <LoadingModal onFinish={handleLoadingFinish} />}

      {/* FailedModal 렌더링 */}
      <FailedModal
        isOpen={isFailedModalOpen}
        onClose={closeFailedModal}
        onRestart={handleRestart}
        onContinue={handleContinue}
        onHelp={handleHelp}
      />

      {/* SuccessModal 렌더링 (새로 추가) */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={closeSuccessModal} // SuccessModal에는 닫기 버튼이 없을 수 있지만 명시적으로 추가
        onRestart={handleSuccessRestart}
        onContinue={handleSuccessContinue}
        onHelp={handleSuccessHelp}
      />
    </div>
  );
};

export default Challenge;
