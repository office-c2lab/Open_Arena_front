import { ArrowRight, BookOpen, Medal, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import UserIcon from '@/assets/icons/user.svg';
import { useAuthStore } from '@/stores/authStore';

function Stat({ label, value }) {
  return (
    <div className="border-l border-[#E3E6EB] px-5 first:border-l-0">
      <p className="text-[11px] font-800 text-[#8A93A5]">{label}</p>
      <p className="mt-1 text-[22px] font-900 text-[#151A21]">{value}</p>
    </div>
  );
}

function SummaryCard({ icon: Icon, title, description, action, to }) {
  return (
    <Link to={to} className="group flex items-center gap-4 rounded-[4px] border border-[#DDE3EA] bg-white p-4 transition hover:border-[#FFB8BE] hover:bg-[#FFF9FA]">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[4px] bg-[#FFF0F2]">
        <Icon className="h-5 w-5 text-[#FF4854]" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-[14px] font-900 text-[#2E3338]">{title}</h3>
        <p className="mt-1 truncate text-[12px] font-600 text-[#8A93A5]">{description}</p>
      </div>
      <span className="flex shrink-0 items-center gap-1 text-[12px] font-800 text-[#FF4854]">
        {action} <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

export default function ProfilePage() {
  const teamInfo = useAuthStore(state => state.teamInfo);
  const nickname = teamInfo?.teamname || teamInfo?.username || 'ARENA 유저';
  const email = teamInfo?.login_id || teamInfo?.email || 'arena@example.com';
  const membershipLabel = teamInfo?.membershipLabel || '무료 회원';
  const isPaidMember = teamInfo?.membershipType === 'paid';
  const stats = teamInfo?.profileStats || {};

  return (
    <main className="mx-auto w-full max-w-[1200px] bg-white px-5 py-10 sm:px-8">
      <section className="overflow-hidden rounded-[4px] border border-[#DDE3EA] bg-white">
        <div className="relative h-[132px] bg-[#FAFBFC]">
          <div className="absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_20px_20px,#EEF1F5_8px,transparent_9px)] [background-size:42px_42px]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,72,84,0.05))]" />
        </div>
        <div className="px-6 pb-6">
          <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-[#F2F4F6] shadow-sm">
                <img src={UserIcon} alt="" className="h-12 w-12 opacity-45 grayscale" />
              </div>
              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-[25px] font-900 text-[#151A21]">{nickname}</h1>
                  <span className="text-[12px] font-800 text-[#FF4854]">{membershipLabel}</span>
                </div>
                <p className="mt-1 text-[13px] font-600 text-[#8A93A5]">{email}</p>
              </div>
            </div>
            <Link to="/settings" className="w-fit rounded-[3px] border border-[#FFB8BE] px-4 py-2 text-[13px] font-800 text-[#FF4854] transition hover:bg-[#FFF0F2]">
              프로필 편집
            </Link>
          </div>

          <p className="mt-6 text-[14px] font-600 text-[#66717E]">AI 보안 실습을 통해 한 단계씩 성장하고 있습니다.</p>
          <div className="mt-6 flex flex-wrap divide-x divide-[#E3E6EB]">
            {isPaidMember ? (
              <>
                <Stat label="성공한 챌린지" value={stats.solvedChallenges || 0} />
                <Stat label="총 성공 횟수" value={stats.totalSuccesses || 0} />
                <Stat label="랭킹" value={`${stats.rank || '-'}위`} />
              </>
            ) : (
              <>
                <Stat label="무료 도전" value="1 / 6" />
                <Stat label="무료 채팅" value="10" />
                <Stat label="무료 토큰" value="1,000" />
              </>
            )}
          </div>
        </div>
      </section>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] font-900 text-[#151A21]">나의 성장 현황</h2>
            <Link to="/education" className="flex items-center gap-1 text-[12px] font-800 text-[#FF4854]">
              전체 보기 <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            <SummaryCard icon={BookOpen} title="학습" description="AI Red Teaming 기초를 학습 중입니다." action="학습 보기" to="/education" />
            <SummaryCard icon={Target} title="튜토리얼" description="Prompt Injection Basics 튜토리얼을 진행 중입니다." action="튜토리얼 보기" to="/tutorial" />
            <SummaryCard icon={Medal} title="챌린지" description="System Hacking Basics 챌린지를 탐색해 보세요." action="챌린지 보기" to="/kategorie" />
          </div>

          <section className="mt-10">
            <h2 className="text-[20px] font-900 text-[#151A21]">최근 활동</h2>
            <div className="mt-4 divide-y divide-[#E3E6EB] border-y border-[#E3E6EB]">
              {[
                ['학습 시작', 'AI Red Teaming이란 무엇인가요?', '방금 전'],
                ['튜토리얼', 'Prompt Injection Basics', '어제'],
                ['챌린지', 'System Hacking Basics', '3일 전'],
              ].map(([type, title, time]) => (
                <div key={title} className="grid grid-cols-[88px_minmax(0,1fr)_70px] items-center gap-3 py-4 text-[13px]">
                  <span className="font-800 text-[#FF4854]">{type}</span>
                  <span className="truncate font-700 text-[#3D4754]">{title}</span>
                  <span className="text-right font-600 text-[#A0A8B3]">{time}</span>
                </div>
              ))}
            </div>
          </section>
        </section>

        <aside>
          <section className="rounded-[4px] border border-[#DDE3EA] bg-white p-5">
            <h2 className="text-[16px] font-900 text-[#151A21]">프로필 정보</h2>
            <dl className="mt-5 space-y-4 text-[13px]">
              <div className="flex justify-between gap-4"><dt className="font-700 text-[#8A93A5]">자기소개</dt><dd className="text-right font-700 text-[#596575]">아직 자기소개가 없습니다.</dd></div>
              <div className="flex justify-between gap-4"><dt className="font-700 text-[#8A93A5]">국가</dt><dd className="font-700 text-[#596575]">대한민국</dd></div>
              <div className="flex justify-between gap-4"><dt className="font-700 text-[#8A93A5]">가입일</dt><dd className="font-700 text-[#596575]">2026.07.01</dd></div>
            </dl>
            <Link to="/settings" className="mt-6 flex h-10 items-center justify-center rounded-[3px] bg-[#FF4854] text-[13px] font-900 text-white transition hover:bg-[#E73541]">
              계정 설정
            </Link>
          </section>
        </aside>
      </div>
    </main>
  );
}
