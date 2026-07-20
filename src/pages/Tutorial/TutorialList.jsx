import React, { useCallback, useMemo, useState } from 'react';
import { Bookmark, Clock3, Search, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TutorialBannerImage from '@/assets/images/tutorial_banner.png';

const TUTORIALS = [
  {
    id: 1,
    title: 'Prompt Injection Basics',
    tier: 'Tier 0',
    difficulty: 'Beginner',
    category: 'AI Security',
    tags: ['Tutorial', 'AI Security'],
    rating: '10.0',
    reviews: 12,
    duration: '1시간 30분',
    price: '무료',
    level: 'Start',
    tone: 'pink',
  },
  {
    id: 2,
    title: 'ARENA Interface Walkthrough',
    tier: 'Tier 0',
    difficulty: 'Beginner',
    category: 'ARENA',
    tags: ['Tutorial', 'Basics'],
    rating: '10.0',
    reviews: 8,
    duration: '45분',
    price: '무료',
    level: 'Start',
    tone: 'red',
  },
  {
    id: 3,
    title: 'Red Teaming Scenario Flow',
    tier: 'Tier 1',
    difficulty: 'Easy',
    category: 'Red Teaming',
    tags: ['Tutorial', 'Scenario'],
    rating: '10.0',
    reviews: 6,
    duration: '2시간',
    price: '무료',
    level: 'Starter',
    tone: 'purple',
  },
  {
    id: 4,
    title: 'Model Response Analysis',
    tier: 'Tier 1',
    difficulty: 'Easy',
    category: 'AI Security',
    tags: ['Tutorial', 'Analysis'],
    rating: '10.0',
    reviews: 5,
    duration: '1시간 20분',
    price: '무료',
    level: 'Starter',
    tone: 'cyan',
  },
  {
    id: 5,
    title: 'Basic Defense Strategy',
    tier: 'Tier 2',
    difficulty: 'Easy',
    category: 'Defense',
    tags: ['Tutorial', 'Defense'],
    rating: '10.0',
    reviews: 4,
    duration: '1시간 50분',
    price: '무료',
    level: 'Starter',
    tone: 'green',
  },
  {
    id: 6,
    title: 'Challenge Practice Guide',
    tier: 'Tier 2',
    difficulty: 'Medium',
    category: 'ARENA',
    tags: ['Tutorial', 'Practice'],
    rating: '10.0',
    reviews: 3,
    duration: '2시간 10분',
    price: '무료',
    level: 'Pro',
    tone: 'yellow',
  },
];

const TONE_CLASSES = {
  pink: {
    bg: 'bg-[#FFF0F7]',
    line: 'border-[#FF87BA]/55',
    flag: 'bg-[#FF45A2]',
    text: 'text-[#2F2F36]',
  },
  red: {
    bg: 'bg-[#FFF0F0]',
    line: 'border-[#FF7A7A]/55',
    flag: 'bg-[#FF4854]',
    text: 'text-[#4A2D2F]',
  },
  purple: {
    bg: 'bg-[#F1EDFF]',
    line: 'border-[#9C7CFF]/60',
    flag: 'bg-[#8057FF]',
    text: 'text-[#4F39A8]',
  },
  cyan: {
    bg: 'bg-[#E9FBFF]',
    line: 'border-[#6FDBEA]/70',
    flag: 'bg-[#5ED9E8]',
    text: 'text-[#168BA0]',
  },
  green: {
    bg: 'bg-[#F1FFE8]',
    line: 'border-[#91D76D]/65',
    flag: 'bg-[#76C94D]',
    text: 'text-[#315A23]',
  },
  yellow: {
    bg: 'bg-[#FFF8E5]',
    line: 'border-[#F2C14E]/65',
    flag: 'bg-[#FFBD3E]',
    text: 'text-[#5D4515]',
  },
};

const tagColors = {
  Beginner: 'border-[#8FE07A] text-[#38A12A]',
  Easy: 'border-[#9CDE7B] text-[#4FAF2F]',
  Medium: 'border-[#FFBC4B] text-[#C88400]',
};

function TutorialPreview({ tutorial }) {
  const tone = TONE_CLASSES[tutorial.tone] ?? TONE_CLASSES.pink;

  return (
    <div className={`relative h-[156px] overflow-hidden rounded-[4px] ${tone.bg}`}>
      <div className="absolute inset-0 opacity-90">
        <div className={`absolute -left-10 top-10 h-32 w-32 rounded-full border ${tone.line}`} />
        <div className={`absolute left-[42%] -top-10 h-36 w-36 rounded-full border ${tone.line}`} />
        <div className={`absolute right-7 bottom-5 h-28 w-28 rounded-full border ${tone.line}`} />
        <div className={`absolute left-8 top-6 h-28 w-[1px] rotate-[29deg] ${tone.line} border-l`} />
        <div className={`absolute left-[53%] top-0 h-44 w-[1px] rotate-[29deg] ${tone.line} border-l`} />
        <div className={`absolute right-10 top-4 h-32 w-[1px] rotate-[29deg] ${tone.line} border-l`} />
      </div>
      <div className={`absolute right-4 top-0 h-12 w-8 ${tone.flag}`}>
        <Bookmark className="mx-auto mt-2 h-4 w-4 fill-white text-white" strokeWidth={1.8} />
        <div className="absolute bottom-[-1px] left-0 h-0 w-0 border-l-[16px] border-r-[16px] border-t-[10px] border-l-transparent border-r-transparent border-t-white/90" />
      </div>
      <h3 className={`relative z-10 max-w-[76%] p-4 text-[22px] font-500 leading-[25px] ${tone.text}`}>
        {tutorial.title}
      </h3>
    </div>
  );
}

function TutorialCard({ tutorial, onClick }) {
  const levelClass =
    tutorial.level === 'Start'
      ? 'bg-[#FF4854] text-white'
      : tutorial.level === 'Starter'
        ? 'bg-[#3F454C] text-white'
        : 'bg-[#353B44] text-white';

  return (
    <article className="group min-w-0 cursor-pointer" onClick={onClick}>
      <TutorialPreview tutorial={tutorial} />
      <div className="pt-3">
        <h2 className="min-h-[42px] text-[16px] font-700 leading-[21px] text-black transition-colors group-hover:text-[#FF4854]">
          {tutorial.title}
        </h2>
        <div className="mt-2 flex flex-wrap gap-1">
          <span className="rounded-[3px] border border-[#C9D8FF] px-1.5 py-0.5 text-[10px] font-600 leading-none text-[#5578EA]">
            {tutorial.tier}
          </span>
          <span className={`rounded-[3px] border px-1.5 py-0.5 text-[10px] font-600 leading-none ${tagColors[tutorial.difficulty] ?? tagColors.Easy}`}>
            {tutorial.difficulty}
          </span>
          {tutorial.tags.map(tag => (
            <span key={tag} className="rounded-[3px] border border-[#D7DDE6] px-1.5 py-0.5 text-[10px] font-500 leading-none text-[#677281]">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between text-[12px] text-[#77808C]">
          <span className="flex items-center gap-1 font-700 text-black">
            <Star className="h-3.5 w-3.5 fill-black text-black" />
            {tutorial.rating} <span className="font-500 text-[#77808C]">({tutorial.reviews})</span>
          </span>
          <span className="flex items-center gap-1">
            <Clock3 className="h-3.5 w-3.5" />
            약 {tutorial.duration}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[12px] font-500 text-[#2E3338]">{tutorial.price}</span>
          <span className={`rounded-[4px] px-2 py-1 text-[11px] font-700 ${levelClass}`}>
            {tutorial.level}
          </span>
        </div>
      </div>
    </article>
  );
}

export default function TutorialList() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');

  const filteredTutorials = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    if (!normalizedKeyword) return TUTORIALS;

    return TUTORIALS.filter(tutorial =>
      [tutorial.title, tutorial.category, tutorial.difficulty, tutorial.tier, ...tutorial.tags]
        .join(' ')
        .toLowerCase()
        .includes(normalizedKeyword)
    );
  }, [keyword]);

  const handleOpenTutorial = useCallback(
    tutorialId => {
      navigate(`/tutorial/${tutorialId}`);
    },
    [navigate]
  );

  return (
    <div className="w-full bg-white pb-14">
      <section className="relative mb-8 h-[220px] overflow-hidden rounded-[6px] bg-black md:h-[320px]">
        <img src={TutorialBannerImage} alt="" className="h-full w-full object-cover object-center" />
        <div className="absolute left-6 top-8 max-w-[760px] text-left sm:left-10 md:left-14 md:top-11">
          <p className="text-[15px] font-800 leading-tight text-white/72 [text-shadow:0_2px_10px_rgba(0,0,0,0.65)] sm:text-[20px] md:text-[24px]">
            레드티밍이 뭔가요? ARENA는 어떻게 시작하나요?
          </p>
          <h1 className="mt-3 whitespace-nowrap text-[24px] font-900 leading-tight text-white [text-shadow:0_3px_16px_rgba(0,0,0,0.8)] sm:text-[36px] md:text-[46px]">
            <span className="text-[#FF4854]">Beginners</span>를 위한 완벽한 입문 가이드 시작하기
          </h1>
        </div>
      </section>

      <div id="tutorial-list-section" className="mb-7 flex items-center gap-3 border-b border-[#E6E9EE] pb-4">
        <button type="button" className="cursor-pointer text-[18px] font-700 text-black">
          Tutorial
        </button>
        <span className="text-[#D5D9DF]">|</span>
        <button type="button" className="cursor-pointer text-[18px] font-700 text-[#9BA4B0] transition-colors hover:text-[#FF4854]">
          Unit
        </button>
      </div>

      <label className="relative mb-8 block">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A4ADB8]" />
        <input
          type="search"
          value={keyword}
          onChange={event => setKeyword(event.target.value)}
          placeholder="관심 있는 튜토리얼을 검색해보세요."
          className="h-10 w-full rounded-[2px] border border-[#D8DDE4] bg-white pl-11 pr-4 text-[13px] outline-none transition focus:border-[#FF4854]"
        />
      </label>

      <div>
        <section className="min-w-0">
          <div className="mb-5 flex items-center justify-between">
            <h1 className="text-[16px] font-700 text-[#2E3338]">
              Tutorial <span className="text-[#FF4854]">{filteredTutorials.length}</span>
            </h1>
            <select className="h-8 cursor-pointer rounded-[2px] border border-[#D8DDE4] bg-white px-3 text-[12px] text-[#566170] outline-none">
              <option>인기순</option>
              <option>최신순</option>
              <option>난이도순</option>
            </select>
          </div>

          <div className="grid grid-cols-1 gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTutorials.map(tutorial => (
              <TutorialCard
                key={tutorial.id}
                tutorial={tutorial}
                onClick={() => handleOpenTutorial(tutorial.id)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
