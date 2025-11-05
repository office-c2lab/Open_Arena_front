import React, { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import {
  useCreateSession,
  useSendMessage,
  useSessionMessages,
} from '@/hooks/useChat';

const FALLBACK_TEAM_ID = 1;
const DEFAULT_PROBLEM_ID = 1;

export default function ChatTester() {
  const loggedInTeamId = useAuthStore((state) => state.teamInfo?.id);
  const [teamId, setTeamId] = useState(loggedInTeamId ?? FALLBACK_TEAM_ID);
  const [problemId, setProblemId] = useState(DEFAULT_PROBLEM_ID);
  const [sessionTitle, setSessionTitle] = useState('New Test Session');
  const [sessionId, setSessionId] = useState(null);
  const [messageContent, setMessageContent] = useState('');

  // 세션 생성
  const createSessionMutation = useCreateSession((data) => {
    setSessionId(data.id);
    setTeamId(data.team_id);
    setProblemId(data.problem_id);
  });

  // 메시지 전송
  const sendMessageMutation = useSendMessage(sessionId, (newSessionId) =>
    setSessionId(newSessionId)
  );

  // 메시지 조회
  const { data: messages, isLoading, error } = useSessionMessages(sessionId, {
    team_id: teamId,
    problem_id: problemId,
  });

  // 핸들러
  const handleCreateSession = () => {
    createSessionMutation.mutate({
      team_id: teamId,
      problem_id: problemId,
      title: sessionTitle,
    });
  };

  const handleSendMessage = () => {
    if (!messageContent.trim()) {
      alert('메시지 내용을 입력해주세요.');
      return;
    }
    const sessionIdToSend = sessionId ?? 0;
    sendMessageMutation.mutate({
      content: messageContent,
      session_id: sessionIdToSend,
      team_id: teamId,
      problem_id: problemId,
    });
    setMessageContent('');
  };

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px', fontFamily: 'sans-serif' }}>
      {/* 세션 생성 */}
      <fieldset style={{ width: 300, border: '1px solid #ccc', padding: 15 }}>
        <legend style={{ fontWeight: 'bold' }}>1. 세션 생성</legend>
        <label>팀 ID: <input value={teamId} onChange={(e) => setTeamId(Number(e.target.value))} /></label>
        <label>문제 ID: <input value={problemId} onChange={(e) => setProblemId(Number(e.target.value))} /></label>
        <label>제목: <input value={sessionTitle} onChange={(e) => setSessionTitle(e.target.value)} /></label>
        <button onClick={handleCreateSession} disabled={createSessionMutation.isPending}>
          {createSessionMutation.isPending ? '생성 중...' : '세션 생성'}
        </button>
      </fieldset>

      {/* 메시지 전송 */}
      <fieldset style={{ width: 400, border: '1px solid #ccc', padding: 15 }}>
        <legend style={{ fontWeight: 'bold' }}>2. 메시지 전송</legend>
        <p>Session ID: {sessionId ?? '없음 (0으로 새로 생성)'}</p>
        <textarea
          rows={3}
          style={{ width: '100%', marginTop: 5 }}
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
        />
        <button
          onClick={handleSendMessage}
          disabled={sendMessageMutation.isPending || !messageContent.trim()}
        >
          {sendMessageMutation.isPending ? '전송 중...' : '전송'}
        </button>
      </fieldset>

      {/* 메시지 조회 */}
      <fieldset style={{ flex: 1, border: '1px solid #ccc', padding: 15 }}>
        <legend style={{ fontWeight: 'bold' }}>3. 메시지 조회</legend>
        {isLoading && <p>로딩 중...</p>}
        {error && <p style={{ color: 'red' }}>에러: {error.message}</p>}
        {messages && (
          <div>
            <h4>대화 내용</h4>
            {messages.messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  textAlign: msg.role === 'user' ? 'right' : 'left',
                  background: msg.role === 'user' ? '#e1f5fe' : '#f0f0f0',
                  padding: 6,
                  margin: '6px 0',
                  borderRadius: 6,
                }}
              >
                <strong>{msg.role === 'user' ? '🧑 사용자' : '🤖 AI'}</strong>
                <p style={{ margin: 0 }}>{msg.content}</p>
              </div>
            ))}
          </div>
        )}
      </fieldset>
    </div>
  );
}
