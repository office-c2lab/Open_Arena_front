import { Check, Github, KeyRound, Link2, MessageCircle, ShieldAlert, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserIcon from '@/assets/icons/user.svg';
import { useAuthStore } from '@/stores/authStore';

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

export default function MyPage({ embedded = false }) {
  const navigate = useNavigate();
  const teamInfo = useAuthStore(state => state.teamInfo);
  const login = useAuthStore(state => state.login);
  const logout = useAuthStore(state => state.logout);
  const nickname = teamInfo?.teamname || teamInfo?.username || 'ARENA 유저';
  const email = teamInfo?.login_id || teamInfo?.email || 'arena@example.com';
  const savedProfileMessage = teamInfo?.profileMessage || '';
  const savedProfileImage = teamInfo?.profileImage || null;
  const profileImageInputRef = useRef(null);
  const [isEditingProfileImage, setIsEditingProfileImage] = useState(false);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [isEditingProfileMessage, setIsEditingProfileMessage] = useState(false);
  const [draftProfileImage, setDraftProfileImage] = useState(savedProfileImage);
  const [activeModal, setActiveModal] = useState(null);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    newPasswordConfirm: '',
  });
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [linkedApps, setLinkedApps] = useState([]);
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
  };
  const handleNicknameSave = () => {
    login({
      ...teamInfo,
      teamname: profile.nickname,
      username: profile.nickname,
    });
    setIsEditingNickname(false);
  };
  const handleNicknameCancel = () => {
    setProfile(current => ({ ...current, nickname }));
    setIsEditingNickname(false);
  };
  const handleProfileMessageSave = () => {
    const nextProfileMessage = profile.profileMessage.trim();
    login({ ...teamInfo, profileMessage: nextProfileMessage });
    setProfile(current => ({ ...current, profileMessage: nextProfileMessage }));
    setIsEditingProfileMessage(false);
  };
  const handleProfileMessageCancel = () => {
    setProfile(current => ({ ...current, profileMessage: savedProfileMessage }));
    setIsEditingProfileMessage(false);
  };
  const handleProfileImageChange = event => {
    const [file] = event.target.files || [];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      window.alert('프로필 이미지는 3MB 이하로 선택해 주세요.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setDraftProfileImage(reader.result);
    reader.readAsDataURL(file);
    event.target.value = '';
  };
  const handleProfileImageSave = () => {
    login({ ...teamInfo, profileImage: draftProfileImage });
    setIsEditingProfileImage(false);
  };
  const handleProfileImageCancel = () => {
    setDraftProfileImage(savedProfileImage);
    setIsEditingProfileImage(false);
  };
  const handlePasswordSubmit = () => {
    const { currentPassword, newPassword, newPasswordConfirm } = passwordForm;

    if (!currentPassword || !newPassword || !newPasswordConfirm) {
      setModalMessage('현재 비밀번호와 새 비밀번호를 모두 입력해 주세요.');
      return;
    }

    if (newPassword.length < 8) {
      setModalMessage('새 비밀번호는 8자 이상이어야 합니다.');
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

    setModalMessage('목업 환경에서 비밀번호 변경이 완료된 것으로 처리했습니다.');
    setPasswordForm({ currentPassword: '', newPassword: '', newPasswordConfirm: '' });
  };
  const handleDeleteAccount = () => {
    if (deleteConfirmText !== '탈퇴') {
      setModalMessage('정확히 "탈퇴"를 입력해야 회원 탈퇴를 진행할 수 있습니다.');
      return;
    }

    logout();
    closeModal();
    navigate('/login');
  };
  const toggleExternalApp = appId => {
    setLinkedApps(current =>
      current.includes(appId) ? current.filter(id => id !== appId) : [...current, appId]
    );
  };
  const externalApps = [
    {
      id: 'github',
      name: 'GitHub',
      description: '개발자 계정과 챌린지 활동을 연결합니다.',
      icon: Github,
    },
    {
      id: 'google',
      name: 'Google',
      description: 'Google 계정 기반 로그인과 알림 연동을 준비합니다.',
      icon: Check,
    },
    {
      id: 'discord',
      name: 'Discord',
      description: '커뮤니티 알림과 챌린지 공지를 받을 수 있게 준비합니다.',
      icon: MessageCircle,
    },
  ];

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
                      className="cursor-pointer text-body font-strong text-[#FF4854]"
                    >
                      이미지 선택
                    </button>
                    {draftProfileImage ? (
                      <button
                        type="button"
                        onClick={() => setDraftProfileImage(null)}
                        className="cursor-pointer text-body font-strong text-[#7B8491] transition hover:text-[#151A21]"
                      >
                        이미지 삭제
                      </button>
                    ) : null}
                    <p className="w-full text-caption font-strong text-[#8A93A5]">최대 3MB</p>
                  </div>
                ) : (
                  <span className="text-[#8A93A5]">
                    {savedProfileImage ? '프로필 사진이 설정되어 있습니다.' : '기본 이미지'}
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
            </div>
            <div className="flex shrink-0 items-center gap-3">
              {isEditingProfileImage ? (
                <button
                  type="button"
                  onClick={handleProfileImageCancel}
                  className="cursor-pointer text-body font-strong text-[#7B8491] transition hover:text-[#151A21]"
                >
                  취소
                </button>
              ) : null}
              <button
                type="button"
                onClick={
                  isEditingProfileImage
                    ? handleProfileImageSave
                    : () => setIsEditingProfileImage(true)
                }
                className="cursor-pointer text-body font-strong text-[#FF4854]"
              >
                {isEditingProfileImage ? '저장' : '편집'}
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
                  onChange={event => updateProfile('nickname', event.target.value)}
                  className={inputClass}
                />
                <p className="mt-1 text-caption font-strong text-[#8A93A5]">
                  수정하면 7일 후에 다시 변경할 수 있습니다.
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
                className="cursor-pointer text-body font-strong text-[#FF4854]"
              >
                {isEditingNickname ? '저장' : '편집'}
              </button>
            </div>
          </div>
        </InfoRow>
        <InfoRow label="프로필 메시지" last>
          <div className="flex items-start justify-between gap-4">
            {isEditingProfileMessage ? (
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
              {isEditingProfileMessage ? (
                <button
                  type="button"
                  onClick={handleProfileMessageCancel}
                  className="cursor-pointer text-body font-strong text-[#7B8491] transition hover:text-[#151A21]"
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
                className="cursor-pointer text-body font-strong text-[#FF4854]"
              >
                {isEditingProfileMessage ? '저장' : '편집'}
              </button>
            </div>
          </div>
        </InfoRow>
      </InfoSection>

      <InfoSection title="계정 관리">
        <InfoRow label="계정연동">
          <div className="flex flex-wrap items-center justify-between gap-3 text-[#8A93A5]">
            <span className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#9AA0A6] text-caption font-bold text-white">
                G
              </span>
              계정이 연동되어 있습니다.
            </span>
            <span>비밀번호 설정 후 연동 해제가 가능합니다.</span>
          </div>
        </InfoRow>
        <InfoRow label="외부 앱 연동">
          <div className="flex items-center justify-between gap-3 text-[#8A93A5]">
            <span className="flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              {linkedApps.length
                ? `${linkedApps.length}개 앱이 연동되어 있습니다.`
                : '연동된 계정이 없습니다.'}
            </span>
            <button
              type="button"
              onClick={() => setActiveModal('externalApps')}
              className="cursor-pointer font-strong text-[#FF4854]"
            >
              연동하기
            </button>
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
            <span>5일 전에 마지막으로 변경</span>
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
            <div className="flex items-center gap-3 rounded-[8px] bg-[#FFF7F8] px-4 py-3 text-body font-strong text-[#D83A45]">
              <KeyRound className="h-5 w-5 shrink-0" />
              목업 환경에서는 입력값 검증 후 화면에서만 변경 완료로 처리됩니다.
            </div>
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
            <Field label="새 비밀번호" hint="8자 이상으로 입력해 주세요.">
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={event =>
                  setPasswordForm(current => ({ ...current, newPassword: event.target.value }))
                }
                className={modalInputClass}
              />
            </Field>
            <Field label="새 비밀번호 확인">
              <input
                type="password"
                value={passwordForm.newPasswordConfirm}
                onChange={event =>
                  setPasswordForm(current => ({
                    ...current,
                    newPasswordConfirm: event.target.value,
                  }))
                }
                className={modalInputClass}
              />
            </Field>
            {modalMessage ? (
              <p className="rounded-[6px] bg-[#F4F6F8] px-3 py-2 text-label font-strong text-[#596575]">
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
                className="btn btn-primary btn-sm"
              >
                변경하기
              </button>
            </div>
          </div>
        </AccountModal>
      ) : null}

      {activeModal === 'externalApps' ? (
        <AccountModal
          title="외부 앱 연동"
          description="연동할 외부 앱을 선택하세요. 현재는 목업으로 화면 상태만 변경됩니다."
          onClose={closeModal}
        >
          <div className="space-y-3">
            {externalApps.map(app => {
              const Icon = app.icon;
              const isLinked = linkedApps.includes(app.id);

              return (
                <div
                  key={app.id}
                  className="flex items-center justify-between gap-4 rounded-[8px] border border-[#E3E6EB] px-4 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[#F4F6F8] text-[#3D4754]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-body font-bold text-[#151A21]">{app.name}</p>
                      <p className="mt-1 text-label font-strong text-[#697586]">
                        {app.description}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleExternalApp(app.id)}
                    className={`shrink-0 cursor-pointer rounded-[6px] px-3 py-2 text-label font-bold transition ${
                      isLinked
                        ? 'bg-[#F4F6F8] text-[#596575] hover:bg-[#E8ECF2]'
                        : 'bg-[#FF4854] text-white hover:bg-[#E63B47]'
                    }`}
                  >
                    {isLinked ? '해제하기' : '연동하기'}
                  </button>
                </div>
              );
            })}
            <div className="flex justify-end pt-2">
              <button type="button" onClick={closeModal} className="btn btn-primary btn-sm">
                완료
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
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />
              계속하려면 아래 입력창에 탈퇴라고 입력해 주세요. 목업 환경에서는 확인 후 로그아웃
              처리됩니다.
            </div>
            <Field label="확인 문구" hint="정확히 '탈퇴'라고 입력해야 합니다.">
              <input
                value={deleteConfirmText}
                onChange={event => setDeleteConfirmText(event.target.value)}
                className={modalInputClass}
                placeholder="탈퇴"
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
                className="btn btn-primary btn-sm bg-[#DC2626] hover:bg-[#B91C1C]"
              >
                탈퇴하기
              </button>
            </div>
          </div>
        </AccountModal>
      ) : null}
    </section>
  );
}
