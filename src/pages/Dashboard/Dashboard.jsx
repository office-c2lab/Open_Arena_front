// src/pages/Dashboard/Dashboard.jsx
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Banner from '@/components/Banner/Banner';
import Skeleton from '@/components/Skeleton/Skeleton';
import { useAuthStore } from '@/stores/authStore';
import { useTeamDashboardQuery } from '@/hooks/useTeamDashboardQuery';

const CATEGORY_OPTIONS = ['전체', '법률', '군사', '사회', '일반'];
const GLASS_CARD_CLASS =
  'border border-white/65 bg-white/48 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_6px_18px_rgba(15,23,42,0.07)] backdrop-blur-md';

function DashboardCard({
  title,
  value,
  unit,
  description,
  isLoading,
  unitColor = '#FF4854',
  isPrivate = false,
}) {
  return (
    <section
      className={`relative min-h-[150px] overflow-hidden rounded-[20px] p-6 transition-all duration-200 hover:-translate-y-[1px] hover:bg-white/64 ${GLASS_CARD_CLASS}`}
    >
      <p className="relative body-large font-700 text-black">{title}</p>
      {isLoading ? (
        <Skeleton className="relative mt-5 h-9 w-28" />
      ) : (
        <div className="relative mt-5 flex flex-wrap items-baseline gap-2">
          <span
            className={
              isPrivate
                ? 'text-[22px] font-700 leading-none text-[#8A93A5]'
                : 'heading-1 font-700 leading-none text-[#FF4854]'
            }
          >
            {value}
          </span>
          {unit ? (
            <span className="heading-3 font-700 leading-none" style={{ color: unitColor }}>
              {unit}
            </span>
          ) : null}
        </div>
      )}
      <p className="relative mt-4 body-medium font-500 text-[#6B6B6B]">{description}</p>
    </section>
  );
}

