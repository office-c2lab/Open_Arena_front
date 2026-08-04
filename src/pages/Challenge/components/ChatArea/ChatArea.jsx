// src/features/Challenge/components/ChatArea/ChatArea.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import useModalStore from '@/stores/useModalStore';
import { useChatSession } from '@/hooks/useChatSession';
import { useChatMessages } from '@/hooks/useChatMessages';
import { useSessionStore } from '@/stores/useSessionStore';
import { successPanelsData, failedPanelsData } from '../../data/challengeModalData';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import ChatControls from './ChatControls';

export default function ChatArea({
  ArenaIcon,
  SendIcon,
  ResetIcon,
  inputDisabled,
  disabledPlaceholder,
  problemId,
  teamId,
  sessions = [],
}) {
  const {
    openResetModal,
    openSubmitModal,
    openSuccessModal,
    openFailedModal,
    setChallengeResults,
    setChallengeRewardPoints,
  } = useModalStore();
  const { sessionStatus } = useSessionStore();
  const queryClient = useQueryClient();

  // 세션 훅
  const { sessionId, clearSession, createSessionMutation } = useChatSession(teamId, problemId);

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

  // 메시지 전송
  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || sendMessageMutation.isPending) return;

    // ⭐ 세션이 없으면 새로 만들고 메시지 전송
    if (!sessionId) {
      const newSession = await createSessionMutation.mutateAsync('');
      const newSessionId = newSession?.id ?? newSession;

      if (newSessionId) {
        // 문제 다시 불러오기
        queryClient.invalidateQueries(['problemBundle', problemId, teamId]);

        // 첫 메시지 전송
        await sendMessageMutation.mutateAsync({ content: trimmed, sessionId: newSessionId });

        // 🔥 토큰 사용량 즉시 갱신
        queryClient.invalidateQueries(['tokenUsage']);
      }
    }

    // ⭐ 기존 세션이 있을 때
    else {
      sendMessageMutation.mutate(trimmed, {
        onSuccess: () => {
          // 🔥 토큰 사용량 즉시 갱신
          queryClient.invalidateQueries(['tokenUsage']);
        },
      });
    }
  };

  const displayMessages = Array.isArray(messages) ? messages : [];
  const isAiTyping = displayMessages.some(msg => msg.isTyping);
  const normalizedSessionStatus = sessionStatus?.toLowerCase();
  const hasJudgeResult =
    normalizedSessionStatus === 'success' ||
    normalizedSessionStatus === 'fail' ||
    normalizedSessionStatus === 'failed';
  const activeSession = sessions.find(session => session.id === sessionId);

  const handleViewJudgeResult = () => {
    if (!hasJudgeResult) {
      openSubmitModal();
      return;
    }

    const isSuccess = normalizedSessionStatus === 'success';
    const basePanels = isSuccess ? successPanelsData : failedPanelsData;
    const judgeReason = activeSession?.judge_reason;

    setChallengeResults(
      basePanels.map((panel, index) => ({
        status: isSuccess ? 'success' : 'failed',
        data: {
          ...panel,
          title: panel.animalName,
          description: index === 0 && judgeReason ? judgeReason : panel.description,
        },
      }))
    );
    setChallengeRewardPoints(
      activeSession?.earned_points ?? activeSession?.points ?? activeSession?.score ?? null
    );

    if (isSuccess) openSuccessModal();
    else openFailedModal();
  };

  // 입력 disabled 조건
  const isChatAreaDisabled =
    inputDisabled ||
    sendMessageMutation.isPending ||
    isAiTyping ||
    createSessionMutation.isPending ||
    sessionStatus === 'success' ||
    sessionStatus === 'fail';

  const isInitialState =
    !sessionId && displayMessages.length === 0 && !createSessionMutation.isPending;

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-grow flex-col">
      <div className="glass-panel flex min-h-0 flex-1 flex-col overflow-hidden rounded-[24px]">
        <ChatMessages
          messages={displayMessages}
          isLoading={isMessagesLoading}
          isInitialState={isInitialState}
          ArenaIcon={ArenaIcon}
          chatEndRef={chatEndRef}
        />

        <div className="h-[210px] md:h-[237px] p-4 md:p-6 border-t border-white/55 bg-white/28 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] flex flex-col justify-end gap-3 flex-shrink-0">
          <ChatInput
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleSend={handleSend}
            SendIcon={SendIcon}
            isDisabled={isChatAreaDisabled}
            disabledPlaceholder={disabledPlaceholder}
            sessionStatus={sessionStatus}
          />

          <ChatControls
            ResetIcon={ResetIcon}
            openResetModal={openResetModal}
            openSubmitModal={openSubmitModal}
            openJudgeResult={handleViewJudgeResult}
            clearSession={clearSession}
            isDisabled={isChatAreaDisabled}
            sessionId={sessionId}
            sessionStatus={sessionStatus}
          />
        </div>
      </div>
    </div>
  );
}
