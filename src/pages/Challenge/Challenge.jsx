// src/features/Challenge/Challenge.jsx

import React, { useState, useRef, useEffect, useCallback } from 'react'; // 💡 useCallback 임포트 추가
import { TABS, BOT_RESPONSE, CHALLENGE_HEADER_INFO } from './data/challengeData';

// 💡 모달 스토어 임포트
import useModalStore from '@/stores/useModalStore';

// 💡 실제 모달 컴포넌트들을 임포트 (경로는 프로젝트에 맞게 수정하세요)
import ArenaIcon from '@/assets/icons/Arena.svg';
import SendIcon from '@/assets/icons/sendBtn.svg';
import ResetIcon from '@/assets/icons/reset.svg';
import PurpleDownIcon from '@/assets/icons/purple-downbtn.svg';

import ChallengeInfoPanel from './components/ChallengeInfoPanel';
import ChatArea from './components/ChatArea';
import AttemptHistoryPanel from './components/AttemptHistoryPanel';
import DebugModal from './ChallengeModal/DebugModal';
import ResetModal from './ChallengeModal/ResetModal';
import FailedModal from './ChallengeModal/FailedModal';
import SuccessModal from './ChallengeModal/SuccesModal';
import LoadingModal from '../../components/Loading/LoadingModal';

// ----------------------------------------------------------------------

export default function Challenge() {
  // --------------------------------------------------------
  // 💡 1. 모달 상태를 스토어에서 개별적으로 가져오기 (최적화된 방식)
  // --------------------------------------------------------
  const isDebugModalOpen = useModalStore(state => state.isDebugModalOpen);
  const isResetModalOpen = useModalStore(state => state.isResetModalOpen);
  const isLoadingModalOpen = useModalStore(state => state.isLoadingModalOpen);
  const isFailedModalOpen = useModalStore(state => state.isFailedModalOpen);
  const isSuccessModalOpen = useModalStore(state => state.isSuccessModalOpen);

  // 💡 2. 리셋 액션 함수 등록을 위한 스토어 액션 가져오기
  const { setResetChatAction } = useModalStore();

  // 초기 탭을 첫 번째 탭 ('description')으로 설정
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const activeTabContent = TABS.find(tab => tab.id === activeTab);

  const [inputValue, setInputValue] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const chatEndRef = useRef(null);

  // --------------------------------------------------------
  // 💡 3. 초기화 로직 (useCallback 적용)
  // --------------------------------------------------------
  const handleResetChat = useCallback(() => {
    setChatMessages([]);
    console.log('대화 내용이 Challenge.jsx에서 실제로 초기화되었습니다.');
  }, []);

  // --------------------------------------------------------
  // 💡 4. 컴포넌트 마운트 시 초기화 로직을 스토어에 등록
  // --------------------------------------------------------
  useEffect(() => {
    setResetChatAction(handleResetChat);

    return () => {
      setResetChatAction(() => {
        console.error('Reset action not registered.');
      });
    };
  }, [setResetChatAction, handleResetChat]); // 의존성 배열에 액션과 함수 포함

  // --------------------------------------------------------
  // 💡 5. 일반 핸들러
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
        handleResetChat={handleResetChat} // 이 prop은 ChatArea에서 더 이상 사용되지 않지만, 다른 곳에서 사용될 수 있어 남겨둠.
      />

      {/* 3. 우측 시도 기록 패널 */}
      <AttemptHistoryPanel PurpleDownIcon={PurpleDownIcon} />

      {/* ========================================================== */}
      {/* 💡 4. 모달 조건부 렌더링 영역 */}
      {/* ========================================================== */}
      {isDebugModalOpen && <DebugModal />}
      {isResetModalOpen && <ResetModal />}
      {isLoadingModalOpen && <LoadingModal />}
      {isFailedModalOpen && <FailedModal />}
      {isSuccessModalOpen && <SuccessModal />}
    </div>
  );
}
