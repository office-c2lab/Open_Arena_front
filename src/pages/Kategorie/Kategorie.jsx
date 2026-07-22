import React, { useCallback, useMemo, useState } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ChallengeBannerImage from '@/assets/images/chalbenner.png';
import ChallengeCardImage from '@/assets/images/challenge.png';

export const PATHS = [
  {
    id: 1,
    title: 'System Hacking Basics',
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
  },
  {
    id: 2,
    title: 'Kubernetes Security Audit of DreamBank',
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
  },
  {
    id: 11,
    title: 'Linux Kernel Hacking Basics',
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
  },
  {
    id: 12,
    title: 'Linux 101',
    tier: 'Tier 0',
    difficulty: 'Beginner',
    category: 'System Hacking',
    tags: ['Beginners', 'Skill Path'],
    rating: '10.0',
    reviews: 44,
    duration: '1시간',
    price: '무료',
    level: 'Try for Free',
    season: '시즌2',
    tone: 'green',
  },
];

const SEASONS = ['시즌1', '시즌2'];

const CATEGORIES = [
  'System Hacking',
  'Reverse Engineering',
  'Cryptography',
  'Cloud',
  'Blockchain',
];

const FILTER_GROUPS = [
  { key: 'category', title: '카테고리', items: CATEGORIES },
  { key: 'tier', title: 'Tier', items: ['Tier 0', 'Tier 1', 'Tier 2', 'Tier 3', 'Tier 4'] },
  { key: 'difficulty', title: '난이도', items: ['Beginner', 'Easy', 'Medium', 'Hard'] },
];

const DEFAULT_FILTERS = {
  category: '',
  tier: '',
  difficulty: '',
};

const tagColors = {
  Beginner: 'border-[#8FE07A] text-[#38A12A]',
  Easy: 'border-[#9CDE7B] text-[#4FAF2F]',
  Medium: 'border-[#FFBC4B] text-[#C88400]',
  Hard: 'border-[#FF7D8A] text-[#FF4854]',
};

