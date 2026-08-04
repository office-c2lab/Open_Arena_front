import { CalendarDays, Camera, Mail } from 'lucide-react';
import { useRef } from 'react';
import UserIcon from '@/assets/icons/user.svg';
import ProfileBannerImage from '@/assets/images/profile_banner.png';
import { useAuthStore } from '@/stores/authStore';
import AccountSettings from './MyPage';

export default function ProfilePage() {
  const teamInfo = useAuthStore(state => state.teamInfo);
  const login = useAuthStore(state => state.login);
  const profileImageInputRef = useRef(null);
  const nickname = teamInfo?.teamname || teamInfo?.username || 'ARENA 유저';
  const email = teamInfo?.login_id || teamInfo?.email || 'arena@example.com';
  const membershipLabel = teamInfo?.membershipLabel || '무료 회원';
  const profileImage = teamInfo?.profileImage || UserIcon;
  const hasProfileImage = Boolean(teamInfo?.profileImage);
  const handleProfileImageChange = event => {
    const [file] = event.target.files || [];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      window.alert('프로필 이미지는 3MB 이하로 선택해 주세요.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => login({ ...teamInfo, profileImage: reader.result });
    reader.readAsDataURL(file);
    event.target.value = '';
  };
  const handleProfileImageRemove = () => {
    login({ ...teamInfo, profileImage: null });
  };

  return (
    <main className="mx-auto w-full max-w-[1200px] bg-white px-5 py-10 sm:px-8">
      <section className="surface relative min-h-[202px] overflow-hidden">
        <img
          src={ProfileBannerImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="relative flex min-h-[202px] flex-col justify-end px-6 pb-6 sm:px-9">
          <div className="flex items-end">
            <div className="flex items-start gap-5">
              <div className="flex shrink-0 flex-col items-center gap-2">
                <button
                  type="button"
                  aria-label="프로필 이미지 변경"
                  onClick={() => profileImageInputRef.current?.click()}
                  className={`group relative flex h-[72px] w-[72px] cursor-pointer items-center justify-center overflow-hidden rounded-full shadow-[0_5px_14px_rgba(15,23,42,0.2)] ${
                    hasProfileImage ? 'bg-[#F2F4F6]' : 'bg-[#FF4854]'
                  }`}
                >
                  <img
                    src={profileImage}
                    alt="프로필 이미지"
                    className={hasProfileImage ? 'h-full w-full object-cover' : 'h-9 w-9'}
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                    <Camera className="h-5 w-5" />
                  </span>
                </button>
                {hasProfileImage ? (
                  <button
                    type="button"
                    onClick={handleProfileImageRemove}
                    className="cursor-pointer text-body font-strong text-[#7B8491] underline decoration-[#A0A8B3] underline-offset-2 transition hover:text-[#FF4854] hover:decoration-[#FF4854]"
                  >
                    이미지 삭제
                  </button>
                ) : (
                  <span className="whitespace-nowrap text-body font-strong text-[#7B8491]">
                    최대 3MB
                  </span>
                )}
              </div>
              <input
                ref={profileImageInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                className="hidden"
              />
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
          </div>
        </div>
      </section>

      <AccountSettings embedded />
    </main>
  );
}
