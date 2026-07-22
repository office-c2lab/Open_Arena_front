import React, { useMemo, useState } from 'react';
import { RefreshCw, Save, Search, X } from 'lucide-react';
import { useAdminTeamActions, useAdminTeams } from '@/hooks/useAdminTeams';

const getUserId = user => user.id ?? user.user_id ?? user.team_id;
const getDisplayName = user =>
  user.nickname ?? user.teamname ?? user.username ?? user.login_id ?? `User ${getUserId(user)}`;
const getLoginId = user => user.login_id ?? user.username ?? '-';
const getEmail = user => user.email ?? '-';
const getScore = user => user.score ?? user.total_score ?? 0;
const getSolvedCount = user => user.solved_count ?? user.solvedCount ?? 0;
const getCreatedAt = user => user.created_at ?? user.createdAt ?? user.joined_at ?? null;
const getIsActive = user => {
  if (typeof user.is_active === 'boolean') return user.is_active;
  if (typeof user.active === 'boolean') return user.active;
  if (typeof user.enabled === 'boolean') return user.enabled;
  return true;
};
const getMembership = user => {
  const value = user.membership ?? user.plan ?? user.member_type ?? user.subscription_type;
  return ['paid', 'premium', 'pro', '유료'].includes(String(value).toLowerCase()) ? 'paid' : 'free';
};
const getTokenLimit = user =>
  Number(user.token_limit ?? user.free_token_limit ?? user.tokenLimit ?? 1000);
const getChallengeLimit = user =>
  Number(user.challenge_limit ?? user.free_challenge_limit ?? user.challengeLimit ?? 6);
const getSubmissionLimit = user =>
  Number(user.submission_limit ?? user.free_submission_limit ?? user.submissionLimit ?? 10);
const getChallengeUsed = user =>
  Number(user.challenge_used_today ?? user.used_challenge_today ?? user.challengeUsedToday ?? 0);
const getSubmissionUsed = user =>
  Number(user.submission_used_today ?? user.used_submission_today ?? user.submissionUsedToday ?? 0);
const getTokenUsed = user =>
  Number(user.token_used_today ?? user.used_token_today ?? user.tokenUsedToday ?? 0);

const parseLimitValue = (value, label) => {
  const numberValue = Number(value);
  if (!Number.isInteger(numberValue) || numberValue < 0) {
    throw new Error(`${label} 한도는 0 이상의 정수로 입력해 주세요.`);
  }
  return numberValue;
};

const formatDate = value => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('ko-KR');
};

const normalizeTeams = data => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.teams)) return data.teams;
  if (Array.isArray(data?.users)) return data.users;
  if (Array.isArray(data?.items)) return data.items;
  return [];
};

