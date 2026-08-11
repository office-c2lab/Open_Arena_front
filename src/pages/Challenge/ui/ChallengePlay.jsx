import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';

import { useProblemBundleQuery } from '@/hooks/useProblemBundleQuery';
import { useChatSessions } from '@/hooks/useChatSessions';
import { useJudgeSubmissions } from '@/hooks/useJudgeSubmissions';
import useModalStore from '@/stores/useModalStore';
import { useAuthStore } from '@/stores/authStore';
import { TABS } from '../data/challengeData';
import ArenaIcon from '@/assets/icons/Arena.svg';
import SendIcon from '@/assets/icons/sendBtn.svg';
import ResetIcon from '@/assets/icons/reset.svg';
import ChallengeInfoPanel from '../components/ChallengeInfoPanel';
import { normalizeProblemCategory } from '@/utils/problemCategory';
import ChatArea from '../components/ChatArea/ChatArea';
import LoadingModal from '../../../components/Loading/LoadingModal';
import DebugModal from '../ChallengeModal/DebugModal';
import ResetModal from '../ChallengeModal/ResetModal';
import SubmitModal from '../ChallengeModal/SubmitMoadl';
import FailedModal from '../ChallengeModal/FailedModal';
import SuccessModal from '../ChallengeModal/SuccesModal';
import { useSessionStore } from '@/stores/useSessionStore';
import { mergeChatSessionsWithSubmissions } from '@/utils/judgeSessions';

const MotionDiv = motion.div;

export default function ChallengePlay() {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const { problemId } = useParams();
  const currentProblemId = problemId || undefined;
  const currentTeamId = useAuthStore(state => state.teamInfo?.id) || undefined;
  const sessionId = useSessionStore(state => state.sessionId);
  const setSessionId = useSessionStore(state => state.setSessionId);
  const setSessionStatus = useSessionStore(state => state.setSessionStatus);
  const hasInitializedSessionRef = useRef(false);

  const {
    isDebugModalOpen,
    isResetModalOpen,
    isLoadingModalOpen,
    isFailedModalOpen,
    isSuccessModalOpen,
    closeLoadingModal,
  } = useModalStore();

  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const [progress, setProgress] = useState(0);

  const {
    data: problemBundleData,
    isLoading: isProblemBundleLoading,
    isError: isProblemError,
    error: problemError,
  } = useProblemBundleQuery(currentProblemId, currentTeamId);
  const sessionsQuery = useChatSessions(currentProblemId);
  const submissionsQuery = useJudgeSubmissions(currentProblemId);
  const mergedSessions = useMemo(
    () => mergeChatSessionsWithSubmissions(sessionsQuery.data?.items, submissionsQuery.data?.items),
    [sessionsQuery.data?.items, submissionsQuery.data?.items]
  );

  useEffect(() => {
    if (sessionsQuery.isLoading || submissionsQuery.isLoading || hasInitializedSessionRef.current) {
      return;
    }

    hasInitializedSessionRef.current = true;
    const activeSession = mergedSessions.find(session => session.id === sessionId);
    if (activeSession) {
      setSessionStatus(activeSession.status === 'failed' ? 'fail' : activeSession.status);
      return;
    }

    const latestSession = mergedSessions[0];
    if (latestSession) {
      setSessionId(latestSession.id);
      setSessionStatus(latestSession.status === 'failed' ? 'fail' : latestSession.status);
    }
  }, [
    sessionId,
    mergedSessions,
    sessionsQuery.isLoading,
    submissionsQuery.isLoading,
    setSessionId,
    setSessionStatus,
  ]);

  useEffect(() => {
    if (isProblemError) {
      const status = problemError?.status;

      if (status === 403) {
        navigate('/403', { replace: true });
      }

      if (status === 404) {
        navigate('/404', { replace: true });
      }
    }
  }, [isProblemError, problemError, navigate]);

  const problem = problemBundleData?.problem;
  const apiInfo = problemBundleData?.problem_api || problemBundleData?.api_info || {};
  const chatDisabledPlaceholder = isProblemBundleLoading
    ? '문제 정보를 불러오는 중입니다...'
    : undefined;

  const { CHALLENGE_HEADER_INFO, overviewSections, SESSIONS_LIST } = (() => {
    if (!problemBundleData?.problem) {
      return {
        CHALLENGE_HEADER_INFO: {
          title: isProblemBundleLoading ? '문제 로딩 중' : '문제 정보 없음',
          subtitle: isProblemBundleLoading
            ? '정보를 불러오는 중입니다.'
            : '문제 데이터를 찾을 수 없습니다.',
          category: '일반',
          score: 0,
        },
        overviewSections: [],
        SESSIONS_LIST: [],
      };
    }

    const headerInfo = {
      title: problem.title,
      subtitle: problem.sub_title,
      category: normalizeProblemCategory(problem.category),
      score: problem.score,
    };

    const sections = [
      { id: 'description', title: '챌린지 설명', content: problem.description },
      { id: 'goal', title: '도전목표', content: problem.goal },
      { id: 'success', title: '성공조건', content: problem.success_criteria },
      { id: 'failure', title: '실패조건', content: problem.failure_criteria },
    ];

    return {
      CHALLENGE_HEADER_INFO: headerInfo,
      overviewSections: sections,
      SESSIONS_LIST: mergedSessions,
    };
  })();

  const hasSuccessSession = SESSIONS_LIST?.some(s => s.status?.toLowerCase() === 'success');
  const activeSession = SESSIONS_LIST.find(session => session.id === sessionId);

  const handleTabClick = (e, tabId) => {
    e.preventDefault();
    setActiveTab(tabId);
  };

  return (
    <MotionDiv
      className="relative flex h-full min-w-[1120px] w-full gap-6 overflow-hidden bg-[#E2E5E9] p-6"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 26, filter: 'blur(10px)' }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.44, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden="true"
      >
        <img src={ArenaIcon} alt="" className="h-[168px] w-auto opacity-[0.12] grayscale" />
      </div>
      <ChallengeInfoPanel
        TABS={TABS}
        activeTab={activeTab}
        overviewSections={overviewSections}
        sessions={SESSIONS_LIST}
        handleTabClick={handleTabClick}
        CHALLENGE_HEADER_INFO={CHALLENGE_HEADER_INFO}
        isLoading={isProblemBundleLoading || sessionsQuery.isLoading || submissionsQuery.isLoading}
        problemCode={problemBundleData?.problem?.problem_code}
        problemApiUrl={apiInfo?.url}
        problemApiMethod={apiInfo?.method}
        problemApiHeaderName={apiInfo?.header_name}
        problemApiKey={apiInfo?.api_key}
        problemId={currentProblemId}
        teamId={currentTeamId}
        tokenUsed={activeSession?.user_prompt_tokens}
      />

      <ChatArea
        ArenaIcon={ArenaIcon}
        SendIcon={SendIcon}
        ResetIcon={ResetIcon}
        inputDisabled={isProblemBundleLoading}
        disabledPlaceholder={chatDisabledPlaceholder}
        problemId={currentProblemId}
        teamId={currentTeamId}
        sessions={SESSIONS_LIST}
        hasSuccessSession={hasSuccessSession}
      />

      {isDebugModalOpen && <DebugModal />}
      {isResetModalOpen && <ResetModal />}
      <SubmitModal setProgress={setProgress} />
      {isLoadingModalOpen && (
        <LoadingModal isOpen={isLoadingModalOpen} progress={progress} onClose={closeLoadingModal} />
      )}
      {isFailedModalOpen && <FailedModal />}
      {isSuccessModalOpen && <SuccessModal />}
    </MotionDiv>
  );
}
