// src/features/Challenge/ui/Challenge.jsx
import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

// React Query 훅
import { useProblemBundleQuery } from '@/hooks/useProblemBundleQuery';
import { useJudgeMutation } from '@/hooks/useJudgeMutation';

// Zustand 스토어
import useModalStore from '@/stores/useModalStore';
import { useAuthStore } from '@/stores/authStore';

// 데이터
import { TABS } from '../data/challengeData';
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

export default function Challenge() {
  const { problemId } = useParams();
  const currentProblemId = parseInt(problemId, 10) || 1;

  const queryClient = useQueryClient();

  // teamId 가져오기
  const currentTeamId = useAuthStore((state) => state.teamInfo?.id) || 1;

  // ----------------------------------------------------------------------
  // API Hooks
  // ----------------------------------------------------------------------
  const { data: problemBundleData, isLoading: isProblemBundleLoading } =
    useProblemBundleQuery(currentProblemId, currentTeamId);

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

  // ----------------------------------------------------------------------
  // Reset & Submit handlers
  // ----------------------------------------------------------------------
  const handleResetChat = () => {
    console.log('✅ 대화 내용 초기화 완료.');
  };

  const handleSubmit = () => {
    console.log('챌린지 제출 로직 실행됨.');

    judgeMutate(
      {
        problem_id: currentProblemId,
        team_id: currentTeamId,
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
  };

  // 모달 액션 등록
  useMemo(() => {
    setResetChatAction(handleResetChat);
    setSubmitAction(handleSubmit);
  }, []);

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

  const handleTabClick = (e, tabId) => {
    e.preventDefault();
    setActiveTab(tabId);
  };

  // ----------------------------------------------------------------------
  // Render
  // ----------------------------------------------------------------------
  const isPanelLoading = isProblemBundleLoading;
  const isInputDisabled = isJudging || isProblemBundleLoading;

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
        inputDisabled={isInputDisabled}
        problemId={currentProblemId} // 문제 아이디 전달
        teamId={currentTeamId}
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
