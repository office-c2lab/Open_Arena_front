// src/hooks/useAdminJudgeReview.js
import { useQuery } from "@tanstack/react-query";
import {
  fetchJudgeTeams,
  fetchJudgeProblems,
  fetchJudgeSessions,
  fetchJudgeMessages,
  fetchJudgeResult
} from "@/api/adminJudgeReviewApi";

// 팀 목록
export const useJudgeTeams = () =>
  useQuery({
    queryKey: ["judgeTeams"],
    queryFn: fetchJudgeTeams,
  });

// 문제 목록
export const useJudgeProblems = () =>
  useQuery({
    queryKey: ["judgeProblems"],
    queryFn: fetchJudgeProblems,
  });

// 세션 목록
export const useJudgeSessions = (teamId, problemId) =>
  useQuery({
    queryKey: ["judgeSessions", teamId, problemId],
    queryFn: () => fetchJudgeSessions(teamId, problemId),
    enabled: !!teamId && !!problemId,
  });

// 세션 메시지
export const useJudgeMessages = (sessionId) =>
  useQuery({
    queryKey: ["judgeMessages", sessionId],
    queryFn: () => fetchJudgeMessages(sessionId),
    enabled: !!sessionId,
  });

// 저지 결과
export const useJudgeResult = (sessionId) =>
  useQuery({
    queryKey: ["judgeResult", sessionId],
    queryFn: () => fetchJudgeResult(sessionId),
    enabled: !!sessionId,
  });
