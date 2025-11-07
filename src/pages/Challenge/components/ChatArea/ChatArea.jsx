import React, { useState, useEffect, useRef } from 'react';
import useModalStore from '@/stores/useModalStore';
import { useChatSession } from '@/hooks/useChatSession';
import { useChatMessages } from '@/hooks/useChatMessages';
import SessionList from './SessionList';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import ChatControls from './ChatControls';

export default function ChatArea({
  ArenaIcon,
  SendIcon,
  ResetIcon,
  inputDisabled,
  problemId,
  teamId,
  sessions = [],
}) {
  const { openResetModal, openSubmitModal } = useModalStore();

  // ✅ 세션 및 메시지 관련 훅
  const { sessionId, clearSession, createSessionMutation, handleSessionClick } =
    useChatSession(teamId, problemId);
  const [inputValue, setInputValue] = useState('');
  const { messages, isMessagesLoading, sendMessageMutation } = useChatMessages(
    sessionId,
    teamId,
    problemId,
    clearSession,
    setInputValue // ✅ 여기 전달 (입력값 초기화를 훅 안에서 수행)
  );

  const chatEndRef = useRef(null);
  useEffect(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages]);

  // ✅ 메시지 전송 로직
  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || sendMessageMutation.isPending) return;

    if (!sessionId) {
      const newSession = await createSessionMutation.mutateAsync('자동 생성된 세션');
      const newSessionId = newSession?.id ?? newSession;
      if (newSessionId) await sendMessageMutation.mutateAsync(trimmed);
    } else {
      sendMessageMutation.mutate(trimmed);
    }
  };

  // ✅ 상태 계산
  const displayMessages = Array.isArray(messages) ? messages : [];
  const isAiTyping = displayMessages.some((msg) => msg.isTyping);
  const isChatAreaDisabled =
    inputDisabled ||
    sendMessageMutation.isPending ||
    isAiTyping ||
    createSessionMutation.isPending;
  const isInitialState =
    !sessionId && displayMessages.length === 0 && !createSessionMutation.isPending;

  return (
    <div className="flex flex-col flex-grow h-full">
      <SessionList sessions={sessions} sessionId={sessionId} onSessionClick={handleSessionClick} />
      <div className="flex-1 bg-white shadow-xl rounded-[20px] flex flex-col overflow-hidden h-full">
        <ChatMessages
          messages={displayMessages}
          isLoading={isMessagesLoading}
          isInitialState={isInitialState}
          ArenaIcon={ArenaIcon}
          chatEndRef={chatEndRef}
        />
        <div className="h-[210px] md:h-[237px] p-4 md:p-6 bg-purple-50/20 shadow-[0_-3px_10px_rgba(0,0,0,0.25)] rounded-b-[20px] flex flex-col justify-end gap-3 flex-shrink-0">
          <ChatInput
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleSend={handleSend}
            SendIcon={SendIcon}
            isDisabled={isChatAreaDisabled}
          />
          <ChatControls
            ResetIcon={ResetIcon}
            openResetModal={openResetModal}
            openSubmitModal={openSubmitModal}
            clearSession={clearSession}
            isDisabled={isChatAreaDisabled}
            sessionId={sessionId}
          />
        </div>
      </div>
    </div>
  );
}