function ProgressBar({ label, solved, total }) {
  const percent = total > 0 ? Math.min((solved / total) * 100, 100) : 0;

  return (
    <div className="min-w-0">
      <div className="mb-3 flex items-center justify-between body-medium font-700 text-black">
        <span>{label}</span>
        <span className="font-700">
          <span className="text-[#FF4854]">{solved}</span>
          <span className="text-[#6B6B6B]"> / {total}</span>
        </span>
      </div>
      <div className="h-[5px] overflow-hidden rounded-full bg-[#E5E7EB]">
        <div className="h-full rounded-full bg-[#FF4854]" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function ProblemStatusBadge({ solved }) {
  return (
    <span className={`body-large font-700 ${solved ? 'text-[#00B654]' : 'text-[#6B6B6B]'}`}>
      {solved ? '완료' : '미해결'}
    </span>
  );
}

function ChallengeCard({ problem, index, onClick }) {
  const title = problem.title || `챌린지 ${index + 1}`;
  const solved = Boolean(problem.solved);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex h-[132px] w-full cursor-pointer flex-col overflow-hidden rounded-[18px] px-6 pb-6 pt-7 text-left backdrop-blur-md transition-all duration-200 hover:-translate-y-[1px] hover:bg-white/64 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_10px_22px_rgba(15,23,42,0.11)] ${
        solved
          ? 'border border-[#86EFAC]/70 bg-[linear-gradient(135deg,rgba(0,182,84,0.16)_0%,rgba(255,255,255,0.58)_56%,rgba(0,182,84,0.08)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.78),0_6px_18px_rgba(15,23,42,0.06)]'
          : 'border border-[#D1D5DB]/70 bg-[linear-gradient(135deg,rgba(138,147,165,0.22)_0%,rgba(255,255,255,0.44)_56%,rgba(138,147,165,0.16)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.68),0_6px_18px_rgba(15,23,42,0.06)]'
      }`}
    >
      {solved ? (
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,182,84,0.12)_0%,rgba(255,255,255,0)_42%)]" />
      ) : null}
      <h3 className="relative truncate text-[16px] leading-[22px] font-700 text-black 2xl:text-[20px] 2xl:leading-[26px]">
        {title}
      </h3>
      <div className="relative mt-auto border-t border-white/60 pt-5">
        <ProblemStatusBadge solved={solved} />
      </div>
    </button>
  );
}

const Dashboard = () => {
  const navigate = useNavigate();

  const teamInfo = useAuthStore(state => state.teamInfo);
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  const teamId = teamInfo?.id || teamInfo?.team_id;

  const { data, isLoading, isError } = useTeamDashboardQuery(teamId);

  const solvedCount = data?.solved_count ?? 0;
  const totalScore = data?.total_score ?? 0;
  const problems = useMemo(() => data?.problems ?? [], [data?.problems]);
  const totalProblems = data?.total_problem_count ?? problems.length ?? 0;
  const currentRank = data?.rank ?? '-';
  const nextRankGap =
    data?.score_gap_to_next_rank ?? data?.next_rank_score_gap ?? data?.next_rank_gap ?? 0;
  const showCompetitionStatus = data?.dashboard_summary_enabled !== false;
  const hiddenSummaryValue = '비공개';

  const categoryStats = useMemo(() => {
    if (Array.isArray(data?.category_solve_status) && data.category_solve_status.length > 0) {
      return data.category_solve_status.map(item => ({
        label: item.category,
        solved: item.solved_count ?? 0,
        total: item.total_count ?? 0,
      }));
    }

    const activeCategories = CATEGORY_OPTIONS.slice(1);
    const buckets = activeCategories.map(label => ({ label, solved: 0, total: 0 }));

    problems.forEach((problem, index) => {
      const label = problem.category || activeCategories[index % activeCategories.length];
      const bucket = buckets.find(item => item.label === label);
      if (!bucket) return;
      bucket.total += 1;
      if (problem.solved) bucket.solved += 1;
    });

    if (problems.length === 0) {
      return buckets.map(item => ({ ...item, total: 10 }));
    }

    return buckets.map(item => ({ ...item, total: item.total || 1 }));
  }, [data?.category_solve_status, problems]);

  if (!isLoggedIn)
    return (
      <div className="flex h-full items-center justify-center text-2xl text-gray-500">
        로그인 후 이용 가능합니다.
      </div>
    );

  if (isError)
    return (
      <div className="flex h-full items-center justify-center text-xl text-red-500">
        데이터를 불러오는 중 오류가 발생했습니다.
      </div>
    );

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-[#F2F4F6] p-6">
      <div className="w-full max-w-[1080px] space-y-6">
        <Banner />

        <section className="flex items-center gap-4 px-1">
          <p className="heading-1 font-700 text-[#FF4854]">대회 현황</p>
        </section>

        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <DashboardCard
            title="현재 순위"
            value={showCompetitionStatus ? currentRank : hiddenSummaryValue}
            unit={showCompetitionStatus && currentRank !== '-' ? '위' : ''}
            description="전체 참가자 중"
            isLoading={isLoading}
            isPrivate={!showCompetitionStatus}
          />
          <DashboardCard
            title="해결한 챌린지"
            value={showCompetitionStatus ? solvedCount : hiddenSummaryValue}
            unit={showCompetitionStatus ? `/ ${totalProblems}` : ''}
            unitColor="#6B6B6B"
            description="해결한 챌린지 수"
            isLoading={isLoading}
            isPrivate={!showCompetitionStatus}
          />
          <DashboardCard
            title="획득 점수"
            value={showCompetitionStatus ? totalScore.toLocaleString() : hiddenSummaryValue}
            unit={showCompetitionStatus ? '점' : ''}
            description="누적 획득 점수"
            isLoading={isLoading}
            isPrivate={!showCompetitionStatus}
          />
          <DashboardCard
            title="다음 순위까지"
            value={showCompetitionStatus ? nextRankGap : hiddenSummaryValue}
            unit={showCompetitionStatus ? '점' : ''}
            description="앞 순위와의 점수 차이"
            isLoading={isLoading}
            isPrivate={!showCompetitionStatus}
          />
        </section>

        <section className={`rounded-[24px] p-7 ${GLASS_CARD_CLASS}`}>
          <div>
            <p className="body-large font-700 text-black">카테고리별 해결 현황</p>
            <div className="mt-6 grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-4">
              {categoryStats.map(item => (
                <ProgressBar key={item.label} {...item} />
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <h2 className="heading-1 font-700 text-[#FF4854]">챌린지 목록</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {isLoading
              ? [...Array(8)].map((_, index) => (
                  <div
                    key={`dashboard-problem-skeleton-${index}`}
                    className={`h-[132px] rounded-[18px] p-5 ${GLASS_CARD_CLASS}`}
                  >
                    <Skeleton className="h-full w-full" />
                  </div>
                ))
              : problems.map((problem, index) => (
                  <ChallengeCard
                    key={problem.id ?? `${problem.title}-${index}`}
                    problem={problem}
                    index={index}
                    onClick={() => {
                      if (!problem.id) return;
                      navigate(`/challenge/${problem.id}`);
                    }}
                  />
                ))}

            {!isLoading && problems.length === 0 ? (
              <div
                className={`col-span-full rounded-[20px] p-10 text-center body-large font-500 text-[#6B6B6B] ${GLASS_CARD_CLASS}`}
              >
                등록된 챌린지가 없습니다.
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
