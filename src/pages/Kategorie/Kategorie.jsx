import React, { useCallback, useMemo, useState } from 'react';
import { Bookmark, Clock3, Search, Star } from 'lucide-react';
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
    tone: 'green',
  },
];

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

const TONE_CLASSES = {
  pink: {
    bg: 'bg-[#FFF0F7]',
    line: 'border-[#FF87BA]/55',
    flag: 'bg-[#FF45A2]',
    text: 'text-[#2F2F36]',
  },
  cyan: {
    bg: 'bg-[#E9FBFF]',
    line: 'border-[#6FDBEA]/70',
    flag: 'bg-[#5ED9E8]',
    text: 'text-[#168BA0]',
  },
  purple: {
    bg: 'bg-[#F1EDFF]',
    line: 'border-[#9C7CFF]/60',
    flag: 'bg-[#8057FF]',
    text: 'text-[#4F39A8]',
  },
  red: {
    bg: 'bg-[#FFF0F0]',
    line: 'border-[#FF7A7A]/55',
    flag: 'bg-[#FF4854]',
    text: 'text-[#4A2D2F]',
  },
  yellow: {
    bg: 'bg-[#FFF8E5]',
    line: 'border-[#F2C14E]/65',
    flag: 'bg-[#FFBD3E]',
    text: 'text-[#5D4515]',
  },
  blue: {
    bg: 'bg-[#EEF3FF]',
    line: 'border-[#88A8FF]/60',
    flag: 'bg-[#4D6DB8]',
    text: 'text-[#283C78]',
  },
  green: {
    bg: 'bg-[#F1FFE8]',
    line: 'border-[#91D76D]/65',
    flag: 'bg-[#76C94D]',
    text: 'text-[#315A23]',
  },
};

const tagColors = {
  Beginner: 'border-[#8FE07A] text-[#38A12A]',
  Easy: 'border-[#9CDE7B] text-[#4FAF2F]',
  Medium: 'border-[#FFBC4B] text-[#C88400]',
  Hard: 'border-[#FF7D8A] text-[#FF4854]',
};

