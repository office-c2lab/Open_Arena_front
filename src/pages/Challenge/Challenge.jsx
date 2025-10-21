// src/features/Challenge/Challenge.jsx

import React, { useState, useRef, useEffect } from 'react';
import { TABS, BOT_RESPONSE, CHALLENGE_DETAILS } from './data/challengeData';

import ArenaIcon from '@/assets/icons/Arena.svg';
import SendIcon from '@/assets/icons/sendBtn.svg';
import ResetIcon from '@/assets/icons/reset.svg';
import PurpleDownIcon from '@/assets/icons/purple-downbtn.svg';

import ChallengeInfoPanel from './components/ChallengeInfoPanel';
import ChatArea from './components/ChatArea';
import AttemptHistoryPanel from './components/AttemptHistoryPanel';

// ----------------------------------------------------------------------

export default function Challenge() {
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const activeTabContent = TABS.find(tab => tab.id === activeTab);

  const [inputValue, setInputValue] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const chatEndRef = useRef(null);

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

  const handleResetChat = () => setChatMessages([]);

  return (
    <div className="flex w-full h-[800px] gap-4 md:gap-6">
      {/* 1. 좌측 챌린지 정보 패널 */}
      <ChallengeInfoPanel
        TABS={TABS}
        activeTab={activeTab}
        activeTabContent={activeTabContent}
        handleTabClick={handleTabClick}
        CHALLENGE_DETAILS={CHALLENGE_DETAILS}
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
        handleResetChat={handleResetChat}
      />

      {/* 3. 우측 시도 기록 패널 */}
      <AttemptHistoryPanel PurpleDownIcon={PurpleDownIcon} />
    </div>
  );
}
