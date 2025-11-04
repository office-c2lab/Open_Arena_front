// src/pages/ChatTest/ChatTestPage.jsx

import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createChatSession, getSessionMessages, sendMessage } from '@/api/chat';
import { useAuthStore } from '@/stores/authStore'; 

// 세션 생성에 필요한 초기 데이터 (임시값)
const INITIAL_SESSION_DATA = {
    problem_id: 1, 
    title: "새로운 채팅 세션",
};


export default function ChatTestPage() {
    const queryClient = useQueryClient();
    // Zustand에서 팀 ID를 가져옵니다.
    const { teamInfo } = useAuthStore(); 
    const team_id = teamInfo?.id;
    
    // 1. 상태 관리
    const [sessionId, setSessionId] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [messages, setMessages] = useState([]); // 메시지 목록 (낙관적 업데이트 및 챗봇 응답 포함)
    const messagesEndRef = useRef(null); 

    // 스크롤을 항상 가장 아래로 이동
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // 2. React Query: 세션 생성 Mutation
    const createSessionMutation = useMutation({
        mutationFn: createChatSession,
        onSuccess: (data) => {
            console.log("세션 생성 성공:", data);
            setSessionId(data.id); 
            alert(`세션 ID ${data.id} 생성 완료!`);
        },
        onError: (error) => {
            console.error("세션 생성 실패:", error);
            alert("세션 생성에 실패했습니다. 로그인 상태와 서버 상태를 확인하세요.");
        }
    });

    // 3. React Query: 메시지 조회 Query (세션 ID가 있을 때만 실행)
    const { 
        data: fetchedMessages = [], 
        isLoading: isMessagesLoading,
        isFetching: isMessagesFetching,
    } = useQuery({
        queryKey: ['chatMessages', sessionId], 
        queryFn: () => getSessionMessages(sessionId),
        enabled: !!sessionId, 
        refetchInterval: 5000, // 5초마다 자동 업데이트 (실제 환경에서는 웹소켓으로 대체 권장)
    });
    
    // 💡 패치된 메시지를 로컬 상태(messages)에 동기화
    useEffect(() => {
        // 이미 로컬 상태에 새로운 메시지가 있다면 (낙관적 업데이트 중이라면) 덮어쓰지 않도록 조정 필요
        if (fetchedMessages.length > 0) {
            setMessages(fetchedMessages);
            scrollToBottom();
        }
    }, [fetchedMessages]);
    
    // 4. React Query: 메시지 전송 Mutation
    const sendMessageMutation = useMutation({
        mutationFn: sendMessage,
        onMutate: async ({ sessionId, messageBody }) => {
            // 💡 낙관적 업데이트: 사용자 메시지를 즉시 화면에 표시
            const userMessage = { 
                id: Date.now(), // 임시 ID
                session_id: sessionId, 
                role: 'user', 
                content: messageBody.content, 
            };
            setMessages((prev) => [...prev, userMessage]);
            setMessageInput(''); 
            scrollToBottom();
            // 롤백을 위해 임시 메시지 ID를 반환
            return { userMessageId: userMessage.id };
        },
        onSuccess: (responseObject) => { // 👈 응답이 객체임
            console.log("메시지 전송 성공 (프록시 응답):", responseObject);
            
            // 💡 오류 수정 반영: 응답 객체에서 'assistant_content' 필드의 문자열만 추출
            const assistantContent = responseObject.assistant_content || '응답을 받지 못했습니다.';

            // 💡 서버로부터의 응답 메시지 (assistant)를 로컬 상태에 추가
            const assistantMessage = {
                id: Date.now() + 1,
                session_id: sessionId,
                role: 'assistant',
                content: assistantContent, 
            };
            setMessages((prev) => [...prev, assistantMessage]);
            
            // 💡 메시지 목록 쿼리 무효화: 백그라운드에서 최신 목록을 다시 가져옴
            queryClient.invalidateQueries({ queryKey: ['chatMessages', sessionId] });
        },
        onError: (error, variables, context) => {
            console.error("메시지 전송 실패:", error);
            alert("메시지 전송에 실패했습니다.");
            
            // 롤백: 낙관적 업데이트로 추가했던 메시지 제거
            setMessages((prev) => prev.filter(msg => msg.id !== context.userMessageId)); 
        },
        onSettled: () => {
            scrollToBottom(); 
        }
    });

    // 5. 핸들러 함수
    const handleCreateSession = () => {
        if (!team_id) {
            alert("로그인 정보(팀 ID)가 없어 세션을 만들 수 없습니다.");
            return;
        }
        createSessionMutation.mutate({ team_id, ...INITIAL_SESSION_DATA });
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!sessionId || !messageInput.trim()) return;

        // **주의: 실제 API에 맞게 스키마 조정 필요**
        const messageBody = { 
            content: messageInput, // 사용자 입력 메시지
            // API가 다른 필드를 요구하면 여기에 추가합니다.
        }; 

        sendMessageMutation.mutate({ sessionId, messageBody });
    };

    // 6. 로딩 상태
    const isSending = sendMessageMutation.isPending;


    return (
        <div className="flex flex-col h-screen p-4 bg-gray-50">
            <h1 className="text-3xl font-bold mb-4 text-center">🤖 채팅 테스트 페이지</h1>
            
            <div className="mb-4 flex gap-2">
                <button 
                    onClick={handleCreateSession}
                    disabled={createSessionMutation.isPending || !!sessionId || !team_id}
                    className="p-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
                >
                    {createSessionMutation.isPending ? '세션 생성 중...' : (sessionId ? `세션 ID: ${sessionId} (생성됨)` : '새 세션 생성')}
                </button>
            </div>

            {/* 채팅창 영역 */}
            <div className="flex-grow overflow-y-auto border border-gray-300 p-4 bg-white rounded-lg mb-4">
                {isMessagesLoading && sessionId && <div className="text-center text-gray-500">메시지 로딩 중...</div>}
                
                {!sessionId && <div className="text-center text-gray-500">세션을 생성해 주세요.</div>}
                
                {sessionId && messages.length === 0 && !isMessagesLoading && !isMessagesFetching && (
                    <div className="text-center text-gray-500">아직 메시지가 없습니다.</div>
                )}
                
                {messages.map((msg) => (
                    <div key={msg.id} className={`mb-2 p-2 rounded-lg max-w-[80%] ${msg.role === 'user' ? 'bg-green-100 ml-auto' : 'bg-gray-100 mr-auto'}`}>
                        <span className="font-bold">{msg.role === 'user' ? '나' : '챗봇'}:</span> {msg.content}
                    </div>
                ))}
                
                {/* 챗봇 응답 대기 시 */}
                {isSending && (
                    <div className={`mb-2 p-2 rounded-lg max-w-[80%] bg-gray-100 mr-auto opacity-70`}>
                        <span className="font-bold">챗봇:</span> 응답 대기 중...
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* 메시지 입력 폼 */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    disabled={!sessionId || isSending}
                    placeholder={sessionId ? "메시지를 입력하세요." : "세션을 먼저 생성해 주세요."}
                    className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                    type="submit"
                    disabled={!sessionId || isSending || !messageInput.trim()}
                    className="p-3 bg-red-500 text-white rounded-lg font-bold disabled:bg-gray-400"
                >
                    {isSending ? '전송 중...' : '전송'}
                </button>
            </form>
        </div>
    );
}