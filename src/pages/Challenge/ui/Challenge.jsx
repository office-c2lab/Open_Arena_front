import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { TABS } from '../data/challengeData';
import { useParams } from 'react-router-dom';

// React Query 훅
import { useSendMessage } from '@/hooks/useChatMutation';
import { useChatMessages } from '@/hooks/useChatQuery';
import { useJudgeMutation } from '@/hooks/useJudgeMutation';
import { useProblemBundleQuery } from '@/hooks/useProblemBundleQuery';
import { useQueryClient } from '@tanstack/react-query';

// Zustand 스토어
import useModalStore from '@/stores/useModalStore';
import useChatSessionStore from '@/stores/useChatSessionStore';
import { useAuthStore } from '@/stores/authStore';

import { successPanelsData, failedPanelsData } from '../data/challengeModalData';

// Assets
import ArenaIcon from '@/assets/icons/Arena.svg';
import SendIcon from '@/assets/icons/sendBtn.svg';
import ResetIcon from '@/assets/icons/reset.svg';
import PurpleDownIcon from '@/assets/icons/purple-downbtn.svg';

// Components
import ChallengeInfoPanel from '../components/ChallengeInfoPanel';
import ChatArea from '../components/ChatArea';
import AttemptHistoryPanel from '../components/AttemptHistoryPanel';
import LoadingModal from '../../../components/Loading/LoadingModal';
import DebugModal from '../ChallengeModal/DebugModal';
import ResetModal from '../ChallengeModal/ResetModal';
import SubmitModal from '../ChallengeModal/SubmitMoadl';
import FailedModal from '../ChallengeModal/FailedModal';
import SuccessModal from '../ChallengeModal/SuccesModal';

// ----------------------------------------------------------------------