function PathPreview({ path }) {
  const tone = TONE_CLASSES[path.tone] ?? TONE_CLASSES.pink;

  return (
    <div className={`relative h-[156px] overflow-hidden rounded-[4px] ${tone.bg}`}>
      <div className="absolute inset-0 opacity-90">
        <div
          className={`absolute -left-10 top-10 h-32 w-32 rounded-full border ${tone.line}`}
        />
        <div
          className={`absolute left-[42%] -top-10 h-36 w-36 rounded-full border ${tone.line}`}
        />
        <div
          className={`absolute right-7 bottom-5 h-28 w-28 rounded-full border ${tone.line}`}
        />
        <div className={`absolute left-8 top-6 h-28 w-[1px] rotate-[29deg] ${tone.line} border-l`} />
        <div className={`absolute left-[53%] top-0 h-44 w-[1px] rotate-[29deg] ${tone.line} border-l`} />
        <div className={`absolute right-10 top-4 h-32 w-[1px] rotate-[29deg] ${tone.line} border-l`} />
      </div>
      <div className={`absolute right-4 top-0 h-12 w-8 ${tone.flag}`}>
        <Bookmark className="mx-auto mt-2 h-4 w-4 fill-white text-white" strokeWidth={1.8} />
        <div className="absolute bottom-[-1px] left-0 h-0 w-0 border-l-[16px] border-r-[16px] border-t-[10px] border-l-transparent border-r-transparent border-t-white/90" />
      </div>
      <h3 className={`relative z-10 max-w-[76%] p-4 text-[22px] font-500 leading-[25px] ${tone.text}`}>
        {path.title}
      </h3>
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
    <article className="group min-w-0 cursor-pointer" onClick={onClick}>
      <PathPreview path={path} />
      <div className="pt-3">
        <h2 className="min-h-[42px] text-[16px] font-700 leading-[21px] text-black transition-colors group-hover:text-[#FF4854]">
          {path.title}
        </h2>
        <div className="mt-2 flex flex-wrap gap-1">
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
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[12px] font-500 text-[#2E3338]">{path.price}</span>
          <span className={`rounded-[4px] px-2 py-1 text-[11px] font-700 ${levelClass}`}>
            {path.level}
          </span>
        </div>
      </div>
    </article>
  );
}

function FilterGroup({ title, items }) {
  return (
    <section className="border-b border-[#E2E6EA] pb-5">
      <h3 className="mb-3 text-[13px] font-700 text-[#33383F]">{title}</h3>
      <div className="space-y-2">
        {items.map(item => (
          <label key={item} className="flex cursor-pointer items-center gap-2 text-[12px] text-[#606B78]">
            <input type="checkbox" className="h-3.5 w-3.5 cursor-pointer accent-[#FF4854]" />
            {item}
          </label>
        ))}
      </div>
    </section>
  );
}

const ChallengeSection = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Path');
  const [keyword, setKeyword] = useState('');

  const filteredPaths = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    if (!normalizedKeyword) return PATHS;

    return PATHS.filter(path =>
      [path.title, path.category, path.difficulty, path.tier, ...path.tags]
        .join(' ')
        .toLowerCase()
        .includes(normalizedKeyword)
    );
  }, [keyword]);

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

      <div id="challenge-path-section" className="mb-7 flex items-center gap-3 border-b border-[#E6E9EE] pb-4">
        <button
          type="button"
          onClick={() => setActiveTab('Path')}
          className={`cursor-pointer text-[18px] font-700 transition-colors ${
            activeTab === 'Path' ? 'text-black' : 'text-[#9BA4B0]'
          }`}
        >
          Path
        </button>
        <span className="text-[#D5D9DF]">|</span>
        <button
          type="button"
          onClick={() => setActiveTab('Unit')}
          className={`cursor-pointer text-[18px] font-700 transition-colors ${
            activeTab === 'Unit' ? 'text-black' : 'text-[#9BA4B0]'
          }`}
        >
          Unit
        </button>
      </div>

      <label className="relative mb-8 block">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A4ADB8]" />
        <input
          type="search"
          value={keyword}
          onChange={event => setKeyword(event.target.value)}
          placeholder="관심 있는 강의를 검색해보세요."
          className="h-10 w-full rounded-[2px] border border-[#D8DDE4] bg-white pl-11 pr-4 text-[13px] outline-none transition focus:border-[#FF4854]"
        />
      </label>

      <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[14px] font-700 text-black">필터</h2>
            <button type="button" className="cursor-pointer text-[11px] font-500 text-[#98A1AD]">
              초기화
            </button>
          </div>

          {FILTER_GROUPS.map(group => (
            <FilterGroup key={group.title} {...group} />
          ))}
        </aside>

        <section className="min-w-0">
          <div className="mb-5 flex items-center justify-between">
            <h1 className="text-[16px] font-700 text-[#2E3338]">
              {activeTab} <span className="text-[#FF4854]">{filteredPaths.length}</span>
            </h1>
            <select className="h-8 cursor-pointer rounded-[2px] border border-[#D8DDE4] bg-white px-3 text-[12px] text-[#566170] outline-none">
              <option>인기순</option>
              <option>최신순</option>
              <option>난이도순</option>
            </select>
          </div>

          {activeTab === 'Unit' ? (
            <div className="rounded-[6px] border border-[#E3E7EC] bg-[#FAFBFC] px-5 py-12 text-center text-[14px] font-500 text-[#7A8491]">
              Unit 콘텐츠는 준비 중입니다.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-7 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
              {filteredPaths.map(path => (
                <PathCard
                  key={path.id}
                  path={path}
                  onClick={() => handleSolveProblem(path.id)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ChallengeSection;
