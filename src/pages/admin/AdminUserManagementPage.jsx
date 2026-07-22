import React, { useMemo, useState } from 'react';
import { RefreshCw, Save, Search, X } from 'lucide-react';
import { useAdminTeamActions, useAdminTeams } from '@/hooks/useAdminTeams';

const getUserId = user => user.id ?? user.user_id ?? user.team_id;
const getDisplayName = user =>
  user.teamname ?? user.username ?? user.login_id ?? `User ${getUserId(user)}`;
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
  const [activeOnly, setActiveOnly] = useState(false);
  const [membershipOverrides, setMembershipOverrides] = useState({});
  const [tokenLimitOverrides, setTokenLimitOverrides] = useState({});
  const [tokenInputs, setTokenInputs] = useState({});
  const [activeOverrides, setActiveOverrides] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const { data, isLoading, isError, refetch, isFetching } = useAdminTeams({ activeOnly });
  const { toggleActive, resetPassword, isToggling, isResettingPassword } = useAdminTeamActions();

  const users = useMemo(() => normalizeTeams(data), [data]);

  const filteredUsers = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    if (!normalizedKeyword) return users;

    return users.filter(user => {
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
  }, [keyword, users]);

  const getCurrentIsActive = user => activeOverrides[getUserId(user)] ?? getIsActive(user);
  const activeCount = users.filter(getCurrentIsActive).length;
  const totalScore = users.reduce((sum, user) => sum + Number(getScore(user) || 0), 0);
  const getCurrentMembership = user => membershipOverrides[getUserId(user)] ?? getMembership(user);
  const getCurrentTokenLimit = user => tokenLimitOverrides[getUserId(user)] ?? getTokenLimit(user);
  const freeCount = users.filter(user => getCurrentMembership(user) === 'free').length;

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
    const confirmed = window.confirm(`${getDisplayName(user)} 비밀번호를 login_id로 초기화할까요?`);
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

  const handleSaveTokenLimit = user => {
    const userId = getUserId(user);
    const rawValue = tokenInputs[userId] ?? String(getCurrentTokenLimit(user));
    const tokenLimit = Number(rawValue);

    if (!Number.isInteger(tokenLimit) || tokenLimit < 0) {
      setActionError('토큰 한도는 0 이상의 정수로 입력해 주세요.');
      return;
    }

    setActionError('');
    setTokenLimitOverrides(prev => ({ ...prev, [userId]: tokenLimit }));
    setTokenInputs(prev => ({ ...prev, [userId]: String(tokenLimit) }));
  };

  const handleUpgradeToPaid = user => {
    const userId = getUserId(user);
    const confirmed = window.confirm(
      `${getDisplayName(user)} 사용자를 유료회원으로 전환할까요? (목업에서는 화면에만 반영됩니다.)`
    );
    if (!confirmed) return;

    setMembershipOverrides(prev => ({ ...prev, [userId]: 'paid' }));
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

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <SummaryCard label="전체 사용자" value={users.length} />
          <SummaryCard label="활성 사용자" value={activeCount} />
          <SummaryCard label="무료회원" value={freeCount} />
          <SummaryCard label="전체 점수" value={totalScore.toLocaleString()} />
        </div>

        <div className="bg-[#0B021C]/70 border border-white/10 rounded-xl overflow-hidden shadow-lg">
          <div className="p-5 border-b border-white/10 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="heading-2 font-700 text-[#FF4854]">사용자 목록</h2>
              <p className="body-medium text-gray-400 mt-1">
                무료회원 토큰 한도와 회원 등급은 목업으로 화면에서만 변경됩니다.
              </p>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <label className="flex items-center gap-3 h-11 px-4 rounded-lg border border-white/10 bg-[#1A0B15] text-gray-200 cursor-pointer">
                <ActiveToggle
                  enabled={activeOnly}
                  disabled={isFetching}
                  onToggle={() => setActiveOnly(prev => !prev)}
                />
                <span className="body-medium font-700 whitespace-nowrap">활성 팀만 보기</span>
              </label>

              <label className="relative w-full md:w-[320px]">
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
                    <Th>사용자</Th>
                    <Th>로그인 ID</Th>
                    <Th>이메일</Th>
                    <Th>점수</Th>
                    <Th>해결 문제</Th>
                    <Th>가입일</Th>
                    <Th>상태</Th>
                    <Th>회원 등급</Th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => {
                    const userId = getUserId(user);
                    const isActive = getCurrentIsActive(user);
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
                        <Td>{getLoginId(user)}</Td>
                        <Td>{getEmail(user)}</Td>
                        <Td>{Number(getScore(user) || 0).toLocaleString()}</Td>
                        <Td>{getSolvedCount(user)}</Td>
                        <Td>{formatDate(getCreatedAt(user))}</Td>
                        <Td>
                          <span
                            className={`px-3 py-1 rounded-full body-small leading-4 font-700 ${
                              isActive
                                ? 'bg-green-500/15 text-green-300 border border-green-400/30'
                                : 'bg-gray-500/15 text-gray-300 border border-gray-400/30'
                            }`}
                          >
                            {isActive ? '활성' : '비활성'}
                          </span>
                        </Td>
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
          tokenLimit={getCurrentTokenLimit(selectedUser)}
          isActive={getCurrentIsActive(selectedUser)}
          tokenInput={tokenInputs[getUserId(selectedUser)]}
          isToggling={isToggling}
          isResettingPassword={isResettingPassword}
          onClose={() => setSelectedUser(null)}
          onTokenInputChange={handleTokenInputChange}
          onSaveTokenLimit={handleSaveTokenLimit}
          onUpgradeToPaid={handleUpgradeToPaid}
          onToggleActive={handleToggleActive}
          onResetPassword={handleResetPassword}
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

function UserDetailModal({
  user,
  membership,
  tokenLimit,
  isActive,
  tokenInput,
  isToggling,
  isResettingPassword,
  onClose,
  onTokenInputChange,
  onSaveTokenLimit,
  onUpgradeToPaid,
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
            <DetailItem label="로그인 ID" value={getLoginId(user)} />
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
                <span className="body-small text-[#FFD08A]">유료회원으로 전환되었습니다.</span>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0B021C]/70 p-5">
            <h3 className="font-700 text-white">무료 토큰 한도</h3>
            {membership === 'free' ? (
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={tokenInput ?? String(tokenLimit)}
                  onChange={event => onTokenInputChange(userId, event.target.value)}
                  className="h-11 w-40 rounded-lg border border-white/10 bg-[#1A0B15] px-4 text-white outline-none focus:border-[#FF4854]"
                  aria-label="무료 토큰 한도"
                />
                <span className="text-gray-400">토큰</span>
                <button
                  type="button"
                  onClick={() => onSaveTokenLimit(user)}
                  className="h-11 px-4 rounded-lg bg-[#FF4854] text-white font-bold hover:bg-[#ff3242] flex items-center gap-2 cursor-pointer transition"
                >
                  <Save size={17} /> 저장
                </button>
              </div>
            ) : (
              <p className="mt-3 text-gray-400">유료회원은 토큰 한도가 적용되지 않습니다.</p>
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
              <p className="body-small text-gray-400 mt-1">login_id 기준으로 비밀번호를 초기화합니다.</p>
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
