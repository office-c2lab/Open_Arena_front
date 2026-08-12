import { useMemo } from 'react';
import { ArrowLeft, UserRoundX } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardProfileSummaryCard from '@/components/Profile/DashboardProfileSummaryCard';
import {
  PublicActivityHeatmapCard,
  PublicRecentSolvedChallengeCard,
  PublicSuccessRateCard,
  PublicTopSolvedChallenges,
} from '@/components/Profile/PublicProfileDashboardWidgets';
import { useChallengeProblems } from '@/hooks/useChallenges';
import { usePublicUserProfile } from '@/hooks/usePublicUserProfile';

const formatNumber = value => Number(value ?? 0).toLocaleString('ko-KR');

function ProfileState({ title, description, onBack }) {
  return (
    <section className="flex min-h-[420px] flex-col items-center justify-center rounded-[16px] border border-[#E3E8EF] bg-[#FAFBFC] px-6 text-center shadow-[0_8px_28px_rgba(15,23,42,0.05)]">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FFECEF] text-[#FF4854]">
        <UserRoundX className="h-8 w-8" aria-hidden="true" />
      </div>
      <h1 className="mt-5 text-page-title font-bold text-[#202832]">{title}</h1>
      <p className="mt-3 text-body-lg font-strong text-[#66717E]">{description}</p>
      <button type="button" onClick={onBack} className="btn btn-primary btn-md mt-7 min-w-[180px]">
        이전 페이지로
      </button>
    </section>
  );
}

export default function PublicProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const profileQuery = usePublicUserProfile(userId);
  const challengeProblemsQuery = useChallengeProblems();
  const profile = profileQuery.data;
  const problemById = useMemo(
    () => new Map((challengeProblemsQuery.data?.items ?? []).map(problem => [problem.id, problem])),
    [challengeProblemsQuery.data?.items]
  );

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/leaderboard', { replace: true });
  };

  if (profileQuery.isLoading) {
    return (
      <div className="mx-auto w-full max-w-[1200px] px-4 py-10 sm:px-6 lg:px-0">
        <div className="mb-7 h-10 w-32 animate-pulse rounded-[8px] bg-[#F1F3F5]" />
        <div className="h-[340px] animate-pulse rounded-[16px] bg-[#F1F3F5]" />
      </div>
    );
  }

  if (profileQuery.error) {
    const isNotFound =
      profileQuery.error.status === 404 || profileQuery.error.code === 'PUBLIC_PROFILE_NOT_FOUND';

    return (
      <div className="mx-auto w-full max-w-[1200px] px-4 py-10 sm:px-6 lg:px-0">
        <ProfileState
          title={isNotFound ? '프로필을 찾을 수 없습니다.' : '프로필을 불러오지 못했습니다.'}
          description={
            isNotFound
              ? '존재하지 않거나 공개할 수 없는 사용자입니다.'
              : profileQuery.error.message || '잠시 후 다시 시도해 주세요.'
          }
          onBack={handleBack}
        />
      </div>
    );
  }

  const summaryStats = [
    {
      label: '현재 순위',
      value: profile.rank == null ? '비공개' : `${formatNumber(profile.rank)}위`,
      subText: profile.rank == null ? '리더보드 비공개' : '전체 참가자 기준',
    },
    {
      label: '해결한 문제',
      value: `${formatNumber(profile.solved_count)}문제`,
      subText: '누적 해결 기준',
    },
    {
      label: '총 점수',
      value: `${formatNumber(profile.total_score)}점`,
      subText: `총 성공 ${formatNumber(profile.total_successes)}회`,
    },
    {
      label: '다음 순위까지',
      value:
        profile.rank == null || profile.score_to_next_rank == null
          ? '-'
          : `${formatNumber(profile.score_to_next_rank)}점`,
      subText: profile.rank == null ? '리더보드 비공개' : '한 단계 상승까지',
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-10 sm:px-6 lg:px-0">
      <button
        type="button"
        onClick={handleBack}
        className="group mb-7 inline-flex cursor-pointer items-center gap-2 text-body-lg font-bold text-[#596575] transition hover:text-[#FF4854]"
      >
        <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
        이전으로
      </button>

      <header className="mb-6">
        <h1 className="text-display font-bold text-[#151A21]">{profile.nickname}님의 프로필</h1>
        <p className="mt-2 text-body-lg font-strong text-[#66717E]">
          <strong className="font-bold text-[#3D4754]">{profile.nickname}</strong> 님이 공개한
          프로필과 챌린지 기록입니다.
        </p>
      </header>

      <div className="flex flex-col gap-7">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-stretch">
          <DashboardProfileSummaryCard
            profile={profile}
            summaryStats={summaryStats}
            showEmail={false}
          />
          <PublicRecentSolvedChallengeCard
            challenge={profile.recent_solved_challenge}
            problem={problemById.get(profile.recent_solved_challenge?.problem_id)}
            onSelect={problemId => navigate(`/challenge/${problemId}`)}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.75fr)_minmax(300px,0.85fr)] lg:items-stretch">
          <PublicActivityHeatmapCard activity={profile.activity} />
          <PublicSuccessRateCard summary={profile.submission_summary} />
        </div>

        <PublicTopSolvedChallenges
          challenges={profile.top_solved_challenges ?? []}
          problemById={problemById}
          onSelect={problemId => navigate(`/challenge/${problemId}`)}
        />
      </div>
    </div>
  );
}
