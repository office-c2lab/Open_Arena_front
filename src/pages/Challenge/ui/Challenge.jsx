// src/features/Challenge/ui/Challenge.jsx (최종 - 데이터 패칭 및 적용 통합)

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
// 💡 TABS 정의는 이 컴포넌트 내부에서 사용되므로 임포트 유지 (데이터 예시)
import { TABS } from '../data/challengeData'; 

// 💡 React Query 훅 임포트
import { useSendMessage } from '@/hooks/useChatMutation'; 
import { useChatMessages } from '@/hooks/useChatQuery'; 
import { useJudgeMutation } from '@/hooks/useJudgeMutation'; 
import { useProblemBundleQuery } from '@/hooks/useProblemBundleQuery'; // 💡 새로 임포트
import { useQueryClient } from '@tanstack/react-query'; 

// 💡 모달/세션/인증 스토어 임포트
import useModalStore from '@/stores/useModalStore';
import useChatSessionStore from '@/stores/useChatSessionStore'; 
import { useAuthStore } from '@/stores/authStore'; 
import { successPanelsData, failedPanelsData } from '../data/challengeModalData';

// assets 경로가 '@'로 설정되어 있다고 가정합니다.
import ArenaIcon from '@/assets/icons/Arena.svg';
import SendIcon from '@/assets/icons/sendBtn.svg';
import ResetIcon from '@/assets/icons/reset.svg';
import PurpleDownIcon from '@/assets/icons/purple-downbtn.svg';

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

// 💡 API 호출에 필요한 ID 정의
const PROBLEM_ID = 1; 

