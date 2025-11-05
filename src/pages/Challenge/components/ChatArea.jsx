import React, { useState, useEffect, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ChatBubble from './ChatBubble';
import useModalStore from '@/stores/useModalStore';
import { sendMessage, createSession, getSessionMessages } from '@/api/chatApi';
import { useSessionStore } from '@/stores/useSessionStore'; 

function SessionCard({ session, isActive, onClick }) {
  return (
    <div
      onClick={() => onClick(session.id)}
      className={`p-3 rounded-lg cursor-pointer border ${isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'} mb-2`}
    >
      <p className="font-bold">{session.title}</p>
      <p className="text-sm text-gray-500">{new Date(session.created_at).toLocaleString()}</p>
    </div>
  );
}

export default function ChatArea({ ArenaIcon, SendIcon, ResetIcon, inputDisabled, problemId, teamId, sessions = [] }) {
  const queryClient = useQueryClient();
  const { openResetModal, openSubmitModal } = useModalStore();
  const { sessionId, setSessionId } = useSessionStore();
  
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef(null);

  // ----------------------------
  // 1️⃣ 세션 메시지 조회
  // ----------------------------
  const { data: messages = [], isLoading: isMessagesLoading } = useQuery({
    queryKey: ['chatMessages', sessionId, teamId, problemId],
    queryFn: async () => {
      if (!sessionId) return [];
      const res = await getSessionMessages({ sessionId, teamId, problemId });
      return Array.isArray(res?.messages) ? res.messages : [];
    },
    enabled: !!sessionId,
  });

  // ----------------------------
  // 2️⃣ 세션 생성
  // ----------------------------
  const createSessionMutation = useMutation({
    mutationFn: (title) => createSession({ teamId, problemId, title }),
    onSuccess: (data) => {
      const newSessionId = data?.id ?? data;
      if (newSessionId) {
        setSessionId(newSessionId);
        queryClient.invalidateQueries({ queryKey: ['chatMessages', newSessionId] });
      }
    },
  });

  const handleCreateSession = () => createSessionMutation.mutate('새로운 채팅 세션');

  // ----------------------------
  // 3️⃣ 메시지 전송
  // ----------------------------
  const sendMessageMutation = useMutation({
    mutationFn: (content) => sendMessage({ sessionId, teamId, problemId, content }),
    onMutate: async (content) => {
      const trimmed = content.trim();
      if (!trimmed || !sessionId) return;

      const queryKey = ['chatMessages', sessionId, teamId, problemId];
      await queryClient.cancelQueries({ queryKey });
      const previousMessages = queryClient.getQueryData(queryKey);

      const userMessage = { id: `u-${Date.now()}`, role: 'user', content: trimmed, timestamp: Date.now() };
      const aiLoadingMessage = { id: `a-${Date.now()}`, role: 'assistant', content: 'AI가 응답을 생성 중입니다...', isTyping: true, timestamp: Date.now() + 1 };

      queryClient.setQueryData(queryKey, (old) => [...(Array.isArray(old) ? old : []), userMessage, aiLoadingMessage]);
      setInputValue('');

      return { previousMessages, aiLoadingMessageId: aiLoadingMessage.id };
    },
    onSuccess: (res, variables, context) => {
      const aiContent = res.assistant_content || 'AI 응답 없음';
      const aiLoadingMessageId = context.aiLoadingMessageId;

      queryClient.setQueryData(['chatMessages', sessionId, teamId, problemId], (old) =>
        (Array.isArray(old) ? old : []).map((msg) =>
          msg.id === aiLoadingMessageId ? { ...msg, content: aiContent, isTyping: false, timestamp: Date.now() } : msg
        )
      );
    },
  });

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || !sessionId || sendMessageMutation.isPending) return;
    sendMessageMutation.mutate(trimmed);
  };

  // ----------------------------
  // 4️⃣ 세션 카드 클릭
  // ----------------------------
  const handleSessionClick = (newSessionId) => {
    if (newSessionId === sessionId) return;
    setSessionId(newSessionId);
    queryClient.invalidateQueries({ queryKey: ['chatMessages', newSessionId, teamId, problemId] });
  };

  // ----------------------------
  // 5️⃣ 자동 스크롤
  // ----------------------------
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const displayMessages = Array.isArray(messages) ? messages : [];
  const isAiTyping = displayMessages.some((msg) => msg.isTyping);
  const isChatAreaDisabled = inputDisabled || !sessionId || sendMessageMutation.isPending || isAiTyping || createSessionMutation.isPending;
  const isInitialState = !sessionId && displayMessages.length === 0 && !createSessionMutation.isPending;

  return (
    <div className="flex flex-col flex-grow h-full">
      {/* 세션 카드 목록 */}
      {sessions.length > 0 && (
        <div className="p-4 flex flex-col max-h-[200px] overflow-y-auto">
          {sessions.map((s) => (
            <SessionCard key={s.id} session={s} isActive={s.id === sessionId} onClick={handleSessionClick} />
          ))}
        </div>
      )}

      <div className="flex-1 bg-white shadow-xl rounded-[20px] flex flex-col overflow-hidden h-full">
        <div className="flex-1 p-6 relative overflow-hidden">
          {isInitialState ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <img src={ArenaIcon} alt="ARENA Logo" className="max-w-[246px] max-h-[361px] w-[40vw] h-[40vh] object-contain mb-4" />
              <p className="heading-3 font-300 text-[#000000] mt-4 mb-6">
                AI와 대화를 시작하세요. <br /> 아래 버튼을 눌러 **새로운 세션**을 생성하세요.
              </p>
              <button
                onClick={handleCreateSession}
                disabled={createSessionMutation.isPending}
                className={`bg-blue-600 text-white px-6 py-3 rounded-full font-bold transition-opacity ${createSessionMutation.isPending ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
              >
                {createSessionMutation.isPending ? '세션 생성 중...' : '💡 새 세션 생성'}
              </button>
            </div>
          ) : (
            <>
              <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                <img src={ArenaIcon} alt="ARENA Logo" className="max-w-[246px] max-h-[361px] w-[40vw] h-[40vh] object-contain opacity-30" />
              </div>
              <div className="relative z-10 pt-4 h-full overflow-y-auto">
                {isMessagesLoading ? (
                  <div className="text-center p-4 text-gray-500">메시지를 불러오는 중...</div>
                ) : (
                  displayMessages.map((msg) => (
                    <ChatBubble key={msg.id || `${msg.role}-${msg.timestamp}`} role={msg.role} content={msg.content} isTyping={msg.isTyping || false} />
                  ))
                )}
                <div ref={chatEndRef} />
              </div>
            </>
          )}
        </div>

        {/* Input & Action Area */}
        <div className="h-[210px] md:h-[237px] p-4 md:p-6 bg-purple-50/20 shadow-[0px_-3px_10px_rgba(0,0,0,0.25)] rounded-b-[20px] flex flex-col justify-end gap-3 flex-shrink-0">
          <div className="w-full h-[130px] md:h-[153px] bg-white shadow-[0px_0px_4px_rgba(0,0,0,0.25)] rounded-[20px] p-3 md:p-4 flex items-start relative">
            <textarea
              className="w-full h-full resize-none focus:outline-none body-large text-[#6B6B6B] pr-12 overflow-y-auto"
              placeholder={isChatAreaDisabled ? '세션이 없거나 전송 중입니다.' : '프롬프트를 입력하세요 (Shift + Enter로 줄바꿈)'}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); handleSend(); } }}
              disabled={isChatAreaDisabled}
            />
            <button
              className={`flex-shrink-0 w-10 h-10 ${inputValue.trim() ? 'bg-[#FF6289] cursor-pointer hover:bg-[#e6597c]' : 'bg-[#D9DADB]'} rounded-full flex justify-center items-center absolute right-4 bottom-4 transition-colors duration-200 ${isChatAreaDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!inputValue.trim() || isChatAreaDisabled}
              onClick={handleSend}
            >
              <img src={SendIcon} alt="Send" className="w-5 h-5" />
            </button>
          </div>

          <div className="flex justify-between flex-shrink-0 gap-16">
            <button
              className={`flex items-center justify-center flex-1 h-[44px] bg-[#D9DADB] rounded-lg gap-2 cursor-pointer transition-opacity ${isChatAreaDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#BFC0C4]'}`}
              onClick={() => {
                useSessionStore.getState().clearSession();
                queryClient.removeQueries({ queryKey: ['chatMessages'] });
                openResetModal();
              }}
              disabled={isChatAreaDisabled}
            >
              <img src={ResetIcon} alt="Reset" className="w-4 h-4" />
              <span className="heading-3 font-700 text-[#515151] leading-[26px]">대화 내용 초기화</span>
            </button>

            <button
              className={`flex-1 h-[44px] bg-[#FF6289] rounded-lg flex justify-center items-center cursor-pointer transition-opacity ${isChatAreaDisabled || !sessionId ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#e6597c]'}`}
              onClick={openSubmitModal}
              disabled={isChatAreaDisabled || !sessionId}
            >
              <span className="heading-3 font-700 text-white leading-[26px]">제출하기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
