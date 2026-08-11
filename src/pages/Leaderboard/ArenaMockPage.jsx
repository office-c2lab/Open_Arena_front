import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RotateCcw,
  Search,
} from 'lucide-react';
import medalBronze from '@/assets/icons/medal_bronze.svg';
import medalGold from '@/assets/icons/medal_gold.svg';
import medalSilver from '@/assets/icons/medal_silver.svg';
import UserIcon from '@/assets/icons/user.svg';
import { useLeaderboardQuery, useLeaderboardSearchQuery } from '@/hooks/useLeaderboardQuery';
import { useAuthStore } from '@/stores/authStore';

const MEDAL_ICON_MAP = { 1: medalGold, 2: medalSilver, 3: medalBronze };
const ROWS_PER_PAGE = 30;

const formatNumber = value => Number(value ?? 0).toLocaleString('ko-KR');

const formatSolvedAt = value => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('ko-KR', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const presentLeaderboardEntry = entry => ({
  userId: entry.user_id,
  rank: entry.rank,
  name: entry.nickname,
  profileImage: entry.profile_image_url,
  score: entry.total_score,
  challenges: entry.solved_count,
  tokens: entry.minimum_success_prompt_tokens,
  lastSolvedAt: entry.last_solved_at,
});

function Avatar({ size = 'md', src }) {
  const sizeClass = {
    md: 'h-12 w-12',
    lg: 'h-[112px] w-[112px]',
  }[size];

  return (
    <div
      className={`${sizeClass} flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#FF4854] shadow-[0_8px_20px_rgba(255,72,84,0.22)]`}
    >
      <img
        src={src || UserIcon}
        alt=""
        className={src ? 'h-full w-full object-cover' : size === 'lg' ? 'h-14 w-14' : 'h-7 w-7'}
        aria-hidden="true"
      />
    </div>
  );
}

function RankMedal({ rank }) {
  return (
    <img
      src={MEDAL_ICON_MAP[rank]}
      alt={`${rank}위`}
      className="absolute left-6 top-5 z-10 h-[52px] w-[52px] drop-shadow-[0_8px_16px_rgba(15,23,42,0.14)]"
    />
  );
}

function StatPair({ value, label }) {
  return (
    <div className="min-w-0 text-center">
      <span className="block truncate text-body font-strong text-[#525B66]">{label}</span>
      <strong className="mt-2 block truncate text-section-title font-bold text-[#1F2937]">
        {value}
      </strong>
    </div>
  );
}

function TopRankCard({ row, isCurrentUser, onOpenProfile }) {
  const toneClass =
    row.rank === 1
      ? 'border-[#FFB51F]/55 bg-[radial-gradient(circle_at_50%_0%,rgba(255,199,43,0.36)_0%,rgba(255,237,176,0.30)_42%,rgba(255,255,255,0.68)_82%)] shadow-[0_18px_38px_rgba(255,181,31,0.18)]'
      : row.rank === 2
        ? 'border-[#C9CED6]/70 bg-[radial-gradient(circle_at_50%_0%,rgba(174,183,192,0.28)_0%,rgba(255,255,255,0.62)_72%)] shadow-[0_14px_30px_rgba(100,116,139,0.12)]'
        : 'border-[#D08A52]/50 bg-[radial-gradient(circle_at_50%_0%,rgba(208,138,82,0.24)_0%,rgba(255,248,243,0.72)_62%,rgba(255,255,255,0.62)_100%)] shadow-[0_14px_30px_rgba(173,103,40,0.12)]';

  return (
    <button
      type="button"
      onClick={() => onOpenProfile(row)}
      className={`relative flex min-h-[320px] w-full cursor-pointer flex-col items-center overflow-hidden rounded-[30px] border px-8 pb-8 pt-10 text-left backdrop-blur-xl transition duration-200 hover:-translate-y-1 hover:shadow-[0_22px_46px_rgba(15,23,42,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4854]/40 md:h-[400px] ${toneClass}`}
    >
      <RankMedal rank={row.rank} />
      <Avatar size="lg" src={row.profileImage} />
      <div className="mt-6 flex max-w-full items-center justify-center gap-2">
        <h2 className="truncate text-center text-card-title font-bold text-[#111827]">
          {row.name}
        </h2>
        {isCurrentUser ? (
          <span className="shrink-0 rounded-full bg-[#F52F45] px-2 py-0.5 text-caption font-bold text-white">
            나
          </span>
        ) : null}
      </div>
      <p className="mt-1 text-page-title font-bold text-[#F52F45]">{formatNumber(row.score)}점</p>
      <div className="mt-5 h-px w-full bg-white/70" />
      <div className="mt-4 grid w-full grid-cols-2 divide-x divide-[#D7DDE6]">
        <StatPair value={`${formatNumber(row.challenges)}개`} label="성공 챌린지" />
        <StatPair value={formatNumber(row.tokens)} label="최소 성공 토큰" />
      </div>
    </button>
  );
}

function TableAvatar({ src }) {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#FF4854] shadow-[0_3px_10px_rgba(255,72,84,0.18)]">
      <img
        src={src || UserIcon}
        alt=""
        className={src ? 'h-full w-full object-cover' : 'h-5 w-5'}
        aria-hidden="true"
      />
    </div>
  );
}

