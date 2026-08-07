import React, { useCallback, useMemo, useState } from 'react';
import { ArrowRight, Clock3, RotateCcw, Search, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TutorialBannerImage from '@/assets/images/tutorial_banner.png';
import TutorialCardImage from '@/assets/images/tutorial.png';
import TutorialElementCardImage from '@/assets/images/t1.png';
import TutorialChatTokenCardImage from '@/assets/images/t2.png';
import TutorialJudgeFailureCardImage from '@/assets/images/t3.png';
import TutorialJudgeSuccessCardImage from '@/assets/images/t4.png';

export const TUTORIALS = [
  {
    id: 7,
    title: '구성요소',
    subtitle: 'ARENA 챌린지 화면과 핵심 구성요소 익히기',
    tier: 'Tier 1',
    difficulty: 'Beginner',
    category: 'Basic',
    tags: ['Tutorial', 'Guide'],
    rating: '10.0',
    reviews: 0,
    duration: '10분',
    price: '무료',
    level: 'Start',
    tone: 'red',
    successfulUsers: 0,
    averageTokens: '0',
    description:
      '문제 설명, 목표, 대화 영역, 제출 버튼, 시도 기록 등 챌린지를 진행할 때 보는 기본 화면 요소를 살펴봅니다.',
    goal: '챌린지 화면의 각 구성요소가 어떤 역할을 하는지 이해하는 것이 목표입니다.',
    myRecord: { status: '미도전', attempts: 0, successes: 0, failures: 0, tokens: 0, score: 0 },
  },
  {
    id: 8,
    title: '채팅과 토큰',
    subtitle: 'AI와 대화하고 토큰 사용량을 확인하는 방법',
    tier: 'Tier 1',
    difficulty: 'Beginner',
    category: 'Chat',
    tags: ['Tutorial', 'Token'],
    rating: '10.0',
    reviews: 0,
    duration: '15분',
    price: '무료',
    level: 'Starter',
    successfulUsers: 0,
    averageTokens: '320',
    description:
      '채팅 입력, AI 응답, 대화 재시도, 토큰 소모량을 확인하며 효율적으로 대화하는 흐름을 연습합니다.',
    goal: 'AI와 한 번 이상 대화하고, 사용한 토큰이 어디에 표시되는지 확인하는 것이 목표입니다.',
    myRecord: { status: '미도전', attempts: 0, successes: 0, failures: 0, tokens: 0, score: 0 },
  },
  {
    id: 9,
    title: '저지 실패',
    subtitle: '제출 결과가 실패로 판정되는 흐름 이해하기',
    tier: 'Tier 2',
    difficulty: 'Easy',
    category: 'Judge',
    tags: ['Tutorial', 'Judge'],
    rating: '10.0',
    reviews: 0,
    duration: '15분',
    price: '무료',
    level: 'Starter',
    successfulUsers: 0,
    averageTokens: '680',
    description:
      '목표 조건을 충족하지 못한 응답을 제출해보고, 저지 실패 사유와 다음 시도에 반영할 점을 확인합니다.',
    goal: '실패 판정이 나는 이유를 확인하고, 실패 기록을 읽는 방법을 익히는 것이 목표입니다.',
    myRecord: { status: '미도전', attempts: 0, successes: 0, failures: 0, tokens: 0, score: 0 },
  },
  {
    id: 10,
    title: '저지 성공',
    subtitle: '성공 조건을 만족하는 응답 제출하기',
    tier: 'Tier 2',
    difficulty: 'Easy',
    category: 'Judge',
    tags: ['Tutorial', 'Judge'],
    rating: '10.0',
    reviews: 0,
    duration: '20분',
    price: '무료',
    level: 'Starter',
    successfulUsers: 0,
    averageTokens: '920',
    description:
      '문제 목표와 성공 조건을 비교하며 AI 응답을 제출하고, 성공 판정과 점수 반영 방식을 확인합니다.',
    goal: '성공 조건을 만족하는 응답을 제출해 저지 성공 흐름을 경험하는 것이 목표입니다.',
    myRecord: { status: '미도전', attempts: 0, successes: 0, failures: 0, tokens: 0, score: 0 },
  },
  {
    id: 11,
    title: '실전 연습',
    subtitle: '튜토리얼에서 익힌 흐름으로 미니 챌린지 풀기',
    tier: 'Tier 3',
    difficulty: 'Medium',
    category: 'Practice',
    tags: ['Tutorial', 'Practice'],
    rating: '10.0',
    reviews: 0,
    duration: '30분',
    price: '무료',
    level: 'Starter',
    successfulUsers: 0,
    averageTokens: '1,240',
    description:
      '문제 목표를 읽고, AI와 대화하고, 제출 결과를 확인하는 전체 과정을 실제 챌린지처럼 연습합니다.',
    goal: '최소한의 시도와 토큰으로 목표 조건을 만족하는 응답을 받아내는 것이 목표입니다.',
    myRecord: { status: '미도전', attempts: 0, successes: 0, failures: 0, tokens: 0, score: 0 },
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
      <strong className="relative z-10 text-page-title font-bold uppercase text-white [text-shadow:0_3px_14px_rgba(255,72,84,0.32)]">
        {tutorial.title}
      </strong>
    </div>
  );
}

function TutorialCard({ tutorial, onClick }) {
  if (tutorial.id >= 7) {
    const isPracticeTutorial = tutorial.id === 11;
    const cardImage =
      tutorial.id === 7
        ? TutorialElementCardImage
        : tutorial.id === 8
          ? TutorialChatTokenCardImage
          : tutorial.id === 9
            ? TutorialJudgeFailureCardImage
            : tutorial.id === 10
              ? TutorialJudgeSuccessCardImage
              : TutorialCardImage;

    return (
      <article
        className="surface surface-interactive group flex min-w-0 cursor-pointer flex-col overflow-hidden"
        onClick={onClick}
      >
        <div className="relative h-[180px] overflow-hidden">
          <img src={cardImage} alt={tutorial.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 flex flex-col justify-center bg-[#12070A]/94 p-5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <p className="text-body font-strong text-white">{tutorial.description}</p>
            <p className="mt-3 text-body font-bold text-[#FF5A65]">{tutorial.goal}</p>
          </div>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h2 className="text-card-title font-bold text-[#151A21]">{tutorial.title}</h2>
          <p className="mt-2 text-body font-strong text-[#66717E]">{tutorial.subtitle}</p>
          <div className="mt-auto pt-5">
            <button type="button" className="btn btn-primary btn-lg btn-block">
              {isPracticeTutorial ? '문제풀기' : '튜토리얼 진행하기'}
            </button>
          </div>
        </div>
      </article>
    );
  }

  const levelClass =
    tutorial.level === 'Start'
      ? 'bg-[#FF4854] text-white'
      : tutorial.level === 'Starter'
        ? 'bg-[#3F454C] text-white'
        : 'bg-[#353B44] text-white';

  return (
    <article
      className="surface surface-interactive group flex min-h-[392px] min-w-0 cursor-pointer flex-col overflow-hidden"
      onClick={onClick}
    >
      <TutorialPreview tutorial={tutorial} />
      <div className="flex flex-1 flex-col p-5">
        <h2 className="text-card-title font-bold text-[#151A21] transition-colors group-hover:text-[#FF4854]">
          {tutorial.title}
        </h2>
        {tutorial.subtitle ? (
          <p className="mt-2 line-clamp-2 text-body font-strong text-[#66717E]">
            {tutorial.subtitle}
          </p>
        ) : null}
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="rounded-[3px] border border-[#C9D8FF] px-1.5 py-0.5 text-caption font-strong text-[#5578EA]">
            {tutorial.tier}
          </span>
          <span
            className={`rounded-[3px] border px-1.5 py-0.5 text-caption font-strong ${tagColors[tutorial.difficulty] ?? tagColors.Easy}`}
          >
            {tutorial.difficulty}
          </span>
          {tutorial.tags.map(tag => (
            <span
              key={tag}
              className="rounded-[3px] border border-[#D7DDE6] px-1.5 py-0.5 text-caption font-medium text-[#677281]"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between text-label text-[#77808C]">
          <span className="flex items-center gap-1 font-strong text-black">
            <Star className="h-3.5 w-3.5 fill-black text-black" />
            {tutorial.rating}{' '}
            <span className="font-medium text-[#77808C]">({tutorial.reviews})</span>
          </span>
          <span className="flex items-center gap-1">
            <Clock3 className="h-3.5 w-3.5" />약 {tutorial.duration}
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-label font-medium text-[#2E3338]">{tutorial.price}</span>
          <span className={`rounded-[4px] px-2 py-1 text-caption font-strong ${levelClass}`}>
            {tutorial.level}
          </span>
        </div>
        <button type="button" className="btn btn-primary btn-md btn-block mt-auto">
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
      [
        tutorial.title,
        tutorial.subtitle,
        tutorial.category,
        tutorial.difficulty,
        tutorial.tier,
        ...tutorial.tags,
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedKeyword)
    );
  }, [keyword]);

  const handleOpenTutorial = useCallback(
    tutorialId => {
      navigate(tutorialId === 11 ? '/challenge/1' : `/tutorial/${tutorialId}`);
    },
    [navigate]
  );

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

  return (
    <div className="w-full bg-white pb-14">
      <section className="relative mb-8 h-[220px] overflow-hidden rounded-[6px] bg-black md:h-[320px]">
        <img
          src={TutorialBannerImage}
          alt=""
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 flex flex-col items-start justify-center px-6 text-left sm:px-10 md:px-14">
          <div className="max-w-[760px]">
            <h1 className="whitespace-nowrap text-section-title font-bold text-white [text-shadow:0_3px_16px_rgba(0,0,0,0.8)] sm:text-display md:text-display-lg">
              <span className="text-[#FF4854]">Beginners</span>를 위한 완벽한 입문 가이드 시작하기
            </h1>
            <p className="mt-3 text-body font-strong text-white/72 [text-shadow:0_2px_10px_rgba(0,0,0,0.65)] sm:text-card-title md:text-section-title">
              레드티밍이 뭔가요? ARENA는 어떻게 시작하나요?
            </p>
          </div>
        </div>
      </section>

      <div
        id="tutorial-list-section"
        className="mb-7 flex flex-col gap-4 border-b border-[#E6E9EE] pb-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <button
          type="button"
          className="cursor-pointer border-b-2 border-[#FF4854] pb-3 text-card-title font-strong text-black"
        >
          Tutorial
        </button>
        <form onSubmit={handleSearch} className="flex w-full gap-3 sm:w-[min(100%,500px)]">
          <label className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A4ADB8]" />
            <input
              type="search"
              value={searchInput}
              onChange={event => setSearchInput(event.target.value)}
              placeholder="관심 있는 튜토리얼을 검색해보세요."
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

      <div>
        <section className="min-w-0">
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
