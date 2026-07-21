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

      <AccountSettings embedded />
    </main>
  );
}