function LeaderboardRow({ row, isCurrentUser, onOpenProfile }) {
  return (
    <tr
      className={`h-[58px] text-body font-strong text-[#344050] ${isCurrentUser ? 'bg-[#FFF7F8]' : ''}`}
    >
      <td className="w-[88px] font-bold">
        <div className="flex w-[40px] items-center justify-center">
          {row.rank <= 3 ? (
            <img src={MEDAL_ICON_MAP[row.rank]} alt={`${row.rank}위`} className="h-8 w-8" />
          ) : (
            <span>{row.rank}위</span>
          )}
        </div>
      </td>
      <td className="min-w-[230px]">
        <button
          type="button"
          onClick={() => onOpenProfile(row)}
          className="group flex cursor-pointer items-center gap-4 rounded-[8px] pr-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4854]/35"
        >
          <TableAvatar src={row.profileImage} />
          <span className="font-strong transition group-hover:text-[#FF4854]">{row.name}</span>
          {isCurrentUser ? (
            <span className="rounded-full bg-[#F52F45] px-2 py-0.5 text-caption font-bold text-white">
              나
            </span>
          ) : null}
        </button>
      </td>
      <td className="w-[160px] font-bold text-[#F52F45]">{formatNumber(row.score)}</td>
      <td className="w-[150px] text-center">{formatNumber(row.challenges)}</td>
      <td className="w-[170px] text-center">{formatNumber(row.tokens)}</td>
      <td className="w-[180px] text-center text-[#66717E]">{formatSolvedAt(row.lastSolvedAt)}</td>
    </tr>
  );
}

function LeaderboardState({ children, error = false }) {
  return (
    <div
      className={`flex min-h-[180px] items-center justify-center rounded-[12px] border px-6 text-center text-body-lg font-strong ${
        error
          ? 'border-[#FFD3D7] bg-[#FFF8F8] text-[#D93643]'
          : 'border-[#E3E8EF] bg-[#FAFBFC] text-[#66717E]'
      }`}
    >
      {children}
    </div>
  );
}