function PathPreview({ path }) {
  return (
    <div className="relative h-[180px] overflow-hidden">
      <img
        src={ChallengeCardImage}
        alt={`${path.title} 챌린지`}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 flex flex-col justify-center bg-[#12070A]/94 p-5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <p className="text-[13px] font-800 leading-[18px] text-white">
          {path.title} 시나리오에서 AI의 보안 규칙과 취약점을 분석해 목표를 달성하세요.
        </p>
        <p className="mt-3 text-[13px] font-900 leading-[18px] text-[#FF5A65]">
          {path.category} 분야의 핵심 보안 과제를 해결하는 것.
        </p>
      </div>
    </div>
  );
}

function PathCard({ path, onClick }) {
  const levelClass =
    path.level === 'Try for Free'
      ? 'bg-[#D8F9E4] text-[#1BAE5B]'
      : path.level === 'Starter'
        ? 'bg-[#3F454C] text-white'
        : 'bg-[#353B44] text-white';

  return (
    <article
      className="group flex min-w-0 cursor-pointer flex-col overflow-hidden rounded-[14px] bg-white shadow-[0_12px_24px_rgba(15,23,42,0.13)] transition hover:-translate-y-1 hover:shadow-[0_18px_30px_rgba(15,23,42,0.18)]"
      onClick={onClick}
    >
      <PathPreview path={path} />
      <div className="flex flex-1 flex-col p-5">
        <h2 className="text-[21px] font-900 text-[#151A21]">{path.title}</h2>
        <p className="mt-2 text-[13px] font-600 leading-[20px] text-[#66717E]">{path.category} 실전 보안 챌린지</p>
        <div className="mt-5 grid grid-cols-[0.85fr_1.35fr_1.35fr_0.8fr] divide-x divide-[#D8DDE4] text-[12px] text-[#2E3338]">
          <span className="flex items-center justify-center whitespace-nowrap pr-1 font-700">
            성공 <em className="ml-1 not-italic text-[#FF4854]">{path.reviews}</em>명
          </span>
          <span className="flex items-center justify-center whitespace-nowrap px-1 font-700">
            평균 <em className="mx-1 not-italic text-[#FF4854]">1,240</em> 토큰
          </span>
          <span className="flex items-center justify-center whitespace-nowrap px-1 font-700">
            최대 <em className="mx-1 not-italic text-[#FF4854]">{path.maximumPoints ?? 100}</em> 포인트
          </span>
          <span className="flex items-center justify-center pl-1">
            <span className={`rounded-[4px] px-2 py-1 text-[12px] font-700 ${levelClass}`}>
              {path.level}
            </span>
          </span>
        </div>
        <button
          type="button"
          className="mt-5 flex h-11 w-full cursor-pointer items-center justify-center rounded-[6px] bg-[#FF6470] text-[14px] font-900 text-white transition hover:bg-[#E94D59]"
        >
          문제풀기
        </button>
      </div>
    </article>
  );
}

function FilterColumn({ title, value, options, onChange }) {
  const allOptions = [{ label: `${title} 전체`, value: '' }, ...options.map(option => ({ label: option, value: option }))];

  return (
    <div className="min-w-0">
      <p className="mb-3 text-[13px] font-900 text-[#2E3338]">{title}</p>
      <div className="flex flex-col gap-2">
        {allOptions.map(option => {
          const isSelected = value === option.value;

          return (
            <button
              key={option.label}
              type="button"
              onClick={() => onChange(option.value)}
              className={`group flex h-9 w-full cursor-pointer items-center gap-2 rounded-[3px] border px-3 text-left text-[12px] font-800 transition ${
                isSelected
                  ? 'border-[#FF4854] bg-[#FFF3F4] text-[#151A21]'
                  : 'border-[#D8DDE4] bg-white text-[#596575] hover:border-[#FFB8BE] hover:text-[#FF4854]'
              }`}
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border transition ${
                  isSelected
                    ? 'border-[#FF4854] bg-[#FF4854]'
                    : 'border-[#C9D0DA] bg-white group-hover:border-[#FF4854]'
                }`}
              >
                {isSelected ? <Check className="h-3 w-3 text-white" strokeWidth={3} /> : null}
              </span>
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SeasonColumn({ value, options, onChange }) {
  const allOptions = [{ label: '전체 시즌', value: '' }, ...options.map(option => ({ label: option, value: option }))];

  return (
    <div className="min-w-0">
      <p className="mb-3 text-[13px] font-900 text-[#2E3338]">시즌</p>
      <div className="flex flex-col gap-2">
        {allOptions.map(option => {
          const isSelected = value === option.value;

          return (
            <button
              key={option.label}
              type="button"
              onClick={() => onChange(option.value)}
              className={`group flex h-9 w-full cursor-pointer items-center gap-2 rounded-[3px] border px-3 text-left text-[12px] font-800 transition ${
                isSelected
                  ? 'border-[#FF4854] bg-[#FFF3F4] text-[#151A21]'
                  : 'border-[#D8DDE4] bg-white text-[#596575] hover:border-[#FFB8BE] hover:text-[#FF4854]'
              }`}
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border transition ${
                  isSelected
                    ? 'border-[#FF4854] bg-[#FF4854]'
                    : 'border-[#C9D0DA] bg-white group-hover:border-[#FF4854]'
                }`}
              >
                {isSelected ? <Check className="h-3 w-3 text-white" strokeWidth={3} /> : null}
              </span>
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const ChallengeSection = () => {
  const navigate = useNavigate();
  const [activeSeason, setActiveSeason] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const filterSummary = useMemo(
    () =>
      [
        activeSeason || '전체 시즌',
        filters.category || '카테고리 전체',
        filters.tier || 'Tier 전체',
        filters.difficulty || '난이도 전체',
      ].join(' | '),
    [activeSeason, filters]
  );

  const filteredPaths = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return PATHS.filter(path =>
      (!activeSeason || path.season === activeSeason) &&
      (!filters.category || path.category === filters.category) &&
      (!filters.tier || path.tier === filters.tier) &&
      (!filters.difficulty || path.difficulty === filters.difficulty) &&
      (!normalizedKeyword ||
        [path.title, path.category, path.difficulty, path.tier, ...path.tags]
          .join(' ')
          .toLowerCase()
          .includes(normalizedKeyword))
    );
  }, [activeSeason, filters, keyword]);

  const visiblePaths = filteredPaths.slice(0, 1);

  const updateFilter = useCallback((key, value) => {
    setFilters(current => ({ ...current, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const handleSearch = useCallback(event => {
    event.preventDefault();
    setKeyword(searchInput);
  }, [searchInput]);

  const handleSolveProblem = useCallback(
    problemId => {
      navigate(`/challenge/${problemId}`);
    },
    [navigate]
  );

  return (
    <div className="w-full bg-white pb-14">
      <section className="relative mb-8 h-[220px] overflow-hidden rounded-[6px] bg-black md:h-[320px]">
        <img src={ChallengeBannerImage} alt="" className="h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/72 via-black/28 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-start justify-center px-6 text-left sm:px-10 md:px-14">
          <h1 className="max-w-full whitespace-nowrap text-[18px] font-900 leading-tight tracking-normal text-white sm:text-[26px] md:text-[34px] lg:text-[42px]">
            지금 바로 <span className="text-[#FF4854]">Red Teaming</span>에 도전하세요
          </h1>
          <p className="mt-3 max-w-[620px] text-[14px] font-700 leading-relaxed text-white/72 sm:text-[17px] md:mt-4 md:text-[22px]">
            AI 레드팀 평가로 실제 공격 시나리오를 경험하고,
            <br />
            실전형 보안 역량을 강화하세요.
          </p>
        </div>
      </section>

      <div
        id="challenge-path-section"
        className={`border-b border-[#E6E9EE] ${isFilterOpen ? 'mb-7 pb-5' : 'mb-5 pb-3'}`}
      >
        <div className={`${isFilterOpen ? 'mb-5' : 'mb-0'} flex items-start justify-between gap-3`}>
          <button
            type="button"
            className="cursor-default border-b-2 border-[#FF4854] pb-3 text-[18px] font-700 text-black"
          >
            {activeSeason || '전체 시즌'}
          </button>
          <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
            {!isFilterOpen ? (
              <p className="min-w-0 truncate text-right text-[12px] font-700 text-[#7A8491]">
                {filterSummary}
              </p>
            ) : null}
            <button
              type="button"
              onClick={() => setIsFilterOpen(current => !current)}
              className={`flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-[3px] border px-3 text-[12px] font-900 transition ${
                isFilterOpen
                  ? 'border-[#FFB8BE] text-[#FF4854]'
                  : 'border-[#D8DDE4] text-[#596575] hover:border-[#FFB8BE] hover:text-[#FF4854]'
              }`}
            >
              {isFilterOpen ? '필터 접기' : '필터 펼치기'}
              <ChevronDown className={`h-4 w-4 transition ${isFilterOpen ? 'rotate-180' : ''}`} strokeWidth={2.4} />
            </button>
          </div>
        </div>

        {isFilterOpen ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <SeasonColumn value={activeSeason} options={SEASONS} onChange={setActiveSeason} />
              {FILTER_GROUPS.map(group => (
                <FilterColumn
                  key={group.key}
                  title={group.title}
                  value={filters[group.key]}
                  options={group.items}
                  onChange={value => updateFilter(group.key, value)}
                />
              ))}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={resetFilters}
                className="flex h-9 min-w-[92px] cursor-pointer items-center justify-center rounded-[3px] border border-[#D8DDE4] bg-white px-3 text-[12px] font-800 text-[#98A1AD] transition hover:border-[#FF4854] hover:text-[#FF4854]"
              >
                초기화
              </button>
            </div>
          </>
        ) : null}
      </div>

      <form onSubmit={handleSearch} className="mb-8 flex gap-3">
        <label className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A4ADB8]" />
          <input
            type="search"
            value={searchInput}
            onChange={event => setSearchInput(event.target.value)}
            placeholder="관심 있는 강의를 검색해보세요."
            className="h-10 w-full rounded-[3px] border border-[#D8DDE4] bg-white pl-11 pr-4 text-[13px] outline-none transition focus:border-[#FF4854]"
          />
        </label>
        <button
          type="submit"
          className="flex h-10 cursor-pointer items-center justify-center rounded-[3px] bg-[#FF4854] px-6 text-[13px] font-900 text-white transition hover:bg-[#E73541]"
        >
          검색
        </button>
      </form>

      <div>
        <section className="min-w-0">
          <div className="mb-5 flex items-center justify-between">
            <h1 className="text-[16px] font-700 text-[#2E3338]">
              {activeSeason || '전체 시즌'} <span className="text-[#FF4854]">{visiblePaths.length}</span>
            </h1>
          </div>

          <div className="grid grid-cols-1 gap-x-7 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
            {visiblePaths.map(path => (
              <PathCard
                key={path.id}
                path={path}
                onClick={() => handleSolveProblem(path.id)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ChallengeSection;
