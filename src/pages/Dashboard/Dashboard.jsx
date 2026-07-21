import React, { useEffect, useState } from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UserIcon from '@/assets/icons/user.svg';
import { useAuthStore } from '@/stores/authStore';
import ArenaBannerImage from '@/assets/images/banner.svg';
import ChallengeBannerImage from '@/assets/images/chalbenner.png';
import TutorialBannerImage from '@/assets/images/tutorial_banner.png';
import LlmSafetyBannerImage from '@/assets/images/LLMSAFETY_banner.png';
import LearningBannerImage from '@/assets/images/learning_banner.png';
import { articles as educationArticles } from '@/pages/Education/Education';
import { PATHS as challengePaths } from '@/pages/Kategorie/Kategorie';
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
                      <span className="text-[#FF4854]">Beginners</span>를 위한 완벽한 입문 가이드 시작하기
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
                      <ArrowRight className="h-6 w-6 transition-transform duration-200 group-hover:translate-x-1 sm:h-8 sm:w-8" strokeWidth={1.8} />
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
                      <ArrowRight className="h-6 w-6 transition-transform duration-200 group-hover:translate-x-1 sm:h-8 sm:w-8" strokeWidth={1.8} />
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
                      <ArrowRight className="h-6 w-6 transition-transform duration-200 group-hover:translate-x-1 sm:h-8 sm:w-8" strokeWidth={1.8} />
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
    <section className="overflow-hidden rounded-[3px] border border-[#DDE3EA] bg-white">
      <div className="px-5 py-5">
        <div className="flex items-center gap-3">
          <div className={`relative flex h-[74px] w-[74px] items-center justify-center overflow-hidden rounded-full ${hasProfileImage ? 'bg-[#F2F4F6]' : 'border border-[#E6EAF0] bg-[#F2F4F6]'}`}>
            <img src={profileImage} alt="" className={hasProfileImage ? 'h-full w-full object-cover' : 'h-11 w-11 opacity-35 grayscale'} />
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
      <div className="rounded-[3px] border border-[#DDE3EA] bg-white p-4">
        <div className="flex items-start gap-3">
          <div className="relative flex h-16 w-20 shrink-0 items-center overflow-hidden bg-[#0B0D18] px-2">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#120F1D_0%,#250B13_52%,#FF4854_220%)]" />
            <strong className="relative text-[11px] font-900 leading-[12px] text-white">{challenge.title}</strong>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-800 text-[#FF4854]">
              {challenge.tier} · {challenge.difficulty}
            </p>
            <p className="mt-1 line-clamp-2 text-[14px] font-900 leading-[18px] text-[#2E3338]">{challenge.title}</p>
            <p className="mt-1 truncate text-[11px] font-600 text-[#8A93A5]">{challenge.category}</p>
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
      <div className="rounded-[3px] border border-[#DDE3EA] bg-white p-4">
        <div className="flex items-start gap-3">
          <div className="relative flex h-16 w-20 shrink-0 items-center overflow-hidden bg-[#0B0D18] px-2">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#120F1D_0%,#250B13_52%,#FF4854_220%)]" />
            <strong className="relative text-[11px] font-900 leading-[12px] text-white">{article.visualTitle}</strong>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-800 text-[#FF4854]">{article.category}</p>
            <p className="mt-1 truncate text-[14px] font-900 text-[#2E3338]">{article.title}</p>
            <p className="mt-1 line-clamp-2 text-[11px] font-600 leading-[16px] text-[#8A93A5]">{article.summary}</p>
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
  const visibleArticles = selectedLearningStatus === 'in-progress' ? educationArticles.slice(0, 1) : [];

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
          <article key={article.id} className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center">
            <div className="relative flex h-[112px] w-full shrink-0 items-center overflow-hidden bg-[#0B0D18] px-4 sm:w-[184px]">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,#120F1D_0%,#250B13_52%,#FF4854_220%)]" />
              <strong className="relative text-[17px] font-900 leading-[19px] text-white">{article.visualTitle}</strong>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-800 text-[#FF4854]">
                {article.category} · {article.date}
              </p>
              <h2 className="mt-2 text-[18px] font-900 text-[#151A21]">{article.title}</h2>
              <p className="mt-2 line-clamp-2 text-[13px] font-500 leading-[20px] text-[#66717E]">{article.summary}</p>
              <p className="mt-3 text-[11px] font-700 text-[#8A93A5]">{article.readTime} 읽기</p>
            </div>
          </article>
        ))}
        {!visibleArticles.length ? (
          <p className="py-12 text-center text-[13px] font-700 text-[#8A93A5]">완료한 학습 자료가 없습니다.</p>
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
          <article key={tutorial.id} className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center">
            <div className="relative flex h-[112px] w-full shrink-0 items-center overflow-hidden bg-[#0B0D18] px-4 sm:w-[184px]">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,#120F1D_0%,#250B13_52%,#FF4854_220%)]" />
              <strong className="relative text-[17px] font-900 leading-[19px] text-white">{tutorial.title}</strong>
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
          <p className="py-12 text-center text-[13px] font-700 text-[#8A93A5]">완료한 튜토리얼이 없습니다.</p>
        ) : null}
      </div>
    </section>
  );
}