export default function Challenge({ onResetChatSession }) {
  const { problemId } = useParams();
  const currentProblemId = parseInt(problemId, 10) || 1;
  const queryClient = useQueryClient();

  // 💡 teamId from AuthStore
  const currentTeamId = useAuthStore((state) => state.teamInfo?.team_id) || 1;

  const sessionId = useChatSessionStore((state) => state.sessionId);

  // ----------------------------------------------------------------------
  // API hooks
  // ----------------------------------------------------------------------

  const { data: problemBundleData, isLoading: isProblemBundleLoading } =
    useProblemBundleQuery(currentProblemId, currentTeamId);

  const {
    data: fetchedMessages = [],
    isLoading: isMessagesLoading,
    isError: isMessagesError,
  } = useChatMessages(sessionId, currentTeamId, currentProblemId);

  const { mutate: sendMutate, isPending: isSending } = useSendMessage(sessionId, {
    onMutate: async ({ messageBody }) => {
      await queryClient.cancelQueries({
        queryKey: ['chatMessages', sessionId, currentTeamId, currentProblemId],
      });

      const userMessage = {
        id: Date.now(),
        role: 'user',
        content: messageBody.content,
      };
      setChatMessages((prev) => [...prev, userMessage]);
      setInputValue('');

      return { userMessageId: userMessage.id };
    },
    onError: (err, variables, context) => {
      console.error('❌ 메시지 전송 실패 (롤백):', err);
      setChatMessages((prev) => prev.filter((msg) => msg.id !== context.userMessageId));
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `⚠️ 전송 실패: ${err.message}`,
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    },
    onSettled: () => {
      if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    },
  });

  const { mutate: judgeMutate, isPending: isJudging } = useJudgeMutation();

  // ----------------------------------------------------------------------
  // Zustand store + state
  // ----------------------------------------------------------------------

  const {
    isDebugModalOpen,
    isResetModalOpen,
    isSubmitModalOpen,
    isLoadingModalOpen,
    isFailedModalOpen,
    isSuccessModalOpen,
    setResetChatAction,
    setSubmitAction,
    closeLoadingModal,
    openFailedModal,
    openSuccessModal,
    setChallengeResults,
  } = useModalStore();

  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const [inputValue, setInputValue] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const chatEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (!isMessagesLoading && !isMessagesError && fetchedMessages.length > 0) {
      setChatMessages(fetchedMessages);
      console.log(`✅ [Chat] 메시지 로드 완료. Session ID: ${sessionId}`);
      scrollToBottom();
    } else if (!isMessagesLoading && fetchedMessages.length === 0) {
      setChatMessages([]);
      console.log(`✅ [Chat] 새 세션 시작. Session ID: ${sessionId}`);
    }
  }, [isMessagesLoading, isMessagesError, fetchedMessages, sessionId, scrollToBottom]);

  // ----------------------------------------------------------------------
  // Reset & Submit handlers
  // ----------------------------------------------------------------------

  const handleResetChat = useCallback(() => {
    onResetChatSession();
    setChatMessages([]);
    setInputValue('');
    console.log('✅ 대화 내용 초기화 완료.');
  }, [onResetChatSession]);

  const handleSubmit = useCallback(() => {
    console.log('챌린지 제출 로직 실행됨.');

    judgeMutate(
      {
        problem_id: currentProblemId,
        team_id: currentTeamId,
        session_id: sessionId,
      },
      {
        onSuccess: (data) => {
          console.log('✅ Judge API 성공:', data);

          closeLoadingModal();

          const results = data.votes.map((vote, index) => {
            const isSuccess = vote.verdict === 'success';
            const baseData = isSuccess
              ? successPanelsData[index % successPanelsData.length]
              : failedPanelsData[index % failedPanelsData.length];

            return {
              status: vote.verdict,
              data: {
                ...baseData,
                title: vote.model,
                content: vote.raw_summary || baseData.content,
              },
            };
          });

          setChallengeResults(results);

          if (data.verdict === 'success') openSuccessModal();
          else openFailedModal();
        },
        onError: (error) => {
          console.error('❌ Judge 실패:', error);
          closeLoadingModal();
          alert(`제출 실패: ${error.message}`);
        },
      }
    );
  }, [
    sessionId,
    closeLoadingModal,
    openFailedModal,
    openSuccessModal,
    setChallengeResults,
    judgeMutate,
    currentTeamId,
    currentProblemId,
  ]);

  useEffect(() => {
    setResetChatAction(handleResetChat);
    setSubmitAction(handleSubmit);

    return () => {
      setResetChatAction(() => console.warn('Reset action not registered.'));
      setSubmitAction(() => console.warn('Submit action not registered.'));
    };
  }, [setResetChatAction, handleResetChat, setSubmitAction, handleSubmit]);

  // ----------------------------------------------------------------------
  // useMemo: 문제 데이터 가공
  // ----------------------------------------------------------------------

  const { CHALLENGE_HEADER_INFO, activeTabContent, PROBLEM_API_URL, SESSIONS_LIST } =
    useMemo(() => {
      if (!problemBundleData) {
        return {
          CHALLENGE_HEADER_INFO: {
            title: '문제 로딩 중',
            subtitle: '정보를 불러오는 중입니다.',
            score: 0,
          },
          activeTabContent: null,
          PROBLEM_API_URL: null,
          SESSIONS_LIST: [],
        };
      }

      const problem = problemBundleData.problem;
      const sessions = problemBundleData.sessions || [];

      const headerInfo = {
        title: problem.title,
        subtitle: problem.sub_title,
        score: problem.score,
      };

      const tabContents = {
        description: { title: '챌린지 개요', content: problem.description },
        goal: { title: '도전 목표', content: problem.goal },
        success: { title: '성공 조건', content: problem.success_criteria },
        failure: { title: '실패 조건', content: problem.failure_criteria },
      };

      const design = TABS.find((tab) => tab.id === activeTab);
      const tabContent = tabContents[activeTab];

      return {
        CHALLENGE_HEADER_INFO: headerInfo,
        activeTabContent: { ...design, ...tabContent },
        PROBLEM_API_URL: problemBundleData.problem_api?.url || null,
        SESSIONS_LIST: sessions,
      };
    }, [problemBundleData, activeTab]);

  // ----------------------------------------------------------------------
  // Input handlers
  // ----------------------------------------------------------------------

  const handleInputChange = (e) => setInputValue(e.target.value);

  const handleTabClick = (e, tabId) => {
    e.preventDefault();
    setActiveTab(tabId);
  };

  const handleSendMessage = () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isSending) return;

    sendMutate({
      sessionId,
      messageBody: {
        content: trimmedInput,
        team_id: currentTeamId,
        problem_id: currentProblemId,
},
    });
  };

  // ----------------------------------------------------------------------
  // Render
  // ----------------------------------------------------------------------

  const isPanelLoading = isMessagesLoading || isProblemBundleLoading;
  const isInputDisabled = isMessagesLoading || isSending || isJudging || isProblemBundleLoading;

  return (
    <div className="flex w-full h-full gap-4 md:gap-6">
      {/* 좌측 문제 정보 패널 */}
      <ChallengeInfoPanel
        TABS={TABS}
        activeTab={activeTab}
        activeTabContent={activeTabContent}
        handleTabClick={handleTabClick}
        CHALLENGE_HEADER_INFO={CHALLENGE_HEADER_INFO}
        isLoading={isPanelLoading}
        problemApiUrl={PROBLEM_API_URL}
      />

      {/* 중앙 챗 영역 */}
      <ChatArea
        ArenaIcon={ArenaIcon}
        SendIcon={SendIcon}
        ResetIcon={ResetIcon}
        chatMessages={chatMessages}
        chatEndRef={chatEndRef}
        inputValue={inputValue}
        handleInputChange={handleInputChange}
        handleSendMessage={handleSendMessage}
        inputDisabled={isInputDisabled}
        isMessagesLoading={isPanelLoading}
        teamId={currentTeamId}
        problemId={currentProblemId}
        sessionId={sessionId}
        setSessionId={useChatSessionStore((state) => state.setSessionId)}
      />

      {/* 우측 시도 기록 */}
      <AttemptHistoryPanel
        PurpleDownIcon={PurpleDownIcon}
        isLoading={isPanelLoading}
        sessions={SESSIONS_LIST}
        problemId={currentProblemId}
        teamId={currentTeamId}
      />

      {/* 모달 */}
      {isDebugModalOpen && <DebugModal />}
      {isResetModalOpen && <ResetModal />}
      {isSubmitModalOpen && <SubmitModal />}
      {isLoadingModalOpen && <LoadingModal />}
      {isFailedModalOpen && <FailedModal />}
      {isSuccessModalOpen && <SuccessModal />}
    </div>
  );
}
