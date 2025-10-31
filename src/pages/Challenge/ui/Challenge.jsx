// /src/pages/Challenge/Challenge.jsx (수정 전체 코드)

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { TABS, CHALLENGE_HEADER_INFO } from '../data/challengeData';

// 💡 React Query 훅 임포트
import { useSendMessage } from '@/hooks/useChatMutation'; 
import { useChatMessages } from '@/hooks/useChatQuery'; 
import { useJudgeMutation } from '@/hooks/useJudgeMutation'; // 💡 [추가] Judge 훅 임포트

// 💡 모달/세션 스토어 임포트
import useModalStore from '@/stores/useModalStore';
import useChatSessionStore from '@/stores/useChatSessionStore'; 
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

// 💡 [추가] API 호출에 필요한 ID 정의 (요청하신 대로 1로 설정)
const PROBLEM_ID = 1; 
const TEAM_ID = 1;    

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
 } = useChatMessages(sessionId); 

 // 2. 메시지 전송 Mutation (POST /send)
 const { 
  mutate: sendMutate, 
  isPending: isSending, 
 } = useSendMessage();
  
  // 3. Judge Mutation (POST /judge)
 const { 
  mutate: judgeMutate, 
  isPending: isJudging, // 💡 [추가] 심사 중 상태
 } = useJudgeMutation(); // 💡 [추가] Judge 훅 사용

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
  console.log('--- [Challenge.jsx] 로드된 메시지 목록 ---');
  console.log(initialMessages); 
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

 // SubmitModal에서 호출될 실제 비동기 제출 로직 (API 연동으로 대체)
 const handleSubmit = useCallback(() => {
  console.log('챌린지 제출 로직 실행됨. /judge API 호출 시작');
  
  // 1. judgeMutate 실행
  judgeMutate({ 
   problem_id: PROBLEM_ID, 
   team_id: TEAM_ID, 
   session_id: sessionId 
  }, {
   onSuccess: (data) => {
    console.log('✅ Judge API 응답 성공:', data);

    // 2. 로딩 모달 닫기
    closeLoadingModal();

    // 3. 응답 데이터(data.votes)를 기반으로 결과 패널 데이터 생성
    const results = data.votes.map((vote, index) => {
     const isSuccess = vote.verdict === 'success';
     // 임시로 기존 시뮬레이션 데이터 구조를 사용 (실제는 vote의 raw_summary 사용)
     const baseData = isSuccess ? successPanelsData[index % successPanelsData.length] : failedPanelsData[index % failedPanelsData.length];
     return {
      status: vote.verdict, 
      data: { 
       ...baseData,
       title: vote.model, // 모델명 사용
       content: vote.raw_summary || baseData.content, // 상세 요약 사용
      },
     };
    });
    setChallengeResults(results);

    // 4. 최종 결과에 따른 모달 결정
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
 }, [sessionId, closeLoadingModal, openFailedModal, openSuccessModal, setChallengeResults, judgeMutate]);


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
  if (!trimmedInput || isSending) return; 

  // 1. 사용자 메시지를 먼저 채팅창에 즉시 반영 (낙관적 업데이트)
  const userMessage = { id: Date.now(), sender: 'user', content: trimmedInput, role: 'user' };
  setChatMessages(prev => [...prev, userMessage]); 
  const inputBeforeClear = inputValue; 
  setInputValue(''); 

  // 2. API 전송 (sendMutate 실행)
  sendMutate({ sessionId, message: trimmedInput }, { 
   onSuccess: () => {
    console.log('✅ AI 응답 성공. 메시지 목록 재조회 시작.');
    refetchMessages(); 
   },
   onError: (err) => {
    console.error('❌ 메시지 전송 실패:', err);
    const errorMessage = { id: Date.now() + 1, sender: 'system', content: `메시지 전송 실패: ${err.message}`, role: 'system' };
    
    setChatMessages(prev => [...prev.slice(0, prev.length - 1), errorMessage]); 
    setInputValue(inputBeforeClear); 
   }
  });
 };
 
 // --------------------------------------------------------
 // 💡 5. 최종 로딩 상태 및 렌더링 수정 (로딩 분리 적용)
 // --------------------------------------------------------
 // ✅ 1. 양옆 패널 로딩: 초기 메시지 로드 (isMessagesLoading) 시에만 로딩 상태
 const isPanelLoading = isMessagesLoading; 

 // ✅ 2. 입력창 비활성화: 초기 로딩 중이거나 (isMessagesLoading), 메시지 전송 중일 때 (isSending), 심사 중일 때 (isJudging)
 const isInputDisabled = isMessagesLoading || isSending || isJudging; // 💡 isJudging 추가!

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
  inputDisabled={isInputDisabled} // 💡 isJudging 상태를 포함
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