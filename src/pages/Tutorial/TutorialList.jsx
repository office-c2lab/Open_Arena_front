import React, { useCallback, useMemo, useState } from 'react';
import { ArrowRight, Clock3, Search, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TutorialBannerImage from '@/assets/images/tutorial_banner.png';

export const TUTORIALS = [
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

const tagColors = {
  Beginner: 'border-[#8FE07A] text-[#38A12A]',
  Easy: 'border-[#9CDE7B] text-[#4FAF2F]',
  Medium: 'border-[#FFBC4B] text-[#C88400]',
};

function TutorialPreview({ tutorial }) {
  return (
    <div className="relative flex h-[150px] w-full items-center overflow-hidden bg-[#0B0D18] px-5 text-left">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#120F1D_0%,#250B13_52%,#FF4854_220%)]" />
      <div className="absolute -right-8 -top-10 h-40 w-40 rounded-full border border-[#FF4854]/30" />
      <div className="absolute right-10 bottom-[-54px] h-36 w-36 rounded-full border border-[#FF4854]/20" />
      <strong className="relative z-10 text-[26px] font-900 uppercase leading-[31px] text-white [text-shadow:0_3px_14px_rgba(255,72,84,0.32)]">
        {tutorial.title}
      </strong>
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
    <article
      className="group flex min-h-[392px] min-w-0 cursor-pointer flex-col overflow-hidden rounded-[6px] border border-[#E1E6EE] bg-white transition hover:-translate-y-1 hover:border-[#FFB8BE] hover:shadow-[0_16px_36px_rgba(15,23,42,0.08)]"
      onClick={onClick}
    >
      <TutorialPreview tutorial={tutorial} />
      <div className="flex flex-1 flex-col p-5">
        <h2 className="text-[20px] font-900 leading-[26px] text-[#151A21] transition-colors group-hover:text-[#FF4854]">
          {tutorial.title}
        </h2>
        <div className="mt-3 flex flex-wrap gap-1.5">
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
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[12px] font-500 text-[#2E3338]">{tutorial.price}</span>
          <span className={`rounded-[4px] px-2 py-1 text-[11px] font-700 ${levelClass}`}>
            {tutorial.level}
          </span>
        </div>
        <button
          type="button"
          className="mt-auto flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-[4px] bg-[#FF4854] text-[14px] font-900 text-white transition hover:bg-[#E73541]"
        >
          튜토리얼 보기
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}

export default function TutorialList() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
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

  const handleSearch = useCallback(event => {
    event.preventDefault();
    setKeyword(searchInput);
  }, [searchInput]);

  return (
    <div className="w-full bg-white pb-14">
      <section className="relative mb-8 h-[220px] overflow-hidden rounded-[6px] bg-black md:h-[320px]">
        <img src={TutorialBannerImage} alt="" className="h-full w-full object-cover object-center" />
        <div className="absolute inset-0 flex flex-col items-start justify-center px-6 text-left sm:px-10 md:px-14">
          <div className="max-w-[760px]">
            <h1 className="whitespace-nowrap text-[24px] font-900 leading-tight text-white [text-shadow:0_3px_16px_rgba(0,0,0,0.8)] sm:text-[36px] md:text-[46px]">
              <span className="text-[#FF4854]">Beginners</span>를 위한 완벽한 입문 가이드 시작하기
            </h1>
            <p className="mt-3 text-[15px] font-800 leading-tight text-white/72 [text-shadow:0_2px_10px_rgba(0,0,0,0.65)] sm:text-[20px] md:text-[24px]">
              레드티밍이 뭔가요? ARENA는 어떻게 시작하나요?
            </p>
          </div>
        </div>
      </section>

      <div id="tutorial-list-section" className="mb-7 flex items-center gap-3 border-b border-[#E6E9EE] pb-4">
        <button type="button" className="cursor-pointer border-b-2 border-[#FF4854] pb-3 text-[18px] font-700 text-black">
          Tutorial
        </button>
      </div>

      <form onSubmit={handleSearch} className="mb-8 flex gap-3">
        <label className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A4ADB8]" />
          <input
            type="search"
            value={searchInput}
            onChange={event => setSearchInput(event.target.value)}
            placeholder="관심 있는 튜토리얼을 검색해보세요."
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
              Tutorial <span className="text-[#FF4854]">{filteredTutorials.length}</span>
            </h1>
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
