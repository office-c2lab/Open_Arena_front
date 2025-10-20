import React, { useState, useCallback } from 'react';

// DebugModal과 ResetModal을 동일 경로에서 import 한다고 가정
import DebugModal from './ChallengeModal/DebugModal';
import ResetModal from './ChallengeModal/ResetModal';

const Challenge = () => {
  // 1. DebugModal의 열림 상태
  const [isDebugModalOpen, setIsDebugModalOpen] = useState(false);

  // 2. ResetModal의 열림 상태 (새로 추가)
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // DebugModal을 닫는 함수
  const closeDebugModal = useCallback(() => {
    setIsDebugModalOpen(false);
  }, []);

  // DebugModal을 여는 함수
  const openDebugModal = useCallback(() => {
    setIsDebugModalOpen(true);
  }, []);

  // ResetModal을 닫는 함수
  const closeResetModal = useCallback(() => {
    setIsResetModalOpen(false);
  }, []);

  // ResetModal을 여는 함수 (새로 추가)
  const openResetModal = useCallback(() => {
    setIsResetModalOpen(true);
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

        {/* 2. ResetModal을 여는 버튼 (새로 추가) */}
        <button
          onClick={openResetModal}
          className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-300"
        >
          대화 초기화 모달 열기
        </button>
      </div>
      {/* ============================== */}

      {/* DebugModal 렌더링 */}
      <DebugModal isOpen={isDebugModalOpen} onClose={closeDebugModal} />

      {/* ResetModal 렌더링 */}
      <ResetModal isOpen={isResetModalOpen} onClose={closeResetModal} />
    </div>
  );
};

export default Challenge;
