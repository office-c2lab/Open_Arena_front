import React, { useMemo, useState } from 'react';
import { RefreshCw, Search } from 'lucide-react';
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

  const activeCount = users.filter(getIsActive).length;
  const totalScore = users.reduce((sum, user) => sum + Number(getScore(user) || 0), 0);

  const handleRefresh = () => {
    refetch();
  };

  const handleToggleActive = async user => {
    const userId = getUserId(user);

    setActionError('');
    try {
      await toggleActive(userId);
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
          <SummaryCard label="전체 사용자" value={users.length} />
          <SummaryCard label="활성 사용자" value={activeCount} />
          <SummaryCard label="전체 점수" value={totalScore.toLocaleString()} />
        </div>

        <div className="bg-[#0B021C]/70 border border-white/10 rounded-xl overflow-hidden shadow-lg">
          <div className="p-5 border-b border-white/10 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="heading-2 font-700 text-[#FF4854]">사용자 목록</h2>
              <p className="body-medium text-gray-400 mt-1">
                팀별 활성 상태를 변경하고 비밀번호를 login_id 기준으로 초기화할 수 있습니다.
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
              <table className="w-full min-w-[920px] text-left">
                <thead className="text-[#FF4854] border-b border-white/10 bg-[#10050F]/50">
                  <tr>
                    <Th>사용자</Th>
                    <Th>로그인 ID</Th>
                    <Th>이메일</Th>
                    <Th>점수</Th>
                    <Th>해결 문제</Th>
                    <Th>가입일</Th>
                    <Th>상태</Th>
                    <Th>활성화</Th>
                    <Th>비밀번호</Th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => {
                    const userId = getUserId(user);
                    const isActive = getIsActive(user);

                    return (
                      <tr
                        key={userId ?? getDisplayName(user)}
                        className="border-b border-white/10 hover:bg-[#1A0B15]/70 transition"
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
                          <ActiveToggle
                            enabled={isActive}
                            disabled={!userId || isToggling}
                            onToggle={() => handleToggleActive(user)}
                          />
                        </Td>
                        <Td>
                          <button
                            type="button"
                            onClick={() => handleResetPassword(user)}
                            disabled={!userId || isResettingPassword}
                            className="h-9 px-4 rounded-lg bg-[#FF4854] text-white font-bold hover:bg-[#ff3242] disabled:opacity-50 cursor-pointer transition"
                            title="비밀번호 초기화"
                          >
                            초기화
                          </button>
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
