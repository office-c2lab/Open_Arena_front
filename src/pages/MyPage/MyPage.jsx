import { Check, Link2 } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';

function InfoRow({ label, children, last = false }) {
  return (
    <div className={`grid grid-cols-[150px_minmax(0,1fr)] items-center gap-4 px-4 py-4 text-[13px] sm:px-5 ${last ? '' : 'border-b border-[#E3E6EB]'}`}>
      <span className="font-700 text-[#697586]">{label}</span>
      <div className="min-w-0 font-700 text-[#3D4754]">{children}</div>
    </div>
  );
}

function InfoSection({ title, children }) {
  return (
    <section className="mt-8">
      <h2 className="mb-4 text-[17px] font-900 text-[#151A21]">{title}</h2>
      <div className="overflow-hidden rounded-[4px] border border-[#DDE3EA] bg-white">{children}</div>
    </section>
  );
}

export default function MyPage({ embedded = false }) {
  const teamInfo = useAuthStore(state => state.teamInfo);
  const login = useAuthStore(state => state.login);
  const nickname = teamInfo?.teamname || teamInfo?.username || 'ARENA 유저';
  const email = teamInfo?.login_id || teamInfo?.email || 'arena@example.com';
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    nickname,
    year: '2001',
    month: '3',
    day: '7',
    name: 'ARENA 회원',
    phone: '+82 10 9921 1743',
    country: 'KR 대한민국',
    gender: '비공개',
  });
  const inputClass =
    'h-8 w-full rounded-[3px] border border-[#DDE3EA] bg-white px-3 text-[12px] font-700 text-[#3D4754] outline-none focus:border-[#FF4854]';
  const disabledInputClass =
    'h-8 w-full rounded-[3px] border border-[#DDE3EA] bg-[#F4F6F8] px-3 text-[12px] font-700 text-[#A0A8B3] outline-none';
  const updateProfile = (key, value) => setProfile(current => ({ ...current, [key]: value }));
  const handleSave = () => {
    login({ ...teamInfo, teamname: profile.nickname, username: profile.nickname });
    setIsEditing(false);
  };
  const handleCancel = () => {
    setProfile(current => ({ ...current, nickname }));
    setIsEditing(false);
  };

  return (
    <section className={embedded ? 'mt-10 border-t border-[#E3E6EB] pt-8' : 'mx-auto w-full max-w-[1200px] bg-white px-5 py-10 sm:px-8'}>
      <div className="flex items-center gap-8">
        <h1 className="text-[23px] font-900 text-[#151A21]">기본정보</h1>
        <button
          type="button"
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className="cursor-pointer text-[13px] font-800 text-[#FF4854]"
        >
          {isEditing ? '저장' : '편집'}
        </button>
      </div>

      <InfoSection title="공개정보">
        <InfoRow label="닉네임">
          {isEditing ? (
            <div>
              <input value={profile.nickname} onChange={event => updateProfile('nickname', event.target.value)} className={inputClass} />
              <p className="mt-1 text-[10px] font-600 text-[#8A93A5]">수정하면 7일 후에 다시 변경할 수 있습니다.</p>
            </div>
          ) : (
            nickname
          )}
        </InfoRow>
        <InfoRow label="생년월일" last>
          {isEditing ? (
            <div className="flex gap-2">
              {[
                ['year', ['2001', '2000', '1999']],
                ['month', ['3', '2', '1']],
                ['day', ['7', '6', '5']],
              ].map(([key, options]) => (
                <select key={key} value={profile[key]} onChange={event => updateProfile(key, event.target.value)} className={inputClass}>
                  {options.map(option => <option key={option}>{option}</option>)}
                </select>
              ))}
              <button type="button" className="shrink-0 text-[12px] font-800 text-[#FF4854]">초기화</button>
            </div>
          ) : (
            `${profile.year}-${profile.month.padStart(2, '0')}-${profile.day.padStart(2, '0')}`
          )}
        </InfoRow>
      </InfoSection>

      <InfoSection title="개인정보">
        <InfoRow label="이름">{isEditing ? <input disabled value={profile.name} className={disabledInputClass} /> : profile.name}</InfoRow>
        <InfoRow label="전화번호">
          {isEditing ? (
            <div>
              <div className="flex gap-3">
                <input value={profile.phone} onChange={event => updateProfile('phone', event.target.value)} className={disabledInputClass} />
                <button type="button" className="shrink-0 text-[12px] font-800 text-[#FF4854]">인증하기</button>
              </div>
              <p className="mt-1 text-[10px] font-600 text-[#8A93A5]">전화번호 변경을 위해 본인인증이 필요합니다.</p>
            </div>
          ) : profile.phone}
        </InfoRow>
        <InfoRow label="국가">
          {isEditing ? (
            <select value={profile.country} onChange={event => updateProfile('country', event.target.value)} className={inputClass}>
              <option>KR 대한민국</option>
            </select>
          ) : profile.country}
        </InfoRow>
        <InfoRow label="성별" last>
          {isEditing ? (
            <select value={profile.gender} onChange={event => updateProfile('gender', event.target.value)} className={inputClass}>
              <option>비공개</option>
              <option>남성</option>
              <option>여성</option>
            </select>
          ) : profile.gender}
        </InfoRow>
      </InfoSection>

      <InfoSection title="계정 관리">
        <InfoRow label="계정연동">
          <div className="flex flex-wrap items-center justify-between gap-3 text-[#8A93A5]">
            <span className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#9AA0A6] text-[11px] font-900 text-white">G</span>
              계정이 연동되어 있습니다.
            </span>
            <span>비밀번호 설정 후 연동 해제가 가능합니다.</span>
          </div>
        </InfoRow>
        <InfoRow label="외부 앱 연동">
          <div className="flex items-center justify-between gap-3 text-[#8A93A5]">
            <span className="flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              연동된 계정이 없습니다.
            </span>
            <button type="button" className="cursor-pointer font-800 text-[#FF4854]">연동하기</button>
          </div>
        </InfoRow>
        <InfoRow label="이메일 아이디">
          {isEditing ? (
            <div>
              <div className="flex gap-3">
                <input disabled value={email} className={disabledInputClass} />
                <button type="button" className="shrink-0 text-[12px] font-800 text-[#FF4854]">인증하기</button>
              </div>
              <p className="mt-1 text-[10px] font-600 text-[#8A93A5]">이메일 변경을 위해 이메일 인증이 필요합니다.</p>
            </div>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[#8A93A5]">
              {email}
              <Check className="h-4 w-4 text-[#FF4854]" strokeWidth={3} />
            </span>
          )}
        </InfoRow>
        <InfoRow label="비밀번호" last>
          <div className="flex items-center justify-between gap-3 text-[#8A93A5]">
            <span>5일 전에 마지막으로 변경</span>
            <button type="button" className="cursor-pointer font-800 text-[#FF4854]">변경하기</button>
          </div>
        </InfoRow>
      </InfoSection>

      {isEditing ? (
        <div className="mt-8 flex justify-end gap-3">
          <button type="button" onClick={handleCancel} className="h-9 cursor-pointer rounded-[3px] border border-[#DDE3EA] px-5 text-[13px] font-800 text-[#596575]">
            취소
          </button>
          <button type="button" onClick={handleSave} className="h-9 cursor-pointer rounded-[3px] bg-[#FF4854] px-5 text-[13px] font-800 text-white">
            저장하기
          </button>
        </div>
      ) : (
        <button type="button" className="mt-8 w-full cursor-pointer text-center text-[13px] font-800 text-[#FF4854]">
          회원 탈퇴하기
        </button>
      )}
    </section>
  );
}
