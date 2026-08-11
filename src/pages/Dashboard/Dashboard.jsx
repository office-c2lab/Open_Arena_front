import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowRight, BookOpen, ChevronLeft, ChevronDown, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { useNavigate } from 'react-router-dom';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import UserIcon from '@/assets/icons/user.svg';
import DashboardProfileSummaryCard from '@/components/Profile/DashboardProfileSummaryCard';
import { normalizeUser } from '@/api/auth';
import { useChallengeProblems } from '@/hooks/useChallenges';
import { useDashboardQuery } from '@/hooks/useTeamDashboardQuery';
import { useAuthStore } from '@/stores/authStore';
import { useSessionStore } from '@/stores/useSessionStore';
import ArenaBannerImage from '@/assets/images/banner.svg';
import ChallengeBannerImage from '@/assets/images/chalbenner.png';
import TutorialBannerImage from '@/assets/images/tutorial_banner.png';
import LlmSafetyBannerImage from '@/assets/images/LLMSAFETY_banner.png';
import LearningBannerImage from '@/assets/images/learning_banner.png';
import { articles as educationArticles } from '@/pages/Education/Education';
import { PATHS as challengePaths, PathCard } from '@/pages/Kategorie/Kategorie';
import { TUTORIALS } from '@/pages/Tutorial/TutorialList';
import { getChallengeImage } from '@/utils/challengePresentation';

const dashboardBanners = [
  {
    id: 'challenge',
    type: 'challenge',
    title: '지금 바로 Red Teaming에 도전하세요',
    caption: (
      <>
        AI 레드팀 평가로 실제 공격 시나리오를 경험하고,
        <br />
        실전형 보안 역량을 강화하세요.
      </>
    ),
    image: ChallengeBannerImage,
  },
  {
    id: 'arena',
    type: 'arena',
    title: 'ARENA',
    caption: 'AI 보안 실습 플랫폼',
    image: ArenaBannerImage,
  },
  {
    id: 'llm-safety',
    type: 'llm-safety',
    title: 'LLM Safety Challenge',
    caption: 'Coming Soon',
    image: LlmSafetyBannerImage,
  },
  {
    id: 'learning',
    type: 'learning',
    title: 'LLM Safety Challenge Learning',
    caption: '학습 자료',
    image: LearningBannerImage,
  },
  {
    id: 'tutorial',
    type: 'tutorial',
    title: (
      <>
        튜토리얼로 <span className="text-[#FF4854]">ARENA</span>를 시작하세요
      </>
    ),
    caption: '기초 개념부터 실전 흐름까지, 단계별 학습으로 보안 감각을 익혀보세요.',
    image: TutorialBannerImage,
  },
];

const activityLevels = [
  'bg-[#F3F4F6]',
  'bg-[#FFE8EA]',
  'bg-[#FFB8BE]',
  'bg-[#FF7D86]',
  'bg-[#FF4854]',
  'bg-[#CF1723]',
];

const timeBlocks = Array.from({ length: 8 }, (_, index) => {
  const startHour = index * 3;

  return {
    startHour,
    hours: [startHour, startHour + 1, startHour + 2],
    label: `${String(startHour).padStart(2, '0')}:00-${String(startHour + 3).padStart(2, '0')}:00`,
  };
});

function getActivityLevel(count) {
  return Math.min(Math.max(Math.floor(Number(count) || 0), 0), 5);
}

const toLocalDateKey = date => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function buildActivityHeatmap(activity) {
  const parsedStartDate = activity?.start_date
    ? new Date(`${activity.start_date}T00:00:00`)
    : new Date();
  const startDate = Number.isNaN(parsedStartDate.getTime()) ? new Date() : parsedStartDate;
  startDate.setHours(0, 0, 0, 0);
  const cellCountByDateAndHour = new Map(
    (activity?.cells ?? []).map(cell => [`${cell.date}:${cell.hour}`, cell.count])
  );

  const days = Array.from({ length: 7 }, (_, dayIndex) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + dayIndex);
    const dateKey = toLocalDateKey(date);
    const blocks = timeBlocks.map(({ label, startHour, hours }) => {
      const cells = hours.map(hour => {
        const count = cellCountByDateAndHour.get(`${dateKey}:${hour}`) ?? 0;

        return {
          hour,
          count,
          level: getActivityLevel(count),
        };
      });

      return {
        label,
        startHour,
        cells,
      };
    });

    return {
      date,
      dateKey,
      label: new Intl.DateTimeFormat('ko-KR', { weekday: 'short' })
        .format(date)
        .replace('요일', ''),
      blocks,
    };
  });

  return {
    days,
    totalCount: activity?.total_attempts ?? 0,
  };
}

