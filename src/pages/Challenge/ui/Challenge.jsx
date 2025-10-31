// /src/pages/Challenge/Challenge.jsx

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { TABS, CHALLENGE_HEADER_INFO } from '../data/challengeData';

// 💡 React Query 훅 임포트
import { useSendMessage } from '@/hooks/useChatMutation'; 
import { useChatMessages } from '@/hooks/useChatQuery'; 

// 💡 모달/세션 스토어 임포트
import useModalStore from '@/stores/useModalStore';
import useChatSessionStore from '@/stores/useChatSessionStore'; // 💡 세션 스토어
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

// 💡 prop 제거! ChallengePage에서 prop을 전달하지 않습니다.
export default function Challenge() { 
    
    // 💡 0-1. Zustand 스토어에서 sessionId 가져오기
    const sessionId = useChatSessionStore(state => state.sessionId);

    // --------------------------------------------------------
    // 💡 0-2. API 훅 사용 (React Query)
    // --------------------------------------------------------
    // 1. 초기 메시지 목록 조회 (GET /messages)
    const { 
        data: initialMessages, 
        isLoading: isMessagesLoading, 
        isError: isMessagesError, 
        refetch: refetchMessages 
    } = useChatMessages(sessionId); // 💡 스토어에서 가져온 sessionId 사용

    // 2. 메시지 전송 Mutation (POST /send)
    const { 
        mutate: sendMutate, 
        isPending: isSending, 
    } = useSendMessage();

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

    // --------------------------------------------------------
    // 💡 1-1. 초기 메시지 로드 및 상태 초기화
    // --------------------------------------------------------
    useEffect(() => {
        if (!isMessagesLoading && !isMessagesError && initialMessages) {
            setChatMessages(initialMessages); 
            console.log(`✅ [Chat] 초기 메시지 로드 완료.`);
        }
    }, [isMessagesLoading, isMessagesError, initialMessages]);

    // --------------------------------------------------------
    // 💡 2. 초기화/제출 로직 (useCallback 적용)
    // --------------------------------------------------------
    // ResetModal에서 호출될 실제 초기화 로직
    const handleResetChat = useCallback(() => {
        // ⚠️ TODO: 채팅 리셋 API 호출 로직 추가 (선택 사항)
        setChatMessages([]);
        console.log('대화 내용이 Challenge.jsx에서 실제로 초기화되었습니다.');
    }, []);

    // SubmitModal에서 호출될 실제 비동기 제출 로직 (현재는 시뮬레이션)
    const handleSubmit = useCallback(async () => {
        console.log('챌린지 제출 로직 실행됨. (3초 로딩 시뮬레이션 시작)');
        
        // 1. 비동기 작업 시뮬레이션 (3초 대기)
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // 2. 로딩 모달 닫기
        closeLoadingModal();

        // 3. 💡 3개 AI 모델의 무작위 성공/실패 결과 생성
        const results = [];
        let successCount = 0;
        const totalModels = 3;

        for (let i = 0; i < totalModels; i++) {
            const isSuccess = Math.random() < 0.5;
            const status = isSuccess ? 'success' : 'failed';
            if (isSuccess) successCount++;
            const data = isSuccess ? successPanelsData[i] : failedPanelsData[i];
            results.push({
                status,
                data: {
                    ...data,
                    isFirstPanel: data.isFirstPanel,
                },
            });
        }
        
        // 4. 💡 챌린지 결과 스토어에 저장
        setChallengeResults(results);

        // 5. 💡 성공 모델 수에 따라 최종 모달 결정
        if (successCount >= 2) {
            console.log(`챌린지 최종 결과: 성공! (${successCount}/${totalModels} 성공)`);
            openSuccessModal();
        } else {
            console.log(`챌린지 최종 결과: 실패! (${successCount}/${totalModels} 성공)`);
            openFailedModal();
        }
    }, [closeLoadingModal, openFailedModal, openSuccessModal, setChallengeResults]);

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
    // 💡 4. 일반 핸들러 (handleSendMessage API 통합)
    // --------------------------------------------------------
    useEffect(() => {
        if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    const handleInputChange = e => setInputValue(e.target.value);

    const handleTabClick = (e, tabId) => {
        e.preventDefault();
        setActiveTab(tabId);
    };

    const handleSendMessage = () => {
        const trimmedInput = inputValue.trim();
        // isSending 상태를 사용하여 전송 중 중복 클릭 방지
        if (!trimmedInput || isSending) return; 

        // 1. 사용자 메시지를 먼저 채팅창에 즉시 반영 (낙관적 업데이트)
        const userMessage = { id: Date.now(), sender: 'user', content: trimmedInput, role: 'user' };
        setChatMessages(prev => [...prev, userMessage]); 
        const inputBeforeClear = inputValue; 
        setInputValue(''); 

        // 2. API 전송 (sendMutate 실행)
        sendMutate({ sessionId, message: trimmedInput }, { // 💡 스토어에서 가져온 sessionId 사용
            onSuccess: () => {
                // ✅ 성공 시, 서버에서 최신 메시지 목록을 다시 가져와 상태를 동기화
                console.log('✅ AI 응답 성공. 메시지 목록 재조회 시작.');
                refetchMessages(); 
            },
            onError: (err) => {
                // ❌ 502 Bad Gateway 발생 시 에러 메시지 표시
                console.error('❌ 메시지 전송 실패:', err);
                const errorMessage = { id: Date.now() + 1, sender: 'system', content: `메시지 전송 실패 (502 예상): ${err.message}`, role: 'system' };
                
                // 실패 시, 낙관적 업데이트 메시지 제거 후 에러 메시지 추가
                setChatMessages(prev => [...prev.slice(0, prev.length - 1), errorMessage]); 
                setInputValue(inputBeforeClear); 
            }
        });
    };
    
    // --------------------------------------------------------
    // 💡 5. 최종 로딩 상태 및 렌더링 수정
    // --------------------------------------------------------
    const isOverallLoading = isMessagesLoading || isSending; 

    return (
        <div className="flex w-full h-full gap-4 md:gap-6">
            {/* 1. 좌측 챌린지 정보 패널 */}
            <ChallengeInfoPanel
                TABS={TABS}
                activeTab={activeTab}
                activeTabContent={activeTabContent}
                handleTabClick={handleTabClick}
                CHALLENGE_HEADER_INFO={CHALLENGE_HEADER_INFO}
                isLoading={isOverallLoading} 
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
                inputDisabled={isOverallLoading} 
            />

            {/* 3. 우측 시도 기록 패널 */}
            <AttemptHistoryPanel 
                PurpleDownIcon={PurpleDownIcon} 
                isLoading={isOverallLoading} 
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