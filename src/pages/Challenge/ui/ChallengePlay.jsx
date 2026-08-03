import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';

import { useProblemBundleQuery } from '@/hooks/useProblemBundleQuery';
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
import ChallengeBg from '@/assets/images/chalbg.png';

const MotionDiv = motion.div;

export default function ChallengePlay() {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const { problemId } = useParams();
  const currentProblemId = parseInt(problemId, 10) || undefined;
  const currentTeamId = useAuthStore(state => state.teamInfo?.id) || undefined;

  const {
    isDebugModalOpen,
    isResetModalOpen,
    isSubmitModalOpen,
    isLoadingModalOpen,
    isFailedModalOpen,
    isSuccessModalOpen,
    setResetChatAction,
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

  useEffect(() => {
    if (isProblemError) {
      const status = problemError?.response?.status;

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

  const { CHALLENGE_HEADER_INFO, activeTabContent, SESSIONS_LIST } = useMemo(() => {
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
        activeTabContent: null,
        SESSIONS_LIST: [],
      };
    }

    const sessions = problemBundleData.sessions || [];

    const headerInfo = {
      title: problem.title,
      subtitle: problem.sub_title,
      category: normalizeProblemCategory(problem.category),
      score: problem.score,
    };

    const tabContents = {
      description: { title: '설명', content: problem.description },
      goal: { title: '목표', content: problem.goal },
      success: { title: '성공조건', content: problem.success_criteria },
      failure: { title: '실패조건', content: problem.failure_criteria },
    };

    const design = TABS.find(tab => tab.id === activeTab);
    const tabContent = tabContents[activeTab];

    return {
      CHALLENGE_HEADER_INFO: headerInfo,
      activeTabContent: { ...design, ...tabContent },
      SESSIONS_LIST: sessions,
    };
  }, [problemBundleData, activeTab, isProblemBundleLoading]);

  const hasSuccessSession = useMemo(() => {
    return SESSIONS_LIST?.some(s => s.status?.toLowerCase() === 'success');
  }, [SESSIONS_LIST]);

  const handleTabClick = (e, tabId) => {
    e.preventDefault();
    setActiveTab(tabId);
  };

  const handleResetChat = () => {};

  useMemo(() => {
    setResetChatAction(handleResetChat);
  }, [setResetChatAction]);

  return (
    <MotionDiv
      className="relative flex h-full min-w-[1120px] w-full gap-6 overflow-hidden bg-[#E5EAF0] p-6"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 26, filter: 'blur(10px)' }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.44, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.55]"
        style={{ backgroundImage: `url(${ChallengeBg})` }}
      />
      <ChallengeInfoPanel
        TABS={TABS}
        activeTab={activeTab}
        activeTabContent={activeTabContent}
        handleTabClick={handleTabClick}
        CHALLENGE_HEADER_INFO={CHALLENGE_HEADER_INFO}
        isLoading={isProblemBundleLoading}
        problemCode={problemBundleData?.problem?.problem_code}
        problemApiUrl={apiInfo?.url}
        problemApiMethod={apiInfo?.method}
        problemApiHeaderName={apiInfo?.header_name}
        problemApiKey={apiInfo?.api_key}
        problemId={currentProblemId}
        teamId={currentTeamId}
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
      {isSubmitModalOpen && <SubmitModal setProgress={setProgress} />}
      {isLoadingModalOpen && (
        <LoadingModal isOpen={isLoadingModalOpen} progress={progress} onClose={closeLoadingModal} />
      )}
      {isFailedModalOpen && <FailedModal />}
      {isSuccessModalOpen && <SuccessModal />}
    </MotionDiv>
  );
}