function DashboardBannerSlider() {
  const navigate = useNavigate();
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveBannerIndex(current => (current + 1) % dashboardBanners.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[220px] w-full overflow-hidden bg-black md:h-[320px]">
      <div
        className="flex h-full transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${activeBannerIndex * 100}%)` }}
      >
        {dashboardBanners.map(banner => (
          <article key={banner.id} className="relative h-full w-full shrink-0">
            <div className="relative mx-auto h-full w-full max-w-[1200px] overflow-hidden">
              <img src={banner.image} alt="" className="h-full w-full object-cover object-center" />
              {banner.type === 'tutorial' && (
                <div className="absolute inset-0 flex flex-col items-start justify-center px-6 text-left sm:px-10 md:px-14">
                  <div className="max-w-[760px]">
                    <h1 className="whitespace-nowrap text-section-title font-bold text-white [text-shadow:0_3px_16px_rgba(0,0,0,0.8)] sm:text-display md:text-display-lg">
                      <span className="text-[#FF4854]">Beginners</span>를 위한 완벽한 입문 가이드
                      시작하기
                    </h1>
                    <p className="mt-3 text-body font-strong text-white/72 [text-shadow:0_2px_10px_rgba(0,0,0,0.65)] sm:text-card-title md:text-section-title">
                      레드티밍이 뭔가요? ARENA는 어떻게 시작하나요?
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate('/tutorial')}
                      className="group mt-7 flex cursor-pointer items-center gap-4 text-card-title font-bold text-white transition-colors hover:text-[#FF4854] sm:text-section-title md:mt-9"
                    >
                      지금 바로 확인하기
                      <ArrowRight
                        className="h-6 w-6 transition-transform duration-200 group-hover:translate-x-1 sm:h-8 sm:w-8"
                        strokeWidth={1.8}
                      />
                    </button>
                  </div>
                </div>
              )}
              {banner.type === 'llm-safety' && (
                <button
                  type="button"
                  aria-label="LLM Safety Challenge 배너"
                  onClick={() => navigate('/kategorie')}
                  className="absolute inset-0 cursor-pointer"
                />
              )}
              {banner.type === 'learning' && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/24 to-transparent" />
                  <div className="absolute inset-0 flex flex-col items-start justify-center px-6 text-left sm:px-10 md:px-14">
                    <h1 className="whitespace-nowrap text-section-title font-bold text-white [text-shadow:0_3px_16px_rgba(0,0,0,0.8)] sm:text-display md:text-display-lg">
                      <span className="text-[#FF4854]">LLM Safety</span> 학습 자료로 시작하세요
                    </h1>
                    <p className="mt-3 text-body font-strong text-white/72 [text-shadow:0_2px_10px_rgba(0,0,0,0.65)] sm:text-card-title md:text-section-title">
                      AI Red Teaming을 더 깊게 이해하고 싶다면
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate('/education')}
                      className="group mt-7 flex cursor-pointer items-center gap-4 text-card-title font-bold text-white transition-colors hover:text-[#FF4854] sm:text-section-title md:mt-9"
                    >
                      지금 바로 확인하기
                      <ArrowRight
                        className="h-6 w-6 transition-transform duration-200 group-hover:translate-x-1 sm:h-8 sm:w-8"
                        strokeWidth={1.8}
                      />
                    </button>
                  </div>
                </>
              )}
              {banner.type === 'challenge' && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-black/72 via-black/28 to-transparent" />
                  <div className="absolute inset-0 flex flex-col items-start justify-center px-6 text-left sm:px-10 md:px-14">
                    <h1 className="max-w-full whitespace-nowrap text-card-title font-bold tracking-normal text-white sm:text-page-title md:text-page-title lg:text-display">
                      {banner.type === 'challenge' ? (
                        <>
                          지금 바로 <span className="text-[#FF4854]">Red Teaming</span>에 도전하세요
                        </>
                      ) : (
                        banner.title
                      )}
                    </h1>
                    <p className="mt-3 max-w-[620px] text-body font-strong text-white/72 sm:text-body-lg md:mt-4 md:text-section-title">
                      {banner.caption}
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate('/kategorie')}
                      className="group mt-7 flex cursor-pointer items-center gap-4 text-card-title font-bold text-white transition-colors hover:text-[#FF4854] sm:text-section-title md:mt-9"
                    >
                      챌린지에 도전하기
                      <ArrowRight
                        className="h-6 w-6 transition-transform duration-200 group-hover:translate-x-1 sm:h-8 sm:w-8"
                        strokeWidth={1.8}
                      />
                    </button>
                  </div>
                </>
              )}
            </div>
          </article>
        ))}
      </div>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {dashboardBanners.map((banner, index) => (
          <button
            key={banner.id}
            type="button"
            aria-label={`${index + 1}번째 배너 보기`}
            onClick={() => setActiveBannerIndex(index)}
            className={`h-2.5 cursor-pointer rounded-full transition-all ${
              activeBannerIndex === index ? 'w-8 bg-[#FF4854]' : 'w-2.5 bg-white/55 hover:bg-white'
            }`}
          />
        ))}
      </div>
    </section>
  );
}

