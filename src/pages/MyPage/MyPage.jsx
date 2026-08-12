import { Check, ShieldAlert, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  changeNickname,
  changePassword,
  deleteProfileBackground,
  deleteProfileImage,
  updateProfileMessage,
  updateTheme,
  uploadProfileBackground,
  uploadProfileImage,
  withdrawAccount,
} from '@/api/accountApi';
import UserIcon from '@/assets/icons/user.svg';
import HomeMyBgImage from '@/assets/images/homemybg.png';
import { useAuthStore } from '@/stores/authStore';
import { appToast } from '@/components/Toast/appToast';
import PasswordPolicyChecklist from '@/components/Auth/PasswordPolicyChecklist';
import { isPasswordValid, PASSWORD_POLICY_MESSAGE, sanitizePassword } from '@/utils/passwordPolicy';
import { isNicknameValid, NICKNAME_POLICY_MESSAGE, sanitizeNickname } from '@/utils/nicknamePolicy';

function InfoRow({ label, children, last = false }) {
  return (
    <div
      className={`grid grid-cols-[150px_minmax(0,1fr)] items-center gap-4 px-4 py-4 text-body sm:px-5 ${last ? '' : 'border-b border-[#E3E6EB]'}`}
    >
      <span className="font-strong text-[#697586]">{label}</span>
      <div className="min-w-0 font-strong text-[#3D4754]">{children}</div>
    </div>
  );
}

function InfoSection({ title, children }) {
  return (
    <section className="mt-8">
      <h2 className="mb-4 text-body-lg font-bold text-[#151A21]">{title}</h2>
      <div className="surface overflow-hidden">{children}</div>
    </section>
  );
}

