import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import {
  fetchAllJudgeSessions,
  fetchAllJudgeUsers,
  fetchJudgeMessages,
  fetchJudgeSessions,
  fetchJudgeSubmissions,
} from '@/api/adminJudgeReviewApi';
import { getAdminSubmission, setAdminManualVerdict } from '@/api/adminJudgeApi';
import { appToast } from '@/components/Toast/appToast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const PAGE_SIZE = 20;
const emptyFilterInputs = {
  nickname: '',
  problemTitle: '',
  submissionStatus: '',
  verdict: '',
};
const emptyFilters = {
  nickname: '',
  problemTitle: '',
  submissionStatus: '',
  verdict: '',
};

export default function AdminConversationMockPage() {
  const queryClient = useQueryClient();
  const [filterInputs, setFilterInputs] = useState(emptyFilterInputs);
  const [filters, setFilters] = useState(emptyFilters);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedProblemId, setSelectedProblemId] = useState(null);
  const [offset, setOffset] = useState(0);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);
  const [manualVerdict, setManualVerdict] = useState('passed');
  const [manualReason, setManualReason] = useState('');

  const usersQuery = useQuery({
    queryKey: ['adminChatReviewUsers', filters.nickname],
    queryFn: () => fetchAllJudgeUsers({ nickname: filters.nickname }),
  });
  const problemSessionsQuery = useQuery({
    queryKey: [
      'adminChatSessionProblems',
      selectedUserId,
      filters.submissionStatus,
      filters.verdict,
    ],
    queryFn: () =>
      fetchAllJudgeSessions({
        userId: selectedUserId,
        submissionStatus: filters.submissionStatus,
        verdict: filters.verdict,
      }),
    enabled: Boolean(selectedUserId),
  });
  const sessionParams = useMemo(
    () => ({
      userId: selectedUserId,
      problemId: selectedProblemId,
      submissionStatus: filters.submissionStatus,
      verdict: filters.verdict,
      offset,
      limit: PAGE_SIZE,
    }),
    [filters.submissionStatus, filters.verdict, offset, selectedProblemId, selectedUserId]
  );
  const sessionsQuery = useQuery({
    queryKey: ['adminChatSessions', sessionParams],
    queryFn: () => fetchJudgeSessions(sessionParams),
    enabled: Boolean(selectedUserId && selectedProblemId),
  });
  const messagesQuery = useQuery({
    queryKey: ['adminChatMessages', selectedSessionId],
    queryFn: () => fetchJudgeMessages(selectedSessionId),
    enabled: Boolean(selectedSessionId),
  });
  const submissionsQuery = useQuery({
    queryKey: ['adminSessionSubmissions', selectedSessionId],
    queryFn: () => fetchJudgeSubmissions({ sessionId: selectedSessionId, limit: 100 }),
    enabled: Boolean(selectedSessionId),
  });
  const submissionDetailQuery = useQuery({
    queryKey: ['adminSubmission', selectedSubmissionId],
    queryFn: () => getAdminSubmission(selectedSubmissionId),
    enabled: Boolean(selectedSubmissionId),
  });
  const verdictMutation = useMutation({
    mutationFn: setAdminManualVerdict,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['adminSessionSubmissions', selectedSessionId],
        }),
        queryClient.invalidateQueries({ queryKey: ['adminChatSessions'] }),
        queryClient.invalidateQueries({ queryKey: ['adminChatSessionProblems'] }),
        queryClient.invalidateQueries({ queryKey: ['adminSubmission', selectedSubmissionId] }),
      ]);
      setManualReason('');
      appToast.success('수동 판정을 변경했습니다.');
    },
    onError: error => appToast.error(error.message),
  });

  const users = useMemo(() => {
    const nicknameQuery = filters.nickname.toLocaleLowerCase('ko-KR');
    return (usersQuery.data ?? []).filter(user =>
      String(user.nickname || '')
        .toLocaleLowerCase('ko-KR')
        .includes(nicknameQuery)
    );
  }, [filters.nickname, usersQuery.data]);
  const problems = useMemo(() => {
    const problemMap = new Map();
    (problemSessionsQuery.data ?? []).forEach(session => {
      const problem = problemMap.get(session.problem_id);
      problemMap.set(session.problem_id, {
        id: session.problem_id,
        title: session.problem_title,
        sessionCount: (problem?.sessionCount ?? 0) + 1,
      });
    });
    const problemTitleQuery = filters.problemTitle.toLocaleLowerCase('ko-KR');
    return [...problemMap.values()]
      .filter(problem => problem.title.toLocaleLowerCase('ko-KR').includes(problemTitleQuery))
      .sort((a, b) => a.title.localeCompare(b.title, 'ko-KR'));
  }, [filters.problemTitle, problemSessionsQuery.data]);
  const sessions = sessionsQuery.data?.items ?? [];
  const total = sessionsQuery.data?.total ?? 0;
  const submissions = submissionsQuery.data?.items ?? [];
  const selectedSubmission = submissionDetailQuery.data;
  const isRefreshing =
    usersQuery.isFetching || problemSessionsQuery.isFetching || sessionsQuery.isFetching;

  const refreshHierarchy = () => {
    void usersQuery.refetch();
    if (selectedUserId) void problemSessionsQuery.refetch();
    if (selectedUserId && selectedProblemId) void sessionsQuery.refetch();
  };

  const submitFilters = event => {
    event.preventDefault();
    setFilters({
      nickname: filterInputs.nickname.trim(),
      problemTitle: filterInputs.problemTitle.trim(),
      submissionStatus: filterInputs.submissionStatus,
      verdict: filterInputs.verdict,
    });
    setSelectedUserId(null);
    setSelectedProblemId(null);
    setOffset(0);
    setSelectedSessionId(null);
    setSelectedSubmissionId(null);
  };

  const submitManualVerdict = event => {
    event.preventDefault();
    if (!manualReason.trim() || !selectedSubmissionId) return;
    verdictMutation.mutate({
      submissionId: selectedSubmissionId,
      verdict: manualVerdict,
      reason: manualReason.trim(),
    });
  };

  return (
    <div className="min-h-screen w-full px-6 py-8 pb-40 text-white xl:px-10 xl:py-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-page-title font-bold text-[#FF4854]">채팅·판정 열람</h1>
          <p className="mt-2 text-gray-400">
            회원 채팅 세션과 전체 메시지, 제출 이력을 조회합니다.
          </p>
        </div>
        <button
          type="button"
          onClick={refreshHierarchy}
          disabled={isRefreshing}
          className="flex h-11 items-center gap-2 rounded-lg bg-[#FF4854] px-5 font-bold disabled:opacity-50"
        >
          <RefreshCw size={17} className={isRefreshing ? 'animate-spin' : ''} /> 새로고침
        </button>
      </div>

      <form
        onSubmit={submitFilters}
        className="mt-6 grid gap-3 rounded-xl border border-white/10 bg-[#0B021C]/70 p-5 md:grid-cols-2 xl:grid-cols-5"
      >
        <FilterInput
          label="닉네임"
          placeholder="닉네임 일부 입력"
          value={filterInputs.nickname}
          onChange={value => setFilterInputs(current => ({ ...current, nickname: value }))}
        />
        <FilterInput
          label="문제 제목"
          placeholder="문제 제목 일부 입력"
          value={filterInputs.problemTitle}
          onChange={value => setFilterInputs(current => ({ ...current, problemTitle: value }))}
        />
        <FilterSelect
          label="제출 상태"
          value={filterInputs.submissionStatus}
          onChange={value => setFilterInputs(current => ({ ...current, submissionStatus: value }))}
        >
          <option value="">전체</option>
          {['pending', 'running', 'completed', 'failed', 'cancelled'].map(value => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </FilterSelect>
        <FilterSelect
          label="판정"
          value={filterInputs.verdict}
          onChange={value => setFilterInputs(current => ({ ...current, verdict: value }))}
        >
          <option value="">전체</option>
          {['passed', 'failed', 'review'].map(value => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </FilterSelect>
        <button
          type="submit"
          className="mt-auto h-11 rounded-lg bg-[#FF4854] px-5 font-bold hover:bg-[#ff3242]"
        >
          필터 적용
        </button>
      </form>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <ReviewColumn title={`사용자 · ${users.length.toLocaleString()}명`}>
          {usersQuery.isLoading && <State>사용자를 불러오는 중...</State>}
          {usersQuery.error && <State error>{usersQuery.error.message}</State>}
          {users.map(user => (
            <HierarchyItem
              key={user.id}
              active={selectedUserId === user.id}
              title={user.nickname || '닉네임 없음'}
              description={user.email || '이메일 없음'}
              onClick={() => {
                setSelectedUserId(user.id);
                setSelectedProblemId(null);
                setSelectedSessionId(null);
                setSelectedSubmissionId(null);
                setOffset(0);
              }}
            />
          ))}
          {!usersQuery.isLoading && users.length === 0 && <State>표시할 사용자가 없습니다.</State>}
        </ReviewColumn>

        <ReviewColumn title={`문제 · ${problems.length.toLocaleString()}개`}>
          {!selectedUserId && <State>사용자를 먼저 선택해 주세요.</State>}
          {selectedUserId && problemSessionsQuery.isLoading && (
            <State>사용자의 문제를 불러오는 중...</State>
          )}
          {problemSessionsQuery.error && <State error>{problemSessionsQuery.error.message}</State>}
          {problems.map(problem => (
            <HierarchyItem
              key={problem.id}
              active={selectedProblemId === problem.id}
              title={problem.title}
              description={`세션 ${problem.sessionCount.toLocaleString()}개`}
              onClick={() => {
                setSelectedProblemId(problem.id);
                setSelectedSessionId(null);
                setSelectedSubmissionId(null);
                setOffset(0);
              }}
            />
          ))}
          {selectedUserId && !problemSessionsQuery.isLoading && problems.length === 0 && (
            <State>필터 조건에 맞는 문제가 없습니다.</State>
          )}
        </ReviewColumn>

        <ReviewColumn
          title={`세션 · ${total.toLocaleString()}개`}
          footer={
            total > 0 ? (
              <div className="flex items-center justify-between text-label">
                <button
                  type="button"
                  disabled={offset === 0}
                  onClick={() => setOffset(value => Math.max(0, value - PAGE_SIZE))}
                  className="flex h-8 w-8 items-center justify-center rounded bg-white/10 disabled:opacity-30"
                  aria-label="이전 세션 페이지"
                >
                  <ChevronLeft size={17} />
                </button>
                <span>
                  {Math.floor(offset / PAGE_SIZE) + 1} / {Math.max(1, Math.ceil(total / PAGE_SIZE))}
                </span>
                <button
                  type="button"
                  disabled={offset + PAGE_SIZE >= total}
                  onClick={() => setOffset(value => value + PAGE_SIZE)}
                  className="flex h-8 w-8 items-center justify-center rounded bg-white/10 disabled:opacity-30"
                  aria-label="다음 세션 페이지"
                >
                  <ChevronRight size={17} />
                </button>
              </div>
            ) : null
          }
        >
          {!selectedProblemId && <State>문제를 먼저 선택해 주세요.</State>}
          {selectedProblemId && sessionsQuery.isLoading && <State>세션을 불러오는 중...</State>}
          {sessionsQuery.error && <State error>{sessionsQuery.error.message}</State>}
          {selectedProblemId &&
            sessions.map(session => (
              <button
                key={session.id}
                type="button"
                onClick={() => {
                  setSelectedSessionId(session.id);
                  setSelectedSubmissionId(null);
                }}
                className={`mb-2 w-full rounded-lg border p-3 text-left transition ${selectedSessionId === session.id ? 'border-[#FF4854] bg-[#FF4854] text-white' : 'border-white/10 bg-[#10050F]/60 hover:bg-[#1A0B15]'}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <strong className="truncate">{session.title || '제목 없는 세션'}</strong>
                  {session.verdict && <VerdictBadge verdict={session.verdict} />}
                </div>
                <div className="mt-2 text-caption opacity-60">
                  {new Date(session.updated_at).toLocaleString('ko-KR')}
                </div>
              </button>
            ))}
          {selectedProblemId && !sessionsQuery.isLoading && sessions.length === 0 && (
            <State>표시할 세션이 없습니다.</State>
          )}
        </ReviewColumn>
      </div>

      <div className="mt-6 space-y-6">
        {!selectedSessionId && <State>위에서 채팅 세션을 선택해 주세요.</State>}
        {selectedSessionId && (
          <>
            <section className="rounded-xl border border-white/10 bg-[#0B021C]/70 p-5">
              <h2 className="text-card-title font-bold text-[#FF4854]">전체 메시지</h2>
              {messagesQuery.isLoading && <State>메시지를 불러오는 중...</State>}
              {messagesQuery.error && <State error>{messagesQuery.error.message}</State>}
              <div className="mt-4 flex max-h-[65vh] flex-col gap-3 overflow-y-auto pr-2">
                {(messagesQuery.data?.items ?? []).map(message => (
                  <ChatBubble key={message.id} message={message} />
                ))}
                {!messagesQuery.isLoading && (messagesQuery.data?.items ?? []).length === 0 && (
                  <State>메시지가 없습니다.</State>
                )}
              </div>
            </section>

            <section className="rounded-xl border border-white/10 bg-[#0B021C]/70 p-5">
              <h2 className="text-card-title font-bold text-[#FF4854]">세션 제출 이력</h2>
              {submissionsQuery.isLoading && <State>제출을 불러오는 중...</State>}
              {submissionsQuery.error && <State error>{submissionsQuery.error.message}</State>}
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {submissions.map(submission => (
                  <button
                    key={submission.id}
                    type="button"
                    onClick={() => {
                      setSelectedSubmissionId(submission.id);
                      setManualVerdict(
                        ['passed', 'failed'].includes(submission.verdict)
                          ? submission.verdict
                          : 'passed'
                      );
                      setManualReason('');
                    }}
                    className={`rounded-lg border p-4 text-left ${selectedSubmissionId === submission.id ? 'border-[#FF4854] bg-[#2A0B15]' : 'border-white/10 bg-[#10050F]/60'}`}
                  >
                    <div className="flex justify-between gap-2">
                      <strong>{submission.status}</strong>
                      {submission.verdict && <VerdictBadge verdict={submission.verdict} />}
                    </div>
                    <div className="mt-2 truncate text-label text-gray-500">{submission.id}</div>
                    <div className="mt-2 text-label text-gray-400">
                      {new Date(submission.submitted_at).toLocaleString('ko-KR')}
                    </div>
                  </button>
                ))}
              </div>
              {!submissionsQuery.isLoading && submissions.length === 0 && (
                <State>제출 이력이 없습니다.</State>
              )}
            </section>

            {selectedSubmission && (
              <SubmissionDetail
                submission={selectedSubmission}
                verdict={manualVerdict}
                reason={manualReason}
                onVerdictChange={setManualVerdict}
                onReasonChange={setManualReason}
                onSubmit={submitManualVerdict}
                isSaving={verdictMutation.isPending}
              />
            )}
            {submissionDetailQuery.isLoading && <State>제출 상세를 불러오는 중...</State>}
            {submissionDetailQuery.error && (
              <State error>{submissionDetailQuery.error.message}</State>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ReviewColumn({ title, children, footer }) {
  return (
    <section className="flex h-[calc(100vh-320px)] min-h-[480px] flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0B021C]/70">
      <div className="shrink-0 border-b border-white/10 p-4 font-bold text-[#FF4854]">{title}</div>
      <div className="min-h-0 flex-1 overflow-y-auto p-3">{children}</div>
      {footer ? <div className="shrink-0 border-t border-white/10 p-3">{footer}</div> : null}
    </section>
  );
}

function HierarchyItem({ title, description, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`mb-2 w-full rounded-lg border p-3 text-left transition ${
        active
          ? 'border-[#FF4854] bg-[#FF4854] text-white'
          : 'border-white/10 bg-[#10050F]/60 text-gray-200 hover:bg-[#1A0B15]'
      }`}
    >
      <strong className="block truncate">{title}</strong>
      {description ? (
        <span className="mt-1 block truncate text-caption opacity-65">{description}</span>
      ) : null}
    </button>
  );
}

function SubmissionDetail({
  submission,
  verdict,
  reason,
  onVerdictChange,
  onReasonChange,
  onSubmit,
  isSaving,
}) {
  return (
    <section className="rounded-xl border border-white/10 bg-[#0B021C]/70 p-5">
      <h2 className="text-card-title font-bold text-[#FF4854]">제출 상세·수동 판정</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Info label="제출 ID" value={submission.id} />
        <Info label="상태" value={submission.status} />
        <Info label="점수" value={submission.score ?? '-'} />
      </div>
      {submission.manual_reason && (
        <div className="mt-4 rounded-lg border border-amber-400/20 bg-amber-950/20 p-4">
          <div className="text-label font-bold text-amber-300">현재 수동 판정 사유</div>
          <p className="mt-2 whitespace-pre-wrap text-gray-300">{submission.manual_reason}</p>
        </div>
      )}
      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        {submission.judgements.map((judge, index) => (
          <article
            key={`${judge.model}-${index}`}
            className="rounded-lg border border-white/10 bg-[#140B20]/70 p-4"
          >
            <div className="flex justify-between gap-2">
              <strong>{judge.model}</strong>
              <VerdictBadge verdict={judge.verdict} />
            </div>
            <p className="mt-3 whitespace-pre-wrap text-body text-gray-300">{judge.reason}</p>
            <div className="mt-3 text-caption text-gray-500">
              {judge.latency_ms}ms · {judge.prompt_tokens + judge.completion_tokens} tokens
            </div>
          </article>
        ))}
      </div>
      <form onSubmit={onSubmit} className="mt-5 border-t border-white/10 pt-5">
        <div className="grid gap-3 sm:grid-cols-[160px_1fr]">
          <select
            value={verdict}
            onChange={event => onVerdictChange(event.target.value)}
            className="h-11 rounded-lg border border-white/10 bg-[#1A0B15] px-3 outline-none"
          >
            <option value="passed">통과</option>
            <option value="failed">실패</option>
          </select>
          <textarea
            value={reason}
            onChange={event => onReasonChange(event.target.value)}
            placeholder="수동 판정 사유"
            required
            className="h-24 rounded-lg border border-white/10 bg-[#1A0B15] p-3 outline-none focus:border-[#FF4854]"
          />
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="mt-3 h-11 rounded-lg bg-[#FF4854] px-5 font-bold hover:bg-[#ff3242] disabled:opacity-50"
        >
          {isSaving ? '저장 중...' : '수동 판정 변경'}
        </button>
      </form>
    </section>
  );
}

function ChatBubble({ message }) {
  const isUser = message.role === 'user';
  return (
    <article
      className={`max-w-[88%] rounded-xl p-4 ${isUser ? 'ml-auto bg-[#2A1620]' : 'mr-auto bg-[#16202A]'}`}
    >
      <div className="flex justify-between gap-4 text-label opacity-60">
        <span>{message.role}</span>
        <span>{new Date(message.created_at).toLocaleString('ko-KR')}</span>
      </div>
      <p className="mt-2 whitespace-pre-wrap break-words">{message.content}</p>
      <div className="mt-2 text-caption text-gray-500">
        입력 {message.prompt_tokens} · 출력 {message.completion_tokens}
      </div>
    </article>
  );
}
function FilterInput({ label, value, onChange, placeholder }) {
  return (
    <label>
      <span className="text-label text-gray-300">{label}</span>
      <input
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-[#1A0B15] px-3 outline-none focus:border-[#FF4854]"
      />
    </label>
  );
}
function FilterSelect({ label, value, onChange, children }) {
  return (
    <label>
      <span className="text-label text-gray-300">{label}</span>
      <select
        value={value}
        onChange={event => onChange(event.target.value)}
        className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-[#1A0B15] px-3 outline-none focus:border-[#FF4854]"
      >
        {children}
      </select>
    </label>
  );
}
function VerdictBadge({ verdict }) {
  return (
    <span
      className={`rounded-full px-2 py-1 text-caption font-bold ${verdict === 'passed' ? 'bg-emerald-500/15 text-emerald-300' : verdict === 'failed' ? 'bg-red-500/15 text-red-300' : 'bg-amber-500/15 text-amber-300'}`}
    >
      {verdict}
    </span>
  );
}
function Info({ label, value }) {
  return (
    <div>
      <div className="text-label text-gray-400">{label}</div>
      <div className="mt-1 break-all font-bold">{value}</div>
    </div>
  );
}
function State({ children, error }) {
  return (
    <div
      className={`my-4 rounded-lg border p-5 text-center ${error ? 'border-red-400/30 text-red-300' : 'border-white/10 text-gray-400'}`}
    >
      {children}
    </div>
  );
}
