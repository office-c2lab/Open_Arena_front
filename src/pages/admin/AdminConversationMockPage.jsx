// src/pages/AdminConversationReview/AdminConversationReviewPage.jsx
import React, { useState } from "react";
import {
  useJudgeTeams,
  useJudgeProblems,
  useJudgeSessions,
  useJudgeMessages,
  useJudgeResult,
} from "@/hooks/useAdminJudgeReview";

export default function AdminConversationReviewPage() {
  const [teamId, setTeamId] = useState(null);
  const [problemId, setProblemId] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  /* ---------------------------------------------
     1) 팀 / 문제 / 세션 / 메시지 / 저지 결과
  ---------------------------------------------- */
  const { data: teams = [] } = useJudgeTeams();
  const { data: problems = [] } = useJudgeProblems();
  const { data: sessions = [] } = useJudgeSessions(teamId, problemId);
  const { data: messages = [] } = useJudgeMessages(sessionId);
  const { data: judgeResult } = useJudgeResult(sessionId);

  return (
    <div className="w-full p-10 text-white flex flex-col gap-6">

      <h1 className="text-3xl font-bold text-[#FF4854]">
        관리자 세션 / 판정 관리 페이지
      </h1>

      {/* ==============================
          1) 상단 3패널 (팀 / 문제 / 세션)
      =============================== */}
      <div className="grid grid-cols-3 gap-4">

        {/* 팀 목록 */}
        <Column title="팀 목록">
          {teams.map((t) => (
            <Item
              key={t.id}
              label={t.username ?? t.teamname ?? `Team ${t.id}`}
              active={teamId === t.id}
              onClick={() => {
                setTeamId(t.id);
                setProblemId(null);
                setSessionId(null);
              }}
            />
          ))}
        </Column>

        {/* 문제 목록 */}
        <Column title="문제 목록">
          {problems.length === 0 && <Empty>문제를 불러오는 중...</Empty>}
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

        {/* 세션 목록 */}
        <Column title="세션 목록">
          {(!teamId || !problemId) && (
            <Empty>팀/문제를 먼저 선택하세요</Empty>
          )}

          {sessions.map((s) => (
            <Item
              key={s.id}
              label={`세션 #${s.id} (${s.status})`}
              active={sessionId === s.id}
              onClick={() => setSessionId(s.id)}
            />
          ))}
        </Column>
      </div>

      {/* ==============================
          2) 세션 전체 대화
      =============================== */}
      <div className="w-full bg-[#0B021C]/70 rounded-xl p-6 border border-white/10 h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-[#FF4854] mb-4">세션 전체 대화</h2>

        {!sessionId && <Empty>세션을 선택하세요</Empty>}

        <div className="flex flex-col gap-3">
          {messages.map((m) => (
            <ChatBubble key={m.id} msg={m} />
          ))}
        </div>
      </div>

      {/* ==============================
          3) Judge 결과 + 최종 판정 UI
      =============================== */}
      <JudgePanel judgeResult={judgeResult} />

    </div>
  );
}

/* =======================================================
      ⭐ 공통 컴포넌트
======================================================= */

// 🔥 스크롤 완전 적용된 Column
function Column({ title, children }) {
  return (
    <div
      className="
        flex flex-col 
        bg-[#0B021C]/70 
        rounded-xl 
        p-4 
        border border-white/10
        h-[55vh]                    /* ⬅ 고정 높이 */
      "
    >
      <div className="font-bold text-white mb-3">{title}</div>

      <div
        className="
          flex-1 
          overflow-y-auto 
          pr-2 
          scrollbar-thin 
          scrollbar-thumb-[#FF4854]/40 
          scrollbar-track-transparent
        "
      >
        {children}
      </div>
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

function ChatBubble({ msg }) {
  const isUser = msg.role === "user";

  return (
    <div
      className={`max-w-[85%] p-3 rounded-lg 
        ${isUser ? "ml-auto bg-[#2A1620]" : "mr-auto bg-[#16202A]"}`}
    >
      <div className="text-xs opacity-60 mb-1">{msg.role}</div>
      <div className="whitespace-pre-wrap">{msg.content}</div>
    </div>
  );
}

/* =======================================================
      ⭐ Judge 결과 패널
======================================================= */

function JudgePanel({ judgeResult }) {
  if (!judgeResult) {
    return (
      <div className="w-full bg-[#0B021C]/70 rounded-xl p-6 border border-white/20 text-gray-400">
        세션을 선택하면 Judge 결과가 표시됩니다.
      </div>
    );
  }

  const { status, judge_reason, results = [] } = judgeResult;

  return (
    <div className="w-full bg-[#0B021C]/70 rounded-xl p-6 border border-white/20 flex flex-col gap-6">

      <h2 className="text-xl font-bold text-[#FF4854] mb-2">Judge 모델 결과</h2>

      {/* ================================
            🔥 모델별 3컬럼 UI
      ================================= */}
      <div className="grid grid-cols-3 gap-4 h-[45vh]">
        {results.map((r, idx) => (
          <div
            key={idx}
            className="
              flex flex-col 
              bg-[#140B20]/70 
              rounded-xl 
              p-4 
              border border-white/10
              overflow-y-auto 
              scrollbar-thin 
              scrollbar-thumb-[#FF4854]/40
              scrollbar-track-transparent
            "
          >
            {/* 모델명 */}
            <div className="font-bold text-[#FF4854] text-lg mb-4">
              {r.model}
            </div>

            {/* verdict */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm opacity-70">판단:</span>
              <span
                className={`
                  px-3 py-1 rounded-full text-white text-sm
                  ${
                    r.verdict?.toLowerCase() === "passed"
                      ? "bg-green-600"
                      : r.verdict?.toLowerCase() === "failed"
                      ? "bg-red-600"
                      : "bg-gray-600"
                  }
                `}
              >
                {r.verdict}
              </span>
            </div>

            {/* 모델 output 전체 */}
            <div className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
              {r.output}
            </div>
          </div>
        ))}
      </div>

      {/* ======================================
            🔥 최종 Judge 결과
      ====================================== */}
      <div className="mt-4 p-4 rounded-lg bg-[#1A0B15] border border-white/10">
        <div className="text-lg font-bold mb-2">최종 판정</div>
        <div
          className={`px-4 py-2 inline-block rounded-full text-white font-bold ${
            status === "success"
              ? "bg-green-600"
              : status === "fail"
              ? "bg-red-600"
              : "bg-gray-600"
          }`}
        >
          {status}
        </div>

        <div className="mt-3 text-gray-300 whitespace-pre-wrap">
          {judge_reason}
        </div>
      </div>
    </div>
  );
}
