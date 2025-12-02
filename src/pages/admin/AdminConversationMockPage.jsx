// src/pages/AdminConversationReview/AdminConversationMockPage.jsx
import React, { useState } from "react";
import { useMockAdminData } from "@/hooks/useAdminConversationMock";

export default function AdminConversationMockPage() {
  const {
    users,
    getProblems,
    getSessions,
    getMessages,
    updateSessionJudge,
  } = useMockAdminData();

  const [userId, setUserId] = useState(null);
  const [problemId, setProblemId] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  const problems = userId ? getProblems(userId) : [];
  const sessions = problemId ? getSessions(problemId) : [];
  const messages = sessionId ? getMessages(sessionId) : [];

  const selectedSession = sessions.find((s) => s.id === sessionId);

  return (
    <div className="w-full p-10 text-white flex flex-col gap-6">

      <h1 className="text-3xl font-bold text-[#FF4854]">
        관리자 세션 / 판정 관리 페이지
      </h1>

      {/* ===== 상단 3패널 ===== */}
      <div className="grid grid-cols-3 gap-4 h-[55vh]">

        {/* 사용자 */}
        <Column title="사용자">
          {users.map((u) => (
            <Item
              key={u.id}
              label={u.username}
              active={userId === u.id}
              onClick={() => {
                setUserId(u.id);
                setProblemId(null);
                setSessionId(null);
              }}
            />
          ))}
        </Column>

        {/* 문제 */}
        <Column title="문제">
          {problems.length === 0 && <Empty>사용자를 선택하세요</Empty>}
          {problems.map((p) => (
            <Item
              key={p.id}
              label={p.title}
              active={problemId === p.id}
              onClick={() => {
                setProblemId(p.id);
                setSessionId(null);
              }}
            />
          ))}
        </Column>

        {/* 세션 */}
        <Column title="세션 목록">
          {sessions.length === 0 && <Empty>문제를 선택하세요</Empty>}
          {sessions.map((s) => (
            <Item
              key={s.id}
              label={`세션 #${s.id} (${s.judge})`}
              active={sessionId === s.id}
              onClick={() => setSessionId(s.id)}
            />
          ))}
        </Column>
      </div>

      {/* ===== 세션 전체 대화 ===== */}
      <div className="w-full bg-[#0B021C]/70 rounded-xl p-6 border border-white/10 h-[35vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-[#FF4854] mb-4">세션 전체 대화</h2>

        {!sessionId && <Empty>세션을 선택하세요</Empty>}

        <div className="flex flex-col gap-3">
          {messages.map((m) => (
            <ChatBubble key={m.id} msg={m} />
          ))}
        </div>
      </div>

      {/* ===== 세션 판정 ===== */}
      <div className="w-full bg-[#0B021C]/70 rounded-xl p-6 border border-white/20">
        <h2 className="text-xl font-bold text-[#FF4854] mb-4">세션 최종 판정</h2>

        {!selectedSession && <Empty>세션을 선택하세요</Empty>}

        {selectedSession && (
          <SessionJudgeEditor
            session={selectedSession}
            onSave={(value) => updateSessionJudge(selectedSession.id, value)}
          />
        )}
      </div>

    </div>
  );
}

/* ----------------------------------
   공통 UI 컴포넌트
---------------------------------- */

function Column({ title, children }) {
  return (
    <div className="flex flex-col bg-[#0B021C]/70 rounded-xl p-4 border border-white/10">
      <div className="font-bold text-white mb-3">{title}</div>
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}

function Item({ label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`p-2 rounded-lg cursor-pointer mb-2 border
      ${
        active
          ? "bg-[#FF4854] text-white border-[#FF4854]"
          : "bg-[#10050F]/50 text-gray-200 hover:bg-[#1A0B15] border-white/10"
      }`}
    >
      {label}
    </div>
  );
}

function Empty({ children }) {
  return <div className="text-gray-400 text-sm">{children}</div>;
}

/* ----------------------------------
   말풍선
---------------------------------- */
function ChatBubble({ msg }) {
  const isUser = msg.role === "user";

  return (
    <div
      className={`
        max-w-[85%] p-3 rounded-lg
        ${isUser ? "ml-auto bg-[#2A1620]" : "mr-auto bg-[#16202A]"}
      `}
    >
      <div className="text-xs opacity-60 mb-1">{msg.role}</div>
      <div className="whitespace-pre-wrap">{msg.content}</div>
    </div>
  );
}

/* ----------------------------------
   ⭐ Judge 결과 3패널 + 판정 UI
---------------------------------- */

function SessionJudgeEditor({ session, onSave }) {
  const [tempJudge, setTempJudge] = useState(session.judge);

  // ⭐ Mock judge 결과
  const judgeModels = [
    {
      id: 1,
      name: "Judge Model A",
      verdict: "success",
      reason: "핵심 플래그 검증 로직이 모두 충족되었습니다.",
    },
    {
      id: 2,
      name: "Judge Model B",
      verdict: "fail",
      reason: "입력된 요청이 목표 조건에 완전히 도달하지 못했습니다.",
    },
    {
      id: 3,
      name: "Judge Model C",
      verdict: "pending",
      reason: "추가 시도가 필요합니다. 충분한 증거가 부족합니다.",
    },
  ];

  return (
    <div className="flex flex-col gap-6">

      {/* ⭐⭐⭐ Judge 모델 결과 패널 3개 */}
      <div className="grid grid-cols-3 gap-4 h-[30vh]">
        {judgeModels.map((jm) => (
          <div
            key={jm.id}
            className="flex flex-col bg-[#0B021C]/70 rounded-xl p-4 border border-white/10"
          >
            <div className="font-bold text-[#FF4854] text-lg mb-2">
              {jm.name}
            </div>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm opacity-70">판단:</span>
              <span
                className={`px-3 py-1 rounded-full text-white text-sm ${
                  jm.verdict === "success"
                    ? "bg-green-600"
                    : jm.verdict === "fail"
                    ? "bg-red-600"
                    : "bg-gray-600"
                }`}
              >
                {jm.verdict}
              </span>
            </div>

            <div className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
              {jm.reason}
            </div>
          </div>
        ))}
      </div>

      {/* 현재 판정 표시 */}
      <div className="text-lg font-bold flex items-center">
        현재 판정 :
        <span
          className={`
            ml-3 px-3 py-1 rounded-full
            ${
              session.judge === "success"
                ? "bg-green-600"
                : session.judge === "fail"
                ? "bg-red-600"
                : "bg-gray-600"
            }
          `}
        >
          {session.judge}
        </span>
      </div>

      {/* 판정 선택 */}
      <div className="flex gap-3">
        {["pending", "success", "fail"].map((st) => (
          <button
            key={st}
            onClick={() => setTempJudge(st)}
            className={`
              px-4 py-2 rounded-full text-sm border font-semibold
              ${
                tempJudge === st
                  ? "bg-[#FF4854] border-[#FF4854] text-white"
                  : "border-white/20 text-white hover:bg-white/10"
              }
            `}
          >
            {st}
          </button>
        ))}
      </div>

      {/* 저장 버튼 */}
      <button
        onClick={() => onSave(tempJudge)}
        className="
          w-40 px-4 py-2 rounded-lg text-white font-bold
          bg-[#FF4854] hover:bg-[#ff3242] transition
        "
      >
        판정 수정하기
      </button>
    </div>
  );
}
