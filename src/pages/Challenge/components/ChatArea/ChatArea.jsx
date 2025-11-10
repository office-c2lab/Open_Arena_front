import React, { useState, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import useModalStore from '@/stores/useModalStore';
import { useChatSession } from '@/hooks/useChatSession';
import { useChatMessages } from '@/hooks/useChatMessages';
import { useSessionStore } from '@/stores/useSessionStore';
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
  hasSuccessSession = false, // ✅ 추가: 전체 문제 성공 여부
}) {
  const { openResetModal, openSubmitModal } = useModalStore();
  const { sessionStatus } = useSessionStore();
  const queryClient = useQueryClient();

  // ✅ 세션 및 메시지 관련 훅
  const { sessionId, clearSession, createSessionMutation, handleSessionClick } = useChatSession(
    teamId,
    problemId
  );

  const [inputValue, setInputValue] = useState('');

  const { messages, isMessagesLoading, sendMessageMutation } = useChatMessages(
    sessionId,
    teamId,
    problemId,
    clearSession,
    setInputValue
  );

  const chatEndRef = useRef(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ✅ 메시지 전송 로직
  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || sendMessageMutation.isPending) return;

    if (!sessionId) {
      const newSession = await createSessionMutation.mutateAsync('');
      const newSessionId = newSession?.id ?? newSession;

      if (newSessionId) {
        queryClient.invalidateQueries(['problemBundle', problemId, teamId]);
        await sendMessageMutation.mutateAsync(trimmed);
      }
    } else {
      sendMessageMutation.mutate(trimmed);
    }
  };

  // ✅ 상태 계산
  const displayMessages = Array.isArray(messages) ? messages : [];
  const isAiTyping = displayMessages.some(msg => msg.isTyping);

  // ✅ 세션 상태 또는 전체 성공 여부 시 입력 막기
  const isChatAreaDisabled =
    inputDisabled ||
    sendMessageMutation.isPending ||
    isAiTyping ||
    createSessionMutation.isPending ||
    sessionStatus === 'success' ||
    sessionStatus === 'fail' ||
    hasSuccessSession; // ✅ ← 전체 문제 성공 시 완전 잠금

  const isInitialState =
    !sessionId && displayMessages.length === 0 && !createSessionMutation.isPending;

  // ✅ 렌더
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
            sessionStatus={sessionStatus}
            hasSuccessSession={hasSuccessSession} // ✅ 전달
          />

          <ChatControls
            ResetIcon={ResetIcon}
            openResetModal={openResetModal}
            openSubmitModal={openSubmitModal}
            clearSession={clearSession}
            isDisabled={isChatAreaDisabled}
            sessionId={sessionId}
            hasSuccessSession={hasSuccessSession}
          />
        </div>
      </div>
    </div>
  );
}
