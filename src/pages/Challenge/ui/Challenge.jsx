import React, { useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Heart, Search } from 'lucide-react';
import UserIcon from '@/assets/icons/user.svg';
import MedalGold from '@/assets/icons/medal_gold.svg';
import MedalSilver from '@/assets/icons/medal_silver.svg';
import MedalBronze from '@/assets/icons/medal_bronze.svg';
import { createSession } from '@/api/chatApi';
import { appToast } from '@/components/Toast/appToast';
import {
  useChallengeFavoriteMutation,
  useChallengeProblem,
  useChallengeProblemRanking,
  useChallengeProblems,
  useChallengeStatus,
  useUnlockChallengeProblem,
} from '@/hooks/useChallenges';
import { useChatSessions } from '@/hooks/useChatSessions';
import { useJudgeSubmissions } from '@/hooks/useJudgeSubmissions';
import { useAuthStore } from '@/stores/authStore';
import { useSessionStore } from '@/stores/useSessionStore';
import { getChallengeDifficultyMeta, getChallengeImage } from '@/utils/challengePresentation';
import { mergeChatSessionsWithSubmissions } from '@/utils/judgeSessions';
import ChallengeEnterTransition from '../components/ChallengeEnterTransition';
import { AttemptStatusBadge } from '../components/AttemptHistoryCard';

const CHALLENGE_MEDAL_ICON_MAP = {
  1: MedalGold,
  2: MedalSilver,
  3: MedalBronze,
};

function getAttemptStatus(status) {
  const normalizedStatus = status?.toLowerCase() || 'unsubmitted';

  if (normalizedStatus === 'success') return 'success';
  if (normalizedStatus === 'fail' || normalizedStatus === 'failed') return 'failed';

  return 'unsubmitted';
}

function SolverAvatar() {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FF4854] shadow-[0_3px_10px_rgba(255,72,84,0.18)]">
      <img src={UserIcon} alt="" className="h-5 w-5" aria-hidden="true" />
    </div>
  );
}

