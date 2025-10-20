import React, { useState, useCallback } from 'react';

// 모달 컴포넌트 import
import DebugModal from './ChallengeModal/DebugModal';
import ResetModal from './ChallengeModal/ResetModal';
import LoadingModal from '../../components/Loading/LoadingModal';

const Challenge = () => {
  // 1. DebugModal의 열림 상태
  const [isDebugModalOpen, setIsDebugModalOpen] = useState(false);

  // 2. ResetModal의 열림 상태
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // 3. LoadingModal의 열림 상태 (새로 추가)
  const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);

  // DebugModal을 닫는 함수
  const closeDebugModal = useCallback(() => {
    setIsDebugModalOpen(false);
  }, []);

  // DebugModal을 여는 함수
  const openDebugModal = useCallback(() => {
    // 다른 모달이 열려 있다면 닫습니다 (선택적)
    setIsResetModalOpen(false);
    setIsDebugModalOpen(true);
  }, []);

  // ResetModal을 닫는 함수
  const closeResetModal = useCallback(() => {
    setIsResetModalOpen(false);
  }, []);

  // ResetModal을 여는 함수
  const openResetModal = useCallback(() => {
    // 다른 모달이 열려 있다면 닫습니다 (선택적)
    setIsDebugModalOpen(false);
    setIsResetModalOpen(true);
  }, []);

  // LoadingModal을 여는 함수 (새로 추가)
  const openLoadingModal = useCallback(() => {
    // 로딩이 시작될 때 열고, onFinish 콜백에 의해 닫힐 때까지 기다립니다.
    setIsLoadingModalOpen(true);
  }, []);

  // LoadingModal의 onFinish prop에 전달할 함수 (로딩 완료 시 호출됨)
  const handleLoadingFinish = useCallback(() => {
    // LoadingModal 내부의 setTimeout에 의해 4.5초 후 호출됩니다.
    setIsLoadingModalOpen(false);
    console.log('로딩이 완료되어 로딩 모달이 닫혔습니다.');
  }, []);

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
          디버그 도움 요청 모달 열기
        </button>

        {/* 2. ResetModal을 여는 버튼 */}
        <button
          onClick={openResetModal}
          className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-300"
        >
          대화 초기화 모달 열기
        </button>

        {/* 3. LoadingModal을 여는 버튼 (새로 추가) */}
        <button
          onClick={openLoadingModal}
          className="px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-gray-900 transition duration-300"
        >
          로딩 모달 테스트 (4.5초)
        </button>
      </div>
      {/* ============================== */}

      {/* DebugModal 렌더링 */}
      <DebugModal isOpen={isDebugModalOpen} onClose={closeDebugModal} />

      {/* ResetModal 렌더링 */}
      <ResetModal isOpen={isResetModalOpen} onClose={closeResetModal} />

      {/* LoadingModal 렌더링 */}
      {/* show 상태가 아닌, 외부 상태(isLoadingModalOpen)에 따라 렌더링을 제어합니다. */}
      {isLoadingModalOpen && <LoadingModal onFinish={handleLoadingFinish} />}
    </div>
  );
};

export default Challenge;