function ProfileCard() {
  const teamInfo = useAuthStore(state => state.teamInfo);
  const displayName = teamInfo?.teamname || teamInfo?.username || 'ARENA 유저';
  const displayEmail = teamInfo?.login_id || teamInfo?.email || 'arena@example.com';
  const membershipLabel = teamInfo?.membershipLabel || '무료 회원';
  const isPaidMember = teamInfo?.membershipType === 'paid';
  const profileStats = teamInfo?.profileStats || {};
  const profileImage = teamInfo?.profileImage || UserIcon;
  const hasProfileImage = Boolean(teamInfo?.profileImage);

  return (
    <section className="surface overflow-hidden">
      <div className="px-5 py-5">
        <div className="flex items-center gap-3">
          <div
            className={`relative flex h-[74px] w-[74px] items-center justify-center overflow-hidden rounded-full ${hasProfileImage ? 'bg-[#F2F4F6]' : 'bg-[#FF4854]'}`}
          >
            <img
              src={profileImage}
              alt=""
              className={hasProfileImage ? 'h-full w-full object-cover' : 'h-10 w-10'}
              aria-hidden="true"
            />
          </div>
          <div className="min-w-0 flex-1 pb-1">
            <div className="flex items-center justify-between gap-2">
              <div className="truncate text-card-title font-bold text-[#3A414B]">{displayName}</div>
              <div className="shrink-0 text-label font-strong text-[#FF4854]">
                {membershipLabel}
              </div>
            </div>
            <p className="mt-1 truncate text-label font-strong text-[#8A93A5]">{displayEmail}</p>
          </div>
        </div>

        {isPaidMember ? (
          <div className="mt-5 grid grid-cols-3 divide-x divide-[#DDE3EA] text-center">
            {[
              ['성공한 챌린지', profileStats.solvedChallenges || 0],
              ['총 성공 갯수', profileStats.totalSuccesses || 0],
              ['랭킹', `${profileStats.rank || '-'}위`],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-caption font-strong text-[#A0A8B3]">{label}</p>
                <p className="mt-1 text-body-lg font-bold text-[#4B5563]">{value}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-3 divide-x divide-[#DDE3EA] text-center">
            {[
              ['무료 도전 횟수', '1 / 6'],
              ['무료 채팅', 10],
              ['무료 토큰', 1000],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-caption font-strong text-[#A0A8B3]">{label}</p>
                <p className="mt-1 text-body-lg font-bold text-[#4B5563]">{value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function MissionCard({ onShowDetails }) {
  const challenge = challengePaths[0];

  if (!challenge) return null;

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-body font-bold text-[#2E3338]">진행중인 챌린지</h2>
        <button
          type="button"
          onClick={onShowDetails}
          className="flex cursor-pointer items-center gap-1 text-label font-bold text-[#FF4854]"
        >
          자세히 보기 <ArrowRight className="h-3 w-3" />
        </button>
      </div>
      <div className="surface p-4">
        <div className="flex items-start gap-3">
          <div className="relative flex h-16 w-20 shrink-0 items-center overflow-hidden bg-[#0B0D18] px-2">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#120F1D_0%,#250B13_52%,#FF4854_220%)]" />
            <strong className="relative text-caption font-bold text-white">
              {challenge.title}
            </strong>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-caption font-strong text-[#FF4854]">
              {challenge.tier} · {challenge.difficulty}
            </p>
            <p className="mt-1 line-clamp-2 text-body font-bold text-[#2E3338]">
              {challenge.title}
            </p>
            <p className="mt-1 truncate text-caption font-strong text-[#8A93A5]">
              {challenge.category}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function LearningProgressCard({ onShowDetails }) {
  const article = educationArticles[0];

  if (!article) return null;

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-body font-bold text-[#2E3338]">진행중인 학습</h2>
        <button
          type="button"
          onClick={onShowDetails}
          className="flex cursor-pointer items-center gap-1 text-label font-bold text-[#FF4854]"
        >
          자세히 보기 <ArrowRight className="h-3 w-3" />
        </button>
      </div>
      <div className="surface p-4">
        <div className="flex items-start gap-3">
          <div className="relative flex h-16 w-20 shrink-0 items-center overflow-hidden bg-[#0B0D18] px-2">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#120F1D_0%,#250B13_52%,#FF4854_220%)]" />
            <strong className="relative text-caption font-bold text-white">
              {article.visualTitle}
            </strong>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-caption font-strong text-[#FF4854]">{article.category}</p>
            <p className="mt-1 truncate text-body font-bold text-[#2E3338]">{article.title}</p>
            <p className="mt-1 line-clamp-2 text-caption font-strong text-[#8A93A5]">
              {article.summary}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function LearningDetailPanel() {
  const [selectedLearningStatus, setSelectedLearningStatus] = useState('in-progress');
  const learningStatusOptions = [
    { key: 'in-progress', label: '진행 중', count: 1 },
    { key: 'completed', label: '완료', count: 0 },
  ];
  const visibleArticles =
    selectedLearningStatus === 'in-progress' ? educationArticles.slice(0, 1) : [];

  return (
    <section>
      <h1 className="text-section-title font-bold text-[#151A21]">학습</h1>

      <div className="mt-5 flex flex-wrap items-center gap-3 text-body font-strong">
        {learningStatusOptions.map(option => {
          const isSelected = selectedLearningStatus === option.key;

          return (
            <button
              key={option.key}
              type="button"
              onClick={() => setSelectedLearningStatus(option.key)}
              className={`cursor-pointer rounded-full px-3 py-1.5 transition ${
                isSelected ? 'bg-[#FFF0F2] text-[#FF4854]' : 'text-[#7B8491] hover:bg-[#F6F7F9]'
              }`}
            >
              {option.label} {option.count}
            </button>
          );
        })}
      </div>

      <div className="mt-7 divide-y divide-[#E6E9EE] border-y border-[#E6E9EE]">
        {visibleArticles.map(article => (
          <article
            key={article.id}
            className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center"
          >
            <div className="relative flex h-[112px] w-full shrink-0 items-center overflow-hidden bg-[#0B0D18] px-4 sm:w-[184px]">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,#120F1D_0%,#250B13_52%,#FF4854_220%)]" />
              <strong className="relative text-body-lg font-bold text-white">
                {article.visualTitle}
              </strong>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-caption font-strong text-[#FF4854]">
                {article.category} · {article.date}
              </p>
              <h2 className="mt-2 text-card-title font-bold text-[#151A21]">{article.title}</h2>
              <p className="mt-2 line-clamp-2 text-body font-medium text-[#66717E]">
                {article.summary}
              </p>
              <p className="mt-3 text-caption font-strong text-[#8A93A5]">
                {article.readTime} 읽기
              </p>
            </div>
          </article>
        ))}
        {!visibleArticles.length ? (
          <p className="py-12 text-center text-body font-strong text-[#8A93A5]">
            완료한 학습 자료가 없습니다.
          </p>
        ) : null}
      </div>
    </section>
  );
}

function TutorialDetailPanel() {
  const [selectedTutorialStatus, setSelectedTutorialStatus] = useState('in-progress');
  const visibleTutorials = selectedTutorialStatus === 'in-progress' ? TUTORIALS.slice(0, 1) : [];

  return (
    <section>
      <h1 className="text-section-title font-bold text-[#151A21]">튜토리얼</h1>
      <div className="mt-5 flex items-center gap-3 text-body font-strong">
        {[
          { key: 'in-progress', label: '진행 중', count: 1 },
          { key: 'completed', label: '완료', count: 0 },
        ].map(option => (
          <button
            key={option.key}
            type="button"
            onClick={() => setSelectedTutorialStatus(option.key)}
            className={`cursor-pointer rounded-full px-3 py-1.5 transition ${
              selectedTutorialStatus === option.key
                ? 'bg-[#FFF0F2] text-[#FF4854]'
                : 'text-[#7B8491] hover:bg-[#F6F7F9]'
            }`}
          >
            {option.label} {option.count}
          </button>
        ))}
      </div>
      <div className="mt-5 divide-y divide-[#E6E9EE] border-y border-[#E6E9EE]">
        {visibleTutorials.map(tutorial => (
          <article
            key={tutorial.id}
            className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center"
          >
            <div className="relative flex h-[112px] w-full shrink-0 items-center overflow-hidden bg-[#0B0D18] px-4 sm:w-[184px]">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,#120F1D_0%,#250B13_52%,#FF4854_220%)]" />
              <strong className="relative text-body-lg font-bold text-white">
                {tutorial.title}
              </strong>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-caption font-strong text-[#FF4854]">
                {tutorial.tier} · {tutorial.difficulty}
              </p>
              <h2 className="mt-2 text-card-title font-bold text-[#151A21]">{tutorial.title}</h2>
              <p className="mt-2 text-body font-medium text-[#66717E]">{tutorial.category}</p>
              <p className="mt-3 text-caption font-strong text-[#8A93A5]">약 {tutorial.duration}</p>
            </div>
          </article>
        ))}
        {!visibleTutorials.length ? (
          <p className="py-12 text-center text-body font-strong text-[#8A93A5]">
            완료한 튜토리얼이 없습니다.
          </p>
        ) : null}
      </div>
    </section>
  );
}

function ChallengeDetailPanel() {
  const [selectedChallengeStatus, setSelectedChallengeStatus] = useState('in-progress');
  const visibleChallenges =
    selectedChallengeStatus === 'in-progress' ? challengePaths.slice(0, 1) : [];

  return (
    <section>
      <h1 className="text-section-title font-bold text-[#151A21]">챌린지</h1>
      <div className="mt-5 flex items-center gap-3 text-body font-strong">
        {[
          { key: 'in-progress', label: '진행 중', count: 1 },
          { key: 'completed', label: '완료', count: 0 },
        ].map(option => (
          <button
            key={option.key}
            type="button"
            onClick={() => setSelectedChallengeStatus(option.key)}
            className={`cursor-pointer rounded-full px-3 py-1.5 transition ${
              selectedChallengeStatus === option.key
                ? 'bg-[#FFF0F2] text-[#FF4854]'
                : 'text-[#7B8491] hover:bg-[#F6F7F9]'
            }`}
          >
            {option.label} {option.count}
          </button>
        ))}
      </div>
      <div className="mt-5 divide-y divide-[#E6E9EE] border-y border-[#E6E9EE]">
        {visibleChallenges.map(challenge => (
          <article
            key={challenge.id}
            className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center"
          >
            <div className="relative flex h-[112px] w-full shrink-0 items-center overflow-hidden bg-[#0B0D18] px-4 sm:w-[184px]">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,#120F1D_0%,#250B13_52%,#FF4854_220%)]" />
              <strong className="relative text-body-lg font-bold text-white">
                {challenge.title}
              </strong>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-caption font-strong text-[#FF4854]">
                {challenge.tier} · {challenge.difficulty}
              </p>
              <h2 className="mt-2 text-card-title font-bold text-[#151A21]">{challenge.title}</h2>
              <p className="mt-2 text-body font-medium text-[#66717E]">{challenge.category}</p>
              <p className="mt-3 text-caption font-strong text-[#8A93A5]">
                약 {challenge.duration}
              </p>
            </div>
          </article>
        ))}
        {!visibleChallenges.length ? (
          <p className="py-12 text-center text-body font-strong text-[#8A93A5]">
            완료한 챌린지가 없습니다.
          </p>
        ) : null}
      </div>
    </section>
  );
}

function TutorialProgressCard({ onShowDetails }) {
  const [selectedTutorialId, setSelectedTutorialId] = useState(null);
  const tutorials = TUTORIALS;

  if (!tutorials.length) return null;

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-body font-bold text-[#2E3338]">진행중인 튜토리얼</h2>
        <button
          type="button"
          onClick={onShowDetails}
          className="flex cursor-pointer items-center gap-1 text-label font-bold text-[#FF4854]"
        >
          자세히 보기 <ArrowRight className="h-3 w-3" />
        </button>
      </div>
      <div className="surface p-4">
        <div className="rounded-[3px] bg-[#FFF0F2] p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] bg-[#FFDCE0]">
              <BookOpen className="h-5 w-5 text-[#FF4854]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-body font-bold text-[#2E3338]">튜토리얼 입문 여정</p>
              <p className="mt-1 text-caption font-strong text-[#8A93A5]">
                튜토리얼 완료까지 4개 남았어요!
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div className="h-1 min-w-0 flex-1 overflow-hidden rounded-full bg-white">
              <div className="h-full w-1/5 rounded-full bg-[#FF4854]" />
            </div>
            <span className="text-caption font-strong text-[#FF4854]">20%</span>
          </div>
        </div>

        <div className="mt-3 divide-y divide-[#DDE3EA]">
          {tutorials.map((tutorial, index) => {
            const isSelected = selectedTutorialId === tutorial.id;
            const status = index < 2 ? '완료' : '미완료';

            return (
              <div key={tutorial.id}>
                <button
                  type="button"
                  aria-expanded={isSelected}
                  onClick={() =>
                    setSelectedTutorialId(current => (current === tutorial.id ? null : tutorial.id))
                  }
                  className="flex w-full cursor-pointer items-center justify-between gap-3 py-3 text-left"
                >
                  <p className="min-w-0 truncate text-body font-bold text-[#2E3338]">
                    {tutorial.title}
                  </p>
                  <span
                    className={`shrink-0 text-caption font-strong ${status === '완료' ? 'text-[#1BAE5B]' : 'text-[#A0A8B3]'}`}
                  >
                    {status}
                  </span>
                </button>

                {isSelected ? (
                  <div className="mb-3 flex items-start gap-3">
                    <div className="relative flex h-16 w-20 shrink-0 items-center overflow-hidden bg-[#0B0D18] px-2">
                      <div className="absolute inset-0 bg-[linear-gradient(135deg,#120F1D_0%,#250B13_52%,#FF4854_220%)]" />
                      <strong className="relative text-caption font-bold text-white">
                        {tutorial.title}
                      </strong>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-caption font-strong text-[#FF4854]">
                        {tutorial.tier} · {tutorial.difficulty}
                      </p>
                      <p className="mt-1 line-clamp-2 text-body font-bold text-[#2E3338]">
                        {tutorial.title}
                      </p>
                      <p className="mt-1 truncate text-caption font-strong text-[#8A93A5]">
                        {tutorial.category}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function DashboardSectionHeader({ title, description, action }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h2 className="text-card-title font-bold text-[#202832]">{title}</h2>
        {description ? (
          <p className="mt-2 text-body font-strong text-[#6F7885]">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

function ActivityHeatmapTooltip({ tooltip }) {
  if (!tooltip) return null;

  return (
    <div
      className="pointer-events-none fixed z-[9999] w-max max-w-[180px] rounded-[8px] border border-[#E9ECF1] bg-white px-3 py-2 text-left shadow-[0_14px_30px_rgba(15,23,42,0.12)]"
      style={{
        left: tooltip.x,
        top: tooltip.y,
        transform: 'translate(-50%, -100%)',
      }}
    >
      <span className="block text-label font-bold text-[#202832]">{tooltip.dateText}</span>
      <span className="mt-1 block text-caption font-strong text-[#7B8491]">{tooltip.hourText}</span>
      <span className="mt-1 block text-label font-bold text-[#FF4854]">도전 {tooltip.count}회</span>
    </div>
  );
}

function ActivityHeatmapCell({ day, cell, onTooltipShow, onTooltipHide }) {
  const dateText = day.date.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });
  const hourText = `${String(cell.hour).padStart(2, '0')}:00 - ${String(cell.hour + 1).padStart(2, '0')}:00`;
  const showTooltip = event => {
    const rect = event.currentTarget.getBoundingClientRect();
    const tooltipWidth = 180;
    const viewportPadding = 12;
    const x = Math.min(
      Math.max(rect.left + rect.width / 2, viewportPadding + tooltipWidth / 2),
      window.innerWidth - viewportPadding - tooltipWidth / 2
    );

    onTooltipShow({
      x,
      y: rect.top - 8,
      dateText,
      hourText,
      count: cell.count,
    });
  };

  return (
    <button
      type="button"
      aria-label={`${dateText} ${hourText} 도전 ${cell.count}회`}
      onMouseEnter={showTooltip}
      onMouseMove={showTooltip}
      onMouseLeave={onTooltipHide}
      onFocus={showTooltip}
      onBlur={onTooltipHide}
      className={`relative h-[22px] w-[22px] cursor-pointer rounded-[5px] outline-none transition hover:scale-110 focus-visible:scale-110 focus-visible:ring-2 focus-visible:ring-[#FF4854]/35 ${activityLevels[cell.level]}`}
    />
  );
}

const presentHomeChallenge = (summary, problem) => {
  const problemId = problem?.id ?? summary?.problem_id;
  const attemptStatus = problem?.attempt_status;

  return {
    ...summary,
    ...problem,
    id: problemId,
    image: getChallengeImage(problemId),
    category: problem?.category?.name ?? summary?.category_name ?? '일반',
    difficulty: problem?.difficulty ?? summary?.difficulty,
    maximumPoints: problem?.max_score ?? summary?.max_score ?? 0,
    successfulUsers: problem?.successful_user_count ?? 0,
    totalSuccesses: problem?.total_success_count ?? 0,
    best_score: problem?.best_score ?? 0,
    status: attemptStatus === 'not_started' || !attemptStatus ? 'untried' : attemptStatus,
  };
};

function ChallengeActivityHeatmap({ dashboard, challengeProblems, areChallengeProblemsLoading }) {
  const { account, activity, challenge, continue_challenge: continueChallenge } = dashboard;
  const profile = useMemo(() => normalizeUser(account), [account]);
  const { days, totalCount } = useMemo(() => buildActivityHeatmap(activity), [activity]);
  const challengeProblemById = useMemo(
    () => new Map(challengeProblems.map(problem => [problem.id, problem])),
    [challengeProblems]
  );
  const [activeTooltip, setActiveTooltip] = useState(null);
  const displayedRank =
    challenge.leaderboard_visible && challenge.rank ? `${challenge.rank}위` : '-';
  const scoreToNextRank = challenge.score_to_next_rank;
  const summaryStats = [
    { label: '현재 순위', value: displayedRank, subText: '전체 참가자 기준' },
    {
      label: '해결한 문제',
      value: `${challenge.solved_count.toLocaleString()}문제`,
      subText: `전체 ${challenge.total_problem_count.toLocaleString()}문제 중`,
    },
    {
      label: '총 점수',
      value: `${challenge.total_score.toLocaleString()}점`,
      subText: `총 성공 ${challenge.total_successes.toLocaleString()}회`,
    },
    {
      label: '다음 순위까지',
      value: scoreToNextRank == null ? '-' : `${scoreToNextRank.toLocaleString()}점`,
      subText: scoreToNextRank == null ? '현재 집계 기준' : '한 단계 상승까지',
    },
  ];

  return (
    <section className="mx-auto flex w-full max-w-[1200px] flex-col gap-7 px-4 py-7 sm:px-6 lg:px-0">
      <ActivityHeatmapTooltip tooltip={activeTooltip} />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-stretch">
        <DashboardProfileSummaryCard profile={profile} summaryStats={summaryStats} />
        <RecentAttemptProblemsCard
          challenge={continueChallenge}
          problem={challengeProblemById.get(continueChallenge?.problem_id)}
          isProblemLoading={areChallengeProblemsLoading}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.75fr)_minmax(300px,0.85fr)] lg:items-stretch">
        <section className="surface max-w-full px-5 py-4 sm:px-6">
          <DashboardSectionHeader title="도전 활동 히트맵" description="일별 도전 참여 현황" />
          <div className="mt-5 flex max-w-full justify-center">
            <div className="overflow-x-auto pb-1">
              <div className="w-max">
                <div className="grid grid-cols-[32px_repeat(24,22px)] gap-x-[6px] gap-y-[6px]">
                  {days.map(day => {
                    const cells = day.blocks.flatMap(block => block.cells);

                    return (
                      <React.Fragment key={day.dateKey}>
                        <span className="flex h-[22px] items-center text-body font-bold text-[#596575]">
                          {day.label}
                        </span>
                        {cells.map(cell => (
                          <ActivityHeatmapCell
                            key={`${day.dateKey}-${cell.hour}`}
                            day={day}
                            cell={cell}
                            onTooltipShow={setActiveTooltip}
                            onTooltipHide={() => setActiveTooltip(null)}
                          />
                        ))}
                      </React.Fragment>
                    );
                  })}
                </div>

                <div className="mt-5 flex items-center justify-between gap-4 text-body font-strong text-[#596575]">
                  <div className="flex items-center gap-2">
                    <span>낮음</span>
                    <div className="flex gap-[4px]">
                      {activityLevels.map(levelClass => (
                        <span key={levelClass} className={`h-3 w-3 rounded-[2px] ${levelClass}`} />
                      ))}
                    </div>
                    <span>높음</span>
                  </div>
                  <p>
                    총 도전{' '}
                    <strong className="font-bold text-[#202832]">
                      {totalCount.toLocaleString()}회
                    </strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="flex min-w-0 w-full flex-col gap-5">
          <SuccessRateCard summary={dashboard.submission_summary} />
        </div>
      </div>
      <RecommendedChallengeSection
        challenges={dashboard.recommended_challenges}
        challengeEnabled={challenge.enabled}
        challengeProblemById={challengeProblemById}
        areChallengeProblemsLoading={areChallengeProblemsLoading}
      />
    </section>
  );
}

function RecentAttemptProblemsCard({ challenge, problem, isProblemLoading }) {
  const navigate = useNavigate();
  const setSessionId = useSessionStore(state => state.setSessionId);
  const setSessionStatus = useSessionStore(state => state.setSessionStatus);

  if (!challenge) {
    return (
      <section className="surface flex min-h-[286px] flex-col items-center justify-center px-6 py-8 text-center">
        <p className="text-body-lg font-bold text-[#202832]">진행 중인 챌린지가 없습니다.</p>
        <p className="mt-2 text-body font-strong text-[#8A93A5]">
          새로운 문제에 도전해 기록을 만들어 보세요.
        </p>
        <button
          type="button"
          onClick={() => navigate('/kategorie')}
          className="btn btn-primary btn-md mt-6 min-w-[180px]"
        >
          챌린지 목록
        </button>
      </section>
    );
  }

  if (isProblemLoading && !problem) {
    return <div className="h-[390px] animate-pulse rounded-[10px] bg-[#F1F3F5]" />;
  }

  const handleContinue = () => {
    setSessionId(challenge.chat_session_id);
    setSessionStatus('unsubmitted');
    navigate(`/challenge/${challenge.problem_id}/play`);
  };
  const path = presentHomeChallenge(challenge, problem);

  return (
    <PathCard path={path} status={path.status} badgeLabel="이어서 하기" onClick={handleContinue} />
  );
}

const dashboardChallengeStatusMeta = {
  success: { label: '성공', className: 'text-[#1EC186]' },
  failed: { label: '실패', className: 'text-[#FF4854]' },
  in_progress: { label: '도전 중', className: 'text-[#FFBC4B]' },
  untried: { label: '미도전', className: 'text-white' },
};

function DashboardChallengeStatusBadge({ status }) {
  const meta = dashboardChallengeStatusMeta[status] ?? dashboardChallengeStatusMeta.untried;

  return (
    <span
      className={`absolute right-3 top-3 rounded-[7px] bg-[#171C24]/90 px-2.5 py-1 text-caption font-bold shadow-[0_8px_18px_rgba(0,0,0,0.24)] ${meta.className}`}
    >
      {meta.label}
    </span>
  );
}

function DashboardChallengeCard({ challenge, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="surface surface-interactive surface-no-hover-border min-w-[220px] cursor-pointer overflow-hidden text-left"
    >
      <div className="relative h-[96px] overflow-hidden bg-[#0B0D18]">
        <img
          src={challenge.image}
          alt={`${challenge.title} 챌린지`}
          className="h-full w-full object-cover"
        />
        <DashboardChallengeStatusBadge status={challenge.status} />
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 min-h-[44px] text-body-lg font-bold text-[#202832]">
          {challenge.title}
        </h3>
      </div>
    </button>
  );
}

function RecommendedChallengeSection({
  challenges,
  challengeEnabled,
  challengeProblemById,
  areChallengeProblemsLoading,
}) {
  const navigate = useNavigate();
  const [activeStatusTab, setActiveStatusTab] = useState('all');
  const displayedChallenges = useMemo(
    () =>
      challenges.map(challenge =>
        presentHomeChallenge(challenge, challengeProblemById.get(challenge.problem_id))
      ),
    [challengeProblemById, challenges]
  );
  const challengeStatusPaths = useMemo(
    () =>
      [...challengeProblemById.values()]
        .filter(problem => !problem.is_tutorial)
        .map(problem => presentHomeChallenge(null, problem)),
    [challengeProblemById]
  );
  const visibleChallengeStatusPaths =
    activeStatusTab === 'all'
      ? challengeStatusPaths
      : challengeStatusPaths.filter(challenge => challenge.status === activeStatusTab);
  const [selectedQueueIndex, setSelectedQueueIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    loop: challenges.length > 1,
    duration: 24,
  });
  const statusTabs = [
    { key: 'all', label: '전체' },
    { key: 'success', label: '성공' },
    { key: 'failed', label: '실패' },
    { key: 'untried', label: '미도전' },
  ];
  const queueCount = challenges.length;
  const updateSelectedQueueIndex = useCallback(() => {
    if (!emblaApi) return;

    setSelectedQueueIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);
  const selectQueueIndex = useCallback(
    nextIndex => {
      if (!emblaApi) {
        setSelectedQueueIndex(nextIndex);
        return;
      }

      emblaApi.scrollTo(nextIndex);
    },
    [emblaApi]
  );
  const showPreviousChallenge = useCallback(() => {
    if (!queueCount) return;
    if (!emblaApi) {
      setSelectedQueueIndex(current => (current - 1 + queueCount) % queueCount);
      return;
    }

    emblaApi.scrollPrev();
  }, [emblaApi, queueCount]);
  const showNextChallenge = useCallback(() => {
    if (!queueCount) return;
    if (!emblaApi) {
      setSelectedQueueIndex(current => (current + 1) % queueCount);
      return;
    }

    emblaApi.scrollNext();
  }, [emblaApi, queueCount]);

  useEffect(() => {
    if (!emblaApi) return undefined;

    updateSelectedQueueIndex();
    emblaApi.on('select', updateSelectedQueueIndex);
    emblaApi.on('reInit', updateSelectedQueueIndex);

    return () => {
      emblaApi.off('select', updateSelectedQueueIndex);
      emblaApi.off('reInit', updateSelectedQueueIndex);
    };
  }, [emblaApi, updateSelectedQueueIndex]);

  return (
    <div className="flex flex-col gap-7">
      <section className="surface relative px-5 py-6 sm:px-6">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-card-title font-bold text-[#202832]">추천 챌린지</h2>
            <p className="mt-2 text-body font-strong text-[#8A93A5]">
              회원님의 기록을 바탕으로 추천한 챌린지예요.
            </p>
          </div>
        </div>

        {areChallengeProblemsLoading && !challengeProblemById.size ? (
          <div className="mx-auto h-[390px] max-w-[380px] animate-pulse rounded-[10px] bg-[#F1F3F5]" />
        ) : challenges.length ? (
          <>
            {challenges.length > 1 ? (
              <>
                <button
                  type="button"
                  aria-label="이전 추천"
                  onClick={showPreviousChallenge}
                  className="absolute left-4 top-[calc(50%+24px)] z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#EEF1F5] bg-white text-[#2E3338] shadow-[0_8px_20px_rgba(15,23,42,0.1)] transition hover:-translate-y-[calc(50%+2px)] hover:border-[#FFB8BE] hover:bg-[#FFF3F4] hover:text-[#FF4854] hover:shadow-[0_12px_24px_rgba(255,72,84,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4854]/30"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="다음 추천"
                  onClick={showNextChallenge}
                  className="absolute right-4 top-[calc(50%+24px)] z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#EEF1F5] bg-white text-[#2E3338] shadow-[0_8px_20px_rgba(15,23,42,0.1)] transition hover:-translate-y-[calc(50%+2px)] hover:border-[#FFB8BE] hover:bg-[#FFF3F4] hover:text-[#FF4854] hover:shadow-[0_12px_24px_rgba(255,72,84,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4854]/30"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            ) : null}

            <div className="mx-auto max-w-[1000px] overflow-hidden px-10" ref={emblaRef}>
              <div className="-ml-16 flex items-stretch">
                {displayedChallenges.map(challenge => (
                  <div key={challenge.id} className="min-w-0 shrink-0 grow-0 basis-[444px] pl-16">
                    <PathCard
                      path={challenge}
                      status={challenge.status}
                      onClick={() => navigate(`/challenge/${challenge.id}`)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {challenges.length > 1 ? (
              <div className="mt-5 flex justify-center gap-2">
                {challenges.map((challenge, index) => (
                  <button
                    key={challenge.problem_id}
                    type="button"
                    aria-label={`${challenge.title} 추천 보기`}
                    onClick={() => selectQueueIndex(index)}
                    className={`h-2 w-2 cursor-pointer rounded-full ${
                      index === selectedQueueIndex ? 'bg-[#FF4854]' : 'bg-[#D1D7E0]'
                    }`}
                  />
                ))}
              </div>
            ) : null}
          </>
        ) : (
          <div className="rounded-[8px] bg-[#F7F8FA] px-5 py-10 text-center text-body font-strong text-[#8A93A5]">
            현재 추천할 챌린지가 없습니다.
          </div>
        )}
      </section>

      <section className="surface px-5 py-6 sm:px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-card-title font-bold text-[#202832]">챌린지 현황</h2>
          <div className="flex items-center gap-5 text-body font-bold">
            {statusTabs.map(tab => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveStatusTab(tab.key)}
                className={`cursor-pointer border-b-2 pb-2 transition ${
                  activeStatusTab === tab.key
                    ? 'border-[#FF4854] text-[#FF4854]'
                    : 'border-transparent text-[#9AA3AF] hover:text-[#596575]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {!challengeEnabled ? (
          <div className="mb-5 rounded-[8px] border border-[#FFD5D8] bg-[#FFF4F5] px-4 py-3 text-body font-bold text-[#E93643]">
            현재 챌린지 운영이 일시 중지되어 있습니다.
          </div>
        ) : null}

        {areChallengeProblemsLoading && !challengeProblemById.size ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {[0, 1, 2, 3, 4].map(index => (
              <div key={index} className="h-[164px] animate-pulse rounded-[10px] bg-[#F1F3F5]" />
            ))}
          </div>
        ) : visibleChallengeStatusPaths.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {visibleChallengeStatusPaths.map(challenge => (
              <DashboardChallengeCard
                key={challenge.id}
                challenge={challenge}
                onClick={() => navigate(`/challenge/${challenge.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[8px] bg-[#F7F8FA] px-5 py-10 text-center text-body font-strong text-[#8A93A5]">
            해당 상태의 챌린지가 없습니다.
          </div>
        )}
      </section>
    </div>
  );
}

function TokenEfficiencyCard() {
  const points = 188;
  const minTokens = 184;
  const maxTokens = 6120;
  const efficiency = points / minTokens;
  const gaugePercent = 56;

  return (
    <section className="surface w-full px-5 py-5 sm:px-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(420px,0.9fr)] xl:items-stretch">
        <div className="flex min-w-0 flex-col justify-between">
          <div>
            <DashboardSectionHeader title="토큰 효율" description="적게 쓸수록 높은 점수" />

            <div className="mt-8 flex flex-wrap items-end gap-x-6 gap-y-4">
              <strong className="text-metric-lg font-bold text-[#FF4854]">
                {efficiency.toFixed(2)}
              </strong>
              <div className="pb-3">
                <p className="text-card-title font-bold text-[#202832]">효율 점수</p>
                <p className="mt-2 text-body font-strong text-[#7B8491]">
                  토큰을 적게 사용할수록 더 높은 효율을 얻어요.
                </p>
              </div>
            </div>

            <div className="mt-9">
              <div className="mb-2 grid grid-cols-5 text-label font-strong text-[#9AA3AF]">
                <span>낮은 효율</span>
                <span className="text-center">0.50</span>
                <span className="text-center">1.00</span>
                <span className="text-center">1.50</span>
                <span className="text-right">높은 효율</span>
              </div>
              <div className="relative h-3 rounded-full bg-[#F1F3F6]">
                <div
                  className="h-full rounded-full bg-[#FF4854]"
                  style={{ width: `${gaugePercent}%` }}
                />
                <span
                  className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-[4px] border-white bg-[#FF4854] shadow-[0_6px_14px_rgba(255,72,84,0.28)]"
                  style={{ left: `calc(${gaugePercent}% - 10px)` }}
                />
                <span
                  className="absolute bottom-[calc(100%+8px)] rounded-[7px] bg-[#FF4854] px-3 py-1 text-body font-bold text-white"
                  style={{ left: `calc(${gaugePercent}% - 24px)` }}
                >
                  {efficiency.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid min-w-0 gap-4 sm:grid-cols-3 xl:grid-cols-3">
          <div className="surface-muted flex min-h-[190px] flex-col justify-end px-6 py-5"></div>
          <div className="flex min-h-[190px] flex-col justify-end rounded-[8px] border border-[#FFB8BE] bg-[#FFF7F8] px-6 py-5 shadow-[0_12px_26px_rgba(255,72,84,0.08)]">
            <p className="text-card-title font-bold text-[#FF4854]">최저 사용량</p>
            <strong className="mt-6 block text-display-lg font-bold text-[#FF4854]">
              {minTokens.toLocaleString()}
            </strong>
            <p className="mt-4 text-body font-strong text-[#8A93A5]">성공한 도전 기준</p>
          </div>
          <div className="surface-muted flex min-h-[190px] flex-col justify-end px-6 py-5">
            <p className="text-card-title font-bold text-[#596575]">최고 사용량</p>
            <strong className="mt-6 block text-display-lg font-bold text-[#202832]">
              {maxTokens.toLocaleString()}
            </strong>
            <p className="mt-4 text-body font-strong text-[#8A93A5]">전체 도전 기준</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChartTooltipDot({ color }) {
  return <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />;
}

function SuccessRateTooltip({ active, payload }) {
  if (!active || !payload?.length) {
    return null;
  }

  const segment = payload[0].payload;

  return (
    <div className="rounded-xl border border-[#E9ECF1] bg-white px-3 py-2 text-label font-strong shadow-[0_14px_30px_rgba(15,23,42,0.12)]">
      <div className="flex items-center gap-2 text-[#202832]">
        <ChartTooltipDot color={segment.color} />
        <span>{segment.label}</span>
      </div>
      <div className="mt-1 text-[#7B8491]">
        {segment.percentage}% · {segment.count}
      </div>
    </div>
  );
}

function SuccessRateCard({ summary }) {
  const [selectedSegmentLabel, setSelectedSegmentLabel] = useState(null);
  const completedCount = summary.success_count + summary.failure_count;
  const hasCompletedSubmission = completedCount > 0;
  const calculatedSuccessRate = completedCount ? (summary.success_count / completedCount) * 100 : 0;
  const successRate = Math.min(
    100,
    Math.max(0, Number(summary.success_rate ?? calculatedSuccessRate))
  );
  const displayedSuccessRate = Number(successRate.toFixed(1));
  const failureRate = Number((100 - displayedSuccessRate).toFixed(1));
  const chartData = [
    {
      label: '성공',
      value: hasCompletedSubmission ? displayedSuccessRate : 0,
      percentage: hasCompletedSubmission ? displayedSuccessRate : 0,
      count: `${summary.success_count.toLocaleString()}회`,
      color: '#FF4854',
    },
    {
      label: '실패',
      value: hasCompletedSubmission ? failureRate : 1,
      percentage: hasCompletedSubmission ? failureRate : 0,
      count: `${summary.failure_count.toLocaleString()}회`,
      color: '#F1F3F6',
    },
  ];
  const selectedSegment = chartData.find(segment => segment.label === selectedSegmentLabel);

  const handleSelectSegment = segment => {
    setSelectedSegmentLabel(current => (current === segment.label ? null : segment.label));
  };

  return (
    <section className="surface w-full px-5 py-4">
      <DashboardSectionHeader
        title="성공률"
        description={`전체 제출 ${summary.total_count.toLocaleString()}회 · 판정 중 ${summary.in_progress_count.toLocaleString()}회`}
      />

      <div className="mt-5 flex flex-col items-center">
        <div className="relative h-[210px] w-[210px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<SuccessRateTooltip />} wrapperStyle={{ zIndex: 20 }} />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={92}
                startAngle={90}
                endAngle={-270}
                paddingAngle={3}
                cornerRadius={8}
                stroke="none"
                onClick={handleSelectSegment}
                isAnimationActive={false}
              >
                {chartData.map(segment => (
                  <Cell
                    key={segment.label}
                    fill={segment.color}
                    opacity={selectedSegment && selectedSegment.label !== segment.label ? 0.42 : 1}
                    style={{ cursor: 'pointer' }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-label font-strong text-[#8A93A5]">
              {selectedSegment ? selectedSegment.label : '성공률'}
            </span>
            <strong className="mt-1 text-page-title font-bold text-[#202832]">
              {selectedSegment
                ? selectedSegment.count
                : hasCompletedSubmission
                  ? `${displayedSuccessRate}%`
                  : '-'}
            </strong>
            {selectedSegment ? (
              <span className="mt-1 text-label font-strong text-[#7B8491]">
                {selectedSegment.percentage}%
              </span>
            ) : null}
          </div>
        </div>

        <div className="mt-5 flex w-full items-center justify-center gap-5">
          {chartData.map(segment => {
            const isSelected = selectedSegmentLabel === segment.label;
            const isDimmed = selectedSegment && !isSelected;

            return (
              <button
                key={segment.label}
                type="button"
                onClick={() => handleSelectSegment(segment)}
                className={`flex cursor-pointer items-center gap-2 text-left transition ${
                  isDimmed ? 'opacity-50' : 'opacity-100'
                }`}
              >
                <ChartTooltipDot color={segment.color} />
                <span className="text-label font-bold text-[#202832]">{segment.label}</span>
                <span className="text-label font-strong text-[#7B8491]">
                  {segment.percentage}% · {segment.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function Dashboard() {
  const queryClient = useQueryClient();
  const login = useAuthStore(state => state.login);
  const dashboardQuery = useDashboardQuery();
  const challengeProblemsQuery = useChallengeProblems();

  useEffect(() => {
    if (!dashboardQuery.data) return;

    const normalizedAccount = normalizeUser(dashboardQuery.data.account);
    login({ ...useAuthStore.getState().teamInfo, ...normalizedAccount });
    queryClient.setQueryData(['account', 'me'], normalizedAccount);
    queryClient.setQueryData(['account', 'usage', 'today'], dashboardQuery.data.usage);
  }, [dashboardQuery.data, login, queryClient]);

  return (
    <div className="w-full bg-white">
      <DashboardBannerSlider />
      {dashboardQuery.isPending ? (
        <section className="mx-auto w-full max-w-[1200px] px-4 py-7 sm:px-6 lg:px-0">
          <div className="surface flex min-h-[320px] items-center justify-center px-6 text-body-lg font-bold text-[#7B8491]">
            대시보드를 불러오는 중입니다.
          </div>
        </section>
      ) : dashboardQuery.isError ? (
        <section className="mx-auto w-full max-w-[1200px] px-4 py-7 sm:px-6 lg:px-0">
          <div className="surface flex min-h-[320px] flex-col items-center justify-center px-6 text-center">
            <p className="text-body-lg font-bold text-[#202832]">대시보드를 불러오지 못했습니다.</p>
            <p className="mt-2 text-body font-strong text-[#8A93A5]">
              {dashboardQuery.error?.message || '잠시 후 다시 시도해 주세요.'}
            </p>
            <button
              type="button"
              onClick={() => dashboardQuery.refetch()}
              className="btn btn-primary btn-md mt-6 min-w-[160px]"
            >
              다시 시도
            </button>
          </div>
        </section>
      ) : (
        <ChallengeActivityHeatmap
          dashboard={dashboardQuery.data}
          challengeProblems={challengeProblemsQuery.data?.items ?? []}
          areChallengeProblemsLoading={challengeProblemsQuery.isPending}
        />
      )}
    </div>
  );
}
