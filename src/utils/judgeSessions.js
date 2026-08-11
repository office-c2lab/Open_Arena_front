const getSubmissionTime = submission =>
  new Date(submission?.submitted_at || submission?.completed_at || 0).getTime();

const getSessionJudgeStatus = submission => {
  if (!submission || submission.status !== 'completed') return 'unsubmitted';
  return submission.verdict === 'passed' ? 'success' : 'failed';
};

const getJudgeReason = submission => {
  if (!submission) return null;
  if (submission.manual_reason) return submission.manual_reason;

  const reasons = (submission.judgements ?? []).map(judgement => judgement.reason).filter(Boolean);

  return reasons.length ? reasons.join('\n') : null;
};

export const mergeChatSessionsWithSubmissions = (sessions = [], submissions = []) => {
  const latestSubmissionBySession = new Map();

  submissions.forEach(submission => {
    const sessionId = submission.chat_session_id;
    if (!sessionId) return;

    const previous = latestSubmissionBySession.get(sessionId);
    if (!previous || getSubmissionTime(submission) > getSubmissionTime(previous)) {
      latestSubmissionBySession.set(sessionId, submission);
    }
  });

  return sessions.map(session => {
    const submission = latestSubmissionBySession.get(session.id);
    if (!submission) return session;

    return {
      ...session,
      status: getSessionJudgeStatus(submission),
      submission,
      submission_id: submission.id,
      judge_reason: getJudgeReason(submission),
      score: submission.score,
      tokens: submission.prompt_tokens_snapshot ?? session.user_prompt_tokens,
    };
  });
};
