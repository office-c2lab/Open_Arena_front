import React, { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, Building2, Instagram, MessageCircle, ShieldCheck, Twitter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UserIcon from '@/assets/icons/user.svg';
import TigerImage from '@/assets/images/tiger.png';
import PhoenixImage from '@/assets/images/phoenix.png';
import ArenaBannerImage from '@/assets/images/banner.svg';
import ChallengeBannerImage from '@/assets/images/chalbenner.png';
import TutorialBannerImage from '@/assets/images/tutorial_banner.png';

const notices = [
  ['공지사항', '2026년 6월의 드림핵 노트', '2026.07.01.'],
  ['공지사항', '새로워진 학습 메뉴, 이렇게 달라졌어요', '2026.06.08.'],
  ['공지사항', '2026년 5월의 드림핵 노트', '2026.06.05.'],
];

const missions = [
  { title: '프레시맨', state: '미완료', desc: '강의 1개 수강 완료' },
  { title: '스포트맨', state: '미완료', desc: '강의 10개 수강 완료' },
  { title: '비기너즈 졸업', state: '미완료', desc: '1개 이상의 비기너즈 분야의 Path 수강 완료' },
  { title: '스쿼드', state: '미완료', desc: '워게임 15문제 해결' },
  { title: '비기너즈 입문', state: '완료', desc: '1개 이상의 비기너즈 분야의 Path 수강 시작' },
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
                <div className="absolute left-6 top-8 max-w-[760px] text-left sm:left-10 md:left-14 md:top-11">
                  <p className="text-[15px] font-800 leading-tight text-white/72 [text-shadow:0_2px_10px_rgba(0,0,0,0.65)] sm:text-[20px] md:text-[24px]">
                    레드티밍이 뭔가요? ARENA는 어떻게 시작하나요?
                  </p>
                  <h1 className="mt-3 whitespace-nowrap text-[24px] font-900 leading-tight text-white [text-shadow:0_3px_16px_rgba(0,0,0,0.8)] sm:text-[36px] md:text-[46px]">
                    <span className="text-[#FF4854]">Beginners</span>를 위한 완벽한 입문 가이드 시작하기
                  </h1>
                  <button
                    type="button"
                    onClick={() => navigate('/tutorial')}
                    className="group mt-7 flex cursor-pointer items-center gap-4 text-[18px] font-900 text-white transition-colors hover:text-[#FF4854] sm:text-[24px] md:mt-9"
                  >
                    튜토리얼 문제 풀기
                    <ArrowRight className="h-6 w-6 transition-transform duration-200 group-hover:translate-x-1 sm:h-8 sm:w-8" strokeWidth={1.8} />
                  </button>
                </div>
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
  return (
    <section className="overflow-hidden rounded-[3px] border border-[#DDE3EA] bg-white">
      <div className="relative h-[92px] bg-[#FAFBFC]">
        <div className="absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_20px_20px,#EEF1F5_8px,transparent_9px)] [background-size:42px_42px]" />
      </div>
      <div className="px-5 pb-5">
        <div className="-mt-10 flex items-end gap-3">
          <div className="relative flex h-[74px] w-[74px] items-center justify-center rounded-full border border-[#E6EAF0] bg-[#F2F4F6]">
            <img src={UserIcon} alt="" className="h-11 w-11 opacity-35 grayscale" />
          </div>
          <div className="pb-1">
            <div className="flex items-center gap-1.5 text-[18px] font-900 text-[#3A414B]">
              돌킹왕짱
              <ShieldCheck className="h-4 w-4 fill-[#C3C8D0] text-white" />
            </div>
          </div>
        </div>

        <p className="mt-5 text-[13px] font-600 text-[#8A93A5]">아직 자기소개가 없습니다.</p>
        <div className="mt-3 space-y-1 text-[12px] font-600 text-[#8A93A5]">
          <p>대표 업적 없음</p>
          <p>등록된 기관 없음</p>
        </div>

        <div className="mt-5 grid grid-cols-3 divide-x divide-[#DDE3EA] text-center">
          {[
            ['CTF', 0],
            ['WARGAME', 0],
            ['LEVEL', 1],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-[10px] font-800 text-[#A0A8B3]">{label}</p>
              <p className="mt-1 text-[16px] font-900 text-[#4B5563]">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MissionCard() {
  return (
    <section>
      <h2 className="mb-3 text-[14px] font-900 text-[#2E3338]">진행중인 미션</h2>
      <div className="rounded-[3px] border border-[#DDE3EA] bg-white p-4">
        <div className="rounded-[3px] bg-[#F6F5FF] p-3">
          <div className="flex items-center justify-between text-[11px] font-700 text-[#9AA3AF]">
            <span>드림핵 모험가</span>
            <span>900 XP</span>
            <span>50 코인</span>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-[#DAD6FF]">
              <BookOpen className="h-6 w-6 text-[#756CFF]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-900 text-[#2E3338]">드림핵 입문 여정</p>
              <p className="mt-1 text-[11px] font-600 text-[#8A93A5]">미션 완료까지 4개 남았어요!</p>
            </div>
            <button type="button" className="cursor-pointer rounded-[4px] bg-[#756CFF] px-3 py-2 text-[11px] font-900 text-white">
              자세히 보기
            </button>
          </div>
          <div className="mt-4">
            <div className="h-1.5 rounded-full bg-[#E3E1FF]">
              <div className="h-full w-[20%] rounded-full bg-[#756CFF]" />
            </div>
            <p className="mt-1 text-right text-[11px] font-800 text-[#756CFF]">20%</p>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          {missions.map(mission => (
            <div key={mission.title} className="flex items-center justify-between rounded-[3px] border border-[#DDE3EA] px-3 py-3">
              <div>
                <p className="text-[13px] font-900 text-[#2E3338]">
                  {mission.title} <span className="text-[11px] text-[#A0A8B3]">{mission.state}</span>
                </p>
                <p className="mt-1 text-[11px] font-600 text-[#9AA3AF]">{mission.desc}</p>
              </div>
              <button type="button" className="flex cursor-pointer items-center gap-1 text-[11px] font-900 text-[#756CFF]">
                바로가기 <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PromoCard({ type }) {
  const isGift = type === 'gift';

  return (
    <section className="relative overflow-hidden rounded-[3px] bg-[#F6F7F9] p-5">
      <div className="relative z-10">
        <p className="text-[14px] font-900 leading-[22px] text-[#2E3338]">
          {isGift ? '프로필 완성하고 코인 받기!' : '더 나은 드림핵 서비스를 위해'}
          <br />
          {isGift ? '가입 후 1달 동안만 참여 가능해요!' : '오류를 제보해 주세요!'}
        </p>
        <button type="button" className="mt-4 flex cursor-pointer items-center gap-1 text-[12px] font-900 text-[#756CFF]">
          {isGift ? '참여하고 코인 받기' : '제보하고 코인 받기'} <ArrowRight className="h-3 w-3" />
        </button>
      </div>
      {isGift ? (
        <img src={TigerImage} alt="" className="absolute bottom-2 right-5 h-20 w-20 object-contain" />
      ) : (
        <img src={PhoenixImage} alt="" className="absolute bottom-2 right-5 h-20 w-20 object-contain opacity-80" />
      )}
    </section>
  );
}

function Timeline() {
  return (
    <section>
      <div className="mb-8 flex gap-8 border-b border-[#DDE3EA]">
        <button type="button" className="cursor-pointer border-b-2 border-[#FF4854] pb-3 text-[14px] font-900 text-[#2E3338]">
          타임라인
        </button>
        <button type="button" className="cursor-pointer border-b-2 border-transparent pb-3 text-[14px] font-900 text-[#7B8491] hover:text-[#FF4854]">
          알림
        </button>
      </div>

      <div className="space-y-5">
        {notices.map(([category, title, date]) => (
          <div key={title} className="grid grid-cols-[96px_58px_minmax(0,1fr)_110px] items-center gap-4 text-[14px]">
            <span className="font-700 text-[#6B7280]">{category}</span>
            <span className="w-fit rounded-[3px] border border-[#CCD6FF] bg-[#F5F7FF] px-3 py-1 text-[12px] font-800 text-[#6D75FF]">
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

function NewsSection() {
  return (
    <section className="mt-10">
      <h2 className="mb-5 text-[27px] font-900 text-[#2E3338]">드림핵 인기 소식</h2>
      <div className="flex gap-6">
        <div className="h-[230px] w-[180px] rounded-[3px] border border-[#DDE3EA] bg-white p-5">
          <div className="h-5 w-20 rounded bg-[#E2E4E8]" />
          <div className="mt-24 h-5 w-16 rounded bg-[#E2E4E8]" />
          <div className="mt-3 h-4 w-24 rounded bg-[#E2E4E8]" />
          <div className="mt-8 h-5 w-20 rounded bg-[#E2E4E8]" />
        </div>
      </div>
      <p className="mt-16 text-center text-[15px] font-700 text-[#A0A8B3]">지난 활동들을 모두 확인하셨습니다.</p>
    </section>
  );
}

export default function Dashboard() {
  return (
    <div className="w-full bg-white">
      <DashboardBannerSlider />

      <div className="mx-auto grid w-full max-w-[1200px] gap-10 bg-white py-10 lg:grid-cols-[370px_minmax(0,1fr)]">
        <aside className="space-y-5">
          <ProfileCard />
          <button type="button" className="h-11 w-full cursor-pointer rounded-[3px] bg-[#FF4854] text-[15px] font-900 text-white transition hover:bg-[#E73541]">
            프로필 커스터
          </button>
          <button type="button" className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-[3px] border border-[#DDE3EA] bg-white text-[13px] font-800 text-[#596575] transition hover:border-[#FF4854] hover:text-[#FF4854]">
            <ArrowRight className="h-4 w-4" />
            마이페이지로 이동
          </button>
          <MissionCard />
          <PromoCard type="gift" />
          <PromoCard type="report" />
          <div className="grid grid-cols-4 gap-2">
            {[Twitter, Instagram, Building2, MessageCircle].map((Icon, index) => (
              <button key={index} type="button" className="flex h-9 cursor-pointer items-center justify-center rounded-[3px] border border-[#DDE3EA] text-[#A0A8B3] transition hover:border-[#FF4854] hover:text-[#FF4854]">
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </aside>

        <main className="min-w-0 pt-1">
          <Timeline />
          <NewsSection />
        </main>
      </div>
    </div>
  );
}
