import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw, Save, Search, X } from 'lucide-react';
import UserIcon from '@/assets/icons/user.svg';
import DashboardProfileSummaryCard from '@/components/Profile/DashboardProfileSummaryCard';
import { appToast } from '@/components/Toast/appToast';
import {
  useAdminFreeDailyLimits,
  useAdminTeamActions,
  useAdminTeams,
  useAdminUserUsage,
} from '@/hooks/useAdminTeams';

const PAGE_SIZE = 20;

const getUserId = user => user?.id ?? user?.user_id;
const getDisplayName = user => user?.nickname ?? user?.email ?? `User ${getUserId(user)}`;
const getMembership = user => (user?.membership === 'paid' ? 'paid' : 'free');
const getAccountStatus = user => user?.account_status ?? 'active';

const STATUS_LABELS = {
  active: '활성',
  suspended: '정지',
  withdrawn: '탈퇴',
};

const formatDate = value => {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '-' : date.toLocaleDateString('ko-KR');
};

function AdminUserAvatar({ user, size = 'sm' }) {
  const imageUrl = user?.profile_image_url;
  const sizeClass = size === 'sm' ? 'h-10 w-10' : 'h-14 w-14';
  const iconClass = size === 'sm' ? 'h-5 w-5' : 'h-7 w-7';

  return (
    <div
      className={`${sizeClass} flex shrink-0 items-center justify-center overflow-hidden rounded-full ${imageUrl ? 'bg-[#F2F4F6]' : 'bg-[#FF4854]'}`}
    >
      <img
        src={imageUrl || UserIcon}
        alt=""
        className={imageUrl ? 'h-full w-full object-cover' : iconClass}
        aria-hidden="true"
      />
    </div>
  );
}

const parseLimit = (value, label, max) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0 || parsed > max) {
    throw new Error(`${label}은(는) 0~${max.toLocaleString()} 사이의 정수로 입력해 주세요.`);
  }
  return parsed;
};

const parseQuota = (value, label) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0 || parsed > 1_000_000_000) {
    throw new Error(`${label}은(는) 0~1,000,000,000 사이의 정수로 입력해 주세요.`);
  }
  return parsed;
};

