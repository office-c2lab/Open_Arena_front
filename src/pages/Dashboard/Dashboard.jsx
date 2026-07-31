import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  CircleDashed,
  XCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import UserIcon from '@/assets/icons/user.svg';
import { useAuthStore } from '@/stores/authStore';
import ArenaBannerImage from '@/assets/images/banner.svg';
import ChallengeBannerImage from '@/assets/images/chalbenner.png';
import TutorialBannerImage from '@/assets/images/tutorial_banner.png';
import LlmSafetyBannerImage from '@/assets/images/LLMSAFETY_banner.png';
import LearningBannerImage from '@/assets/images/learning_banner.png';
import { articles as educationArticles } from '@/pages/Education/Education';
import { PATHS as challengePaths, PathCard } from '@/pages/Kategorie/Kategorie';
import { TUTORIALS } from '@/pages/Tutorial/TutorialList';

const notices = [
  ['공지사항', '2026년 6월의 아레나 노트', '2026.07.01.'],
  ['공지사항', '새로워진 학습 메뉴, 이렇게 달라졌어요', '2026.06.08.'],
  ['공지사항', '2026년 5월의 아레나 노트', '2026.06.05.'],
];

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

const dayLabels = ['월', '화', '수', '목', '금', '토', '일'];
const timeBlocks = Array.from({ length: 8 }, (_, index) => {
  const startHour = index * 3;

  return {
    startHour,
    hours: [startHour, startHour + 1, startHour + 2],
    label: `${String(startHour).padStart(2, '0')}:00-${String(startHour + 3).padStart(2, '0')}:00`,
  };
});

const problemStatusById = {
  1: { status: 'solved', attempts: 4, bestScore: 100 },
  2: { status: 'failed', attempts: 3, bestScore: 0 },
  3: { status: 'solved', attempts: 5, bestScore: 88 },
  4: { status: 'untried', attempts: 0, bestScore: 0 },
  5: { status: 'failed', attempts: 2, bestScore: 0 },
  6: { status: 'untried', attempts: 0, bestScore: 0 },
};

const problemStatusMeta = {
  solved: {
    label: '풀었음',
    icon: CheckCircle2,
    chipClass: 'bg-[#ECFDF3] text-[#079C4C]',
    iconClass: 'text-[#079C4C]',
  },
  failed: {
    label: '못 풀었음',
    icon: XCircle,
    chipClass: 'bg-[#FFF0F2] text-[#FF4854]',
    iconClass: 'text-[#FF4854]',
  },
  untried: {
    label: '미도전',
    icon: CircleDashed,
    chipClass: 'bg-[#F5F6F8] text-[#7B8491]',
    iconClass: 'text-[#7B8491]',
  },
};

const dashboardSummaryStats = [
  { label: '현재 순위', value: '24위', subText: '전체 참가자 기준' },
  { label: '푼 문제', value: '2문제', subText: '전체 6문제 중' },
  { label: '총 획득 포인트', value: '188점', subText: '이번 주 기준' },
  { label: '다음 순위까지', value: '12점', subText: '23위 추월까지' },
];

const recentAttemptProblemIds = [3, 2, 1];

function getActivityCount(date, dayIndex, startHour) {
  const daySeed = date.getDate() + (date.getMonth() + 1) * 7 + dayIndex * 5 + startHour * 3;

  if (startHour < 6 || startHour > 21 || daySeed % 11 === 0) return 0;
  if (daySeed % 23 === 0) return 6;
  if (daySeed % 17 === 0) return 5;
  if (daySeed % 7 === 0) return 4;
  if (daySeed % 5 === 0) return 3;
  if (daySeed % 3 === 0) return 2;

  return 1;
}

function getActivityLevel(count) {
  if (count === 0) return 0;
  if (count <= 1) return 1;
  if (count <= 2) return 2;
  if (count <= 4) return 3;
  if (count <= 5) return 4;

  return 5;
}

