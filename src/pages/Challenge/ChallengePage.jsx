import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useCreateChatSession } from '../../hooks/useChatMutation'; // React Query Mutation Hook
import useChatSessionStore from '../../stores/useChatSessionStore'; // 💡 Zustand 스토어 임포트
import Challenge from './ui/Challenge';

export default function ChallengePage() {
    const { challengeId } = useParams(); 
    
    // ⚠️ 테스트용 problem_id와 team_id (하드코딩 유지)
    const [problemId] = useState(1);
    const [teamId] = useState(1);

    // 💡 Zustand 스토어 상태 및 액션
    const { 
        sessionId, 
        isSessionLoading, 
        setSessionId, 
        loadSessionId,
        resetSessionState 
    } = useChatSessionStore();

    // 💡 React Query 세션 생성 훅
    const { 
        mutate, 
        data: newSessionData, 
        isPending: isCreationPending, 
        isError, 
        error 
    } = useCreateChatSession(); 

    // ==========================================================
    // 💡 [핵심 추가] 강제 새 세션 생성 로직 (ResetModal에서 호출)
    // ==========================================================
    const handleForceNewSession = useCallback(() => {
        if (!challengeId) return;

        // 1. 기존 세션 상태를 로컬 스토리지에서 제거하고 Zustand 상태 초기화
        resetSessionState(); 

        // 2. 새 세션 생성 API 강제 호출
        console.log(`[Session] 대화 내용 초기화 버튼 클릭. 새 세션 생성 요청 시작: ${challengeId}`);
        mutate({ 
            problem_id: problemId, 
            team_id: teamId, 
            title: `챌린지 세션: ${challengeId}` 
        });

    }, [challengeId, mutate, problemId, teamId, resetSessionState]);


    // ==========================================================
    // 💡 1. 로컬 스토리지에서 세션 로드 또는 생성 요청 (useEffect)
    // ==========================================================
    useEffect(() => {
        if (challengeId) {
            const loadedId = loadSessionId(challengeId);
            
            // 로드된 ID가 없으면, 세션 생성 요청 시작
            if (!loadedId) {
                console.log(`[Session] ChallengePage 진입. 기존 세션 없음. 새로운 세션 생성 요청 시작: ${challengeId}`);
                mutate({ 
                    problem_id: problemId, 
                    team_id: teamId,      
                    title: `챌린지 세션: ${challengeId}` 
                });
            } else {
                console.log(`[Session] ChallengePage 진입. 기존 세션 ID (${loadedId}) 발견. 재사용.`);
            }
        }
        
        // 클린업: challengeId가 바뀔 때 상태 초기화
        return () => resetSessionState();
    }, [challengeId, mutate, problemId, teamId, loadSessionId, resetSessionState]); 
    
    // ==========================================================
    // 💡 2. 뮤테이션 성공 시 세션 ID를 스토어 및 로컬 스토리지에 저장 (useEffect)
    // ==========================================================
    useEffect(() => {
        if (newSessionData?.sessionId && newSessionData.sessionId !== sessionId) {
            console.log(`[API] ✅ 세션 생성 성공: ID ${newSessionData.sessionId}. 스토어 업데이트.`);
            // 성공적으로 세션을 생성하면 스토어와 로컬 스토리지에 저장
            setSessionId(challengeId, newSessionData.sessionId);
        }
    }, [newSessionData, setSessionId, challengeId, sessionId]);
    
    
    // --- 로딩 및 에러 상태 처리 ---
    
    // 전체 로딩 상태: 로컬 스토리지 로딩 중이거나, 새로운 세션 생성 API 대기 중
    const overallLoading = isSessionLoading || isCreationPending;
    
    if (overallLoading || !challengeId) {
        return <div className="p-8 h-screen flex items-center justify-center text-xl">
            {isCreationPending ? '새로운 세션 생성 중...' : '챌린지 세션 준비 중...'}
        </div>;
    }

    if (isError) {
        return <div className="p-8 h-screen flex items-center justify-center text-red-500 text-xl">
            ❌ 세션 생성 실패: {error.message}
        </div>;
    }
    
    // --- 성공 시 Challenge 컴포넌트 렌더링 ---
    
    if (sessionId) {
        console.log(`✅ [Session] 최종 세션 ID 획득 완료: ${sessionId}. Challenge UI 로드.`);
        // 💡 [수정] Challenge 컴포넌트에 새 세션 강제 생성 함수 prop으로 전달
        return <Challenge onResetChatSession={handleForceNewSession} />;
    }
    
    return <div className="p-8 h-screen flex items-center justify-center text-yellow-500 text-xl">
        세션 정보를 가져올 수 없습니다.
    </div>;
}