export default function AdminUserManagementPage() {
  const [keyword, setKeyword] = useState('');
  const [actionError, setActionError] = useState('');
  const [membershipFilter, setMembershipFilter] = useState('all');
  const [membershipOverrides, setMembershipOverrides] = useState({});
  const [tokenLimitOverrides, setTokenLimitOverrides] = useState({});
  const [challengeLimitOverrides, setChallengeLimitOverrides] = useState({});
  const [submissionLimitOverrides, setSubmissionLimitOverrides] = useState({});
  const [tokenInputs, setTokenInputs] = useState({});
  const [challengeInputs, setChallengeInputs] = useState({});
  const [submissionInputs, setSubmissionInputs] = useState({});
  const [activeOverrides, setActiveOverrides] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDailyLimitModalOpen, setIsDailyLimitModalOpen] = useState(false);
  const [dailyLimitInputs, setDailyLimitInputs] = useState({
    challenge: '6',
    submission: '10',
    token: '1000',
  });
  const { data, isLoading, isError, refetch, isFetching } = useAdminTeams();
  const { toggleActive, resetPassword, isToggling, isResettingPassword } = useAdminTeamActions();

  const users = useMemo(() => normalizeTeams(data), [data]);
  const getCurrentIsActive = user => activeOverrides[getUserId(user)] ?? getIsActive(user);
  const getCurrentMembership = user => membershipOverrides[getUserId(user)] ?? getMembership(user);
  const getCurrentTokenLimit = user => tokenLimitOverrides[getUserId(user)] ?? getTokenLimit(user);
  const getCurrentChallengeLimit = user =>
    challengeLimitOverrides[getUserId(user)] ?? getChallengeLimit(user);
  const getCurrentSubmissionLimit = user =>
    submissionLimitOverrides[getUserId(user)] ?? getSubmissionLimit(user);

  const filteredUsers = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    return users.filter(user => {
      if (membershipFilter !== 'all' && getCurrentMembership(user) !== membershipFilter) {
        return false;
      }
      if (!normalizedKeyword) return true;

      const searchableText = [
        getDisplayName(user),
        getLoginId(user),
        getEmail(user),
        String(getUserId(user) ?? ''),
      ]
        .join(' ')
        .toLowerCase();

      return searchableText.includes(normalizedKeyword);
    });
  }, [keyword, users, membershipFilter, membershipOverrides]);

  const freeCount = users.filter(user => getCurrentMembership(user) === 'free').length;
  const paidCount = users.filter(user => getCurrentMembership(user) === 'paid').length;

  const handleRefresh = () => {
    refetch();
  };

  const handleToggleActive = async user => {
    const userId = getUserId(user);

    setActionError('');
    try {
      await toggleActive(userId);
      setActiveOverrides(prev => ({ ...prev, [userId]: !getCurrentIsActive(user) }));
    } catch (error) {
      setActionError(
        error.response?.data?.detail ?? error.message ?? '활성 상태 변경에 실패했습니다.'
      );
    }
  };

  const handleResetPassword = async user => {
    const userId = getUserId(user);
    const confirmed = window.confirm(`${getDisplayName(user)} 비밀번호를 초기화할까요?`);
    if (!confirmed) return;

    setActionError('');
    try {
      await resetPassword({ teamId: userId });
      window.alert(`${getDisplayName(user)} 비밀번호가 초기화되었습니다.`);
    } catch (error) {
      setActionError(
        error.response?.data?.detail ?? error.message ?? '비밀번호 초기화에 실패했습니다.'
      );
    }
  };

  const handleTokenInputChange = (userId, value) => {
    setTokenInputs(prev => ({ ...prev, [userId]: value }));
  };

  const handleChallengeInputChange = (userId, value) => {
    setChallengeInputs(prev => ({ ...prev, [userId]: value }));
  };

  const handleSubmissionInputChange = (userId, value) => {
    setSubmissionInputs(prev => ({ ...prev, [userId]: value }));
  };

  const handleDailyLimitInputChange = (key, value) => {
    setDailyLimitInputs(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveUserLimits = user => {
    const userId = getUserId(user);

    let challengeLimit;
    let submissionLimit;
    let tokenLimit;

    try {
      challengeLimit = parseLimitValue(challengeInputs[userId] ?? '0', '도전 추가');
      submissionLimit = parseLimitValue(submissionInputs[userId] ?? '0', '제출 추가');
      tokenLimit = parseLimitValue(tokenInputs[userId] ?? '0', '토큰 추가');
    } catch (error) {
      setActionError(error.message);
      return;
    }

    setActionError('');
    setChallengeLimitOverrides(prev => ({
      ...prev,
      [userId]: getCurrentChallengeLimit(user) + challengeLimit,
    }));
    setSubmissionLimitOverrides(prev => ({
      ...prev,
      [userId]: getCurrentSubmissionLimit(user) + submissionLimit,
    }));
    setTokenLimitOverrides(prev => ({
      ...prev,
      [userId]: getCurrentTokenLimit(user) + tokenLimit,
    }));
    setChallengeInputs(prev => ({ ...prev, [userId]: '0' }));
    setSubmissionInputs(prev => ({ ...prev, [userId]: '0' }));
    setTokenInputs(prev => ({ ...prev, [userId]: '0' }));
  };

  const handleUpgradeToPaid = user => {
    const userId = getUserId(user);
    const confirmed = window.confirm(
      `${getDisplayName(user)} 사용자를 유료회원으로 전환할까요? (목업에서는 화면에만 반영됩니다.)`
    );
    if (!confirmed) return;

    setMembershipOverrides(prev => ({ ...prev, [userId]: 'paid' }));
  };

  const handleDowngradeToFree = user => {
    const userId = getUserId(user);
    const confirmed = window.confirm(
      `${getDisplayName(user)} 사용자를 무료회원으로 전환할까요? (목업에서는 화면에만 반영됩니다.)`
    );
    if (!confirmed) return;

    setMembershipOverrides(prev => ({ ...prev, [userId]: 'free' }));
  };

  const handleSaveDailyLimit = () => {
    let challengeLimit;
    let submissionLimit;
    let tokenLimit;

    try {
      challengeLimit = parseLimitValue(dailyLimitInputs.challenge, '도전');
      submissionLimit = parseLimitValue(dailyLimitInputs.submission, '제출');
      tokenLimit = parseLimitValue(dailyLimitInputs.token, '토큰');
    } catch (error) {
      setActionError(error.message);
      return;
    }

    const freeUserIds = users
      .filter(user => getCurrentMembership(user) === 'free')
      .map(user => getUserId(user));
    const challengeOverrides = Object.fromEntries(
      freeUserIds.map(userId => [userId, challengeLimit])
    );
    const submissionOverrides = Object.fromEntries(
      freeUserIds.map(userId => [userId, submissionLimit])
    );
    const tokenOverrides = Object.fromEntries(freeUserIds.map(userId => [userId, tokenLimit]));

    setActionError('');
    setChallengeLimitOverrides(prev => ({ ...prev, ...challengeOverrides }));
    setSubmissionLimitOverrides(prev => ({ ...prev, ...submissionOverrides }));
    setTokenLimitOverrides(prev => ({ ...prev, ...tokenOverrides }));
    setIsDailyLimitModalOpen(false);
  };

  return (
    <div className="w-full min-h-screen p-10 pb-40 text-white">
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="heading-1 font-700 text-[#FF4854]">사용자 관리</h1>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isFetching}
            className="h-11 px-5 rounded-lg bg-[#FF4854] hover:bg-[#ff3242] text-white font-bold flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer transition"
          >
            <RefreshCw size={18} className={isFetching ? 'animate-spin' : ''} />
            새로고침
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryCard label="전체" value={users.length} />
          <SummaryCard label="무료회원" value={freeCount} />
          <SummaryCard label="유료회원" value={paidCount} />
        </div>

        <div className="bg-[#0B021C]/70 border border-white/10 rounded-xl overflow-hidden shadow-lg">
          <div className="p-5 border-b border-white/10 flex flex-col gap-5">
            <div>
              <h2 className="heading-2 font-700 text-[#FF4854]">사용자 목록</h2>
              <p className="body-medium text-gray-400 mt-1">
                무료회원 토큰 한도와 회원 등급은 목업으로 화면에서만 변경됩니다.
              </p>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <label className="relative w-full lg:max-w-[360px]">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  value={keyword}
                  onChange={event => setKeyword(event.target.value)}
                  placeholder="사용자 검색"
                  className="w-full h-11 pl-10 pr-4 rounded-lg border border-white/10 bg-[#1A0B15] text-white outline-none focus:border-[#FF4854] placeholder:text-gray-500"
                />
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:ml-auto">
                <div className="flex h-11 rounded-lg border border-white/10 bg-[#1A0B15] p-1">
                  {[
                    { value: 'all', label: '전체' },
                    { value: 'free', label: '무료회원' },
                    { value: 'paid', label: '유료회원' },
                  ].map(filter => (
                    <button
                      key={filter.value}
                      type="button"
                      onClick={() => setMembershipFilter(filter.value)}
                      className={`rounded-md px-3 body-small font-700 whitespace-nowrap cursor-pointer transition ${
                        membershipFilter === filter.value
                          ? 'bg-[#FF4854] text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                {membershipFilter === 'free' && (
                  <button
                    type="button"
                    onClick={() => setIsDailyLimitModalOpen(true)}
                    className="h-11 px-4 rounded-lg bg-[#FF4854] text-white body-small font-700 whitespace-nowrap hover:bg-[#ff3242] cursor-pointer transition"
                  >
                    일일 제한량 설정
                  </button>
                )}
              </div>
            </div>
          </div>

          {actionError && (
            <div className="mx-5 mt-5 px-4 py-3 rounded-lg bg-[#2A0B15] text-red-300 border border-red-400/40">
              {actionError}
            </div>
          )}

          {isLoading && <StateMessage>사용자 정보를 불러오는 중...</StateMessage>}
          {isError && <StateMessage>사용자 정보를 불러오지 못했습니다.</StateMessage>}
          {!isLoading && !isError && filteredUsers.length === 0 && (
            <StateMessage>표시할 사용자가 없습니다.</StateMessage>
          )}

          {!isLoading && !isError && filteredUsers.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead className="text-[#FF4854] border-b border-white/10 bg-[#10050F]/50">
                  <tr>
                    <Th>닉네임</Th>
                    <Th>이메일</Th>
                    <Th>점수</Th>
                    <Th>해결 문제</Th>
                    <Th>가입일</Th>
                    <Th>회원 등급</Th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => {
                    const userId = getUserId(user);
                    const membership = getCurrentMembership(user);

                    return (
                      <tr
                        key={userId ?? getDisplayName(user)}
                        onClick={() => setSelectedUser(user)}
                        className="border-b border-white/10 hover:bg-[#1A0B15]/70 cursor-pointer transition"
                        title={`${getDisplayName(user)} 상세 보기`}
                      >
                        <Td>
                          <div className="font-700 text-white">{getDisplayName(user)}</div>
                          <div className="body-small leading-4 text-gray-400">
                            ID: {userId ?? '-'}
                          </div>
                        </Td>
                        <Td>{getEmail(user)}</Td>
                        <Td>{Number(getScore(user) || 0).toLocaleString()}</Td>
                        <Td>{getSolvedCount(user)}</Td>
                        <Td>{formatDate(getCreatedAt(user))}</Td>
                        <Td>
                          <span
                            className={`px-3 py-1 rounded-full body-small leading-4 font-700 border ${
                              membership === 'paid'
                                ? 'bg-[#FFB155]/15 text-[#FFD08A] border-[#FFB155]/30'
                                : 'bg-sky-500/15 text-sky-300 border-sky-400/30'
                            }`}
                          >
                            {membership === 'paid' ? '유료회원' : '무료회원'}
                          </span>
                        </Td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          membership={getCurrentMembership(selectedUser)}
          challengeLimit={getCurrentChallengeLimit(selectedUser)}
          submissionLimit={getCurrentSubmissionLimit(selectedUser)}
          tokenLimit={getCurrentTokenLimit(selectedUser)}
          challengeUsed={getChallengeUsed(selectedUser)}
          submissionUsed={getSubmissionUsed(selectedUser)}
          tokenUsed={getTokenUsed(selectedUser)}
          isActive={getCurrentIsActive(selectedUser)}
          challengeInput={challengeInputs[getUserId(selectedUser)]}
          submissionInput={submissionInputs[getUserId(selectedUser)]}
          tokenInput={tokenInputs[getUserId(selectedUser)]}
          isToggling={isToggling}
          isResettingPassword={isResettingPassword}
          onClose={() => setSelectedUser(null)}
          onChallengeInputChange={handleChallengeInputChange}
          onSubmissionInputChange={handleSubmissionInputChange}
          onTokenInputChange={handleTokenInputChange}
          onSaveUserLimits={handleSaveUserLimits}
          onUpgradeToPaid={handleUpgradeToPaid}
          onDowngradeToFree={handleDowngradeToFree}
          onToggleActive={handleToggleActive}
          onResetPassword={handleResetPassword}
        />
      )}

      {isDailyLimitModalOpen && (
        <FreeDailyLimitModal
          values={dailyLimitInputs}
          onChange={handleDailyLimitInputChange}
          onClose={() => setIsDailyLimitModalOpen(false)}
          onSave={handleSaveDailyLimit}
        />
      )}
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-xl bg-[#0B021C]/70 border border-white/10 p-5 shadow-lg">
      <div className="body-medium text-gray-400 mb-2">{label}</div>
      <div className="heading-2 font-700 text-[#FF4854]">{value}</div>
    </div>
  );
}

function StateMessage({ children }) {
  return <div className="p-10 text-center text-gray-400">{children}</div>;
}

function FreeDailyLimitModal({ values, onChange, onClose, onSave }) {
  const limitFields = [
    { key: 'challenge', label: '일일 도전 한도', suffix: '회' },
    { key: 'submission', label: '일일 제출 한도', suffix: '회' },
    { key: 'token', label: '일일 토큰 한도', suffix: '토큰' },
  ];

  return (
    <div
      className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/65 p-5"
      role="presentation"
      onMouseDown={event => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="daily-limit-title"
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#10050F] text-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <p className="body-small text-gray-400">무료회원 전체 설정</p>
            <h2 id="daily-limit-title" className="heading-2 font-700 text-[#FF4854] mt-1">
              일일 제한량 설정
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-10 w-10 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white flex items-center justify-center cursor-pointer transition"
            aria-label="일일 제한량 설정 닫기"
          >
            <X size={22} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {limitFields.map(field => (
            <label key={field.key} className="block">
              <span className="body-small text-gray-400">{field.label}</span>
              <div className="mt-2 flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={values[field.key]}
                  onChange={event => onChange(field.key, event.target.value)}
                  className="h-11 min-w-0 flex-1 rounded-lg border border-white/10 bg-[#1A0B15] px-4 text-white outline-none focus:border-[#FF4854]"
                />
                <span className="w-10 text-gray-400">{field.suffix}</span>
              </div>
            </label>
          ))}

          <p className="body-small text-gray-400 mt-3">
            저장하면 현재 무료회원 전체에 같은 일일 한도가 목업으로 적용됩니다.
          </p>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-11 px-4 rounded-lg bg-white/10 text-white font-bold hover:bg-white/15 cursor-pointer transition"
            >
              취소
            </button>
            <button
              type="button"
              onClick={onSave}
              className="h-11 px-4 rounded-lg bg-[#FF4854] text-white font-bold hover:bg-[#ff3242] flex items-center gap-2 cursor-pointer transition"
            >
              <Save size={17} /> 전체 적용
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function UserDetailModal({
  user,
  membership,
  challengeLimit,
  submissionLimit,
  tokenLimit,
  challengeUsed,
  submissionUsed,
  tokenUsed,
  isActive,
  challengeInput,
  submissionInput,
  tokenInput,
  isToggling,
  isResettingPassword,
  onClose,
  onChallengeInputChange,
  onSubmissionInputChange,
  onTokenInputChange,
  onSaveUserLimits,
  onUpgradeToPaid,
  onDowngradeToFree,
  onToggleActive,
  onResetPassword,
}) {
  const userId = getUserId(user);
  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/65 p-5"
      role="presentation"
      onMouseDown={event => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-detail-title"
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#10050F] text-white shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#10050F] px-6 py-5">
          <div>
            <p className="body-small text-gray-400">사용자 상세 · 목업 설정</p>
            <h2 id="user-detail-title" className="heading-2 font-700 text-[#FF4854] mt-1">
              {getDisplayName(user)}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-10 w-10 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white flex items-center justify-center cursor-pointer transition"
            aria-label="상세 닫기"
          >
            <X size={22} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-white/10 bg-[#0B021C]/70 p-5">
            <DetailItem label="닉네임" value={getDisplayName(user)} />
            <DetailItem label="이메일" value={getEmail(user)} />
            <DetailItem label="가입일" value={formatDate(getCreatedAt(user))} />
            <DetailItem label="해결 문제" value={`${getSolvedCount(user)}개`} />
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0B021C]/70 p-5">
            <h3 className="font-700 text-white">회원 등급</h3>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <span
                className={`px-3 py-1 rounded-full body-small font-700 border ${
                  membership === 'paid'
                    ? 'bg-[#FFB155]/15 text-[#FFD08A] border-[#FFB155]/30'
                    : 'bg-sky-500/15 text-sky-300 border-sky-400/30'
                }`}
              >
                {membership === 'paid' ? '유료회원' : '무료회원'}
              </span>
              {membership === 'free' ? (
                <button
                  type="button"
                  onClick={() => onUpgradeToPaid(user)}
                  disabled={!userId}
                  className="h-10 px-4 rounded-lg bg-[#FFB155] text-[#241206] font-bold hover:bg-[#ffc171] disabled:opacity-50 cursor-pointer transition"
                >
                  유료회원으로 전환
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onDowngradeToFree(user)}
                  disabled={!userId}
                  className="h-10 px-4 rounded-lg bg-sky-500 text-white font-bold hover:bg-sky-400 disabled:opacity-50 cursor-pointer transition"
                >
                  무료회원으로 전환
                </button>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0B021C]/70 p-5">
            <h3 className="font-700 text-white">무료회원 일일 한도</h3>
            {membership === 'free' ? (
              <div className="mt-3 space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <LimitUsageCard label="도전" used={challengeUsed} limit={challengeLimit} suffix="회" />
                  <LimitUsageCard label="제출" used={submissionUsed} limit={submissionLimit} suffix="회" />
                  <LimitUsageCard label="토큰" used={tokenUsed} limit={tokenLimit} suffix="토큰" />
                </div>

                <div className="border-t border-white/10 pt-4">
                  <div className="body-small font-700 text-gray-300">추가 지급</div>
                  <p className="body-small text-gray-500 mt-1">
                    입력한 수량만큼 현재 일일 한도에 더해집니다.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <LimitInput
                    label="도전 추가"
                    suffix="회"
                    value={challengeInput ?? '0'}
                    onChange={value => onChallengeInputChange(userId, value)}
                  />
                  <LimitInput
                    label="제출 추가"
                    suffix="회"
                    value={submissionInput ?? '0'}
                    onChange={value => onSubmissionInputChange(userId, value)}
                  />
                  <LimitInput
                    label="토큰 추가"
                    suffix="토큰"
                    value={tokenInput ?? '0'}
                    onChange={value => onTokenInputChange(userId, value)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => onSaveUserLimits(user)}
                  className="h-11 px-4 rounded-lg bg-[#FF4854] text-white font-bold hover:bg-[#ff3242] flex items-center gap-2 cursor-pointer transition"
                >
                  <Save size={17} /> 한도 추가
                </button>
              </div>
            ) : (
              <p className="mt-3 text-gray-400">유료회원은 무료회원 일일 한도가 적용되지 않습니다.</p>
            )}
          </div>

          <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-[#0B021C]/70 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-700 text-white">계정 활성화</h3>
              <p className="body-small text-gray-400 mt-1">현재 {isActive ? '활성' : '비활성'} 상태입니다.</p>
            </div>
            <ActiveToggle
              enabled={isActive}
              disabled={!userId || isToggling}
              onToggle={() => onToggleActive(user)}
            />
          </div>

          <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-[#0B021C]/70 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-700 text-white">비밀번호 초기화</h3>
              <p className="body-small text-gray-400 mt-1">사용자의 비밀번호를 초기화합니다.</p>
            </div>
            <button
              type="button"
              onClick={() => onResetPassword(user)}
              disabled={!userId || isResettingPassword}
              className="h-10 px-4 rounded-lg bg-white/10 text-white font-bold hover:bg-[#FF4854] disabled:opacity-50 cursor-pointer transition"
            >
              초기화
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function LimitUsageCard({ label, used, limit, suffix }) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#10050F]/70 p-3">
      <div className="body-small text-gray-400">{label}</div>
      <div className="mt-2 text-lg font-700 text-white">
        {Number(used || 0).toLocaleString()}
        <span className="mx-1 text-gray-500">/</span>
        {Number(limit || 0).toLocaleString()}
        <span className="ml-1 body-small text-gray-400">{suffix}</span>
      </div>
    </div>
  );
}

function LimitInput({ label, suffix, value, onChange }) {
  return (
    <label className="block">
      <span className="body-small text-gray-400">{label}</span>
      <div className="mt-2 flex items-center gap-2">
        <input
          type="number"
          min="0"
          step="1"
          value={value}
          onChange={event => onChange(event.target.value)}
          className="h-11 min-w-0 flex-1 rounded-lg border border-white/10 bg-[#1A0B15] px-3 text-white outline-none focus:border-[#FF4854]"
          aria-label={`${label} 한도`}
        />
        <span className="body-small text-gray-400">{suffix}</span>
      </div>
    </label>
  );
}

function DetailItem({ label, value }) {
  return (
    <div>
      <div className="body-small text-gray-400">{label}</div>
      <div className="mt-1 font-700 text-white break-all">{value}</div>
    </div>
  );
}

function ActiveToggle({ enabled, disabled, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className={`relative inline-flex h-8 w-14 items-center rounded-full border cursor-pointer transition ${
        enabled ? 'bg-[#FF4854] border-[#FF4854]' : 'bg-[#10050F] border-white/20'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
      aria-pressed={enabled}
    >
      <span
        className={`inline-block h-6 w-6 rounded-full bg-white shadow transition ${
          enabled ? 'translate-x-7' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

function Th({ children }) {
  return <th className="px-5 py-4 body-medium font-700 whitespace-nowrap">{children}</th>;
}

function Td({ children }) {
  return (
    <td className="px-5 py-4 body-medium text-gray-200 align-middle whitespace-nowrap">
      {children}
    </td>
  );
}