function AccountModal({ title, description, children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="account-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[520px] overflow-hidden rounded-[10px] border border-[#E3E6EB] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.24)]"
        onClick={event => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#E3E6EB] px-6 py-5">
          <div>
            <h2 id="account-modal-title" className="text-card-title font-bold text-[#151A21]">
              {title}
            </h2>
            {description ? (
              <p className="mt-2 text-body font-strong text-[#697586]">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-[6px] text-[#7B8491] transition hover:bg-[#F4F6F8] hover:text-[#151A21]"
            aria-label="닫기"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className="mb-2 block text-label font-bold text-[#596575]">{label}</span>
      {children}
      {hint ? (
        <span className="mt-1.5 block text-caption font-strong text-[#8A93A5]">{hint}</span>
      ) : null}
    </label>
  );
}

const modalInputClass =
  'h-10 w-full rounded-[6px] border border-[#DDE3EA] bg-white px-3 text-body font-strong text-[#3D4754] outline-none transition focus:border-[#FF4854]';
const WITHDRAW_CONFIRMATION = '회원탈퇴';
const PROFILE_MEDIA_MAX_BYTES = 3 * 1024 * 1024;
const PROFILE_MEDIA_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

const withCacheBust = url => {
  if (!url) return null;
  return `${url}${url.includes('?') ? '&' : '?'}v=${Date.now()}`;
};

const validateProfileMedia = (file, label) => {
  if (!PROFILE_MEDIA_TYPES.has(file.type)) {
    appToast.error(`${label}은 JPEG, PNG, WebP 파일만 사용할 수 있습니다.`);
    return false;
  }

  if (file.size > PROFILE_MEDIA_MAX_BYTES) {
    appToast.error(`${label}은 3MB 이하로 선택해 주세요.`);
    return false;
  }

  return true;
};

export default function MyPage({ embedded = false }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const teamInfo = useAuthStore(state => state.teamInfo);
  const login = useAuthStore(state => state.login);
  const logout = useAuthStore(state => state.logout);
  const nickname = teamInfo?.teamname || teamInfo?.username || 'ARENA 유저';
  const email = teamInfo?.login_id || teamInfo?.email || 'arena@example.com';
  const savedProfileMessage = teamInfo?.profileMessage || '';
  const savedProfileImage = teamInfo?.profileImage || teamInfo?.profile_image_url || null;
  const savedProfileBackgroundImage =
    teamInfo?.profileBackgroundImage || teamInfo?.profile_background_url || null;
  const savedProfileTextTheme = teamInfo?.profileTextTheme === 'white' ? 'white' : 'black';
  const membership = String(teamInfo?.membershipType || teamInfo?.membership || '').toLowerCase();
  const isPaidMember = ['paid', 'premium', 'pro', '유료'].includes(membership);
  const nicknameAvailableAt = teamInfo?.nickname_change_available_at;
  const nicknameAvailableAtMs = nicknameAvailableAt ? Date.parse(nicknameAvailableAt) : NaN;
  const canChangeNickname =
    Number.isNaN(nicknameAvailableAtMs) || nicknameAvailableAtMs <= Date.now();
  const nicknameAvailableLabel = canChangeNickname
    ? null
    : new Intl.DateTimeFormat('ko-KR', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(nicknameAvailableAtMs);
  const profileImageInputRef = useRef(null);
  const profileBackgroundInputRef = useRef(null);
  const [isEditingProfileImage, setIsEditingProfileImage] = useState(false);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [isEditingProfileMessage, setIsEditingProfileMessage] = useState(false);
  const [isEditingProfileBackground, setIsEditingProfileBackground] = useState(false);
  const [isEditingProfileTextTheme, setIsEditingProfileTextTheme] = useState(false);
  const [draftProfileImage, setDraftProfileImage] = useState(savedProfileImage);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [draftProfileBackgroundImage, setDraftProfileBackgroundImage] = useState(
    savedProfileBackgroundImage
  );
  const [profileBackgroundFile, setProfileBackgroundFile] = useState(null);
  const [draftProfileTextTheme, setDraftProfileTextTheme] = useState(savedProfileTextTheme);
  const [activeModal, setActiveModal] = useState(null);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    newPasswordConfirm: '',
  });
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [withdrawPassword, setWithdrawPassword] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [isChangingNickname, setIsChangingNickname] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isSavingProfileImage, setIsSavingProfileImage] = useState(false);
  const [isSavingProfileBackground, setIsSavingProfileBackground] = useState(false);
  const [isSavingProfileMessage, setIsSavingProfileMessage] = useState(false);
  const [isSavingProfileTextTheme, setIsSavingProfileTextTheme] = useState(false);
  const [profile, setProfile] = useState({
    nickname,
    profileMessage: savedProfileMessage,
    year: '2001',
    month: '3',
    day: '7',
    name: 'ARENA 회원',
    phone: '+82 10 9921 1743',
    country: 'KR 대한민국',
    gender: '비공개',
  });
  const inputClass =
    'h-8 w-full rounded-[3px] border border-[#DDE3EA] bg-white px-3 text-label font-strong text-[#3D4754] outline-none focus:border-[#FF4854]';
  const updateProfile = (key, value) => setProfile(current => ({ ...current, [key]: value }));
  const closeModal = () => {
    setActiveModal(null);
    setModalMessage('');
    setPasswordForm({ currentPassword: '', newPassword: '', newPasswordConfirm: '' });
    setDeleteConfirmText('');
    setWithdrawPassword('');
  };
  const handleNicknameSave = async () => {
    const nextNickname = profile.nickname.trim();

    if (!isNicknameValid(nextNickname)) {
      appToast.info(NICKNAME_POLICY_MESSAGE);
      return;
    }

    setIsChangingNickname(true);
    try {
      const user = await changeNickname(nextNickname);
      login({ ...teamInfo, ...user });
      setProfile(current => ({ ...current, nickname: user.nickname }));
      setIsEditingNickname(false);
      appToast.success('닉네임이 변경되었습니다.');
    } catch (error) {
      appToast.error(error.message);
    } finally {
      setIsChangingNickname(false);
    }
  };
  const handleNicknameCancel = () => {
    setProfile(current => ({ ...current, nickname }));
    setIsEditingNickname(false);
  };
  const handleProfileMessageSave = async () => {
    const nextProfileMessage = profile.profileMessage.trim();

    setIsSavingProfileMessage(true);
    try {
      const user = await updateProfileMessage(nextProfileMessage);
      login({ ...teamInfo, ...user });
      setProfile(current => ({ ...current, profileMessage: user.profileMessage }));
      setIsEditingProfileMessage(false);
      appToast.success('프로필 메시지가 변경되었습니다.');
    } catch (error) {
      appToast.error(error.message);
    } finally {
      setIsSavingProfileMessage(false);
    }
  };
  const handleProfileMessageCancel = () => {
    setProfile(current => ({ ...current, profileMessage: savedProfileMessage }));
    setIsEditingProfileMessage(false);
  };
  const handleProfileImageChange = event => {
    const [file] = event.target.files || [];
    if (!file) return;
    if (!validateProfileMedia(file, '프로필 이미지')) {
      event.target.value = '';
      return;
    }

    setProfileImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setDraftProfileImage(reader.result);
    reader.onerror = () => appToast.error('프로필 이미지 미리보기를 만들지 못했습니다.');
    reader.readAsDataURL(file);
    event.target.value = '';
  };
  const handleProfileImageSave = async () => {
    setIsSavingProfileImage(true);
    try {
      if (profileImageFile) {
        const media = await uploadProfileImage(profileImageFile);
        const nextProfileImage = withCacheBust(media.profile_image_url);
        login({
          ...teamInfo,
          ...media,
          profileImage: nextProfileImage,
          profileBackgroundImage:
            withCacheBust(media.profile_background_url) || teamInfo?.profileBackgroundImage || null,
        });
        setDraftProfileImage(nextProfileImage);
        appToast.success('프로필 사진이 변경되었습니다.');
      } else if (!draftProfileImage && savedProfileImage) {
        await deleteProfileImage();
        login({ ...teamInfo, profile_image_url: null, profileImage: null });
        setDraftProfileImage(null);
        appToast.success('프로필 사진이 삭제되었습니다.');
      }

      setProfileImageFile(null);
      setIsEditingProfileImage(false);
    } catch (error) {
      appToast.error(error.message);
    } finally {
      setIsSavingProfileImage(false);
    }
  };
  const handleProfileImageCancel = () => {
    setDraftProfileImage(savedProfileImage);
    setProfileImageFile(null);
    setIsEditingProfileImage(false);
  };
  const handleProfileBackgroundChange = event => {
    const [file] = event.target.files || [];
    if (!file) return;
    if (!validateProfileMedia(file, '프로필 배경')) {
      event.target.value = '';
      return;
    }

    setProfileBackgroundFile(file);
    const reader = new FileReader();
    reader.onload = () => setDraftProfileBackgroundImage(reader.result);
    reader.onerror = () => appToast.error('프로필 배경 미리보기를 만들지 못했습니다.');
    reader.readAsDataURL(file);
    event.target.value = '';
  };
  const handleProfileBackgroundSave = async () => {
    setIsSavingProfileBackground(true);
    try {
      if (profileBackgroundFile) {
        const media = await uploadProfileBackground(profileBackgroundFile);
        const nextProfileBackground = withCacheBust(media.profile_background_url);
        login({
          ...teamInfo,
          ...media,
          profileImage: withCacheBust(media.profile_image_url) || teamInfo?.profileImage || null,
          profileBackgroundImage: nextProfileBackground,
        });
        setDraftProfileBackgroundImage(nextProfileBackground);
        appToast.success('프로필 배경이 변경되었습니다.');
      } else if (!draftProfileBackgroundImage && savedProfileBackgroundImage) {
        await deleteProfileBackground();
        login({ ...teamInfo, profile_background_url: null, profileBackgroundImage: null });
        setDraftProfileBackgroundImage(null);
        appToast.success('프로필 배경이 삭제되었습니다.');
      }

      setProfileBackgroundFile(null);
      setIsEditingProfileBackground(false);
    } catch (error) {
      appToast.error(error.message);
    } finally {
      setIsSavingProfileBackground(false);
    }
  };
  const handleProfileBackgroundCancel = () => {
    setDraftProfileBackgroundImage(savedProfileBackgroundImage);
    setProfileBackgroundFile(null);
    setIsEditingProfileBackground(false);
  };
  const handleProfileTextThemeSave = async () => {
    setIsSavingProfileTextTheme(true);
    try {
      const user = await updateTheme(draftProfileTextTheme);
      login({ ...teamInfo, ...user });
      setDraftProfileTextTheme(user.profileTextTheme);
      setIsEditingProfileTextTheme(false);
      appToast.success('글자 테마가 변경되었습니다.');
    } catch (error) {
      appToast.error(error.message);
    } finally {
      setIsSavingProfileTextTheme(false);
    }
  };
  const handleProfileTextThemeCancel = () => {
    setDraftProfileTextTheme(savedProfileTextTheme);
    setIsEditingProfileTextTheme(false);
  };
  const handlePasswordSubmit = async () => {
    const { currentPassword, newPassword, newPasswordConfirm } = passwordForm;

    if (!currentPassword || !newPassword || !newPasswordConfirm) {
      setModalMessage('현재 비밀번호와 새 비밀번호를 모두 입력해 주세요.');
      return;
    }

    if (!isPasswordValid(newPassword)) {
      setModalMessage(PASSWORD_POLICY_MESSAGE);
      return;
    }

    if (currentPassword === newPassword) {
      setModalMessage('새 비밀번호는 현재 비밀번호와 달라야 합니다.');
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      setModalMessage('새 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    setIsChangingPassword(true);
    setModalMessage('');
    try {
      const result = await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirm: newPasswordConfirm,
      });
      appToast.success(result?.message || '비밀번호가 변경되었습니다.');
      closeModal();
    } catch (error) {
      setModalMessage(error.message);
    } finally {
      setIsChangingPassword(false);
    }
  };
  const handleDeleteAccount = async () => {
    if (!withdrawPassword) {
      setModalMessage('현재 비밀번호를 입력해 주세요.');
      return;
    }

    if (deleteConfirmText !== WITHDRAW_CONFIRMATION) {
      setModalMessage(`정확히 "${WITHDRAW_CONFIRMATION}"를 입력해 주세요.`);
      return;
    }

    setIsWithdrawing(true);
    setModalMessage('');
    try {
      await withdrawAccount({ password: withdrawPassword, confirmation: deleteConfirmText });
      queryClient.clear();
      logout();
      closeModal();
      appToast.success('회원 탈퇴가 완료되었습니다.');
      navigate('/login', { replace: true });
    } catch (error) {
      setModalMessage(error.message);
    } finally {
      setIsWithdrawing(false);
    }
  };
  return (
    <section
      className={
        embedded
          ? 'mt-10 border-t border-[#E3E6EB] pt-8'
          : 'mx-auto w-full max-w-[1200px] bg-white px-5 py-10 sm:px-8'
      }
    >
      <h1 className="text-section-title font-bold text-[#151A21]">기본정보</h1>

      <InfoSection title="공개정보">
        <InfoRow label="회원 등급">
          <span className="text-[#8A93A5]">
            {teamInfo?.membershipLabel || teamInfo?.membership || '무료 회원'}
          </span>
        </InfoRow>
        <InfoRow label="프로필 사진">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full ${
                  draftProfileImage ? 'bg-[#F2F4F6]' : 'bg-[#FF4854]'
                }`}
              >
                <img
                  src={draftProfileImage || UserIcon}
                  alt="프로필 이미지 미리보기"
                  className={draftProfileImage ? 'h-full w-full object-cover' : 'h-6 w-6'}
                />
              </div>
              <div className="min-w-0">
                {isEditingProfileImage ? (
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <button
                      type="button"
                      onClick={() => profileImageInputRef.current?.click()}
                      disabled={isSavingProfileImage}
                      className="cursor-pointer text-body font-strong text-[#FF4854] disabled:cursor-not-allowed disabled:text-[#AAB1BC]"
                    >
                      이미지 선택
                    </button>
                    {draftProfileImage ? (
                      <button
                        type="button"
                        onClick={() => {
                          setDraftProfileImage(null);
                          setProfileImageFile(null);
                        }}
                        disabled={isSavingProfileImage}
                        className="cursor-pointer text-body font-strong text-[#7B8491] transition hover:text-[#151A21] disabled:cursor-not-allowed disabled:text-[#AAB1BC]"
                      >
                        이미지 삭제
                      </button>
                    ) : null}
                    <p className="w-full text-caption font-strong text-[#8A93A5]">
                      JPEG, PNG, WebP · 최대 3MB
                    </p>
                  </div>
                ) : (
                  <span className="text-[#8A93A5]">
                    {!isPaidMember
                      ? '유료 회원 전용 기능입니다.'
                      : savedProfileImage
                        ? '프로필 사진이 설정되어 있습니다.'
                        : '기본 이미지'}
                  </span>
                )}
              </div>
              <input
                ref={profileImageInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                onChange={handleProfileImageChange}
                className="hidden"
              />
            </div>
            <div className="flex shrink-0 items-center gap-3">
              {isEditingProfileImage ? (
                <button
                  type="button"
                  onClick={handleProfileImageCancel}
                  disabled={isSavingProfileImage}
                  className="cursor-pointer text-body font-strong text-[#7B8491] transition hover:text-[#151A21] disabled:cursor-not-allowed disabled:text-[#AAB1BC]"
                >
                  취소
                </button>
              ) : null}
              <button
                type="button"
                onClick={
                  isEditingProfileImage
                    ? handleProfileImageSave
                    : () => {
                        setDraftProfileImage(savedProfileImage);
                        setProfileImageFile(null);
                        setIsEditingProfileImage(true);
                      }
                }
                disabled={!isPaidMember || isSavingProfileImage}
                className="cursor-pointer text-body font-strong text-[#FF4854] disabled:cursor-not-allowed disabled:text-[#AAB1BC]"
              >
                {!isPaidMember
                  ? '유료 전용'
                  : isSavingProfileImage
                    ? '저장 중...'
                    : isEditingProfileImage
                      ? '저장'
                      : '편집'}
              </button>
            </div>
          </div>
        </InfoRow>
        <InfoRow label="프로필 배경">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <img
                src={draftProfileBackgroundImage || HomeMyBgImage}
                alt="내 정보 카드 배경 미리보기"
                className="h-14 w-24 shrink-0 rounded-[6px] border border-[#E3E6EB] object-cover"
              />
              <div className="min-w-0">
                {isEditingProfileBackground ? (
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <button
                      type="button"
                      onClick={() => profileBackgroundInputRef.current?.click()}
                      disabled={isSavingProfileBackground}
                      className="cursor-pointer text-body font-strong text-[#FF4854] disabled:cursor-not-allowed disabled:text-[#AAB1BC]"
                    >
                      이미지 선택
                    </button>
                    {draftProfileBackgroundImage ? (
                      <button
                        type="button"
                        onClick={() => {
                          setDraftProfileBackgroundImage(null);
                          setProfileBackgroundFile(null);
                        }}
                        disabled={isSavingProfileBackground}
                        className="cursor-pointer text-body font-strong text-[#7B8491] transition hover:text-[#151A21] disabled:cursor-not-allowed disabled:text-[#AAB1BC]"
                      >
                        기본 배경 사용
                      </button>
                    ) : null}
                    <p className="w-full text-caption font-strong text-[#8A93A5]">
                      JPEG, PNG, WebP · 최대 3MB
                    </p>
                  </div>
                ) : (
                  <span className="text-[#8A93A5]">
                    {!isPaidMember
                      ? '유료 회원 전용 기능입니다.'
                      : savedProfileBackgroundImage
                        ? '사용자 배경이 설정되어 있습니다.'
                        : '기본 배경을 사용 중입니다.'}
                  </span>
                )}
              </div>
              <input
                ref={profileBackgroundInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                onChange={handleProfileBackgroundChange}
                className="hidden"
              />
            </div>
            <div className="flex shrink-0 items-center gap-3">
              {isEditingProfileBackground ? (
                <button
                  type="button"
                  onClick={handleProfileBackgroundCancel}
                  disabled={isSavingProfileBackground}
                  className="cursor-pointer text-body font-strong text-[#7B8491] transition hover:text-[#151A21] disabled:cursor-not-allowed disabled:text-[#AAB1BC]"
                >
                  취소
                </button>
              ) : null}
              <button
                type="button"
                onClick={
                  isEditingProfileBackground
                    ? handleProfileBackgroundSave
                    : () => {
                        setDraftProfileBackgroundImage(savedProfileBackgroundImage);
                        setProfileBackgroundFile(null);
                        setIsEditingProfileBackground(true);
                      }
                }
                disabled={!isPaidMember || isSavingProfileBackground}
                className="cursor-pointer text-body font-strong text-[#FF4854] disabled:cursor-not-allowed disabled:text-[#AAB1BC]"
              >
                {!isPaidMember
                  ? '유료 전용'
                  : isSavingProfileBackground
                    ? '저장 중...'
                    : isEditingProfileBackground
                      ? '저장'
                      : '편집'}
              </button>
            </div>
          </div>
        </InfoRow>
        <InfoRow label="글자 테마">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              {!isPaidMember ? (
                <span className="text-[#8A93A5]">유료 회원 전용 기능입니다.</span>
              ) : isEditingProfileTextTheme ? (
                <div
                  className="inline-flex rounded-[6px] border border-[#DDE3EA] bg-[#F4F6F8] p-1"
                  role="radiogroup"
                  aria-label="내 정보 카드 글자 테마"
                >
                  {[
                    { value: 'black', label: '블랙', previewClass: 'bg-[#202832]' },
                    { value: 'white', label: '화이트', previewClass: 'border bg-white' },
                  ].map(theme => {
                    const isSelected = draftProfileTextTheme === theme.value;

                    return (
                      <button
                        key={theme.value}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => setDraftProfileTextTheme(theme.value)}
                        className={`flex h-8 cursor-pointer items-center gap-2 rounded-[4px] px-3 text-label font-bold transition ${
                          isSelected
                            ? 'bg-white text-[#202832] shadow-[0_1px_4px_rgba(15,23,42,0.12)]'
                            : 'text-[#7B8491] hover:text-[#202832]'
                        }`}
                      >
                        <span
                          className={`h-3.5 w-3.5 rounded-full ${theme.previewClass}`}
                          aria-hidden="true"
                        />
                        {theme.label}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <span className="flex items-center gap-2">
                  <span
                    className={`h-3.5 w-3.5 rounded-full ${
                      savedProfileTextTheme === 'white'
                        ? 'border border-[#DDE3EA] bg-white'
                        : 'bg-[#202832]'
                    }`}
                    aria-hidden="true"
                  />
                  {savedProfileTextTheme === 'white' ? '화이트' : '블랙'}
                </span>
              )}
              {isPaidMember ? (
                <p className="mt-1 text-caption font-strong text-[#8A93A5]">
                  내 정보 카드의 글자색을 선택합니다.
                </p>
              ) : null}
            </div>
            <div className="flex shrink-0 items-center gap-3">
              {isPaidMember && isEditingProfileTextTheme ? (
                <button
                  type="button"
                  onClick={handleProfileTextThemeCancel}
                  disabled={isSavingProfileTextTheme}
                  className="cursor-pointer text-body font-strong text-[#7B8491] transition hover:text-[#151A21] disabled:cursor-not-allowed disabled:text-[#AAB1BC]"
                >
                  취소
                </button>
              ) : null}
              <button
                type="button"
                onClick={
                  isEditingProfileTextTheme
                    ? handleProfileTextThemeSave
                    : () => setIsEditingProfileTextTheme(true)
                }
                disabled={!isPaidMember || isSavingProfileTextTheme}
                className="cursor-pointer text-body font-strong text-[#FF4854] disabled:cursor-not-allowed disabled:text-[#AAB1BC]"
              >
                {!isPaidMember
                  ? '유료 전용'
                  : isSavingProfileTextTheme
                    ? '저장 중...'
                    : isEditingProfileTextTheme
                      ? '저장'
                      : '편집'}
              </button>
            </div>
          </div>
        </InfoRow>
        <InfoRow label="닉네임">
          <div className="flex items-start justify-between gap-4">
            {isEditingNickname ? (
              <div className="min-w-0 flex-1">
                <input
                  value={profile.nickname}
                  minLength={2}
                  maxLength={8}
                  onChange={event =>
                    updateProfile('nickname', sanitizeNickname(event.target.value))
                  }
                  className={inputClass}
                />
                <p className="mt-1 text-caption font-strong text-[#8A93A5]">
                  한글, 영문, 숫자, 밑줄 2~8자 · 수정하면 7일 후 다시 변경할 수 있습니다.
                </p>
              </div>
            ) : (
              <span className="min-w-0 flex-1 truncate">{nickname}</span>
            )}
            <div className="flex shrink-0 items-center gap-3">
              {isEditingNickname ? (
                <button
                  type="button"
                  onClick={handleNicknameCancel}
                  className="cursor-pointer text-body font-strong text-[#7B8491] transition hover:text-[#151A21]"
                >
                  취소
                </button>
              ) : null}
              <button
                type="button"
                onClick={isEditingNickname ? handleNicknameSave : () => setIsEditingNickname(true)}
                disabled={isChangingNickname || (!isEditingNickname && !canChangeNickname)}
                className="cursor-pointer text-body font-strong text-[#FF4854] disabled:cursor-not-allowed disabled:text-[#AAB1BC]"
              >
                {isChangingNickname
                  ? '저장 중...'
                  : isEditingNickname
                    ? '저장'
                    : nicknameAvailableLabel
                      ? `${nicknameAvailableLabel} 이후 변경 가능`
                      : '편집'}
              </button>
            </div>
          </div>
        </InfoRow>
        <InfoRow label="프로필 메시지" last>
          <div className="flex items-start justify-between gap-4">
            {!isPaidMember ? (
              <span className="min-w-0 flex-1 text-[#8A93A5]">유료 회원 전용 기능입니다.</span>
            ) : isEditingProfileMessage ? (
              <div className="min-w-0 flex-1">
                <textarea
                  value={profile.profileMessage}
                  maxLength={100}
                  rows={2}
                  placeholder="나를 소개하는 프로필 메시지를 입력해 주세요."
                  onChange={event => updateProfile('profileMessage', event.target.value)}
                  className="block min-h-16 w-full resize-none rounded-[3px] border border-[#DDE3EA] bg-white px-3 py-2 text-label font-strong leading-5 text-[#3D4754] outline-none focus:border-[#FF4854]"
                />
                <p className="mt-1 text-right text-caption font-strong text-[#8A93A5]">
                  {profile.profileMessage.length}/100
                </p>
              </div>
            ) : (
              <span
                className={`min-w-0 flex-1 whitespace-pre-wrap break-words ${
                  savedProfileMessage ? '' : 'text-[#8A93A5]'
                }`}
              >
                {savedProfileMessage || '설정된 프로필 메시지가 없습니다.'}
              </span>
            )}
            <div className="flex shrink-0 items-center gap-3">
              {isPaidMember && isEditingProfileMessage ? (
                <button
                  type="button"
                  onClick={handleProfileMessageCancel}
                  disabled={isSavingProfileMessage}
                  className="cursor-pointer text-body font-strong text-[#7B8491] transition hover:text-[#151A21] disabled:cursor-not-allowed disabled:text-[#AAB1BC]"
                >
                  취소
                </button>
              ) : null}
              <button
                type="button"
                onClick={
                  isEditingProfileMessage
                    ? handleProfileMessageSave
                    : () => setIsEditingProfileMessage(true)
                }
                disabled={!isPaidMember || isSavingProfileMessage}
                className="cursor-pointer text-body font-strong text-[#FF4854] disabled:cursor-not-allowed disabled:text-[#AAB1BC]"
              >
                {!isPaidMember
                  ? '유료 전용'
                  : isSavingProfileMessage
                    ? '저장 중...'
                    : isEditingProfileMessage
                      ? '저장'
                      : '편집'}
              </button>
            </div>
          </div>
        </InfoRow>
      </InfoSection>

      <InfoSection title="계정 관리">
        <InfoRow label="계정연동">
          <div className="flex flex-wrap items-center justify-between gap-3 text-[#8A93A5]">
            <span className="flex items-center gap-2">
              계정이 연동되어 있습니다.
            </span>
          </div>
        </InfoRow>
        <InfoRow label="이메일">
          <span className="inline-flex items-center gap-1.5 text-[#8A93A5]">
            {email}
            <Check className="h-4 w-4 text-[#FF4854]" strokeWidth={3} />
          </span>
        </InfoRow>
        <InfoRow label="비밀번호" last>
          <div className="flex items-center justify-between gap-3 text-[#8A93A5]">
            <span>현재 비밀번호 확인 후 변경할 수 있습니다.</span>
            <button
              type="button"
              onClick={() => setActiveModal('password')}
              className="cursor-pointer font-strong text-[#FF4854]"
            >
              변경하기
            </button>
          </div>
        </InfoRow>
      </InfoSection>

      <button
        type="button"
        onClick={() => setActiveModal('delete')}
        className="mt-8 w-full cursor-pointer text-center text-body font-strong text-[#FF4854]"
      >
        회원 탈퇴하기
      </button>

      {activeModal === 'password' ? (
        <AccountModal
          title="비밀번호 변경"
          description="현재 비밀번호를 확인한 뒤 새 비밀번호로 변경합니다."
          onClose={closeModal}
        >
          <div className="space-y-4">
            <Field label="현재 비밀번호">
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={event =>
                  setPasswordForm(current => ({ ...current, currentPassword: event.target.value }))
                }
                className={modalInputClass}
              />
            </Field>
            <Field label="새 비밀번호">
              <input
                type="password"
                minLength={8}
                maxLength={128}
                autoComplete="new-password"
                value={passwordForm.newPassword}
                onChange={event =>
                  setPasswordForm(current => ({
                    ...current,
                    newPassword: sanitizePassword(event.target.value),
                  }))
                }
                className={modalInputClass}
              />
              <PasswordPolicyChecklist password={passwordForm.newPassword} />
            </Field>
            <Field label="새 비밀번호 확인">
              <input
                type="password"
                minLength={8}
                maxLength={128}
                autoComplete="new-password"
                value={passwordForm.newPasswordConfirm}
                onChange={event =>
                  setPasswordForm(current => ({
                    ...current,
                    newPasswordConfirm: sanitizePassword(event.target.value),
                  }))
                }
                className={modalInputClass}
              />
            </Field>
            {modalMessage ? (
              <p className="rounded-[6px] bg-[#FEF2F2] px-3 py-2 text-label font-strong text-[#B91C1C]">
                {modalMessage}
              </p>
            ) : null}
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={closeModal} className="btn btn-secondary btn-sm">
                취소
              </button>
              <button
                type="button"
                onClick={handlePasswordSubmit}
                disabled={isChangingPassword}
                className="btn btn-primary btn-sm"
              >
                {isChangingPassword ? '변경 중...' : '변경하기'}
              </button>
            </div>
          </div>
        </AccountModal>
      ) : null}

      {activeModal === 'delete' ? (
        <AccountModal
          title="회원 탈퇴"
          description="탈퇴하면 계정 정보와 챌린지 기록을 더 이상 사용할 수 없습니다. 이 작업은 되돌릴 수 없습니다."
          onClose={closeModal}
        >
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-[8px] bg-[#FEF2F2] px-4 py-3 text-body font-strong text-[#B91C1C]">
              계속하면 계정과 세션이 비활성화되며 이 작업은 되돌릴 수 없습니다.
            </div>
            <Field label="현재 비밀번호">
              <input
                type="password"
                value={withdrawPassword}
                onChange={event => setWithdrawPassword(event.target.value)}
                className={modalInputClass}
                autoComplete="current-password"
              />
            </Field>
            <Field
              label="확인 문구"
              hint={`정확히 '${WITHDRAW_CONFIRMATION}'라고 입력해야 합니다.`}
            >
              <input
                value={deleteConfirmText}
                onChange={event => setDeleteConfirmText(event.target.value)}
                className={modalInputClass}
                placeholder={WITHDRAW_CONFIRMATION}
              />
            </Field>
            {modalMessage ? (
              <p className="rounded-[6px] bg-[#FEF2F2] px-3 py-2 text-label font-strong text-[#B91C1C]">
                {modalMessage}
              </p>
            ) : null}
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={closeModal} className="btn btn-secondary btn-sm">
                취소
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={isWithdrawing}
                className="btn btn-primary btn-sm bg-[#DC2626] hover:bg-[#B91C1C]"
              >
                {isWithdrawing ? '탈퇴 처리 중...' : '탈퇴하기'}
              </button>
            </div>
          </div>
        </AccountModal>
      ) : null}
    </section>
  );
}