export default function Challenge({ onResetChatSession }) { 
    const queryClient = useQueryClient();
    
    // 💡 [핵심] useAuthStore에서 팀 ID 가져오기 (team_id로 통일)
    const currentTeamId = useAuthStore(state => state.teamInfo?.team_id) || 1; 

    // 0-1. Zustand 스토어에서 sessionId 가져오기
    const sessionId = useChatSessionStore(state => state.sessionId);

    // --------------------------------------------------------
    // 💡 0-2. API 훅 사용 (React Query)
    // --------------------------------------------------------
    // 1. 문제 번들 정보 조회 (ChallengeInfoPanel에 필요)
    const { 
        data: problemBundleData, 
        isLoading: isProblemBundleLoading,
    } = useProblemBundleQuery(PROBLEM_ID, currentTeamId); // 💡 훅 호출

    // 2. 메시지 목록 조회
    const { 
        data: fetchedMessages = [],
        isLoading: isMessagesLoading, 
        isError: isMessagesError, 
    } = useChatMessages(sessionId); 

    // 3. 메시지 전송 Mutation (낙관적 업데이트 포함)
    const { 
        mutate: sendMutate, 
        isPending: isSending, 
    } = useSendMessage(sessionId, {
        // 🚀 낙관적 업데이트: 사용자 메시지를 즉시 화면에 표시
        onMutate: async ({ messageBody }) => {
            await queryClient.cancelQueries({ queryKey: ['chatMessages', sessionId] }); 
            
            const userMessage = { id: Date.now(), role: 'user', content: messageBody.content };
            
            // Note: 이 부분은 Redux/Zustand 상태가 아닌 로컬 상태 setChatMessages를 사용합니다.
            setChatMessages((prev) => [...prev, userMessage]);
            setInputValue(''); 

            return { userMessageId: userMessage.id };
        },
        // 🚀 전송 실패 시 롤백
        onError: (err, variables, context) => { 
            console.error('❌ 메시지 전송 실패 (롤백):', err);
            setChatMessages((prev) => prev.filter(msg => msg.id !== context.userMessageId));
            const errorMessage = { 
                id: Date.now() + 1, 
                role: 'assistant', 
                content: `⚠️ 전송 실패: ${err.message}`, 
            };
            setChatMessages((prev) => [...prev, errorMessage]);
        },
        onSettled: () => {
            if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    });
 
    // 4. Judge Mutation 
    const { 
        mutate: judgeMutate, 
        isPending: isJudging, 
    } = useJudgeMutation(); 

    // --------------------------------------------------------
    // 💡 1. 상태 및 스토어 구독
    // --------------------------------------------------------
    const isDebugModalOpen = useModalStore(state => state.isDebugModalOpen);
    const isResetModalOpen = useModalStore(state => state.isResetModalOpen);
    const isSubmitModalOpen = useModalStore(state => state.isSubmitModalOpen);
    const isLoadingModalOpen = useModalStore(state => state.isLoadingModalOpen);
    const isFailedModalOpen = useModalStore(state => state.isFailedModalOpen);
    const isSuccessModalOpen = useModalStore(state => state.isSuccessModalOpen);

    const {
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
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    // 💡 1-1. 패치된 메시지를 로컬 상태(messages)에 동기화 및 스크롤
    useEffect(() => {
        if (!isMessagesLoading && !isMessagesError && fetchedMessages.length > 0) {
            setChatMessages(fetchedMessages); 
            console.log(`✅ [Chat] 메시지 로드 완료 및 동기화. (Session ID: ${sessionId})`);
            scrollToBottom();
        } else if (!isMessagesLoading && fetchedMessages && fetchedMessages.length === 0) {
            setChatMessages([]);
            console.log(`✅ [Chat] 새 세션 시작. 메시지 목록 초기화됨. (Session ID: ${sessionId})`);
        }
    }, [isMessagesLoading, isMessagesError, fetchedMessages, sessionId, scrollToBottom]);

    // --------------------------------------------------------
    // 💡 2. 초기화/제출 로직 (teamId 적용)
    // --------------------------------------------------------
    const handleResetChat = useCallback(() => {
        onResetChatSession(); 
        setChatMessages([]);
        setInputValue(''); 
        console.log('✅ 대화 내용 초기화 로직 실행. ChallengePage에 새 세션 생성을 요청했습니다.');
    }, [onResetChatSession]); 

    const handleSubmit = useCallback(() => {
        console.log('챌린지 제출 로직 실행됨. /judge API 호출 시작');
        
        judgeMutate({ 
            problem_id: PROBLEM_ID, 
            team_id: currentTeamId, // 🚀 currentTeamId 적용
            session_id: sessionId 
        }, {
            onSuccess: (data) => {
                console.log('✅ Judge API 응답 성공:', data);

                closeLoadingModal();

                const results = data.votes.map((vote, index) => {
                    const isSuccess = vote.verdict === 'success';
                    const baseData = isSuccess ? successPanelsData[index % successPanelsData.length] : failedPanelsData[index % failedPanelsData.length];
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

                const finalVerdict = data.verdict; 
                
                if (finalVerdict === 'success') {
                    console.log(`챌린지 최종 결과: 성공!`);
                    openSuccessModal();
                } else {
                    console.log(`챌린지 최종 결과: 실패!`);
                    openFailedModal();
                }
            },
            onError: (error) => {
                console.error('❌ Judge API 호출 실패:', error);
                
                closeLoadingModal();
                alert(`챌린지 제출 실패: ${error.message}`);
            }
        });
    }, [sessionId, closeLoadingModal, openFailedModal, openSuccessModal, setChallengeResults, judgeMutate, currentTeamId]);


    // --------------------------------------------------------
    // 💡 3. 컴포넌트 마운트 시 초기화/제출 로직을 스토어에 등록 (유지)
    // --------------------------------------------------------
    useEffect(() => {
        setResetChatAction(handleResetChat);
        setSubmitAction(handleSubmit);

        return () => {
            setResetChatAction(() => { console.error('Reset action not registered.'); });
            setSubmitAction(() => { console.error('Submit action not registered.'); });
        };
    }, [setResetChatAction, handleResetChat, setSubmitAction, handleSubmit]);
    
    // --------------------------------------------------------
    // 💡 4. 문제 번들 데이터를 컴포넌트 Props 형태로 가공 (useMemo 수정)
    // --------------------------------------------------------
    const { CHALLENGE_HEADER_INFO, activeTabContent, PROBLEM_API_URL } = useMemo(() => {
        // 데이터 로딩 중이거나 데이터가 없을 경우 기본값 반환
        if (!problemBundleData) {
            return {
                CHALLENGE_HEADER_INFO: { title: '문제 로딩 중', subtitle: '정보를 불러오는 중입니다.', score: 0 },
                activeTabContent: null,
                PROBLEM_API_URL: null,
            };
        }

        const problem = problemBundleData.problem;
        const problemApiUrl = problemBundleData.problem_api?.url || 'API 정보 없음'; 

        // 1. 헤더 정보 (problem 데이터 그대로 사용)
        const headerInfo = {
            title: problem.title,
            subtitle: problem.sub_title, 
            score: problem.score,
        };

        // 2. 모든 탭 콘텐츠 정의 (백엔드 데이터 필드에 맞게 매핑)
        const tabContentsMap = {
            // description 탭: problem.description 필드 사용
            'description': {
                title: '챌린지 개요',
                content: problem.description, // 💡 백엔드 problem.description 사용
            },
            // goal 탭: problem.goal 필드 사용
            'goal': {
                title: '도전 목표',
                content: problem.goal, // 💡 백엔드 problem.goal 사용
            },
            // success 탭: problem.success_criteria 필드 사용
            'success': {
                title: '성공 조건',
                content: problem.success_criteria, // 💡 백엔드 problem.success_criteria 사용
            },
            // failure 탭: problem.failure_criteria 필드 사용
            'failure': {
                title: '실패 조건',
                content: problem.failure_criteria, // 💡 백엔드 problem.failure_criteria 사용
            },
        };

        // 3. 현재 탭 콘텐츠 및 디자인 속성 결합
        const currentTabDesign = TABS.find(tab => tab.id === activeTab);

        let currentTabContent = null;
        if (tabContentsMap[activeTab] && currentTabDesign) {
            currentTabContent = { 
                // TABS의 디자인 속성 (bgColor, borderColor 등)과
                ...currentTabDesign, 
                // 백엔드 데이터에서 가져온 title 및 content를 결합
                ...tabContentsMap[activeTab], 
            };
        }
        
        return { 
            CHALLENGE_HEADER_INFO: headerInfo, 
            activeTabContent: currentTabContent,
            PROBLEM_API_URL: problemApiUrl
        };
    }, [problemBundleData, activeTab]);

    // --------------------------------------------------------
    // 💡 5. 일반 핸들러 (유지)
    // --------------------------------------------------------
    const handleInputChange = e => setInputValue(e.target.value);

    const handleTabClick = (e, tabId) => {
        e.preventDefault();
        setActiveTab(tabId);
    };

    const handleSendMessage = () => {
        const trimmedInput = inputValue.trim();
        if (!trimmedInput || isSending) return; 

        const messageBody = { content: trimmedInput };
        
        sendMutate({ 
            sessionId, 
            messageBody: messageBody,
        });
        // 입력값 초기화는 onMutate에서 처리
    };

    // --------------------------------------------------------
    // 💡 6. 최종 로딩 상태 및 렌더링
    // --------------------------------------------------------
    // 챌린지 정보 패널의 로딩 상태는 메시지 로딩과 문제 번들 로딩 모두에 의존합니다.
    const isPanelLoading = isMessagesLoading || isProblemBundleLoading; 
    const isInputDisabled = isMessagesLoading || isSending || isJudging || isProblemBundleLoading; 

    return (
        <div className="flex w-full h-full gap-4 md:gap-6">
            {/* 1. 좌측 챌린지 정보 패널 */}
            <ChallengeInfoPanel
                TABS={TABS}
                activeTab={activeTab}
                activeTabContent={activeTabContent} // 💡 가공된 탭 콘텐츠 전달
                handleTabClick={handleTabClick}
                
                CHALLENGE_HEADER_INFO={CHALLENGE_HEADER_INFO} // 💡 가공된 헤더 정보 전달
                isLoading={isPanelLoading} 
                problemApiUrl={PROBLEM_API_URL} // 💡 가공된 API URL 전달
            />

            {/* 2. 중앙 AI 채팅 및 입력 영역 */}
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
            />

            {/* 3. 우측 시도 기록 패널 */}
            <AttemptHistoryPanel 
                PurpleDownIcon={PurpleDownIcon} 
                isLoading={isPanelLoading} 
            />

            {/* ========================================================== */}
            {/* 💡 4. 모달 조건부 렌더링 영역 */}
            {/* ========================================================== */}
            {isDebugModalOpen && <DebugModal />}
            {isResetModalOpen && <ResetModal />}
            {isSubmitModalOpen && <SubmitModal />}
            {isLoadingModalOpen && <LoadingModal />}
            {isFailedModalOpen && <FailedModal />}
            {isSuccessModalOpen && <SuccessModal />}
        </div>
    );
}