function ChallengeSolverList({ ranking, isLoading, error }) {
  const myRankRef = useRef(null);
  const [isMyRankFocused, setIsMyRankFocused] = useState(false);
  const solvers = ranking?.items ?? [];
  const currentUserRank = ranking?.current_user_rank;

  const handleFindMyRank = () => {
    const isVisible = solvers.some(solver => solver.rank === currentUserRank);
    if (!isVisible) {
      appToast.info(
        currentUserRank
          ? `현재 내 순위는 ${currentUserRank}위입니다.`
          : '아직 등록된 순위가 없습니다.'
      );
      return;
    }
    setIsMyRankFocused(true);
    myRankRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  if (isLoading) {
    return <div className="mt-8 h-56 animate-pulse rounded-[10px] bg-[#F1F3F5]" />;
  }

  if (error) {
    return (
      <div className="mt-5 flex min-h-[180px] items-center justify-center rounded-[10px] border border-[#FFD3D7] bg-[#FFF8F8] px-6 text-center text-body-lg font-strong text-[#D93643]">
        {error.message || '순위 정보를 불러오지 못했습니다.'}
      </div>
    );
  }

  if (!solvers.length) {
    return (
      <div className="surface-muted mt-5 flex min-h-[180px] items-center justify-center text-body-lg font-strong text-[#66717E]">
        아직 등록된 순위가 없습니다.
      </div>
    );
  }

  return (
    <section className="mt-5 w-full">
      <div className="flex items-center justify-between gap-4">
        <p className="text-body-lg font-strong text-[#5C6875]">
          <em className="not-italic text-[#FF4854]">{(ranking?.total ?? 0).toLocaleString()}명</em>
          이 문제를 풀었습니다.
        </p>
        <button
          type="button"
          onClick={handleFindMyRank}
          className="flex h-8 cursor-pointer items-center gap-1.5 rounded-[4px] border border-[#DDE3EA] px-3 text-body font-strong text-[#3D4754] transition hover:border-[#FF4854] hover:text-[#FF4854]"
        >
          <Search className="h-4 w-4" />내 순위 찾기
        </button>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[920px] border-separate border-spacing-y-[14px] text-left">
          <thead>
            <tr className="text-body font-bold text-[#99A5B8]">
              <th className="w-[88px]">
                <span className="flex w-[40px] justify-center">순위</span>
              </th>
              <th>유저 정보</th>
              <th className="w-[190px]">사용 토큰</th>
              <th className="w-[190px] text-center">획득 포인트</th>
              <th className="w-[170px] text-center">성공 일시</th>
            </tr>
          </thead>
          <tbody>
            {solvers.map(solver => {
              const rank = solver.rank;
              const isMe = rank === currentUserRank;

              return (
                <tr
                  key={`${solver.rank}-${solver.nickname}`}
                  ref={isMe ? myRankRef : null}
                  className={`h-[58px] rounded-[8px] text-body font-strong text-[#344050] transition-colors ${
                    isMe && isMyRankFocused ? 'bg-[#FFF0F1]' : ''
                  }`}
                >
                  <td className="w-[88px] font-bold">
                    <div className="flex w-[40px] items-center justify-center">
                      {rank <= 3 ? (
                        <img
                          src={CHALLENGE_MEDAL_ICON_MAP[rank]}
                          alt={`${rank}위`}
                          className="h-8 w-8"
                        />
                      ) : (
                        <span>{rank}위</span>
                      )}
                    </div>
                  </td>
                  <td className="min-w-[230px]">
                    <div className="flex items-center gap-4">
                      <SolverAvatar />
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="truncate font-strong">{solver.nickname}</span>
                        {isMe ? (
                          <span className="shrink-0 rounded-[4px] bg-[#FF4854] px-1.5 py-0.5 text-caption font-bold text-white">
                            나
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="w-[190px] font-bold">{solver.prompt_tokens.toLocaleString()}</td>
                  <td className="w-[190px] text-center font-bold text-[#FF4854]">
                    {solver.best_score.toLocaleString()} P
                  </td>
                  <td className="w-[170px] text-center">
                    <time dateTime={solver.succeeded_at}>
                      {new Intl.DateTimeFormat('ko-KR', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      }).format(new Date(solver.succeeded_at))}
                    </time>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ChallengePreview({ challenge }) {
  return (
    <div className="h-[240px] overflow-hidden rounded-[8px] bg-[#12070A] shadow-[0_2px_8px_rgba(15,23,42,0.12)] sm:h-[320px] lg:h-[300px] xl:h-[326px]">
      <img src={challenge.image} alt={challenge.title} className="h-full w-full object-cover" />
    </div>
  );
}

function ChallengeOverviewContent({ challenge }) {
  const lockedMessage = '챌린지 도전하기를 누르면 상세 내용을 확인할 수 있습니다.';

  return (
    <>
      <section className="border-b border-[#E1E6EB] pb-8">
        <h2 className="text-page-title font-bold text-black">챌린지 개요</h2>
        <h3 className="mt-8 flex items-center gap-3 text-card-title font-bold text-[#475569]">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#475569]" aria-hidden="true" />
          챌린지 설명
        </h3>
        <p className="mt-4 whitespace-pre-line text-body-lg font-medium text-[#4D5968]">
          {challenge.description || lockedMessage}
        </p>
      </section>

      <section className="border-b border-[#E1E6EB] pb-8">
        <h2 className="flex items-center gap-3 text-card-title font-bold text-[#202832]">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#E6AA02]" aria-hidden="true" />
          도전목표
        </h2>
        <p className="mt-3 whitespace-pre-line text-body-lg font-medium text-[#4D5968]">
          {challenge.goal || lockedMessage}
        </p>
      </section>

      <section className="border-b border-[#E1E6EB] pb-8">
        <h2 className="flex items-center gap-3 text-card-title font-bold text-[#202832]">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#079C4C]" aria-hidden="true" />
          성공조건
        </h2>
        <ul className="mt-4 space-y-2 text-body-lg font-medium text-[#4D5968]">
          <li className="whitespace-pre-line">{challenge.success_criteria || lockedMessage}</li>
        </ul>
      </section>

      <section>
        <h2 className="flex items-center gap-3 text-card-title font-bold text-[#202832]">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#FF4854]" aria-hidden="true" />
          실패조건
        </h2>
        <ul className="mt-4 space-y-2 text-body-lg font-medium text-[#4D5968]">
          <li className="whitespace-pre-line">{challenge.failure_criteria || lockedMessage}</li>
        </ul>
      </section>
    </>
  );
}

function ChallengeAttemptHistory({ sessions, isLoading, onSessionOpen }) {
  if (isLoading) {
    return (
      <div className="mt-5 w-full">
        {[0, 1, 2].map(index => (
          <div key={index} className="border-b border-[#E1E6EB] px-2 py-5">
            <div className="h-4 w-44 rounded bg-[#EEF1F4]" />
            <div className="mt-4 h-4 w-64 rounded bg-[#F3F5F7]" />
            <div className="mt-5 h-3 w-52 rounded bg-[#F3F5F7]" />
          </div>
        ))}
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="surface-muted mt-5 flex min-h-[180px] w-full items-center justify-center px-6 text-center">
        <div>
          <p className="text-body-lg font-strong text-[#3D4754]">아직 도전 기록이 없습니다.</p>
          <p className="mt-2 text-body text-[#8A94A1]">
            챌린지를 시작하면 시도 결과와 소모 토큰이 여기에 표시됩니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="mt-5 w-full">
      <p className="text-body-lg font-strong text-[#5C6875]">
        내 도전 기록{' '}
        <em className="not-italic text-[#FF4854]">{sessions.length.toLocaleString()}개</em>
      </p>

      <ul className="mt-6">
        {sessions.map(session => {
          const status = getAttemptStatus(session.status);
          const latestUserMessage = [...(session.messages ?? [])]
            .reverse()
            .find(message => message.role === 'user')?.content;
          const title =
            session.title ||
            latestUserMessage ||
            (status === 'success'
              ? '목표를 달성한 시도입니다.'
              : status === 'failed'
                ? '목표를 달성하지 못한 시도입니다.'
                : '아직 제출되지 않은 시도입니다.');
          const description =
            session.judge_reason ||
            (status === 'unsubmitted'
              ? '답변을 제출하지 않아 결과가 집계되지 않았습니다.'
              : '제출 결과에 대한 판정 내용을 확인해보세요.');
          const points = Number(session.points ?? session.earned_points ?? session.score ?? 0);
          const tokens = Number(
            session.user_prompt_tokens ?? session.tokens ?? session.token_count ?? 0
          );
          const createdAt = session.createdAt ?? session.created_at ?? '-';
          const statusLabel =
            status === 'success' ? '성공' : status === 'failed' ? '실패' : '미제출';

          return (
            <li key={session.id} className="border-b border-[#E1E6EB]">
              <button
                type="button"
                onClick={() => onSessionOpen(session.id, status)}
                className="group grid min-h-[132px] w-full cursor-pointer grid-cols-[minmax(0,1fr)_84px_28px] items-center gap-6 px-6 py-5 text-left transition-colors hover:bg-[#FAFBFC] sm:grid-cols-[minmax(0,1fr)_96px_32px] sm:px-8"
                aria-label={`${statusLabel} 도전 기록 플레이 화면으로 이동`}
              >
                <div className="min-w-0">
                  <p className="truncate text-card-title font-bold text-[#202832]">{title}</p>
                  <p className="mt-2 truncate text-body-lg font-medium text-[#66717E]">
                    {description}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-body font-strong text-[#66717E]">
                    <span>
                      사용토큰{' '}
                      <em className="ml-1 not-italic text-[#303843]">
                        {tokens.toLocaleString()}토큰
                      </em>
                    </span>
                    <span className="h-4 w-px bg-[#D8DDE4]" aria-hidden="true" />
                    <span>
                      획득포인트{' '}
                      <em className="ml-1 not-italic text-[#FF4854]">{points.toLocaleString()}P</em>
                    </span>
                    <span className="h-4 w-px bg-[#D8DDE4]" aria-hidden="true" />
                    <span>
                      도전일시 <time className="ml-1 text-[#4D5968]">{createdAt}</time>
                    </span>
                  </div>
                </div>

                <AttemptStatusBadge
                  isSubmitted={status !== 'unsubmitted'}
                  isSuccess={status === 'success'}
                  size="large"
                  className="justify-self-end"
                />

                <ChevronRight
                  className="h-7 w-7 text-[#848A91] transition-transform group-hover:translate-x-1 group-hover:text-[#FF4854]"
                  strokeWidth={2.4}
                  aria-hidden="true"
                />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default function Challenge() {
  const navigate = useNavigate();
  const { problemId } = useParams();
  const membership = useAuthStore(
    state => state.teamInfo?.membershipType ?? state.teamInfo?.membership
  );
  const setSessionId = useSessionStore(state => state.setSessionId);
  const setSessionStatus = useSessionStore(state => state.setSessionStatus);
  const [pendingPlayPath, setPendingPlayPath] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const isFreeMember = String(membership || 'free').toLowerCase() === 'free';
  const statusQuery = useChallengeStatus();
  const problemsQuery = useChallengeProblems();
  const publicChallenge = problemsQuery.data?.items?.find(problem => problem.id === problemId);
  const canFetchProtectedDetail =
    Boolean(publicChallenge) && (!isFreeMember || publicChallenge.unlocked_today);
  const problemQuery = useChallengeProblem(problemId, { enabled: canFetchProtectedDetail });
  const sessionsQuery = useChatSessions(problemId, { enabled: canFetchProtectedDetail });
  const submissionsQuery = useJudgeSubmissions(problemId, { enabled: canFetchProtectedDetail });
  const challengeSessions = useMemo(
    () => mergeChatSessionsWithSubmissions(sessionsQuery.data?.items, submissionsQuery.data?.items),
    [sessionsQuery.data?.items, submissionsQuery.data?.items]
  );
  const rankingQuery = useChallengeProblemRanking(problemId, {
    offset: 0,
    limit: 20,
    enabled: activeTab === 'solvers',
  });
  const unlockMutation = useUnlockChallengeProblem(problemId);
  const favoriteMutation = useChallengeFavoriteMutation(problemId);
  const challenge = problemQuery.data ?? publicChallenge;
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const isStarting = unlockMutation.isPending || isCreatingSession || Boolean(pendingPlayPath);
  const difficultyMeta = getChallengeDifficultyMeta(challenge?.difficulty);

  const startPlayTransition = async () => {
    if (!challenge || isStarting) return;
    if (statusQuery.data?.enabled === false) {
      appToast.info('현재 챌린지 운영이 중지되어 있습니다.');
      return;
    }

    try {
      if (isFreeMember && !challenge.unlocked_today) {
        await unlockMutation.mutateAsync();
        appToast.success('오늘의 무료 문제 열람 권한을 사용했습니다.');
      }
      setIsCreatingSession(true);
      const session = await createSession({ problemId: challenge.id, title: challenge.title });
      setSessionId(session.id);
      setSessionStatus('unsubmitted');
      void sessionsQuery.refetch();
      setPendingPlayPath(`/challenge/${challenge.id}/play`);
    } catch (error) {
      appToast.error(error.message || '챌린지를 열지 못했습니다.');
    } finally {
      setIsCreatingSession(false);
    }
  };

  const handleSessionOpen = (sessionId, status) => {
    setSessionId(sessionId);
    setSessionStatus(status === 'failed' ? 'fail' : status);
    setPendingPlayPath(`/challenge/${challenge.id}/play`);
  };

  const handleFavorite = async () => {
    if (!challenge || favoriteMutation.isPending) return;
    try {
      await favoriteMutation.mutateAsync(challenge.is_favorite);
      appToast.success(
        challenge.is_favorite ? '찜 목록에서 제거했습니다.' : '찜 목록에 추가했습니다.'
      );
    } catch (error) {
      appToast.error(error.message || '찜 상태를 변경하지 못했습니다.');
    }
  };

  const tabs = [
    { id: 'overview', label: '챌린지 개요' },
    { id: 'history', label: '도전 기록' },
    { id: 'solvers', label: '순위 현황' },
  ];

  if (
    problemsQuery.isLoading ||
    statusQuery.isLoading ||
    (canFetchProtectedDetail && problemQuery.isLoading)
  ) {
    return <div className="h-[640px] w-full animate-pulse rounded-[12px] bg-[#F1F3F5]" />;
  }

  const detailError = canFetchProtectedDetail ? problemQuery.error : null;

  if (problemsQuery.error || detailError || statusQuery.error || !challenge) {
    const error = problemsQuery.error || detailError || statusQuery.error;
    return (
      <div className="flex min-h-[520px] flex-col items-center justify-center text-center">
        <p className="text-card-title font-bold text-[#D93643]">
          {error?.message || '챌린지 정보를 찾을 수 없습니다.'}
        </p>
        <div className="mt-8 w-full max-w-[520px] px-2">
          <button
            type="button"
            onClick={() => navigate('/kategorie')}
            className="btn btn-primary btn-cta btn-block"
          >
            챌린지 목록으로
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white pb-16">
      <button
        type="button"
        onClick={() => navigate('/kategorie')}
        className="mb-10 inline-flex cursor-pointer items-center gap-2 text-body-lg font-strong text-[#4E5968] transition-colors hover:text-[#FF4854]"
      >
        <ArrowLeft className="h-5 w-5" />
        챌린지 목록으로
      </button>

      {statusQuery.data?.enabled === false ? (
        <div className="mb-8 rounded-[10px] border border-[#FFD3D7] bg-[#FFF8F8] px-5 py-4 text-body font-strong text-[#D93643]">
          현재 챌린지 운영이 중지되어 있어 문제에 도전할 수 없습니다.
        </div>
      ) : null}

      <section className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14">
        <ChallengePreview challenge={{ ...challenge, image: getChallengeImage(challenge.id) }} />
        <div className="min-w-0">
          <p className="text-body-lg font-strong text-[#596575]">
            {challenge.category?.name ?? '일반'}
          </p>
          <h1 className="mt-3 text-display font-bold tracking-[-0.02em] text-black">
            {challenge.title}
          </h1>

          <h4 className="mt-4 text-body-lg font-bold text-[#202832]">
            {challenge.sub_title || challenge.sub_description || 'AI 레드팀 챌린지'}
          </h4>

          <div className="mt-6 flex w-fit max-w-full flex-wrap items-center divide-x divide-[#D8DDE4] text-body-lg text-[#2E3338]">
            <span className="whitespace-nowrap pr-4 font-strong">
              성공{' '}
              <em className="ml-1 not-italic text-[#FF4854]">
                {challenge.successful_user_count.toLocaleString()}
              </em>
              명
            </span>
            <span className="whitespace-nowrap px-4 font-strong">
              총 성공{' '}
              <em className="mx-1 not-italic text-[#FF4854]">
                {challenge.total_success_count.toLocaleString()}
              </em>
              회
            </span>
            <span className="whitespace-nowrap px-4 font-strong">
              <em className="mr-1 not-italic text-[#FF4854]">
                {(challenge.best_score ?? 0).toLocaleString()}
              </em>
              포인트 획득
            </span>
            <span className="whitespace-nowrap pl-4">
              <span
                className={`rounded-[4px] px-2 py-1 text-label font-strong ${difficultyMeta.className}`}
              >
                {difficultyMeta.label}
              </span>
            </span>
          </div>

          <div className="mt-7 grid max-w-[560px] grid-cols-2 gap-3">
            <button
              type="button"
              onClick={startPlayTransition}
              disabled={isStarting || statusQuery.data?.enabled === false}
              className="btn btn-primary h-[52px] rounded-[6px] text-body-lg"
            >
              {unlockMutation.isPending
                ? '문제 열람 중'
                : isCreatingSession
                  ? '도전 준비 중'
                  : pendingPlayPath
                    ? '챌린지 진입 중'
                    : '챌린지 도전하기'}
            </button>
            <button
              type="button"
              onClick={handleFavorite}
              disabled={favoriteMutation.isPending}
              aria-pressed={challenge.is_favorite}
              className={`btn h-[52px] rounded-[6px] border bg-white text-body-lg transition-colors ${
                challenge.is_favorite
                  ? 'border-[#FF4854] bg-[#FFF7F8] text-[#FF4854]'
                  : 'border-[#FF4854] text-[#FF4854] hover:bg-[#FFF7F8]'
              }`}
            >
              <Heart className={`h-6 w-6 ${challenge.is_favorite ? 'fill-current' : ''}`} />
              {challenge.is_favorite ? '찜했어요' : '찜하기'}
            </button>
          </div>
        </div>
      </section>

      <div className="mt-8 border-b border-[#DDE3EA]">
        <div className="flex gap-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`cursor-pointer border-b-2 pb-3 text-body-lg font-strong ${
                activeTab === tab.id
                  ? 'border-[#FF4854] text-[#2E3338]'
                  : 'border-transparent text-[#7B8491] hover:text-[#FF4854]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <main className="space-y-8">
          {activeTab === 'overview' ? <ChallengeOverviewContent challenge={challenge} /> : null}

          {activeTab === 'history' ? (
            <section>
              <h2 className="text-page-title font-bold text-black">도전 기록</h2>
              <ChallengeAttemptHistory
                sessions={challengeSessions}
                isLoading={sessionsQuery.isLoading || submissionsQuery.isLoading}
                onSessionOpen={handleSessionOpen}
              />
            </section>
          ) : null}

          {activeTab === 'solvers' ? (
            <section>
              <h2 className="text-page-title font-bold text-black">순위 현황</h2>
              <ChallengeSolverList
                ranking={rankingQuery.data}
                isLoading={rankingQuery.isLoading}
                error={rankingQuery.error}
              />
            </section>
          ) : null}
        </main>
      </div>

      <ChallengeEnterTransition
        isOpen={Boolean(pendingPlayPath)}
        title={challenge.title}
        onComplete={() => {
          if (!pendingPlayPath) return;
          navigate(pendingPlayPath, { viewTransition: true });
        }}
      />
    </div>
  );
}
