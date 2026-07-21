import { ArrowRight, BookOpen, CalendarDays, Camera, Mail, Medal, Target } from 'lucide-react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import UserIcon from '@/assets/icons/user.svg';
import ProfileBannerImage from '@/assets/images/profile_banner.png';
import { useAuthStore } from '@/stores/authStore';

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
  const login = useAuthStore(state => state.login);
  const profileImageInputRef = useRef(null);
  const nickname = teamInfo?.teamname || teamInfo?.username || 'ARENA 유저';
  const email = teamInfo?.login_id || teamInfo?.email || 'arena@example.com';
  const membershipLabel = teamInfo?.membershipLabel || '무료 회원';
  const profileImage = teamInfo?.profileImage || UserIcon;
  const handleProfileImageChange = event => {
    const [file] = event.target.files || [];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => login({ ...teamInfo, profileImage: reader.result });
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  return (
    <main className="mx-auto w-full max-w-[1200px] bg-white px-5 py-10 sm:px-8">
      <section className="relative min-h-[202px] overflow-hidden rounded-[10px] border border-[#E3E6EB] bg-white shadow-[0_8px_22px_rgba(15,23,42,0.06)]">
        <img src={ProfileBannerImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="relative flex min-h-[202px] flex-col justify-end px-6 pb-6 sm:px-9">
          <div className="flex items-end">
            <div className="flex items-center gap-5">
              <button
                type="button"
                aria-label="프로필 이미지 변경"
                onClick={() => profileImageInputRef.current?.click()}
                className="group relative flex h-[112px] w-[112px] shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#20242B] shadow-[0_5px_14px_rgba(15,23,42,0.2)]"
              >
                <img src={profileImage} alt="프로필 이미지" className="h-full w-full object-cover" />
                <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                  <Camera className="h-6 w-6" />
                </span>
              </button>
              <input ref={profileImageInputRef} type="file" accept="image/*" onChange={handleProfileImageChange} className="hidden" />
              <div className="pb-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-[26px] font-900 text-[#151A21]">{nickname}</h1>
                  <span className="rounded-full bg-[#FF4854] px-3 py-1 text-[12px] font-900 text-white">{membershipLabel}</span>
                </div>
                <p className="mt-2 flex items-center gap-2 text-[13px] font-700 text-[#596575]"><Mail className="h-4 w-4 text-[#7B8491]" />{email}</p>
                <p className="mt-2 flex items-center gap-2 text-[13px] font-700 text-[#596575]"><CalendarDays className="h-4 w-4 text-[#7B8491]" />가입일 2026.07.01</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-10">
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
      </div>
    </main>
  );
}
