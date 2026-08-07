import { CalendarDays, Camera, Mail, Pencil, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import UserIcon from '@/assets/icons/user.svg';
import { useAuthStore } from '@/stores/authStore';
import AccountSettings from './MyPage';

export default function ProfilePage() {
  const teamInfo = useAuthStore(state => state.teamInfo);
  const login = useAuthStore(state => state.login);
  const profileImageInputRef = useRef(null);
  const profileMessageInputRef = useRef(null);
  const nickname = teamInfo?.teamname || teamInfo?.username || 'ARENA 유저';
  const email = teamInfo?.login_id || teamInfo?.email || 'arena@example.com';
  const membershipLabel = teamInfo?.membershipLabel || '무료 회원';
  const profileImage = teamInfo?.profileImage || UserIcon;
  const hasProfileImage = Boolean(teamInfo?.profileImage);
  const savedProfileMessage = teamInfo?.profileMessage || '';
  const [profileMessage, setProfileMessage] = useState(savedProfileMessage);
  const [isEditingProfileMessage, setIsEditingProfileMessage] = useState(false);

  useEffect(() => {
    setProfileMessage(savedProfileMessage);
  }, [savedProfileMessage]);

  useEffect(() => {
    if (isEditingProfileMessage) profileMessageInputRef.current?.focus();
  }, [isEditingProfileMessage]);

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
  const handleProfileMessageSave = () => {
    const nextProfileMessage = profileMessage.trim();
    login({ ...teamInfo, profileMessage: nextProfileMessage });
    setProfileMessage(nextProfileMessage);
    setIsEditingProfileMessage(false);
  };
  const handleProfileMessageCancel = () => {
    setProfileMessage(savedProfileMessage);
    setIsEditingProfileMessage(false);
  };
  const handleProfileMessageKeyDown = event => {
    if (event.key === 'Escape') handleProfileMessageCancel();
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleProfileMessageSave();
    }
  };

  return (
    <main className="mx-auto w-full max-w-[1200px] bg-white px-5 py-10 sm:px-8">
      <section className="surface overflow-hidden">
        <div className="flex flex-col justify-center px-6 py-6 sm:px-8 lg:min-h-[176px] lg:px-9">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            <div className="flex shrink-0 items-start gap-5">
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
            <div className="min-w-0 flex-1 border-t border-[#E3E6EB] pt-5 lg:border-l lg:border-t-0 lg:py-1 lg:pl-8">
              <p className="mb-2 text-label font-bold text-[#697586]">프로필 메시지</p>
              {isEditingProfileMessage ? (
                <div className="rounded-[8px] border border-[#FF9DA5] bg-[#FAFBFC] p-3 shadow-[0_0_0_3px_rgba(255,72,84,0.08)]">
                  <textarea
                    ref={profileMessageInputRef}
                    value={profileMessage}
                    maxLength={100}
                    rows={2}
                    placeholder="나를 소개하는 프로필 메시지를 입력해 주세요."
                    aria-label="프로필 메시지"
                    onChange={event => setProfileMessage(event.target.value)}
                    onKeyDown={handleProfileMessageKeyDown}
                    className="block max-h-20 min-h-12 w-full resize-none bg-transparent text-body font-strong leading-6 text-[#27313D] outline-none placeholder:text-[#8A93A5]"
                  />
                  <div className="mt-2 flex items-center justify-between gap-3 border-t border-[#EEF0F3] pt-2">
                    <span className="text-caption font-strong text-[#8A93A5]">
                      {profileMessage.length}/100
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleProfileMessageCancel}
                        className="flex h-8 cursor-pointer items-center gap-1 rounded-[5px] px-2.5 text-label font-bold text-[#697586] transition hover:bg-[#F4F6F8]"
                      >
                        <X className="h-3.5 w-3.5" />
                        취소
                      </button>
                      <button
                        type="button"
                        onClick={handleProfileMessageSave}
                        className="h-8 cursor-pointer rounded-[5px] bg-[#FF4854] px-3 text-label font-bold text-white transition hover:bg-[#E93B47]"
                      >
                        저장
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditingProfileMessage(true)}
                  className="group flex min-h-[76px] w-full cursor-pointer items-center justify-between gap-4 rounded-[8px] border border-[#E3E6EB] bg-[#F7F8FA] px-5 py-3 text-left transition hover:border-[#FFB8BE] hover:bg-[#FFF7F8] focus-visible:border-[#FF4854] focus-visible:bg-[#FFF7F8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4854]/15"
                  aria-label={savedProfileMessage ? '프로필 메시지 편집' : '프로필 메시지 설정'}
                >
                  <span
                    className={`min-w-0 whitespace-pre-wrap break-words text-body-lg font-strong leading-7 ${
                      savedProfileMessage ? 'text-[#27313D]' : 'text-[#7B8491]'
                    }`}
                  >
                    {savedProfileMessage || '프로필 메시지를 설정해 보세요.'}
                  </span>
                  <span className="flex shrink-0 items-center gap-1.5 rounded-[5px] bg-white px-2.5 py-1.5 text-label font-bold text-[#697586] shadow-[0_1px_3px_rgba(15,23,42,0.08)] transition group-hover:text-[#FF4854]">
                    <Pencil className="h-4 w-4" />
                    편집
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <AccountSettings embedded />
    </main>
  );
}
