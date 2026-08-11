// src/features/Challenge/components/ChatArea/ChatArea.jsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import useModalStore from '@/stores/useModalStore';
import { useChatSession } from '@/hooks/useChatSession';
import { useChatMessages } from '@/hooks/useChatMessages';
import { useJudgeSubmission } from '@/hooks/useJudgeSubmissions';
import { useSessionStore } from '@/stores/useSessionStore';
import { buildJudgeResultPanels, isPassedSubmission } from '../../utils/judgeResultPresentation';
import { appToast } from '@/components/Toast/appToast';
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
    setResetChatAction,
  } = useModalStore();
  const { sessionStatus } = useSessionStore();

  // 세션 훅
  const { sessionId, clearSession, createSessionMutation } = useChatSession(teamId, problemId);
  const createSessionAsync = createSessionMutation.mutateAsync;

  const [inputValue, setInputValue] = useState('');

  const { messages, isMessagesLoading, messagesError, sendMessageMutation, cancelPendingMessage } =
    useChatMessages(sessionId, teamId, problemId, clearSession, setInputValue);

  const chatEndRef = useRef(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 메시지 전송
  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || sendMessageMutation.isPending) return;

    try {
      if (!sessionId) {
        const newSession = await createSessionMutation.mutateAsync('');
        const newSessionId = newSession?.id ?? newSession;

        if (newSessionId) {
          await sendMessageMutation.mutateAsync({ content: trimmed, sessionId: newSessionId });
        }
      } else {
        await sendMessageMutation.mutateAsync(trimmed);
      }
    } catch {
      // 각 mutation의 onError에서 사용자 메시지를 표시합니다.
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
  const submissionDetailQuery = useJudgeSubmission(activeSession?.submission_id, {
    enabled: Boolean(activeSession?.submission_id),
  });

  const handleViewJudgeResult = () => {
    if (!hasJudgeResult) {
      openSubmitModal();
      return;
    }

    const submission = submissionDetailQuery.data ?? activeSession?.submission;
    if (!submission) {
      appToast.info('판정 상세 결과를 불러오는 중입니다. 잠시 후 다시 시도해 주세요.');
      return;
    }

    setChallengeResults(buildJudgeResultPanels(submission));
    setChallengeRewardPoints(submission.score ?? null);

    if (isPassedSubmission(submission)) openSuccessModal();
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
    displayMessages.length === 0 &&
    !isMessagesLoading &&
    !createSessionMutation.isPending &&
    !sendMessageMutation.isPending;

  const handleResetChat = useCallback(async () => {
    cancelPendingMessage();
    clearSession();
    await createSessionAsync('');
  }, [cancelPendingMessage, clearSession, createSessionAsync]);

  useEffect(() => {
    setResetChatAction(handleResetChat);
  }, [handleResetChat, setResetChatAction]);

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-grow flex-col">
      <div className="glass-panel flex min-h-0 flex-1 flex-col overflow-hidden rounded-[24px]">
        <ChatMessages
          messages={displayMessages}
          isLoading={isMessagesLoading}
          error={messagesError}
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