export default function Leaderboard() {
  const navigate = useNavigate();
  const currentUser = useAuthStore(state => state.teamInfo);
  const [searchInput, setSearchInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const isSearchMode = Boolean(keyword);
  const offset = (currentPage - 1) * ROWS_PER_PAGE;
  const topRanksQuery = useLeaderboardQuery({ offset: 0, limit: 3 });
  const pageQuery = useLeaderboardQuery({
    offset,
    limit: ROWS_PER_PAGE,
    enabled: !isSearchMode,
  });
  const searchQuery = useLeaderboardSearchQuery(keyword);
  const activeQuery = isSearchMode ? searchQuery : pageQuery;
  const searchedItems = searchQuery.data?.items ?? [];
  const rawRows = isSearchMode
    ? searchedItems.slice(offset, offset + ROWS_PER_PAGE)
    : (pageQuery.data?.items ?? []);
  const rows = rawRows.map(presentLeaderboardEntry);
  const topRows = (topRanksQuery.data?.items ?? []).map(presentLeaderboardEntry);
  const total = isSearchMode ? searchedItems.length : (pageQuery.data?.total ?? 0);
  const totalPages = Math.max(1, Math.ceil(total / ROWS_PER_PAGE));
  const currentUserRank =
    topRanksQuery.data?.current_user_rank ?? activeQuery.data?.current_user_rank ?? null;

  const visiblePages = useMemo(() => {
    const visibleCount = Math.min(5, totalPages);
    const start = Math.min(
      Math.max(1, currentPage - Math.floor(visibleCount / 2)),
      totalPages - visibleCount + 1
    );
    return Array.from({ length: visibleCount }, (_, index) => start + index);
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const handleSearch = event => {
    event.preventDefault();
    setKeyword(searchInput.trim());
    setCurrentPage(1);
  };

  const handleResetSearch = () => {
    setSearchInput('');
    setKeyword('');
    setCurrentPage(1);
  };

  const goToPage = page => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

  const handleOpenProfile = row => {
    if (!row.userId) return;

    const currentUserId = currentUser?.id ?? currentUser?.user_id;
    navigate(
      currentUserId && row.userId === currentUserId ? '/dashboard' : `/profile/${row.userId}`
    );
  };

  return (
    <div className="relative left-1/2 min-h-screen w-screen -translate-x-1/2 bg-white pb-10 pt-12">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-10">
        <header className="mb-16 text-center">
          <h1 className="text-display font-bold text-[#111827]">전체 랭킹</h1>
          <p className="mt-4 text-body-lg font-strong text-[#4B5563]">
            ARENA 최고의 도전자들을 확인해 보세요.
          </p>
          {!topRanksQuery.isLoading ? (
            <p className="mt-5 text-body-lg font-bold text-[#66717E]">
              {currentUserRank ? (
                <>
                  내 현재 순위 <em className="not-italic text-[#F52F45]">{currentUserRank}위</em>
                </>
              ) : (
                '아직 순위에 등록되지 않았습니다.'
              )}
            </p>
          ) : null}
        </header>

        {topRanksQuery.isLoading ? (
          <div className="grid gap-5 md:grid-cols-3">
            {[0, 1, 2].map(index => (
              <div key={index} className="h-[400px] animate-pulse rounded-[30px] bg-[#F1F3F5]" />
            ))}
          </div>
        ) : topRanksQuery.error ? (
          <LeaderboardState error>{topRanksQuery.error.message}</LeaderboardState>
        ) : topRows.length ? (
          <section className="grid items-end gap-5 md:grid-cols-3">
            {topRows.map(row => (
              <TopRankCard
                key={row.userId || row.rank}
                row={row}
                isCurrentUser={row.rank === currentUserRank}
                onOpenProfile={handleOpenProfile}
              />
            ))}
          </section>
        ) : (
          <LeaderboardState>아직 등록된 순위가 없습니다.</LeaderboardState>
        )}

        <section className="mt-20 flex flex-col">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-end gap-8">
              <span className="border-b-[3px] border-[#F52F45] pb-5 text-card-title font-bold">
                전체 랭킹 · {total.toLocaleString()}명
              </span>
            </div>

            <form onSubmit={handleSearch} className="flex w-full gap-3 sm:w-[min(100%,500px)]">
              <label className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A4ADB8]" />
                <input
                  type="search"
                  value={searchInput}
                  onChange={event => setSearchInput(event.target.value)}
                  placeholder="유저 닉네임을 검색해 보세요."
                  className="h-11 w-full rounded-[12px] border border-[#D8DDE4] bg-white pl-11 pr-4 text-body outline-none transition focus:border-[#FF4854]"
                />
              </label>
              <button type="submit" className="btn btn-primary btn-lg">
                검색
              </button>
              <button
                type="button"
                aria-label="검색 초기화"
                onClick={handleResetSearch}
                className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-[12px] border border-[#FF4854] bg-[#FF4854] text-white shadow-[0_6px_14px_rgba(255,72,84,0.12)] transition hover:-translate-y-0.5 hover:border-[#E73541] hover:bg-[#E73541] hover:shadow-[0_8px_18px_rgba(255,72,84,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4854]/30"
              >
                <RotateCcw className="h-5 w-5" strokeWidth={2.5} />
              </button>
            </form>
          </div>

          {activeQuery.isLoading ? (
            <div className="mt-10 h-[420px] animate-pulse rounded-[12px] bg-[#F1F3F5]" />
          ) : activeQuery.error ? (
            <div className="mt-10">
              <LeaderboardState error>{activeQuery.error.message}</LeaderboardState>
            </div>
          ) : rows.length ? (
            <div className="mt-10 overflow-x-auto">
              <table className="w-full min-w-[1080px] border-separate border-spacing-y-[14px] text-left">
                <thead>
                  <tr className="text-body font-bold text-[#99A5B8]">
                    <th className="w-[88px]">
                      <span className="flex w-[40px] justify-center">순위</span>
                    </th>
                    <th>유저 정보</th>
                    <th className="w-[160px]">점수</th>
                    <th className="w-[150px] text-center">성공 챌린지</th>
                    <th className="w-[170px] text-center">최소 성공 토큰</th>
                    <th className="w-[180px] text-center">최근 성공</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(row => (
                    <LeaderboardRow
                      key={row.userId || `${row.rank}-${row.name}`}
                      row={row}
                      isCurrentUser={row.rank === currentUserRank}
                      onOpenProfile={handleOpenProfile}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-10">
              <LeaderboardState>
                {isSearchMode ? '검색 결과가 없습니다.' : '아직 등록된 순위가 없습니다.'}
              </LeaderboardState>
            </div>
          )}

          {!activeQuery.isLoading && !activeQuery.error && total > 0 ? (
            <nav className="mt-6 flex items-center justify-center gap-2 text-body-lg font-strong text-[#111827]">
              <button
                type="button"
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#E2E5EA] text-[#9AA3AF] hover:border-[#F52F45] hover:text-[#F52F45] disabled:cursor-not-allowed disabled:opacity-45"
              >
                <ChevronsLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#E2E5EA] text-[#9AA3AF] hover:border-[#F52F45] hover:text-[#F52F45] disabled:cursor-not-allowed disabled:opacity-45"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              {visiblePages.map(page => (
                <button
                  key={page}
                  type="button"
                  onClick={() => goToPage(page)}
                  className={`h-10 min-w-10 cursor-pointer rounded-full px-3 transition-colors ${
                    page === currentPage
                      ? 'bg-[#F52F45] text-white shadow-[0_6px_14px_rgba(245,47,69,0.28)]'
                      : 'text-[#111827] hover:bg-[#FFF0F2] hover:text-[#F52F45]'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#E2E5EA] text-[#9AA3AF] hover:border-[#F52F45] hover:text-[#F52F45] disabled:cursor-not-allowed disabled:opacity-45"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#E2E5EA] text-[#9AA3AF] hover:border-[#F52F45] hover:text-[#F52F45] disabled:cursor-not-allowed disabled:opacity-45"
              >
                <ChevronsRight className="h-5 w-5" />
              </button>
            </nav>
          ) : null}
        </section>
      </div>
    </div>
  );
}