export default function AdminUserManagementPage() {
  const [keyword, setKeyword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [membershipFilter, setMembershipFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [offset, setOffset] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionError, setActionError] = useState('');
  const [quotaInputs, setQuotaInputs] = useState({ unlock: '0', submission: '0', token: '0' });
  const [isDailyLimitModalOpen, setIsDailyLimitModalOpen] = useState(false);
  const [dailyLimitInputs, setDailyLimitInputs] = useState({
    problem_unlocks: '0',
    submissions: '0',
    tokens: '0',
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearchQuery(keyword.trim());
      setOffset(0);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [keyword]);

  const filters = useMemo(
    () => ({
      query: searchQuery || undefined,
      membership: membershipFilter === 'all' ? undefined : membershipFilter,
      accountStatus: statusFilter === 'all' ? undefined : statusFilter,
      offset,
      limit: PAGE_SIZE,
    }),
    [membershipFilter, offset, searchQuery, statusFilter]
  );

  const { data, isLoading, isError, error, refetch, isFetching } = useAdminTeams(filters);
  const users = data?.items ?? [];
  const total = data?.total ?? 0;
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const freeOnPage = users.filter(user => getMembership(user) === 'free').length;
  const paidOnPage = users.filter(user => getMembership(user) === 'paid').length;

  const selectedUserId = getUserId(selectedUser);
  const usageQuery = useAdminUserUsage(selectedUserId);
  const freeLimitsQuery = useAdminFreeDailyLimits(isDailyLimitModalOpen);
  const actions = useAdminTeamActions();

  useEffect(() => {
    if (!freeLimitsQuery.data) return;
    setDailyLimitInputs({
      problem_unlocks: String(freeLimitsQuery.data.problem_unlocks),
      submissions: String(freeLimitsQuery.data.submissions),
      tokens: String(freeLimitsQuery.data.tokens),
    });
  }, [freeLimitsQuery.data]);

  const showError = (caughtError, fallback) => {
    const message = caughtError?.message || fallback;
    setActionError(message);
    appToast.error(message);
  };

  const handleMembershipChange = async membership => {
    if (!selectedUserId) return;
    const label = membership === 'paid' ? '유료회원' : '무료회원';
    if (!window.confirm(`${getDisplayName(selectedUser)} 사용자를 ${label}으로 전환할까요?`)) {
      return;
    }

    setActionError('');
    try {
      const updatedUser = await actions.changeMembership({ userId: selectedUserId, membership });
      setSelectedUser(current => ({ ...current, ...updatedUser }));
      appToast.success(`${label}으로 변경했습니다.`);
    } catch (caughtError) {
      showError(caughtError, '회원 등급 변경에 실패했습니다.');
    }
  };

  const handleStatusToggle = async () => {
    if (!selectedUserId || getAccountStatus(selectedUser) === 'withdrawn') return;
    const accountStatus = getAccountStatus(selectedUser) === 'active' ? 'suspended' : 'active';
    const label = STATUS_LABELS[accountStatus];
    if (!window.confirm(`${getDisplayName(selectedUser)} 계정을 ${label} 상태로 변경할까요?`)) {
      return;
    }

    setActionError('');
    try {
      const updatedUser = await actions.changeStatus({ userId: selectedUserId, accountStatus });
      setSelectedUser(current => ({ ...current, ...updatedUser }));
      appToast.success(`계정 상태를 ${label}(으)로 변경했습니다.`);
    } catch (caughtError) {
      showError(caughtError, '계정 상태 변경에 실패했습니다.');
    }
  };

  const handlePasswordResetEmail = async () => {
    if (!selectedUserId) return;
    if (!window.confirm(`${getDisplayName(selectedUser)} 사용자에게 재설정 메일을 보낼까요?`)) {
      return;
    }

    setActionError('');
    try {
      await actions.sendPasswordResetEmail(selectedUserId);
      appToast.success('비밀번호 재설정 메일을 발송했습니다.');
    } catch (caughtError) {
      showError(caughtError, '비밀번호 재설정 메일 발송에 실패했습니다.');
    }
  };

  const handleRevokeSessions = async () => {
    if (!selectedUserId) return;
    if (
      !window.confirm(`${getDisplayName(selectedUser)} 사용자의 모든 로그인 세션을 해제할까요?`)
    ) {
      return;
    }

    setActionError('');
    try {
      const result = await actions.revokeSessions({ userId: selectedUserId });
      appToast.success(`${result?.revoked_sessions ?? 0}개의 세션을 해제했습니다.`);
    } catch (caughtError) {
      showError(caughtError, '회원 세션 해제에 실패했습니다.');
    }
  };

  const handleAddQuota = async () => {
    if (!selectedUserId) return;

    let unlock;
    let submission;
    let token;
    try {
      unlock = parseQuota(quotaInputs.unlock, '챌린지 열람 추가량');
      submission = parseQuota(quotaInputs.submission, '제출 추가량');
      token = parseQuota(quotaInputs.token, '토큰 추가량');
    } catch (caughtError) {
      showError(caughtError, '추가 한도를 확인해 주세요.');
      return;
    }

    const adjustments = [
      ['problem_unlock', unlock],
      ['submission', submission],
      ['token', token],
    ].filter(([, amount]) => amount > 0);

    if (adjustments.length === 0) {
      showError(null, '하나 이상의 추가 지급량을 입력해 주세요.');
      return;
    }

    setActionError('');
    try {
      for (const [quotaType, amount] of adjustments) {
        await actions.addQuota({ userId: selectedUserId, quotaType, amount });
      }
      await usageQuery.refetch();
      setQuotaInputs({ unlock: '0', submission: '0', token: '0' });
      appToast.success('오늘 추가 한도를 지급했습니다.');
    } catch (caughtError) {
      showError(caughtError, '오늘 추가 한도 지급에 실패했습니다.');
    }
  };

  const handleSaveDailyLimits = async () => {
    let limits;
    try {
      limits = {
        problem_unlocks: parseLimit(dailyLimitInputs.problem_unlocks, '챌린지 열람 한도', 100_000),
        submissions: parseLimit(dailyLimitInputs.submissions, '제출 한도', 100_000),
        tokens: parseLimit(dailyLimitInputs.tokens, '토큰 한도', 10_000_000_000),
      };
    } catch (caughtError) {
      showError(caughtError, '무료회원 일일 한도를 확인해 주세요.');
      return;
    }

    setActionError('');
    try {
      await actions.saveFreeDailyLimits(limits);
      setIsDailyLimitModalOpen(false);
      appToast.success('무료회원 일일 한도 설정을 저장했습니다.');
    } catch (caughtError) {
      showError(caughtError, '무료회원 일일 한도 저장에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen w-full p-10 pb-40 text-white">
      <div className="flex w-full flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <h1 className="text-page-title font-strong text-[#FF4854]">사용자 관리</h1>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#FF4854] px-5 font-bold text-white transition hover:bg-[#ff3242] disabled:opacity-60"
          >
            <RefreshCw size={18} className={isFetching ? 'animate-spin' : ''} /> 새로고침
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <SummaryCard label="검색 결과" value={total} />
          <SummaryCard label="현재 페이지 무료회원" value={freeOnPage} />
          <SummaryCard label="현재 페이지 유료회원" value={paidOnPage} />
        </div>

        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0B021C]/70 shadow-lg">
          <div className="flex flex-col gap-5 border-b border-white/10 p-5">
            <div>
              <h2 className="text-section-title font-strong text-[#FF4854]">사용자 목록</h2>
              <p className="mt-1 text-body text-gray-400">
                회원 등급, 계정 상태, 오늘 사용량과 추가 한도를 관리합니다.
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
                  placeholder="이메일·닉네임 검색"
                  className="h-11 w-full rounded-lg border border-white/10 bg-[#1A0B15] pl-10 pr-4 text-white outline-none placeholder:text-gray-500 focus:border-[#FF4854]"
                />
              </label>

              <div className="flex flex-col gap-3 sm:flex-row lg:ml-auto">
                <FilterGroup
                  value={membershipFilter}
                  onChange={value => {
                    setMembershipFilter(value);
                    setOffset(0);
                  }}
                  options={[
                    ['all', '전체'],
                    ['free', '무료회원'],
                    ['paid', '유료회원'],
                  ]}
                />
                <FilterGroup
                  value={statusFilter}
                  onChange={value => {
                    setStatusFilter(value);
                    setOffset(0);
                  }}
                  options={[
                    ['all', '전체'],
                    ['active', '활성'],
                    ['suspended', '정지'],
                    ['withdrawn', '탈퇴'],
                  ]}
                />
                <button
                  type="button"
                  onClick={() => setIsDailyLimitModalOpen(true)}
                  className="h-11 cursor-pointer whitespace-nowrap rounded-lg bg-[#FF4854] px-4 text-label font-strong text-white transition hover:bg-[#ff3242]"
                >
                  무료회원 일일 한도
                </button>
              </div>
            </div>
          </div>

          {actionError && (
            <div className="mx-5 mt-5 rounded-lg border border-red-400/40 bg-[#2A0B15] px-4 py-3 text-red-300">
              {actionError}
            </div>
          )}
          {isLoading && <StateMessage>사용자 정보를 불러오는 중...</StateMessage>}
          {isError && (
            <StateMessage>{error?.message || '사용자 정보를 불러오지 못했습니다.'}</StateMessage>
          )}
          {!isLoading && !isError && users.length === 0 && (
            <StateMessage>표시할 사용자가 없습니다.</StateMessage>
          )}

          {!isLoading && !isError && users.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px] text-left">
                  <thead className="border-b border-white/10 bg-[#10050F]/50 text-[#FF4854]">
                    <tr>
                      <Th>닉네임</Th>
                      <Th>이메일</Th>
                      <Th>포인트</Th>
                      <Th>해결 챌린지</Th>
                      <Th>가입일</Th>
                      <Th>회원 등급</Th>
                      <Th>계정 상태</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr
                        key={getUserId(user)}
                        onClick={() => {
                          setSelectedUser(user);
                          setActionError('');
                          setQuotaInputs({ unlock: '0', submission: '0', token: '0' });
                        }}
                        className="cursor-pointer border-b border-white/10 transition hover:bg-[#1A0B15]/70"
                      >
                        <Td>
                          <div className="flex items-center gap-3">
                            <AdminUserAvatar user={user} />
                            <div className="min-w-0">
                              <div className="truncate font-strong text-white">
                                {getDisplayName(user)}
                              </div>
                              <div className="truncate text-label text-gray-500">
                                ID: {getUserId(user)}
                              </div>
                            </div>
                          </div>
                        </Td>
                        <Td>{user.email ?? '-'}</Td>
                        <Td>{Number(user.total_score ?? 0).toLocaleString()}</Td>
                        <Td>{Number(user.solved_count ?? 0).toLocaleString()}</Td>
                        <Td>{formatDate(user.created_at)}</Td>
                        <Td>
                          <MembershipBadge membership={getMembership(user)} />
                        </Td>
                        <Td>
                          <StatusBadge status={getAccountStatus(user)} />
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 px-5 py-4 text-body text-gray-300">
                <span>
                  {total.toLocaleString()}명 중 {offset + 1}–
                  {Math.min(offset + users.length, total)}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="이전 페이지"
                    disabled={offset === 0}
                    onClick={() => setOffset(value => Math.max(0, value - PAGE_SIZE))}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 transition hover:bg-white/15 disabled:opacity-30"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span>
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    type="button"
                    aria-label="다음 페이지"
                    disabled={offset + PAGE_SIZE >= total}
                    onClick={() => setOffset(value => value + PAGE_SIZE)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 transition hover:bg-white/15 disabled:opacity-30"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          usage={usageQuery.data}
          isUsageLoading={usageQuery.isLoading}
          usageError={usageQuery.error}
          quotaInputs={quotaInputs}
          onQuotaChange={(key, value) => setQuotaInputs(current => ({ ...current, [key]: value }))}
          onClose={() => setSelectedUser(null)}
          onMembershipChange={handleMembershipChange}
          onStatusToggle={handleStatusToggle}
          onAddQuota={handleAddQuota}
          onPasswordResetEmail={handlePasswordResetEmail}
          onRevokeSessions={handleRevokeSessions}
          actions={actions}
        />
      )}

      {isDailyLimitModalOpen && (
        <FreeDailyLimitModal
          values={dailyLimitInputs}
          onChange={(key, value) => setDailyLimitInputs(current => ({ ...current, [key]: value }))}
          onClose={() => setIsDailyLimitModalOpen(false)}
          onSave={handleSaveDailyLimits}
          isLoading={freeLimitsQuery.isLoading}
          error={freeLimitsQuery.error}
          isSaving={actions.isSavingFreeDailyLimits}
        />
      )}
    </div>
  );
}

function UserDetailModal({
  user,
  usage,
  isUsageLoading,
  usageError,
  quotaInputs,
  onQuotaChange,
  onClose,
  onMembershipChange,
  onStatusToggle,
  onAddQuota,
  onPasswordResetEmail,
  onRevokeSessions,
  actions,
}) {
  const membership = getMembership(user);
  const status = getAccountStatus(user);
  const profile = {
    ...user,
    teamname: getDisplayName(user),
    membershipType: membership,
    membershipLabel: membership === 'paid' ? '유료 회원' : '무료 회원',
    profileImage: user.profile_image_url || null,
    profileBackgroundImage: user.profile_background_url || null,
    profileMessage: user.profile_message ?? '',
    profileTextTheme: user.theme || 'black',
  };
  const summaryStats = [
    { label: '현재 순위', value: user.rank ? `${user.rank}위` : '-', subText: '전체 참가자 기준' },
    {
      label: '해결한 챌린지',
      value: `${user.solved_count ?? 0}개`,
      subText: '누적 해결 기준',
    },
    {
      label: '총 포인트',
      value: `${Number(user.total_score ?? 0).toLocaleString()}포인트`,
      subText: '누적 획득 포인트',
    },
    {
      label: '계정 상태',
      value: STATUS_LABELS[status] ?? status,
      subText: membership === 'paid' ? '유료 회원' : '무료 회원',
    },
  ];

  return (
    <ModalShell
      title={getDisplayName(user)}
      subtitle="사용자 상세"
      onClose={onClose}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6 p-6">
        <DashboardProfileSummaryCard profile={profile} summaryStats={summaryStats} />

        <div className="grid grid-cols-1 gap-4 rounded-xl border border-white/10 bg-[#0B021C]/70 p-5 sm:grid-cols-2">
          <DetailItem label="닉네임" value={getDisplayName(user)} />
          <DetailItem label="이메일" value={user.email ?? '-'} />
          <DetailItem label="가입일" value={formatDate(user.created_at)} />
          <DetailItem
            label="무료 한도 적용 시각"
            value={
              user.free_limits_apply_at
                ? new Date(user.free_limits_apply_at).toLocaleString('ko-KR')
                : '-'
            }
          />
        </div>

        <section className="rounded-xl border border-white/10 bg-[#0B021C]/70 p-5">
          <h3 className="font-strong text-white">회원 등급</h3>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <MembershipBadge membership={membership} />
            <button
              type="button"
              disabled={actions.isChangingMembership}
              onClick={() => onMembershipChange(membership === 'free' ? 'paid' : 'free')}
              className="h-10 rounded-lg bg-[#FF4854] px-4 font-bold text-white transition hover:bg-[#ff3242] disabled:opacity-50"
            >
              {membership === 'free' ? '유료회원으로 전환' : '무료회원으로 전환'}
            </button>
          </div>
        </section>

        <section className="rounded-xl border border-white/10 bg-[#0B021C]/70 p-5">
          <h3 className="font-strong text-white">오늘 사용량</h3>
          {isUsageLoading && <p className="mt-3 text-gray-400">오늘 사용량을 불러오는 중...</p>}
          {usageError && <p className="mt-3 text-red-300">{usageError.message}</p>}
          {usage && (
            <>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <UsageCard label="챌린지 열람" metric={usage.problem_unlocks} suffix="회" />
                <UsageCard label="제출" metric={usage.submissions} suffix="회" />
                <UsageCard label="토큰" metric={usage.tokens} suffix="토큰" />
              </div>
              {usage.unlimited ? (
                <p className="mt-4 text-label text-[#FFD08A]">
                  유료회원 무제한 사용이 적용 중입니다.
                </p>
              ) : (
                <>
                  <div className="mt-5 border-t border-white/10 pt-4">
                    <div className="font-strong text-gray-300">오늘 한도 추가 지급</div>
                    <p className="mt-1 text-label text-gray-500">
                      0보다 큰 항목만 추가 지급됩니다.
                    </p>
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <LimitInput
                      label="챌린지 열람 추가"
                      suffix="회"
                      value={quotaInputs.unlock}
                      onChange={value => onQuotaChange('unlock', value)}
                    />
                    <LimitInput
                      label="제출 추가"
                      suffix="회"
                      value={quotaInputs.submission}
                      onChange={value => onQuotaChange('submission', value)}
                    />
                    <LimitInput
                      label="토큰 추가"
                      suffix="토큰"
                      value={quotaInputs.token}
                      onChange={value => onQuotaChange('token', value)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={onAddQuota}
                    disabled={actions.isAddingQuota}
                    className="mt-4 flex h-11 items-center gap-2 rounded-lg bg-[#FF4854] px-4 font-bold text-white transition hover:bg-[#ff3242] disabled:opacity-50"
                  >
                    <Save size={17} /> 한도 추가
                  </button>
                </>
              )}
            </>
          )}
        </section>

        <section className="flex flex-col gap-4 rounded-xl border border-white/10 bg-[#0B021C]/70 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-strong text-white">계정 상태</h3>
            <p className="mt-1 text-label text-gray-400">
              현재 {STATUS_LABELS[status] ?? status} 상태입니다.
            </p>
          </div>
          {status === 'withdrawn' ? (
            <StatusBadge status={status} />
          ) : (
            <ActiveToggle
              enabled={status === 'active'}
              disabled={actions.isChangingStatus}
              onToggle={onStatusToggle}
            />
          )}
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ActionCard
            title="로그인 세션 전체 해제"
            description="이 사용자의 모든 로그인 세션을 만료시킵니다."
            buttonLabel="전체 해제"
            onClick={onRevokeSessions}
            disabled={actions.isRevokingSessions}
            danger
          />
          <ActionCard
            title="비밀번호 재설정"
            description="등록된 이메일로 비밀번호 재설정 링크를 보냅니다."
            buttonLabel="재설정 메일 발송"
            onClick={onPasswordResetEmail}
            disabled={actions.isSendingPasswordReset}
          />
        </section>
      </div>
    </ModalShell>
  );
}

function FreeDailyLimitModal({ values, onChange, onClose, onSave, isLoading, error, isSaving }) {
  return (
    <ModalShell
      title="일일 제한량 설정"
      subtitle="무료회원 전체 설정"
      onClose={onClose}
      maxWidth="max-w-md"
    >
      <div className="space-y-4 p-6">
        {isLoading && <p className="text-gray-400">설정값을 불러오는 중...</p>}
        {error && <p className="text-red-300">{error.message}</p>}
        {!isLoading && !error && (
          <>
            <LimitInput
              label="일일 챌린지 열람 한도"
              suffix="회"
              value={values.problem_unlocks}
              onChange={value => onChange('problem_unlocks', value)}
            />
            <LimitInput
              label="일일 제출 한도"
              suffix="회"
              value={values.submissions}
              onChange={value => onChange('submissions', value)}
            />
            <LimitInput
              label="일일 토큰 한도"
              suffix="토큰"
              value={values.tokens}
              onChange={value => onChange('tokens', value)}
            />
            <p className="text-label text-gray-400">
              변경된 무료회원 기본 한도는 다음 날부터 적용됩니다.
            </p>
          </>
        )}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-lg bg-white/10 px-4 font-bold text-white transition hover:bg-white/15"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={isLoading || Boolean(error) || isSaving}
            className="flex h-11 items-center gap-2 rounded-lg bg-[#FF4854] px-4 font-bold text-white transition hover:bg-[#ff3242] disabled:opacity-50"
          >
            <Save size={17} /> 저장
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

function ModalShell({ title, subtitle, onClose, maxWidth, children }) {
  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/65 p-5"
      onMouseDown={event => event.target === event.currentTarget && onClose()}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`max-h-[90vh] w-full ${maxWidth} overflow-y-auto rounded-2xl border border-white/10 bg-[#10050F] text-white shadow-2xl`}
      >
        <div className="sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-[#10050F] px-6 py-5 shadow-[0_8px_20px_rgba(0,0,0,0.18)]">
          <div>
            <p className="text-label text-gray-400">{subtitle}</p>
            <h2 className="mt-1 text-section-title font-strong text-[#FF4854]">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-300 transition hover:bg-white/10 hover:text-white"
            aria-label="닫기"
          >
            <X size={22} />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}

function FilterGroup({ value, onChange, options }) {
  return (
    <div className="flex h-11 rounded-lg border border-white/10 bg-[#1A0B15] p-1">
      {options.map(([option, label]) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`cursor-pointer whitespace-nowrap rounded-md px-3 text-label font-strong transition ${value === option ? 'bg-[#FF4854] text-white' : 'text-gray-400 hover:text-white'}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0B021C]/70 p-5 shadow-lg">
      <div className="mb-2 text-body text-gray-400">{label}</div>
      <div className="text-section-title font-strong text-[#FF4854]">
        {Number(value).toLocaleString()}
      </div>
    </div>
  );
}

function MembershipBadge({ membership }) {
  return (
    <span
      className={`rounded-full border px-3 py-1 text-label font-strong ${membership === 'paid' ? 'border-[#FFB155]/30 bg-[#FFB155]/15 text-[#FFD08A]' : 'border-sky-400/30 bg-sky-500/15 text-sky-300'}`}
    >
      {membership === 'paid' ? '유료회원' : '무료회원'}
    </span>
  );
}

function StatusBadge({ status }) {
  const style =
    status === 'active'
      ? 'border-emerald-400/30 bg-emerald-500/15 text-emerald-300'
      : status === 'suspended'
        ? 'border-amber-400/30 bg-amber-500/15 text-amber-300'
        : 'border-gray-400/30 bg-gray-500/15 text-gray-300';
  return (
    <span className={`rounded-full border px-3 py-1 text-label font-strong ${style}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

function UsageCard({ label, metric, suffix }) {
  const unlimited = metric?.unlimited;
  const limit =
    metric?.effective_limit ??
    Number(metric?.base_limit ?? 0) + Number(metric?.additional_limit ?? 0);
  return (
    <div className="rounded-lg border border-white/10 bg-[#10050F]/70 p-3">
      <div className="text-label text-gray-400">{label}</div>
      <div className="mt-2 text-card-title font-strong text-white">
        {Number(metric?.used ?? 0).toLocaleString()}
        <span className="mx-1 text-gray-500">/</span>
        {unlimited ? '무제한' : Number(limit).toLocaleString()}{' '}
        {!unlimited && <span className="text-label text-gray-400">{suffix}</span>}
      </div>
      {!unlimited && (
        <div className="mt-1 text-label text-gray-500">
          추가 {Number(metric?.additional_limit ?? 0).toLocaleString()} · 남음{' '}
          {Number(metric?.remaining ?? 0).toLocaleString()}
        </div>
      )}
    </div>
  );
}

function LimitInput({ label, suffix, value, onChange }) {
  return (
    <label className="block">
      <span className="text-label text-gray-400">{label}</span>
      <div className="mt-2 flex items-center gap-2">
        <input
          type="number"
          min="0"
          step="1"
          value={value}
          onChange={event => onChange(event.target.value)}
          className="h-11 min-w-0 flex-1 rounded-lg border border-white/10 bg-[#1A0B15] px-3 text-white outline-none focus:border-[#FF4854]"
        />
        <span className="text-label text-gray-400">{suffix}</span>
      </div>
    </label>
  );
}

function DetailItem({ label, value }) {
  return (
    <div>
      <div className="text-label text-gray-400">{label}</div>
      <div className="mt-1 break-all font-strong text-white">{value}</div>
    </div>
  );
}

function ActionCard({ title, description, buttonLabel, onClick, disabled, danger }) {
  return (
    <div
      className={`rounded-xl border p-5 ${danger ? 'border-red-400/30 bg-red-950/20' : 'border-white/10 bg-[#0B021C]/70'}`}
    >
      <h3 className="font-strong text-white">{title}</h3>
      <p className="mt-1 min-h-10 text-label text-gray-400">{description}</p>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`mt-4 h-10 rounded-lg px-4 font-bold text-white transition disabled:opacity-50 ${danger ? 'bg-red-600 hover:bg-red-500' : 'bg-white/10 hover:bg-[#FF4854]'}`}
      >
        {buttonLabel}
      </button>
    </div>
  );
}

function ActiveToggle({ enabled, disabled, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className={`relative inline-flex h-8 w-14 items-center rounded-full border transition ${enabled ? 'border-[#FF4854] bg-[#FF4854]' : 'border-white/20 bg-[#10050F]'} disabled:opacity-50`}
      aria-pressed={enabled}
    >
      <span
        className={`inline-block h-6 w-6 rounded-full bg-white shadow transition ${enabled ? 'translate-x-7' : 'translate-x-1'}`}
      />
    </button>
  );
}

function StateMessage({ children }) {
  return <div className="p-10 text-center text-gray-400">{children}</div>;
}
function Th({ children }) {
  return <th className="whitespace-nowrap px-5 py-4 text-body font-strong">{children}</th>;
}
function Td({ children }) {
  return (
    <td className="whitespace-nowrap px-5 py-4 align-middle text-body text-gray-200">{children}</td>
  );
}
