// src/features/Challenge/Challenge.jsx

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { TABS, BOT_RESPONSE, CHALLENGE_HEADER_INFO } from './data/challengeData';

// 💡 모달 스토어 임포트
import useModalStore from '@/stores/useModalStore';

// 💡 실제 모달 컴포넌트들을 임포트 (경로는 프로젝트에 맞게 수정하세요)

// assets 경로가 '@'로 설정되어 있다고 가정합니다.
import ArenaIcon from '@/assets/icons/Arena.svg';
import SendIcon from '@/assets/icons/sendBtn.svg';
import ResetIcon from '@/assets/icons/reset.svg';
import PurpleDownIcon from '@/assets/icons/purple-downbtn.svg';

import ChallengeInfoPanel from './components/ChallengeInfoPanel';
import ChatArea from './components/ChatArea';
import AttemptHistoryPanel from './components/AttemptHistoryPanel';
import LoadingModal from '../../components/Loading/LoadingModal';
import DebugModal from './ChallengeModal/DebugModal';
import ResetModal from './ChallengeModal/ResetModal';
import SubmitModal from './ChallengeModal/SubmitMoadl';
import FailedModal from './ChallengeModal/FailedModal';
import SuccessModal from './ChallengeModal/SuccesModal';

// ----------------------------------------------------------------------

export default function Challenge() {
  // --------------------------------------------------------
  // 💡 1. 상태 및 스토어 구독 (개별 상태 구독 방식)
  // --------------------------------------------------------
  const isDebugModalOpen = useModalStore(state => state.isDebugModalOpen);
  const isResetModalOpen = useModalStore(state => state.isResetModalOpen);
  const isSubmitModalOpen = useModalStore(state => state.isSubmitModalOpen);
  const isLoadingModalOpen = useModalStore(state => state.isLoadingModalOpen);
  const isFailedModalOpen = useModalStore(state => state.isFailedModalOpen);
  const isSuccessModalOpen = useModalStore(state => state.isSuccessModalOpen);

  // 💡 리셋/제출 액션 함수 등록 및 제어를 위한 스토어 액션 가져오기
  const {
    setResetChatAction,
    setSubmitAction,
    closeLoadingModal, // 로딩 닫기 액션
    openFailedModal, // 실패 열기 액션
  } = useModalStore();

  // 초기 탭 설정
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const activeTabContent = TABS.find(tab => tab.id === activeTab);

  const [inputValue, setInputValue] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const chatEndRef = useRef(null);

  // --------------------------------------------------------
  // 💡 2. 초기화/제출 로직 (useCallback 적용)
  // --------------------------------------------------------
  // ResetModal에서 호출될 실제 초기화 로직
  const handleResetChat = useCallback(() => {
    setChatMessages([]);
    console.log('대화 내용이 Challenge.jsx에서 실제로 초기화되었습니다.');
  }, []);

  // SubmitModal에서 호출될 실제 비동기 제출 로직
  const handleSubmit = useCallback(async () => {
    console.log('챌린지 제출 로직 실행됨. (3초 로딩 시뮬레이션 시작)');

    // 1. 비동기 작업 시뮬레이션 (3초 대기)
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 2. 로딩 모달 닫기
    closeLoadingModal();

    // 3. 실패 모달 열기 (요청 사항: 실패 고정)
    openFailedModal();
  }, [closeLoadingModal, openFailedModal]); // 의존성 배열에 액션 추가

  // --------------------------------------------------------
  // 💡 3. 컴포넌트 마운트 시 초기화/제출 로직을 스토어에 등록
  // --------------------------------------------------------
  useEffect(() => {
    setResetChatAction(handleResetChat);
    setSubmitAction(handleSubmit);

    return () => {
      setResetChatAction(() => {
        console.error('Reset action not registered.');
      });
      setSubmitAction(() => {
        console.error('Submit action not registered.');
      });
    };
  }, [setResetChatAction, handleResetChat, setSubmitAction, handleSubmit]);

  // --------------------------------------------------------
  // 💡 4. 일반 핸들러
  // --------------------------------------------------------
  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleInputChange = e => setInputValue(e.target.value);

  const handleTabClick = (e, tabId) => {
    e.preventDefault();
    setActiveTab(tabId);
  };

  const handleSendMessage = () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return;

    const newMessages = [
      { id: Date.now(), sender: 'user', content: trimmedInput },
      { id: Date.now() + 1, sender: 'bot', content: BOT_RESPONSE },
    ];
    setChatMessages(prev => [...prev, ...newMessages]);
    setInputValue('');
  };

  return (
    <div className="flex w-full h-[800px] gap-4 md:gap-6">
      {/* 1. 좌측 챌린지 정보 패널 */}
      <ChallengeInfoPanel
        TABS={TABS}
        activeTab={activeTab}
        activeTabContent={activeTabContent}
        handleTabClick={handleTabClick}
        CHALLENGE_HEADER_INFO={CHALLENGE_HEADER_INFO}
      />

      {/* 2. 중앙 AI 채팅 및 입력 영역 */}
      <ChatArea
        ArenaIcon={ArenaIcon}
        SendIcon={SendIcon}
        ResetIcon={ResetIcon}
        chatMessages={chatMessages}
        chatEndRef={chatEndRef}
        inputValue={inputValue}
        handleInputChange={handleInputChange}
        handleSendMessage={handleSendMessage}
      />

      {/* 3. 우측 시도 기록 패널 */}
      <AttemptHistoryPanel PurpleDownIcon={PurpleDownIcon} />

      {/* ========================================================== */}
      {/* 💡 4. 모달 조건부 렌더링 영역 */}
      {/* ========================================================== */}
      {isDebugModalOpen && <DebugModal />}
      {isResetModalOpen && <ResetModal />}
      {isSubmitModalOpen && <SubmitModal />}
      {isLoadingModalOpen && <LoadingModal />}
      {isFailedModalOpen && <FailedModal />}
      {isSuccessModalOpen && <SuccessModal />}
    </div>
  );
}
