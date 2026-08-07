import { CalendarDays, Mail } from 'lucide-react';
import UserIcon from '@/assets/icons/user.svg';
import { useAuthStore } from '@/stores/authStore';
import AccountSettings from './MyPage';

export default function ProfilePage() {
  const teamInfo = useAuthStore(state => state.teamInfo);
  const nickname = teamInfo?.teamname || teamInfo?.username || 'ARENA 유저';
  const email = teamInfo?.login_id || teamInfo?.email || 'arena@example.com';
  const membershipLabel = teamInfo?.membershipLabel || '무료 회원';
  const profileImage = teamInfo?.profileImage || UserIcon;
  const hasProfileImage = Boolean(teamInfo?.profileImage);
  const savedProfileMessage = teamInfo?.profileMessage || '';

  return (
    <main className="mx-auto w-full max-w-[1200px] bg-white px-5 py-10 sm:px-8">
      <section className="surface overflow-hidden">
        <div className="flex flex-col justify-center px-6 py-6 sm:px-8 lg:min-h-[176px] lg:px-9">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            <div className="flex shrink-0 items-start gap-5">
              <div className="flex shrink-0 items-center">
                <div
                  className={`flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-full shadow-[0_5px_14px_rgba(15,23,42,0.2)] ${
                    hasProfileImage ? 'bg-[#F2F4F6]' : 'bg-[#FF4854]'
                  }`}
                >
                  <img
                    src={profileImage}
                    alt="프로필 이미지"
                    className={hasProfileImage ? 'h-full w-full object-cover' : 'h-9 w-9'}
                  />
                </div>
              </div>
              <div className="pb-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-page-title font-bold text-[#151A21]">{nickname}</h1>
                  <span className="rounded-full bg-[#FF4854] px-3 py-1 text-label font-bold text-white">
                    {membershipLabel}
                  </span>
                </div>
                <p className="mt-2 flex items-center gap-2 text-body font-strong text-[#596575]">
                  <Mail className="h-4 w-4 text-[#7B8491]" />
                  {email}
                </p>
                <p className="mt-2 flex items-center gap-2 text-body font-strong text-[#596575]">
                  <CalendarDays className="h-4 w-4 text-[#7B8491]" />
                  가입일 2026.07.01
                </p>
              </div>
            </div>
            <div className="min-w-0 flex-1 border-t border-[#E3E6EB] pt-5 lg:border-l lg:border-t-0 lg:py-1 lg:pl-8">
              <p className="mb-2 text-label font-bold text-[#697586]">프로필 메시지</p>
              <div className="flex min-h-[76px] items-center rounded-[8px] border border-[#E3E6EB] bg-[#F7F8FA] px-5 py-3">
                <p
                  className={`whitespace-pre-wrap break-words text-body-lg font-strong leading-7 ${
                    savedProfileMessage ? 'text-[#27313D]' : 'text-[#8A93A5]'
                  }`}
                >
                  {savedProfileMessage || '설정된 프로필 메시지가 없습니다.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AccountSettings embedded />
    </main>
  );
}