function ChallengeDetailPanel() {
  const [selectedChallengeStatus, setSelectedChallengeStatus] = useState('in-progress');
  const visibleChallenges = selectedChallengeStatus === 'in-progress' ? challengePaths.slice(0, 1) : [];

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
          <article key={challenge.id} className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center">
            <div className="relative flex h-[112px] w-full shrink-0 items-center overflow-hidden bg-[#0B0D18] px-4 sm:w-[184px]">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,#120F1D_0%,#250B13_52%,#FF4854_220%)]" />
              <strong className="relative text-[17px] font-900 leading-[19px] text-white">{challenge.title}</strong>
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
          <p className="py-12 text-center text-[13px] font-700 text-[#8A93A5]">완료한 챌린지가 없습니다.</p>
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
      <div className="rounded-[3px] border border-[#DDE3EA] bg-white p-4">
        <div className="rounded-[3px] bg-[#FFF0F2] p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] bg-[#FFDCE0]">
              <BookOpen className="h-5 w-5 text-[#FF4854]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-900 text-[#2E3338]">튜토리얼 입문 여정</p>
              <p className="mt-1 text-[11px] font-600 text-[#8A93A5]">튜토리얼 완료까지 4개 남았어요!</p>
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
                  onClick={() => setSelectedTutorialId(current => (current === tutorial.id ? null : tutorial.id))}
                  className="flex w-full cursor-pointer items-center justify-between gap-3 py-3 text-left"
                >
                  <p className="min-w-0 truncate text-[13px] font-900 text-[#2E3338]">{tutorial.title}</p>
                  <span className={`shrink-0 text-[11px] font-800 ${status === '완료' ? 'text-[#1BAE5B]' : 'text-[#A0A8B3]'}`}>
                    {status}
                  </span>
                </button>

                {isSelected ? (
                  <div className="mb-3 flex items-start gap-3">
                    <div className="relative flex h-16 w-20 shrink-0 items-center overflow-hidden bg-[#0B0D18] px-2">
                      <div className="absolute inset-0 bg-[linear-gradient(135deg,#120F1D_0%,#250B13_52%,#FF4854_220%)]" />
                      <strong className="relative text-[11px] font-900 leading-[12px] text-white">{tutorial.title}</strong>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-800 text-[#FF4854]">
                        {tutorial.tier} · {tutorial.difficulty}
                      </p>
                      <p className="mt-1 line-clamp-2 text-[14px] font-900 leading-[18px] text-[#2E3338]">{tutorial.title}</p>
                      <p className="mt-1 truncate text-[11px] font-600 text-[#8A93A5]">{tutorial.category}</p>
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
          <div key={title} className="grid grid-cols-[96px_58px_minmax(0,1fr)_110px] items-center gap-4 text-[14px]">
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

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeDetail, setActiveDetail] = useState(null);

  return (
    <div className="w-full bg-white">
      <DashboardBannerSlider />

      <div className="mx-auto grid w-full max-w-[1200px] gap-10 bg-white py-10 lg:grid-cols-[370px_minmax(0,1fr)]">
        <aside className="space-y-5">
          <ProfileCard />
          <button type="button" className="h-11 w-full cursor-pointer rounded-[3px] bg-[#FF4854] text-[15px] font-900 text-white transition hover:bg-[#E73541]">
            프로필 커스텀
          </button>
          <button
            type="button"
            onClick={() => navigate('/mypage')}
            className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-[3px] border border-[#DDE3EA] bg-white text-[13px] font-800 text-[#596575] transition hover:border-[#FF4854] hover:text-[#FF4854]"
          >
            <ArrowRight className="h-4 w-4" />
            마이페이지로 이동
          </button>
          <LearningProgressCard onShowDetails={() => setActiveDetail('learning')} />
          <TutorialProgressCard onShowDetails={() => setActiveDetail('tutorial')} />
          <MissionCard onShowDetails={() => setActiveDetail('challenge')} />
        </aside>

        <main className="min-w-0 pt-1">
          <Timeline />
          {activeDetail === 'learning' ? <LearningDetailPanel /> : null}
          {activeDetail === 'tutorial' ? <TutorialDetailPanel /> : null}
          {activeDetail === 'challenge' ? <ChallengeDetailPanel /> : null}
        </main>
      </div>
    </div>
  );
}
