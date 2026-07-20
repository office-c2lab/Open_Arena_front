import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Check, ChevronDown, Clock3, Search, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ChallengeBannerImage from '@/assets/images/chalbenner.png';

const PATHS = [
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
    level: 'Pro',
    season: '시즌1',
    tone: 'pink',
    featured: true,
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
  { title: '카테고리', items: CATEGORIES },
  { title: 'Tier', items: ['Tier 0', 'Tier 1', 'Tier 2', 'Tier 3', 'Tier 4'] },
  { title: '난이도', items: ['Beginner', 'Easy', 'Medium', 'Hard'] },
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
    <div className="relative flex h-[150px] w-full items-center overflow-hidden bg-[#0B0D18] px-5 text-left">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#120F1D_0%,#250B13_52%,#FF4854_220%)]" />
      <div className="absolute -right-8 -top-10 h-40 w-40 rounded-full border border-[#FF4854]/30" />
      <div className="absolute right-10 bottom-[-54px] h-36 w-36 rounded-full border border-[#FF4854]/20" />
      <strong className="relative z-10 text-[26px] font-900 uppercase leading-[31px] text-white [text-shadow:0_3px_14px_rgba(255,72,84,0.32)]">
        {path.title}
      </strong>
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
      className="group flex min-h-[392px] min-w-0 cursor-pointer flex-col overflow-hidden rounded-[6px] border border-[#E1E6EE] bg-white transition hover:-translate-y-1 hover:border-[#FFB8BE] hover:shadow-[0_16px_36px_rgba(15,23,42,0.08)]"
      onClick={onClick}
    >
      <PathPreview path={path} />
      <div className="flex flex-1 flex-col p-5">
        <h2 className="text-[20px] font-900 leading-[26px] text-[#151A21] transition-colors group-hover:text-[#FF4854]">
          {path.title}
        </h2>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="rounded-[3px] border border-[#C9D8FF] px-1.5 py-0.5 text-[10px] font-600 leading-none text-[#5578EA]">
            {path.tier}
          </span>
          <span
            className={`rounded-[3px] border px-1.5 py-0.5 text-[10px] font-600 leading-none ${tagColors[path.difficulty] ?? tagColors.Easy}`}
          >
            {path.difficulty}
          </span>
          {path.tags.map(tag => (
            <span
              key={tag}
              className="rounded-[3px] border border-[#D7DDE6] px-1.5 py-0.5 text-[10px] font-500 leading-none text-[#677281]"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between text-[12px] text-[#77808C]">
          <span className="flex items-center gap-1 font-700 text-black">
            <Star className="h-3.5 w-3.5 fill-black text-black" />
            {path.rating} <span className="font-500 text-[#77808C]">({path.reviews})</span>
          </span>
          <span className="flex items-center gap-1">
            <Clock3 className="h-3.5 w-3.5" />
            약 {path.duration}
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[12px] font-500 text-[#2E3338]">{path.price}</span>
          <span className={`rounded-[4px] px-2 py-1 text-[11px] font-700 ${levelClass}`}>
            {path.level}
          </span>
        </div>
        <button
          type="button"
          className="mt-auto flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-[4px] bg-[#FF4854] text-[14px] font-900 text-white transition hover:bg-[#E73541]"
        >
          챌린지 보기
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}

function FilterSelect({ label, value, options, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectedLabel = value || `${label} 전체`;
  const allOptions = [{ label: `${label} 전체`, value: '' }, ...options.map(option => ({ label: option, value: option }))];

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = event => {
      if (!dropdownRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);

    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative min-w-[144px]">
      <button
        type="button"
        onClick={() => setIsOpen(current => !current)}
        className={`flex h-9 w-full cursor-pointer items-center justify-between gap-2 rounded-[3px] border bg-white px-3 text-left text-[12px] font-800 outline-none transition ${
          isOpen
            ? 'border-[#FFB8BE] text-[#FF4854] shadow-[0_8px_18px_rgba(255,72,84,0.08)]'
            : 'border-[#D8DDE4] text-[#566170] hover:border-[#FFB8BE] hover:text-[#FF4854]'
        }`}
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition ${isOpen ? 'rotate-180 text-[#FF4854]' : 'text-[#A4ADB8]'}`}
          strokeWidth={2.2}
        />
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-[calc(100%+8px)] z-30 w-[190px] overflow-hidden rounded-[6px] border border-[#E1E6EE] bg-white p-1.5 shadow-[0_18px_40px_rgba(15,23,42,0.14)]">
          {allOptions.map(option => {
            const isSelected = value === option.value;

            return (
              <button
                key={option.label}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`flex h-9 w-full cursor-pointer items-center justify-between gap-3 rounded-[4px] px-3 text-left text-[12px] font-800 transition ${
                  isSelected
                    ? 'bg-[#FFF0F2] text-[#FF4854]'
                    : 'text-[#596575] hover:bg-[#F7F8FA] hover:text-[#FF4854]'
                }`}
              >
                <span className="truncate">{option.label}</span>
                {isSelected ? <Check className="h-4 w-4 shrink-0 text-[#FF4854]" strokeWidth={2.4} /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

const ChallengeSection = () => {
  const navigate = useNavigate();
  const [activeSeason, setActiveSeason] = useState(SEASONS[0]);
  const [searchInput, setSearchInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const filteredPaths = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return PATHS.filter(path =>
      path.season === activeSeason &&
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

      <div id="challenge-path-section" className="mb-7 flex items-center border-b border-[#E6E9EE] pb-4">
        {SEASONS.map((season, index) => {
          const isActive = activeSeason === season;

          return (
            <React.Fragment key={season}>
              <button
                type="button"
                onClick={() => setActiveSeason(season)}
                className={`cursor-pointer border-b-2 pb-3 text-[18px] font-700 transition-colors ${
                  isActive
                    ? 'border-[#FF4854] text-black'
                    : 'border-transparent text-[#9BA4B0] hover:text-[#FF4854]'
                }`}
              >
                {season}
              </button>
              {index < SEASONS.length - 1 && (
                <span className="px-4 pb-3 text-[18px] font-500 text-[#C7CED8]">|</span>
              )}
            </React.Fragment>
          );
        })}
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
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-[16px] font-700 text-[#2E3338]">
              {activeSeason} <span className="text-[#FF4854]">{filteredPaths.length}</span>
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <FilterSelect
                label="카테고리"
                value={filters.category}
                options={FILTER_GROUPS[0].items}
                onChange={value => updateFilter('category', value)}
              />
              <FilterSelect
                label="Tier"
                value={filters.tier}
                options={FILTER_GROUPS[1].items}
                onChange={value => updateFilter('tier', value)}
              />
              <FilterSelect
                label="난이도"
                value={filters.difficulty}
                options={FILTER_GROUPS[2].items}
                onChange={value => updateFilter('difficulty', value)}
              />
              <button
                type="button"
                onClick={resetFilters}
                className="h-9 cursor-pointer rounded-[3px] border border-[#D8DDE4] bg-white px-3 text-[12px] font-800 text-[#98A1AD] transition hover:border-[#FF4854] hover:text-[#FF4854]"
              >
                초기화
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-x-7 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
            {filteredPaths.map(path => (
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
