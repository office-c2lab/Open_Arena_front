import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useCreateChatSession } from '@/hooks/useChatMutation';
import useChatSessionStore from '@/stores/useChatSessionStore';
import { useAuthStore } from '@/stores/authStore';
import Challenge from './ui/Challenge';

export default function ChallengePage() {
  const { challengeId } = useParams();
  const [problemId] = useState(1);
  const isInitialRequestSent = useRef(false);

  const currentTeamId = useAuthStore((state) => state.teamInfo?.team_id) || 1;

  const { sessionId, isSessionLoading, setSessionId, loadSessionId, resetSessionState } =
    useChatSessionStore();

  const { mutate, data: newSessionData, isPending: isCreationPending, isError, error } =
    useCreateChatSession();

  const handleForceNewSession = useCallback(() => {
    if (!challengeId) return;

    resetSessionState();
    isInitialRequestSent.current = true;

    console.log(`[Session] 새 세션 생성 요청 시작: ${challengeId}`);
    mutate({
      problem_id: problemId,
      team_id: currentTeamId,
      title: `챌린지 세션: ${challengeId}`,
    });
  }, [challengeId, mutate, problemId, currentTeamId, resetSessionState]);

  useEffect(() => {
    if (challengeId) {
      const loadedId = loadSessionId(challengeId, currentTeamId);

      if (!loadedId && !isInitialRequestSent.current) {
        console.log(`[Session] 기존 세션 없음 → 새 세션 생성 요청`);
        isInitialRequestSent.current = true;

        mutate({
          problem_id: problemId,
          team_id: currentTeamId,
          title: `챌린지 세션: ${challengeId}`,
        });
      } else if (loadedId) {
        console.log(`[Session] 기존 세션 ID(${loadedId}) 재사용`);
      }
    }

    return () => {
      isInitialRequestSent.current = false;
    };
  }, [challengeId, mutate, problemId, currentTeamId, loadSessionId]);

  useEffect(() => {
    if (newSessionData?.sessionId && newSessionData.sessionId !== sessionId) {
      console.log(`[API] ✅ 세션 생성 성공: ${newSessionData.sessionId}`);
      setSessionId(challengeId, newSessionData.sessionId, currentTeamId);
    }
  }, [newSessionData, setSessionId, challengeId, sessionId, currentTeamId]);

  const overallLoading = isSessionLoading || isCreationPending;

  if (overallLoading || !challengeId) {
    return (
      <div className="p-8 h-screen flex items-center justify-center text-xl">
        {isCreationPending ? '새로운 세션 생성 중...' : '챌린지 세션 준비 중...'}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 h-screen flex items-center justify-center text-red-500 text-xl">
        ❌ 세션 생성 실패: {error.message}
      </div>
    );
  }

  if (sessionId) {
    return <Challenge onResetChatSession={handleForceNewSession} />;
  }

  return (
    <div className="p-8 h-screen flex items-center justify-center text-yellow-500 text-xl">
      세션 정보를 가져오는 중...
    </div>
  );
}
