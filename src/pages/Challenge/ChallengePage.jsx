// src/features/Challenge/ui/ChallengePage.jsx (최종 - Ref 적용)

import React, { useEffect, useState, useCallback, useRef } from 'react'; // 💡 useRef 임포트
import { useParams } from 'react-router-dom';
import { useCreateChatSession } from '../../hooks/useChatMutation'; 
import useChatSessionStore from '../../stores/useChatSessionStore'; 
import { useAuthStore } from '@/stores/authStore'; 
import Challenge from './ui/Challenge';

export default function ChallengePage() {
    const { challengeId } = useParams(); 
    
    const [problemId] = useState(1);
    // 🚀 [핵심 수정 1] useState 대신 useRef 사용
    const isInitialRequestSent = useRef(false); 

    const currentTeamId = useAuthStore(state => state.teamInfo?.id) || 1; 
    
    // ... (Zustand 스토어 및 useCreateChatSession 훅 정의 유지)
    const { 
        sessionId, 
        isSessionLoading, 
        setSessionId, 
        loadSessionId,
        resetSessionState 
    } = useChatSessionStore();

    const { 
        mutate, 
        data: newSessionData, 
        isPending: isCreationPending, 
        isError, 
        error 
    } = useCreateChatSession(); 

    // 강제 새 세션 생성 로직 (대화 초기화 시)
    const handleForceNewSession = useCallback(() => {
        if (!challengeId) return;

        resetSessionState(); 
        isInitialRequestSent.current = true; // Ref 값 변경

        console.log(`[Session] 대화 내용 초기화 버튼 클릭. 새 세션 생성 요청 시작: ${challengeId}`);
        mutate({ 
            problem_id: problemId, 
            team_id: currentTeamId, 
            title: `챌린지 세션: ${challengeId}` 
        });
    }, [challengeId, mutate, problemId, currentTeamId, resetSessionState]);


    // 로컬 스토리지에서 세션 로드 또는 생성 요청 (최초 진입 시)
    useEffect(() => {
        if (challengeId) {
            const loadedId = loadSessionId(challengeId, currentTeamId); 
            
            // 🚀 [핵심 수정 2] useRef의 current 값 사용
            if (!loadedId && !isInitialRequestSent.current) { 
                console.log(`[Session] ChallengePage 진입. 기존 세션 없음. 새로운 세션 생성 요청 시작: ${challengeId}`);
                
                isInitialRequestSent.current = true; // Ref 값 변경 (리렌더링 X)

                mutate({ 
                    problem_id: problemId, 
                    team_id: currentTeamId,      
                    title: `챌린지 세션: ${challengeId}` 
                });
            } else if (loadedId) {
                console.log(`[Session] ChallengePage 진입. 기존 세션 ID (${loadedId}) 발견. 재사용.`);
            }
        }
        
        // 클린업: 페이지 이탈 시 Ref 초기화
        return () => {
            isInitialRequestSent.current = false; 
        };
    // 🚀 [핵심 수정 3] 의존성 배열에서 isInitialRequestSent 제거 (더 이상 상태가 아님)
    }, [challengeId, mutate, problemId, currentTeamId, loadSessionId]); 
    
    // 뮤테이션 성공 시 세션 ID를 스토어 및 로컬 스토리지에 저장
    useEffect(() => {
        if (newSessionData?.sessionId && newSessionData.sessionId !== sessionId) {
            console.log(`[API] ✅ 세션 생성 성공: ID ${newSessionData.sessionId}. 스토어 업데이트.`);
            setSessionId(challengeId, newSessionData.sessionId, currentTeamId); 
        }
    }, [newSessionData, setSessionId, challengeId, sessionId, currentTeamId]);
    
    
    // --- 렌더링 상태 처리 ---
    
    // isInitialRequestSent는 로딩 상태에 직접 영향을 주지 않으므로 isCreationPending만 확인
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
    
    if (sessionId) {
        return <Challenge onResetChatSession={handleForceNewSession} />;
    }
    
    return <div className="p-8 h-screen flex items-center justify-center text-yellow-500 text-xl">
        세션 정보를 가져올 수 없습니다. (로그인 및 서버 상태 확인)
    </div>;
}