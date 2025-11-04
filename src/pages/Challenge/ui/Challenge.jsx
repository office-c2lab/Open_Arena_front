// src/features/Challenge/ui/Challenge.jsx (최종 - teamId 적용 및 낙관적 업데이트)

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { TABS, CHALLENGE_HEADER_INFO } from '../data/challengeData';

// 💡 React Query 훅 임포트
import { useSendMessage } from '@/hooks/useChatMutation'; 
import { useChatMessages } from '@/hooks/useChatQuery'; 
import { useJudgeMutation } from '@/hooks/useJudgeMutation'; 
import { useQueryClient } from '@tanstack/react-query'; 

// 💡 모달/세션/인증 스토어 임포트
import useModalStore from '@/stores/useModalStore';
import useChatSessionStore from '@/stores/useChatSessionStore'; 
import { useAuthStore } from '@/stores/authStore'; // 💡 useAuthStore 임포트
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
    
    // 💡 [핵심] useAuthStore에서 팀 ID 가져오기
    const currentTeamId = useAuthStore(state => state.teamInfo?.team_id) || 1; 

    // 0-1. Zustand 스토어에서 sessionId 가져오기
    const sessionId = useChatSessionStore(state => state.sessionId);

    // --------------------------------------------------------
    // 💡 0-2. API 훅 사용 (React Query)
    // --------------------------------------------------------
    // 1. 메시지 목록 조회
    const { 
        data: fetchedMessages = [],
        isLoading: isMessagesLoading, 
        isError: isMessagesError, 
    } = useChatMessages(sessionId); 

    // 2. 메시지 전송 Mutation (낙관적 업데이트 포함)
    const { 
        mutate: sendMutate, 
        isPending: isSending, 
    } = useSendMessage(sessionId, {
        // 🚀 낙관적 업데이트: 사용자 메시지를 즉시 화면에 표시
        onMutate: async ({ messageBody }) => {
            await queryClient.cancelQueries({ queryKey: ['chatMessages', sessionId] }); 
            
            const userMessage = { id: Date.now(), role: 'user', content: messageBody.content };
            
            setChatMessages((prev) => [...prev, userMessage]);
            setInputValue(''); 

            return { userMessageId: userMessage.id };
        },
        // 🚀 전송 실패 시 롤백
        onError: (err, variables, context) => { 
            console.error('❌ 메시지 전송 실패 (롤백):', err);
            
            // 롤백: 낙관적 업데이트로 추가했던 메시지 제거
            setChatMessages((prev) => prev.filter(msg => msg.id !== context.userMessageId));
            
            // 에러 메시지 추가 (선택적)
            const errorMessage = { 
                id: Date.now() + 1, 
                role: 'assistant', 
                content: `⚠️ 전송 실패: ${err.message}`, 
            };
            setChatMessages((prev) => [...prev, errorMessage]);
        },
        onSettled: () => {
            // 전송 성공/실패와 관계없이 스크롤 이동
            if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    });
 
    // 3. Judge Mutation 
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
    const activeTabContent = TABS.find(tab => tab.id === activeTab);

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
            team_id: currentTeamId, // 🚀 [핵심] currentTeamId 적용
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
    // 💡 3. 컴포넌트 마운트 시 초기화/제출 로직을 스토어에 등록
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
    // 💡 4. 일반 핸들러
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
    // 💡 5. 최종 로딩 상태 및 렌더링
    // --------------------------------------------------------
    const isPanelLoading = isMessagesLoading; 
    const isInputDisabled = isMessagesLoading || isSending || isJudging; 

    return (
        <div className="flex w-full h-full gap-4 md:gap-6">
            {/* 1. 좌측 챌린지 정보 패널 */}
            <ChallengeInfoPanel
                TABS={TABS}
                activeTab={activeTab}
                activeTabContent={activeTabContent}
                handleTabClick={handleTabClick}
                CHALLENGE_HEADER_INFO={CHALLENGE_HEADER_INFO}
                isLoading={isPanelLoading} 
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