function buildActivityHeatmap() {
  const today = new Date();
  const mondayOffset = (today.getDay() + 6) % 7;
  const startDate = new Date(today);
  startDate.setHours(0, 0, 0, 0);
  startDate.setDate(startDate.getDate() - mondayOffset);

  const days = Array.from({ length: 7 }, (_, dayIndex) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + dayIndex);
    const blocks = timeBlocks.map(({ label, startHour, hours }) => {
      const cells = hours.map(hour => {
        const count = getActivityCount(date, dayIndex, hour);

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
      blocks,
    };
  });

  return {
    days,
    totalCount: days.reduce(
      (daySum, day) =>
        daySum +
        day.blocks.reduce(
          (blockSum, block) =>
            blockSum + block.cells.reduce((cellSum, cell) => cellSum + cell.count, 0),
          0
        ),
      0
    ),
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
                    <h1 className="whitespace-nowrap text-[24px] font-900 leading-tight text-white [text-shadow:0_3px_16px_rgba(0,0,0,0.8)] sm:text-[36px] md:text-[46px]">
                      <span className="text-[#FF4854]">Beginners</span>를 위한 완벽한 입문 가이드
                      시작하기
                    </h1>
                    <p className="mt-3 text-[15px] font-800 leading-tight text-white/72 [text-shadow:0_2px_10px_rgba(0,0,0,0.65)] sm:text-[20px] md:text-[24px]">
                      레드티밍이 뭔가요? ARENA는 어떻게 시작하나요?
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate('/tutorial')}
                      className="group mt-7 flex cursor-pointer items-center gap-4 text-[18px] font-900 text-white transition-colors hover:text-[#FF4854] sm:text-[24px] md:mt-9"
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
                    <h1 className="whitespace-nowrap text-[24px] font-900 leading-tight text-white [text-shadow:0_3px_16px_rgba(0,0,0,0.8)] sm:text-[36px] md:text-[46px]">
                      <span className="text-[#FF4854]">LLM Safety</span> 학습 자료로 시작하세요
                    </h1>
                    <p className="mt-3 text-[15px] font-800 leading-tight text-white/72 [text-shadow:0_2px_10px_rgba(0,0,0,0.65)] sm:text-[20px] md:text-[24px]">
                      AI Red Teaming을 더 깊게 이해하고 싶다면
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate('/education')}
                      className="group mt-7 flex cursor-pointer items-center gap-4 text-[18px] font-900 text-white transition-colors hover:text-[#FF4854] sm:text-[24px] md:mt-9"
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
                    <h1 className="max-w-full whitespace-nowrap text-[18px] font-900 leading-tight tracking-normal text-white sm:text-[26px] md:text-[34px] lg:text-[42px]">
                      {banner.type === 'challenge' ? (
                        <>
                          지금 바로 <span className="text-[#FF4854]">Red Teaming</span>에 도전하세요
                        </>
                      ) : (
                        banner.title
                      )}
                    </h1>
                    <p className="mt-3 max-w-[620px] text-[14px] font-700 leading-relaxed text-white/72 sm:text-[17px] md:mt-4 md:text-[22px]">
                      {banner.caption}
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate('/kategorie')}
                      className="group mt-7 flex cursor-pointer items-center gap-4 text-[18px] font-900 text-white transition-colors hover:text-[#FF4854] sm:text-[24px] md:mt-9"
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
            className={`relative flex h-[74px] w-[74px] items-center justify-center overflow-hidden rounded-full ${hasProfileImage ? 'bg-[#F2F4F6]' : 'border border-[#E6EAF0] bg-[#F2F4F6]'}`}
          >
            <img
              src={profileImage}
              alt=""
              className={
                hasProfileImage ? 'h-full w-full object-cover' : 'h-11 w-11 opacity-35 grayscale'
              }
            />
          </div>
          <div className="min-w-0 flex-1 pb-1">
            <div className="flex items-center justify-between gap-2">
              <div className="truncate text-[18px] font-900 text-[#3A414B]">{displayName}</div>
              <div className="shrink-0 text-[12px] font-800 text-[#FF4854]">{membershipLabel}</div>
            </div>
            <p className="mt-1 truncate text-[12px] font-600 text-[#8A93A5]">{displayEmail}</p>
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
                <p className="text-[10px] font-800 text-[#A0A8B3]">{label}</p>
                <p className="mt-1 text-[16px] font-900 text-[#4B5563]">{value}</p>
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
                <p className="text-[10px] font-800 text-[#A0A8B3]">{label}</p>
                <p className="mt-1 text-[16px] font-900 text-[#4B5563]">{value}</p>
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
        <h2 className="text-[14px] font-900 text-[#2E3338]">진행중인 챌린지</h2>
        <button
          type="button"
          onClick={onShowDetails}
          className="flex cursor-pointer items-center gap-1 text-[12px] font-900 text-[#FF4854]"
        >
          자세히 보기 <ArrowRight className="h-3 w-3" />
        </button>
      </div>
      <div className="surface p-4">
        <div className="flex items-start gap-3">
          <div className="relative flex h-16 w-20 shrink-0 items-center overflow-hidden bg-[#0B0D18] px-2">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#120F1D_0%,#250B13_52%,#FF4854_220%)]" />
            <strong className="relative text-[11px] font-900 leading-[12px] text-white">
              {challenge.title}
            </strong>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-800 text-[#FF4854]">
              {challenge.tier} · {challenge.difficulty}
            </p>
            <p className="mt-1 line-clamp-2 text-[14px] font-900 leading-[18px] text-[#2E3338]">
              {challenge.title}
            </p>
            <p className="mt-1 truncate text-[11px] font-600 text-[#8A93A5]">
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
        <h2 className="text-[14px] font-900 text-[#2E3338]">진행중인 학습</h2>
        <button
          type="button"
          onClick={onShowDetails}
          className="flex cursor-pointer items-center gap-1 text-[12px] font-900 text-[#FF4854]"
        >
          자세히 보기 <ArrowRight className="h-3 w-3" />
        </button>
      </div>
      <div className="surface p-4">
        <div className="flex items-start gap-3">
          <div className="relative flex h-16 w-20 shrink-0 items-center overflow-hidden bg-[#0B0D18] px-2">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#120F1D_0%,#250B13_52%,#FF4854_220%)]" />
            <strong className="relative text-[11px] font-900 leading-[12px] text-white">
              {article.visualTitle}
            </strong>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-800 text-[#FF4854]">{article.category}</p>
            <p className="mt-1 truncate text-[14px] font-900 text-[#2E3338]">{article.title}</p>
            <p className="mt-1 line-clamp-2 text-[11px] font-600 leading-[16px] text-[#8A93A5]">
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
      <h1 className="text-[22px] font-900 text-[#151A21]">학습</h1>

      <div className="mt-5 flex flex-wrap items-center gap-3 text-[13px] font-800">
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
              <strong className="relative text-[17px] font-900 leading-[19px] text-white">
                {article.visualTitle}
              </strong>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-800 text-[#FF4854]">
                {article.category} · {article.date}
              </p>
              <h2 className="mt-2 text-[18px] font-900 text-[#151A21]">{article.title}</h2>
              <p className="mt-2 line-clamp-2 text-[13px] font-500 leading-[20px] text-[#66717E]">
                {article.summary}
              </p>
              <p className="mt-3 text-[11px] font-700 text-[#8A93A5]">{article.readTime} 읽기</p>
            </div>
          </article>
        ))}
        {!visibleArticles.length ? (
          <p className="py-12 text-center text-[13px] font-700 text-[#8A93A5]">
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
      <h1 className="text-[22px] font-900 text-[#151A21]">튜토리얼</h1>
      <div className="mt-5 flex items-center gap-3 text-[13px] font-800">
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
              <strong className="relative text-[17px] font-900 leading-[19px] text-white">
                {tutorial.title}
              </strong>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-800 text-[#FF4854]">
                {tutorial.tier} · {tutorial.difficulty}
              </p>
              <h2 className="mt-2 text-[18px] font-900 text-[#151A21]">{tutorial.title}</h2>
              <p className="mt-2 text-[13px] font-500 text-[#66717E]">{tutorial.category}</p>
              <p className="mt-3 text-[11px] font-700 text-[#8A93A5]">약 {tutorial.duration}</p>
            </div>
          </article>
        ))}
        {!visibleTutorials.length ? (
          <p className="py-12 text-center text-[13px] font-700 text-[#8A93A5]">
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
      <h1 className="text-[22px] font-900 text-[#151A21]">챌린지</h1>
      <div className="mt-5 flex items-center gap-3 text-[13px] font-800">
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
              <strong className="relative text-[17px] font-900 leading-[19px] text-white">
                {challenge.title}
              </strong>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-800 text-[#FF4854]">
                {challenge.tier} · {challenge.difficulty}
              </p>
              <h2 className="mt-2 text-[18px] font-900 text-[#151A21]">{challenge.title}</h2>
              <p className="mt-2 text-[13px] font-500 text-[#66717E]">{challenge.category}</p>
              <p className="mt-3 text-[11px] font-700 text-[#8A93A5]">약 {challenge.duration}</p>
            </div>
          </article>
        ))}
        {!visibleChallenges.length ? (
          <p className="py-12 text-center text-[13px] font-700 text-[#8A93A5]">
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
        <h2 className="text-[14px] font-900 text-[#2E3338]">진행중인 튜토리얼</h2>
        <button
          type="button"
          onClick={onShowDetails}
          className="flex cursor-pointer items-center gap-1 text-[12px] font-900 text-[#FF4854]"
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
              <p className="text-[13px] font-900 text-[#2E3338]">튜토리얼 입문 여정</p>
              <p className="mt-1 text-[11px] font-600 text-[#8A93A5]">
                튜토리얼 완료까지 4개 남았어요!
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div className="h-1 min-w-0 flex-1 overflow-hidden rounded-full bg-white">
              <div className="h-full w-1/5 rounded-full bg-[#FF4854]" />
            </div>
            <span className="text-[11px] font-800 text-[#FF4854]">20%</span>
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
                  <p className="min-w-0 truncate text-[13px] font-900 text-[#2E3338]">
                    {tutorial.title}
                  </p>
                  <span
                    className={`shrink-0 text-[11px] font-800 ${status === '완료' ? 'text-[#1BAE5B]' : 'text-[#A0A8B3]'}`}
                  >
                    {status}
                  </span>
                </button>

                {isSelected ? (
                  <div className="mb-3 flex items-start gap-3">
                    <div className="relative flex h-16 w-20 shrink-0 items-center overflow-hidden bg-[#0B0D18] px-2">
                      <div className="absolute inset-0 bg-[linear-gradient(135deg,#120F1D_0%,#250B13_52%,#FF4854_220%)]" />
                      <strong className="relative text-[11px] font-900 leading-[12px] text-white">
                        {tutorial.title}
                      </strong>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-800 text-[#FF4854]">
                        {tutorial.tier} · {tutorial.difficulty}
                      </p>
                      <p className="mt-1 line-clamp-2 text-[14px] font-900 leading-[18px] text-[#2E3338]">
                        {tutorial.title}
                      </p>
                      <p className="mt-1 truncate text-[11px] font-600 text-[#8A93A5]">
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

function Timeline() {
  return (
    <section className="lg:min-h-[308px]">
      <div className="mb-6 border-b border-[#DDE3EA] pb-3">
        <h2 className="text-[18px] font-900 text-[#2E3338]">공지사항</h2>
      </div>

      <div className="space-y-5">
        {notices.map(([category, title, date]) => (
          <div
            key={title}
            className="grid grid-cols-[96px_58px_minmax(0,1fr)_110px] items-center gap-4 text-[14px]"
          >
            <span className="font-700 text-[#6B7280]">{category}</span>
            <span className="w-fit rounded-[3px] border border-[#FFB8BE] bg-[#FFF0F2] px-3 py-1 text-[12px] font-800 text-[#FF4854]">
              new
            </span>
            <strong className="truncate font-900 text-black">{title}</strong>
            <span className="text-right font-700 text-[#9AA3AF]">{date}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ChallengeActivityHeatmap() {
  const { days, totalCount } = useMemo(() => buildActivityHeatmap(), []);

  return (
    <section className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 px-4 py-6 sm:px-6 lg:px-0">
      <DashboardNoticeCard />
      <DashboardProfileSummaryCard />
      <TokenEfficiencyCard />
      <div className="grid gap-5 lg:grid-cols-[max-content_minmax(0,1fr)] lg:items-stretch">
        <div className="surface max-w-full px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-[18px] font-900 leading-none text-[#202832]">도전 활동 히트맵</h2>
            <p className="mt-2 text-[14px] font-700 text-[#6F7885]">일별 도전 참여 현황</p>
          </div>

          <div className="mt-5 overflow-x-auto pb-1">
            <div className="w-max">
              <div className="grid grid-cols-[32px_repeat(24,22px)] gap-x-[6px] gap-y-[6px]">
                {days.map((day, dayIndex) => {
                  const cells = day.blocks.flatMap(block => block.cells);

                  return (
                    <React.Fragment key={dayLabels[dayIndex]}>
                      <span className="flex h-[22px] items-center text-[14px] font-900 text-[#596575]">
                        {dayLabels[dayIndex]}
                      </span>
                      {cells.map(cell => (
                        <div
                          key={`${dayLabels[dayIndex]}-${cell.hour}`}
                          title={`${day.date.toLocaleDateString('ko-KR')} ${String(cell.hour).padStart(2, '0')}:00 도전 ${cell.count}회`}
                          className={`h-[22px] w-[22px] rounded-[5px] ${activityLevels[cell.level]}`}
                        />
                      ))}
                    </React.Fragment>
                  );
                })}
              </div>

              <div className="mt-5 flex items-center justify-between gap-4 text-[14px] font-800 text-[#596575]">
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
                  <strong className="font-900 text-[#202832]">
                    {totalCount.toLocaleString()}회
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex min-w-0 w-full flex-col gap-5">
          <SuccessRateCard />
        </div>
      </div>
      <RecentAttemptProblemsCard />
      <ProblemSolveStatusCard />
    </section>
  );
}

function DashboardNoticeCard() {
  return (
    <section className="w-full">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-[18px] font-900 leading-none text-[#202832]">공지사항</h2>
          <p className="mt-2 text-[14px] font-700 text-[#6F7885]">ARENA 업데이트와 안내를 확인하세요</p>
        </div>
        <button type="button" className="flex cursor-pointer items-center gap-1 text-[13px] font-900 text-[#FF4854]">
          전체 보기 <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-5 divide-y divide-[#EEF1F5]">
        {notices.map(([category, title, date]) => (
          <article key={title} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-[#FFB8BE] bg-[#FFF0F2] px-2.5 py-1 text-[11px] font-900 text-[#FF4854]">
                  new
                </span>
                <span className="text-[12px] font-800 text-[#7B8491]">{category}</span>
              </div>
              <h3 className="mt-2 truncate text-[15px] font-900 text-[#202832]">{title}</h3>
            </div>
            <time className="text-[12px] font-800 text-[#9AA3AF]">{date}</time>
          </article>
        ))}
      </div>
    </section>
  );
}

function DashboardProfileSummaryCard() {
  const teamInfo = useAuthStore(state => state.teamInfo);
  const displayName = teamInfo?.teamname || teamInfo?.username || 'ARENA 유저';
  const displayEmail = teamInfo?.login_id || teamInfo?.email || 'arena@example.com';
  const profileImage = teamInfo?.profileImage || UserIcon;
  const hasProfileImage = Boolean(teamInfo?.profileImage);

  return (
    <section className="surface w-full px-5 py-5 sm:px-6">
      <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-center">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-full ${hasProfileImage ? 'bg-[#F2F4F6]' : 'border border-[#E6EAF0] bg-[#F2F4F6]'}`}
          >
            <img
              src={profileImage}
              alt=""
              className={
                hasProfileImage ? 'h-full w-full object-cover' : 'h-10 w-10 opacity-35 grayscale'
              }
            />
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-[20px] font-900 text-[#202832]">{displayName}</h2>
            <p className="mt-1 truncate text-[13px] font-700 text-[#7B8491]">{displayEmail}</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {dashboardSummaryStats.map(stat => (
            <div
              key={stat.label}
              className="surface-muted px-4 py-3"
            >
              <p className="text-[12px] font-800 text-[#7B8491]">{stat.label}</p>
              <strong className="mt-2 block text-[22px] font-900 leading-none text-[#202832]">
                {stat.value}
              </strong>
              <p className="mt-2 truncate text-[11px] font-700 text-[#9AA3AF]">{stat.subText}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RecentAttemptProblemsCard() {
  const navigate = useNavigate();
  const recentProblems = recentAttemptProblemIds
    .map(problemId => {
      const problem = challengePaths.find(path => path.id === problemId);

      return problem || null;
    })
    .filter(Boolean);

  const handleSolveProblem = problemId => {
    navigate(`/challenge/${problemId}`);
  };

  return (
    <section className="w-full">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-[18px] font-900 leading-none text-[#202832]">최근 시도한 문제</h2>
          <p className="mt-2 text-[14px] font-700 text-[#6F7885]">
            마지막으로 도전한 문제를 이어서 확인하세요
          </p>
        </div>
        <button
          type="button"
          className="flex cursor-pointer items-center gap-1 text-[13px] font-900 text-[#FF4854]"
        >
          전체 보기 <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        {recentProblems.map(problem => (
          <PathCard
            key={problem.id}
            path={problem}
            onClick={() => handleSolveProblem(problem.id)}
          />
        ))}
      </div>
    </section>
  );
}

function ProblemSolveStatusCard() {
  const problems = challengePaths.slice(0, 6).map(problem => {
    const status = problemStatusById[problem.id] || {
      status: 'untried',
      attempts: 0,
      bestScore: 0,
    };

    return {
      ...problem,
      ...status,
    };
  });

  const solvedCount = problems.filter(problem => problem.status === 'solved').length;

  return (
    <section className="w-full">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-[18px] font-900 leading-none text-[#202832]">문제 풀이 현황</h2>
          <p className="mt-2 text-[14px] font-700 text-[#6F7885]">
            어떤 문제를 풀었는지 한눈에 확인하세요
          </p>
        </div>
        <div className="rounded-full bg-[#FFF0F2] px-4 py-2 text-[13px] font-900 text-[#FF4854]">
          {solvedCount} / {problems.length} 완료
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {problems.map(problem => {
          const meta = problemStatusMeta[problem.status];

          return (
            <article
              key={problem.id}
              className="surface-muted flex min-h-[104px] flex-col justify-between p-4"
            >
              <h3 className="line-clamp-2 text-[16px] font-900 leading-[22px] text-[#202832]">
                {problem.title}
              </h3>

              <div className="mt-4 flex items-center justify-between gap-3">
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-[12px] font-900 ${meta.chipClass}`}
                >
                  {meta.label}
                </span>
                <strong className="text-[16px] font-900 text-[#202832]">
                  {problem.bestScore}점
                </strong>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function TokenEfficiencyCard() {
  const points = 188;
  const minTokens = 184;
  const maxTokens = 6120;
  const efficiency = points / minTokens;
  const efficiencyPercent = 82;

  return (
    <section className="surface w-full px-5 py-5 sm:px-6">
      <div className="grid gap-5 lg:grid-cols-2 lg:items-stretch">
        <div className="flex min-w-0 flex-col justify-between">
          <div>
            <h2 className="text-[18px] font-900 leading-none text-[#202832]">토큰 효율</h2>
            <p className="mt-2 text-[14px] font-700 text-[#6F7885]">적게 쓸수록 높은 점수</p>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-[13px] font-800 text-[#7B8491]">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <span>효율 점수</span>
                <span className="inline-flex items-center gap-1.5">
                  효율
                  <strong className="text-[16px] font-900 leading-none text-[#202832]">
                    {efficiency.toFixed(2)}
                  </strong>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  포인트
                  <strong className="text-[16px] font-900 leading-none text-[#202832]">
                    {points}
                  </strong>
                </span>
              </div>
              <span>{efficiencyPercent}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-[#F1F3F6]">
              <div className="h-full rounded-full bg-[#FF4854]" style={{ width: `${efficiencyPercent}%` }} />
            </div>
          </div>
        </div>

        <div className="grid min-w-0 grid-cols-2 gap-3">
          <div className="surface-muted flex flex-col justify-between px-5 py-4">
            <p className="text-[13px] font-800 text-[#7B8491]">최소 소모 토큰</p>
            <strong className="mt-4 block text-[28px] font-900 leading-none text-[#FF4854]">
              {minTokens.toLocaleString()}
            </strong>
            <p className="mt-2 text-[12px] font-700 text-[#9AA3AF]">단일 성공 기록</p>
          </div>
          <div className="surface-muted flex flex-col justify-between px-5 py-4">
            <p className="text-[13px] font-800 text-[#7B8491]">최대 소모 토큰</p>
            <strong className="mt-4 block text-[28px] font-900 leading-none text-[#202832]">
              {maxTokens.toLocaleString()}
            </strong>
            <p className="mt-2 text-[12px] font-700 text-[#9AA3AF]">전체 도전 기준</p>
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
    <div className="rounded-xl border border-[#E9ECF1] bg-white px-3 py-2 text-[12px] font-800 shadow-[0_14px_30px_rgba(15,23,42,0.12)]">
      <div className="flex items-center gap-2 text-[#202832]">
        <ChartTooltipDot color={segment.color} />
        <span>{segment.label}</span>
      </div>
      <div className="mt-1 text-[#7B8491]">
        {segment.value}% · {segment.count}
      </div>
    </div>
  );
}

function SuccessRateCard() {
  const [selectedSegmentLabel, setSelectedSegmentLabel] = useState(null);
  const successRate = 68;
  const chartData = [
    { label: '성공', value: successRate, count: '17회', color: '#FF4854' },
    { label: '실패', value: 100 - successRate, count: '8회', color: '#F1F3F6' },
  ];
  const selectedSegment = chartData.find(segment => segment.label === selectedSegmentLabel);

  const handleSelectSegment = segment => {
    setSelectedSegmentLabel(current => (current === segment.label ? null : segment.label));
  };

  return (
    <section className="surface w-full px-5 py-4">
      <div>
        <h2 className="text-[18px] font-900 leading-none text-[#202832]">성공률</h2>
        <p className="mt-2 text-[14px] font-700 text-[#6F7885]">이번 주 도전 결과</p>
      </div>

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
            <span className="text-[12px] font-800 text-[#8A93A5]">
              {selectedSegment ? selectedSegment.label : '성공률'}
            </span>
            <strong className="mt-1 text-[32px] font-900 leading-none text-[#202832]">
              {selectedSegment ? selectedSegment.count : `${successRate}%`}
            </strong>
            {selectedSegment ? (
              <span className="mt-1 text-[12px] font-800 text-[#7B8491]">
                {selectedSegment.value}%
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
                <span className="text-[12px] font-900 text-[#202832]">{segment.label}</span>
                <span className="text-[12px] font-800 text-[#7B8491]">
                  {segment.value}% · {segment.count}
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
  return (
    <div className="w-full bg-white">
      <DashboardBannerSlider />
      <ChallengeActivityHeatmap />
    </div>
  );
}
