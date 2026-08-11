import React, { useCallback, useMemo, useState } from 'react';
import { Heart, RotateCcw, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ChallengeBannerImage from '@/assets/images/chalbenner.png';
import ProblemImage1 from '@/assets/images/problemimages/p1.png';
import ProblemImage2 from '@/assets/images/problemimages/p2.png';
import ProblemImage3 from '@/assets/images/problemimages/p3.png';
import ProblemImage4 from '@/assets/images/problemimages/p4.png';
import ProblemImage5 from '@/assets/images/problemimages/p5.png';
import ProblemImage6 from '@/assets/images/problemimages/p6.png';
import ProblemImage7 from '@/assets/images/problemimages/p7.png';
import ProblemImage8 from '@/assets/images/problemimages/p8.png';
import ProblemImage9 from '@/assets/images/problemimages/p9.png';
import ProblemImage10 from '@/assets/images/problemimages/p10.png';
import ProblemImage11 from '@/assets/images/problemimages/p11.png';
import { getChallengeDifficultyMeta, getChallengeImage } from '@/utils/challengePresentation';
import {
  useChallengeCategories,
  useChallengeProblems,
  useChallengeStatus,
  useFavoriteChallengeProblems,
} from '@/hooks/useChallenges';

export const PATHS = [
  {
    id: 1,
    title: 'System Hacking ',
    tier: 'Tier 2',
    difficulty: 'Easy',
    category: 'System Hacking',
    tags: ['Skill Path', 'System Hacking'],
    rating: '10.0',
    reviews: 7,
    duration: '9시간 30분',
    price: '1000 포인트',
    level: 'Premium',
    season: '시즌1',
    tone: 'pink',
    featured: true,
    maximumPoints: 100,
    image: ProblemImage1,
  },
  {
    id: 2,
    title: 'Kubernetes Security Audit',
    tier: 'Tier 4',
    difficulty: 'Medium',
    category: 'Cloud',
    tags: ['Skill Path', 'Cloud'],
    rating: '10.0',
    reviews: 1,
    duration: '14시간 45분',
    price: '1200 포인트',
    level: 'Expert',
    season: '시즌1',
    tone: 'cyan',
    maximumPoints: 120,
    image: ProblemImage2,
  },
  {
    id: 3,
    title: 'AWS Security',
    tier: 'Tier 4',
    difficulty: 'Easy',
    category: 'Cloud',
    tags: ['Skill Path', 'Cloud'],
    rating: '10.0',
    reviews: 4,
    duration: '4시간 30분',
    price: '900 포인트',
    level: 'Expert',
    season: '시즌1',
    tone: 'cyan',
    maximumPoints: 100,
    image: ProblemImage3,
  },
  {
    id: 4,
    title: 'GCP Security',
    tier: 'Tier 4',
    difficulty: 'Easy',
    category: 'Cloud',
    tags: ['Skill Path', 'Cloud'],
    rating: '10.0',
    reviews: 11,
    duration: '9시간 45분',
    price: '1100 포인트',
    level: 'Expert',
    season: '시즌1',
    tone: 'cyan',
    maximumPoints: 100,
    image: ProblemImage4,
  },
  {
    id: 5,
    title: 'Azure Security',
    tier: 'Tier 4',
    difficulty: 'Easy',
    category: 'Cloud',
    tags: ['Skill Path', 'Cloud'],
    rating: '10.0',
    reviews: 1,
    duration: '4시간 30분',
    price: '950 포인트',
    level: 'Expert',
    season: '시즌1',
    tone: 'cyan',
    maximumPoints: 100,
    image: ProblemImage5,
  },
  {
    id: 6,
    title: 'System Hacking - Linux Advanced',
    tier: 'Tier 3',
    difficulty: 'Hard',
    category: 'System Hacking',
    tags: ['Skill Path', 'System Hacking'],
    rating: '10.0',
    reviews: 2,
    duration: '17시간 30분',
    price: '2050 포인트',
    level: 'Pro',
    season: '시즌1',
    tone: 'pink',
    featured: true,
    maximumPoints: 120,
    image: ProblemImage6,
  },
  {
    id: 7,
    title: 'How to Use Ghidra',
    tier: 'Tier 1',
    difficulty: 'Easy',
    category: 'Reverse Engineering',
    tags: ['Skill Path', 'Reverse Engineering'],
    rating: '10.0',
    reviews: 3,
    duration: '9시간 45분',
    price: '450 포인트',
    level: 'Starter',
    season: '시즌2',
    tone: 'purple',
    maximumPoints: 80,
    image: ProblemImage7,
  },
  {
    id: 8,
    title: 'Hardware Hacking',
    tier: 'Tier 2',
    difficulty: 'Easy',
    category: 'Hardware',
    tags: ['Skill Path', 'Hardware'],
    rating: '10.0',
    reviews: 2,
    duration: '10시간 45분',
    price: '800 포인트',
    level: 'Pro',
    season: '시즌2',
    tone: 'red',
    maximumPoints: 100,
    image: ProblemImage8,
  },
  {
    id: 9,
    title: 'Cryptography',
    tier: 'Tier 2',
    difficulty: 'Medium',
    category: 'Cryptography',
    tags: ['Skill Path', 'Cryptography'],
    rating: '10.0',
    reviews: 1,
    duration: '35시간 15분',
    price: '2450 포인트',
    level: 'Pro',
    season: '시즌2',
    tone: 'yellow',
    maximumPoints: 100,
    image: ProblemImage9,
  },
  {
    id: 10,
    title: 'Smart Contract Security',
    tier: 'Tier 3',
    difficulty: 'Easy',
    category: 'Blockchain',
    tags: ['Skill Path', 'Blockchain'],
    rating: '10.0',
    reviews: 1,
    duration: '12시간 45분',
    price: '1250 포인트',
    level: 'Pro',
    season: '시즌2',
    tone: 'blue',
    maximumPoints: 120,
    image: ProblemImage10,
  },
  {
    id: 11,
    title: 'Linux Kernel Hacking ',
    tier: 'Tier 3',
    difficulty: 'Hard',
    category: 'System Hacking',
    tags: ['Skill Path', 'System Hacking'],
    rating: '10.0',
    reviews: 2,
    duration: '10시간 30분',
    price: '3650 포인트',
    level: 'Pro',
    season: '시즌2',
    tone: 'pink',
    maximumPoints: 120,
    image: ProblemImage11,
  },
];

const problemStatusMeta = {
  success: {
    label: '해결',
    className: 'text-[#1EC186]',
  },
  failed: {
    label: '실패',
    className: 'text-[#FF4854]',
  },
  in_progress: {
    label: '도전 중',
    className: 'text-[#FFBC4B]',
  },
  untried: {
    label: '미도전',
    className: 'text-white',
  },
};

function ProblemStatusBadge({ status = 'untried' }) {
  const meta = problemStatusMeta[status] ?? problemStatusMeta.untried;

  return (
    <span
      className={`absolute right-3 top-3 z-10 rounded-[7px] bg-[#171C24]/90 px-3 py-1.5 text-label font-bold shadow-[0_8px_18px_rgba(0,0,0,0.24)] ${meta.className}`}
    >
      {meta.label}
    </span>
  );
}

function PathPreview({ path, status = 'untried' }) {
  const hasPreviewCopy = path.sub_title || path.sub_description;

  return (
    <div className="relative h-[180px] overflow-hidden">
      <img
        src={path.image}
        alt={`${path.title} 챌린지`}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
      />
      {path.is_favorite ? (
        <span
          className="absolute bottom-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#FF4854] shadow-[0_6px_16px_rgba(0,0,0,0.2)]"
          aria-label="찜한 문제"
        >
          <Heart className="h-5 w-5 fill-current" />
        </span>
      ) : null}
      <ProblemStatusBadge status={status} />
      {hasPreviewCopy ? (
        <div className="absolute inset-0 z-[5] flex flex-col justify-center bg-[#12070A]/94 p-5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          {path.sub_title ? (
            <p className="text-body-lg font-bold text-white">{path.sub_title}</p>
          ) : null}
          {path.sub_description ? (
            <p className="mt-3 line-clamp-4 whitespace-pre-line text-body font-strong leading-relaxed text-white/78">
              {path.sub_description}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function PathCard({ path, onClick, status = 'untried' }) {
  const difficultyMeta = getChallengeDifficultyMeta(path.difficulty);
  const bestScore = path.best_score ?? 0;

  return (
    <article
      className="surface surface-interactive surface-no-hover-border group flex min-w-0 cursor-pointer flex-col overflow-hidden"
      onClick={onClick}
    >
      <PathPreview path={path} status={status} />
      <div className="flex flex-1 flex-col p-5">
        <h2 className="text-card-title font-bold text-[#151A21]">{path.title}</h2>
        <p className="mt-2 text-body font-strong text-[#66717E]">{path.category}</p>
        <div className="mt-5 grid grid-cols-[0.85fr_1.35fr_1.35fr_0.8fr] divide-x divide-[#D8DDE4] text-label text-[#2E3338]">
          <span className="flex items-center justify-center whitespace-nowrap pr-1 font-strong">
            성공{' '}
            <em className="ml-1 not-italic text-[#FF4854]">
              {(path.successfulUsers ?? path.reviews ?? 0).toLocaleString()}
            </em>
            명
          </span>
          <span className="flex items-center justify-center whitespace-nowrap px-1 font-strong">
            총 성공{' '}
            <em className="mx-1 not-italic text-[#FF4854]">
              {(path.totalSuccesses ?? path.reviews ?? 0).toLocaleString()}
            </em>
            회
          </span>
          <span className="flex items-center justify-center whitespace-nowrap px-1 font-strong">
            <em className="mr-1 not-italic text-[#FF4854]">{bestScore.toLocaleString()}</em>
            포인트 획득
          </span>
          <span className="flex items-center justify-center pl-1">
            <span
              className={`rounded-[4px] px-2 py-1 text-label font-strong ${difficultyMeta.className}`}
            >
              {difficultyMeta.label}
            </span>
          </span>
        </div>
        <button type="button" className="btn btn-primary btn-lg btn-block mt-5">
          문제풀기
        </button>
      </div>
    </article>
  );
}

const ChallengeSection = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [activeListTab, setActiveListTab] = useState('challenges');
  const [activeCategoryId, setActiveCategoryId] = useState('all');
  const statusQuery = useChallengeStatus();
  const categoriesQuery = useChallengeCategories();
  const problemsQuery = useChallengeProblems();
  const favoritesQuery = useFavoriteChallengeProblems({ enabled: activeListTab === 'favorites' });

  const categories = categoriesQuery.data?.items ?? [];
  const serverPaths = useMemo(() => {
    const difficultyOrder = { easy: 0, normal: 1, hard: 2 };
    const sourceProblems =
      activeListTab === 'favorites'
        ? (favoritesQuery.data?.items ?? [])
        : (problemsQuery.data?.items ?? []);

    return sourceProblems
      .filter(problem => !problem.is_tutorial)
      .map((problem, index) => ({
        ...problem,
        image: getChallengeImage(problem.id),
        category: problem.category?.name ?? '일반',
        categoryId: problem.category?.id ?? null,
        tags: [problem.category?.name, problem.difficulty].filter(Boolean),
        difficulty:
          problem.difficulty === 'easy'
            ? 'Easy'
            : problem.difficulty === 'normal'
              ? 'Medium'
              : 'Hard',
        level:
          problem.difficulty === 'easy'
            ? 'Easy'
            : problem.difficulty === 'normal'
              ? 'Normal'
              : 'Hard',
        maximumPoints: problem.max_score,
        successfulUsers: problem.successful_user_count,
        totalSuccesses: problem.total_success_count,
        status: problem.attempt_status === 'not_started' ? 'untried' : problem.attempt_status,
        serverOrder: index,
      }))
      .sort((a, b) => {
        const difficultyDifference =
          (difficultyOrder[a.difficulty.toLowerCase()] ??
            difficultyOrder[a.difficulty === 'Medium' ? 'normal' : 'hard']) -
          (difficultyOrder[b.difficulty.toLowerCase()] ??
            difficultyOrder[b.difficulty === 'Medium' ? 'normal' : 'hard']);
        return difficultyDifference || a.serverOrder - b.serverOrder;
      });
  }, [activeListTab, favoritesQuery.data?.items, problemsQuery.data?.items]);

  const filteredPaths = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return serverPaths.filter(path => {
      const matchesCategory =
        activeCategoryId === 'all' || String(path.categoryId) === String(activeCategoryId);
      const matchesKeyword =
        !normalizedKeyword ||
        [path.title, path.sub_title, path.category, path.difficulty, ...path.tags]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(normalizedKeyword);

      return matchesCategory && matchesKeyword;
    });
  }, [activeCategoryId, keyword, serverPaths]);

  const visiblePaths = filteredPaths;
  const activeCategory =
    activeCategoryId === 'all'
      ? null
      : categories.find(category => String(category.id) === String(activeCategoryId));
  const listTitle = activeCategory
    ? `${activeCategory.name} ${activeListTab === 'favorites' ? '찜한 ' : ''}챌린지`
    : activeListTab === 'favorites'
      ? '찜한 챌린지'
      : '전체 챌린지';
  const activeProblemsQuery = activeListTab === 'favorites' ? favoritesQuery : problemsQuery;
  const isLoading =
    statusQuery.isLoading || categoriesQuery.isLoading || activeProblemsQuery.isLoading;
  const error = statusQuery.error || categoriesQuery.error || activeProblemsQuery.error;

  const handleSearch = useCallback(
    event => {
      event.preventDefault();
      setKeyword(searchInput);
    },
    [searchInput]
  );

  const handleResetSearch = useCallback(() => {
    setSearchInput('');
    setKeyword('');
  }, []);

  const handleSolveProblem = useCallback(
    problemId => {
      navigate(`/challenge/${problemId}`);
    },
    [navigate]
  );

  return (
    <div className="w-full bg-white pb-14">
      <section className="relative mb-8 h-[220px] overflow-hidden rounded-[6px] bg-black md:h-[320px]">
        <img
          src={ChallengeBannerImage}
          alt=""
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/72 via-black/28 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-start justify-center px-6 text-left sm:px-10 md:px-14">
          <h1 className="max-w-full whitespace-nowrap text-card-title font-bold tracking-normal text-white sm:text-page-title md:text-page-title lg:text-display">
            지금 바로 <span className="text-[#FF4854]">Red Teaming</span>에 도전하세요
          </h1>
          <p className="mt-3 max-w-[620px] text-body font-strong text-white/72 sm:text-body-lg md:mt-4 md:text-section-title">
            AI 레드팀 평가로 실제 공격 시나리오를 경험하고,
            <br />
            실전형 보안 역량을 강화하세요.
          </p>
        </div>
      </section>

      <div
        id="challenge-path-section"
        className="mb-8 flex flex-col gap-4 border-b border-[#E6E9EE] pb-5 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-7" role="tablist" aria-label="챌린지 목록">
          {[
            { id: 'challenges', label: '챌린지' },
            { id: 'favorites', label: '찜 목록' },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeListTab === tab.id}
              onClick={() => setActiveListTab(tab.id)}
              className={`cursor-pointer border-b-2 pb-3 text-card-title font-strong transition-colors ${
                activeListTab === tab.id
                  ? 'border-[#FF4854] text-black'
                  : 'border-transparent text-[#8A94A1] hover:text-[#FF4854]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <form onSubmit={handleSearch} className="flex w-full gap-3 sm:w-[min(100%,500px)]">
          <label className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A4ADB8]" />
            <input
              type="search"
              value={searchInput}
              onChange={event => setSearchInput(event.target.value)}
              placeholder="관심 있는 챌린지를 검색해보세요."
              className="h-11 w-full rounded-[12px] border border-[#D8DDE4] bg-white pl-11 pr-4 text-body outline-none transition focus:border-[#FF4854]"
            />
          </label>
          <button type="submit" className="btn btn-primary btn-lg">
            검색
          </button>
          <button
            type="button"
            aria-label="검색 초기화"
            onClick={handleResetSearch}
            className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-[12px] border border-[#FF4854] bg-[#FF4854] text-white shadow-[0_6px_14px_rgba(255,72,84,0.12)] transition hover:-translate-y-0.5 hover:border-[#E73541] hover:bg-[#E73541] hover:shadow-[0_8px_18px_rgba(255,72,84,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4854]/30"
          >
            <RotateCcw className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </form>
      </div>

      {categories.length ? (
        <div className="mb-7 flex flex-wrap gap-2" aria-label="카테고리 필터">
          <button
            type="button"
            onClick={() => setActiveCategoryId('all')}
            className={`cursor-pointer rounded-full border px-4 py-2 text-body font-strong transition-colors ${
              activeCategoryId === 'all'
                ? 'border-[#FF4854] bg-[#FFF0F1] text-[#FF4854]'
                : 'border-[#DDE3EA] text-[#66717E] hover:border-[#FF4854] hover:text-[#FF4854]'
            }`}
          >
            전체
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategoryId(category.id)}
              className={`cursor-pointer rounded-full border px-4 py-2 text-body font-strong transition-colors ${
                activeCategoryId === category.id
                  ? 'border-[#FF4854] bg-[#FFF0F1] text-[#FF4854]'
                  : 'border-[#DDE3EA] text-[#66717E] hover:border-[#FF4854] hover:text-[#FF4854]'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      ) : null}

      <div>
        <section className="min-w-0">
          <div className="mb-5 flex items-center justify-between">
            <h1 className="text-body-lg font-strong text-[#2E3338]">
              {listTitle} <span className="text-[#FF4854]">{visiblePaths.length}</span>
            </h1>
          </div>

          {statusQuery.data?.enabled === false ? (
            <div className="flex min-h-[260px] flex-col items-center justify-center rounded-[12px] border border-[#E3E8EF] bg-[#FAFBFC] px-6 text-center">
              <p className="text-card-title font-bold text-[#2E3338]">
                챌린지 운영이 중지되었습니다.
              </p>
              <p className="mt-2 text-body font-medium text-[#8A94A1]">
                운영이 재개되면 다시 문제에 도전할 수 있습니다.
              </p>
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-1 gap-x-7 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
              {[0, 1, 2].map(index => (
                <div key={index} className="h-[390px] animate-pulse rounded-[12px] bg-[#F1F3F5]" />
              ))}
            </div>
          ) : error ? (
            <div className="flex min-h-[260px] items-center justify-center rounded-[12px] border border-[#FFD3D7] bg-[#FFF8F8] px-6 text-center">
              <p className="text-body-lg font-strong text-[#D93643]">
                {error.message || '챌린지 목록을 불러오지 못했습니다.'}
              </p>
            </div>
          ) : visiblePaths.length > 0 ? (
            <div className="grid grid-cols-1 gap-x-7 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
              {visiblePaths.map(path => (
                <PathCard
                  key={path.id}
                  path={path}
                  status={path.status}
                  onClick={() => handleSolveProblem(path.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[260px] flex-col items-center justify-center rounded-[12px] border border-[#E3E8EF] bg-[#FAFBFC] px-6 text-center">
              {activeListTab === 'favorites' ? (
                <Heart className="h-10 w-10 text-[#C6CDD6]" strokeWidth={1.8} />
              ) : (
                <Search className="h-10 w-10 text-[#C6CDD6]" strokeWidth={1.8} />
              )}
              <p className="mt-4 text-body-lg font-strong text-[#4D5968]">
                {activeListTab === 'favorites'
                  ? '찜한 챌린지가 없습니다.'
                  : '검색 결과가 없습니다.'}
              </p>
              {activeListTab === 'favorites' ? (
                <p className="mt-2 text-body font-medium text-[#8A94A1]">
                  관심 있는 챌린지 상세에서 찜하기를 눌러보세요.
                </p>
              ) : null}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ChallengeSection;
