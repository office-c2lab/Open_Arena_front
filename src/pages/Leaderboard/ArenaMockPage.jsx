import React, { useEffect, useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RotateCcw,
  Search,
  ShieldCheck,
} from 'lucide-react';
import medalBronze from '@/assets/icons/medal_bronze.svg';
import medalGold from '@/assets/icons/medal_gold.svg';
import medalSilver from '@/assets/icons/medal_silver.svg';
import UserIcon from '@/assets/icons/user.svg';
import DragonImage from '@/assets/images/dragon.png';
import GreenDragonImage from '@/assets/images/green_dragon.png';
import GreenPhoenixImage from '@/assets/images/green_phoenix.png';
import GreenTigerImage from '@/assets/images/green_tiger.png';
import MyRankImage from '@/assets/images/myrank.png';
import PhoenixImage from '@/assets/images/phoenix.png';
import RankBgImage from '@/assets/images/rankbg.png';
import TigerImage from '@/assets/images/tiger.png';

const legacyRows = [
  ['zatsu', 2321, 20, '100'],
  ['GORiyA', 2300, 39, '200'],
  ['4ncientH', 2288, 10, '200'],
  ['posix', 2244, 11, ''],
  ['zzzzzzzz', 2243, 7, ''],
  ['비포맷', 2238, 19, '200'],
  ['Tara', 2237, 7, '150'],
  ['Rootsquare', 2225, 15, '200'],
  ['EDcBA', 2183, 6, '200'],
  ['BlackCat', 2124, 46, ''],
  ['zetacode', 2070, 13, '200'],
  ['c0met', 2066, 25, '200'],
  ['keymoon', 2047, 27, '100'],
  ['KLPP', 2045, 3, '160'],
  ['Axii', 2031, 6, ''],
  ['metamong', 2014, 11, ''],
  ['ReverserInThirties', 2011, 16, '200'],
  ['Unbbal', 2010, 31, '200'],
  ['당근마켓', 1993, 8, '200'],
  ['physicube', 1971, 32, ''],
  ['kq5y', 1970, 12, '100'],
  ['ONE', 1969, 16, '100'],
  ['roaris', 1968, 4, '100'],
  ['AngGimotti', 1968, 2, '200'],
  ['camo132108', 1957, 3, ''],
  ['kam1tsur3', 1939, 8, '100'],
  ['Giappppp', 1917, 14, '50'],
  ['탐오가', 1916, 15, ''],
  ['leehjune', 1914, 8, '200'],
  ['석정원_', 1912, 16, ''],
  ['PieCer', 1897, 28, '200'],
  ['Sechack', 1896, 31, '200'],
  ['vanitas1209', 1895, 4, ''],
  ['G1nM0o', 1890, 14, '200'],
  ['zarfix', 1888, 7, '70'],
  ['BYTE256', 1883, 6, ''],
  ['shpark1104', 1873, 22, '200'],
  ['yuseong', 1872, 17, ''],
  ['DDING', 1867, 11, ''],
  ['n0ha', 1866, 32, ''],
  ['Yu_212', 1847, 29, '100'],
  ['mobydick', 1834, 3, '200'],
  ['lyed', 1832, 8, '140'],
  ['kakur41', 1829, 14, ''],
  ['m0nd2y', 1827, 25, '200'],
  ['jirabbit', 1826, 4, '200'],
  ['wy', 1823, 28, '200'],
  ['gkljasoickl', 1816, 2, '200'],
  ['minnnjuuu', 1815, 23, '200'],
  ['lydxn', 1806, 3, '90'],
];

const avatarImages = [
  TigerImage,
  GreenTigerImage,
  PhoenixImage,
  DragonImage,
  GreenDragonImage,
  GreenPhoenixImage,
];

const leaderboardRows = legacyRows.map(([name, score, challenges, tokens], index) => ({
  rank: index + 1,
  change: 0,
  name,
  score,
  challenges,
  tokens,
  image: avatarImages[index % avatarImages.length],
}));

const topRanks = [
  { ...leaderboardRows[1], tone: 'silver' },
  { ...leaderboardRows[0], tone: 'gold' },
  { ...leaderboardRows[2], tone: 'bronze' },
];

const MEDAL_ICON_MAP = { 1: medalGold, 2: medalSilver, 3: medalBronze };

const summaryItems = [
  { label: '시즌 점수', value: '2,480점' },
  { label: '성공 챌린지', value: '18개' },
  { label: '최소 토큰', value: '14,200' },
  { label: '다음 순위까지', value: '120포인트' },
];

const ROWS_PER_PAGE = 30;

const legacyAvatarColors = [
  'bg-[#FFF2D8]',
  'bg-[#FFE8EF]',
  'bg-[#EAF8F0]',
  'bg-[#F1EDFF]',
  'bg-[#FFF0F2]',
  'bg-[#F2F4F6]',
];

function formatNumber(value) {
  if (value === '' || value == null) return '-';
  return Number(value).toLocaleString('ko-KR');
}

function formatToken(value) {
  if (value === '' || value == null) return '';
  return Number(value).toLocaleString('ko-KR');
}

function Avatar({ image, rank, size = 'md', className = '' }) {
  const sizeClass = {
    sm: 'h-9 w-9',
    md: 'h-12 w-12',
    lg: 'h-[112px] w-[112px]',
  }[size];

  return (
    <div
      className={`${sizeClass} flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/70 bg-white/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_8px_20px_rgba(15,23,42,0.10)] backdrop-blur-md ${className}`}
    >
      <img
        src={image || UserIcon}
        alt=""
        className={`${image ? 'h-full w-full object-cover' : 'h-6 w-6 opacity-45 grayscale'} ${rank === 1 ? 'scale-110' : ''}`}
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
      <span className="block truncate text-[15px] font-700 text-[#525B66]">{label}</span>
      <strong className="mt-2 block truncate text-[24px] font-900 leading-7 text-[#111827]">
        {value}
      </strong>
    </div>
  );
}

function MyRankCard() {
  return (
    <section className="mt-12 overflow-hidden rounded-[24px] border border-[#FFD0D4] bg-[radial-gradient(circle_at_11%_58%,rgba(255,72,84,0.12)_0%,rgba(255,72,84,0.055)_18%,transparent_33%),linear-gradient(105deg,#FFFFFF_0%,#FFFEFE_58%,#FFF7F8_100%)] px-8 py-5 shadow-[0_12px_24px_rgba(15,23,42,0.07)] sm:px-10">
      <div className="grid items-center gap-7 lg:grid-cols-[0.9fr_1.75fr]">
        <div className="min-w-0">
          <div className="flex items-center gap-5">
            <img
              src={MyRankImage}
              alt=""
              className="h-[88px] w-[88px] shrink-0 object-contain drop-shadow-[0_8px_18px_rgba(255,72,84,0.16)]"
            />
            <div className="min-w-0">
              <span className="block text-[15px] font-900 text-[#FF4854]">내 순위</span>
              <div className="flex items-end gap-3 whitespace-nowrap">
                <strong className="text-[64px] font-900 leading-[0.86] text-[#111827]">12</strong>
                <span className="pb-1 text-[24px] font-800 text-[#111827]">위</span>
              </div>
              <div className="mt-2 flex items-center gap-4 whitespace-nowrap text-[14px] font-800 text-[#96A0AE]">
                <span>/ 12,856명</span>
                <span className="h-4 w-px bg-[#CBD1DA]" />
                <span className="text-[#FF4854]">상위 0.1%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid min-h-[96px] items-center sm:grid-cols-4">
          {summaryItems.map(item => (
            <div
              key={item.label}
              className="min-w-0 py-2 sm:border-l sm:border-[#E7EAF0] sm:px-7 sm:first:border-l-0 sm:first:pl-0 sm:last:pr-0"
            >
              <div className="whitespace-nowrap text-[14px] font-800 text-[#8B95A3]">
                {item.label}
              </div>
              <strong
                className={`mt-4 block whitespace-nowrap font-900 leading-none text-[#111827] ${
                  item.label === '다음 순위까지' ? 'text-[26px] text-[#FF4854]' : 'text-[30px]'
                }`}
              >
                {item.value}
              </strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TopRankCard({ row }) {
  const isFirst = row.rank === 1;
  const isThird = row.rank === 3;
  const toneClass = isFirst
    ? 'border-[#FFB51F]/55 bg-[radial-gradient(circle_at_50%_0%,rgba(255,199,43,0.36)_0%,rgba(255,237,176,0.30)_42%,rgba(255,255,255,0.68)_82%)] shadow-[0_18px_38px_rgba(255,181,31,0.18)]'
    : row.rank === 2
      ? 'border-[#C9CED6]/70 bg-[radial-gradient(circle_at_50%_0%,rgba(174,183,192,0.28)_0%,rgba(255,255,255,0.62)_72%)] shadow-[0_14px_30px_rgba(100,116,139,0.12)]'
      : 'border-[#D08A52]/50 bg-[radial-gradient(circle_at_50%_0%,rgba(208,138,82,0.24)_0%,rgba(255,248,243,0.72)_62%,rgba(255,255,255,0.62)_100%)] shadow-[0_14px_30px_rgba(173,103,40,0.12)]';
  const heightClass = isFirst
    ? 'md:-mt-10 md:h-[440px]'
    : isThird
      ? 'md:h-[350px]'
      : 'md:h-[380px]';
  const paddingClass = isThird ? 'px-8 pb-5 pt-10' : 'px-8 pb-7 pt-12';
  const avatarClass = isFirst ? 'mt-4' : isThird ? 'mt-1 md:h-[104px] md:w-[104px]' : 'mt-2';
  const titleSpacingClass = isThird ? 'mt-5' : 'mt-6';

  return (
    <article
      className={`relative flex min-h-[320px] flex-col items-center overflow-hidden rounded-[30px] border backdrop-blur-xl ${paddingClass} ${toneClass} ${heightClass}`}
    >
      <RankMedal rank={row.rank} />
      <Avatar image={row.image} rank={row.rank} size="lg" className={avatarClass} />
      <h2
        className={`${titleSpacingClass} max-w-full  text-center text-[20px] font-900 text-[#111827]`}
      >
        {row.name}
      </h2>
      <p className={`mt-1 text-[30px] font-900 ${isFirst ? 'text-[#F52F45]' : 'text-[#111827]'}`}>
        {formatNumber(row.score)}점
      </p>
      <div className={`${isFirst ? 'mt-4' : 'mt-2'}  h-px w-full bg-white/70`} />
      <div className={`mt-2 grid w-full grid-cols-2 divide-x divide-[#D7DDE6]`}>
        <StatPair value={`${row.challenges}개`} label="성공 챌린지" />
        <StatPair value={formatNumber(row.tokens)} label="최소 토큰" />
      </div>
    </article>
  );
}

function LegacyTableAvatar({ rank }) {
  if (rank === 1) {
    return (
      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#FFF0F2]">
        <img src={DragonImage} alt="" className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E5E9EF] ${legacyAvatarColors[rank % legacyAvatarColors.length]}`}
    >
      <img src={UserIcon} alt="" className="h-5 w-5 opacity-30 grayscale" />
    </div>
  );
}

function LeaderboardRow({ row }) {
  return (
    <tr className="h-[58px] text-[15px] font-700 text-[#344050]">
      <td className="w-[88px] font-900">{row.rank}위</td>
      <td className="min-w-[230px]">
        <div className="flex items-center gap-4">
          <LegacyTableAvatar rank={row.rank} />
          <span className="font-700">{row.name}</span>
        </div>
      </td>
      <td className="w-[190px]">
        <span className="inline-flex items-center gap-3 font-900 text-[#FF4854]">{row.score}</span>
      </td>
      <td className="w-[190px] text-center text-[#7C8797]">{row.challenges || ''}</td>
      <td className="w-[170px] text-center text-[#7C8797]">{formatToken(row.tokens)}</td>
    </tr>
  );
}

export default function Leaderboard() {
  const [searchInput, setSearchInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRows = useMemo(() => {
    const query = keyword.trim().toLowerCase();
    if (!query) return leaderboardRows;

    return leaderboardRows.filter(row =>
      [row.name, row.score, row.challenges, row.tokens].join(' ').toLowerCase().includes(query)
    );
  }, [keyword]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / ROWS_PER_PAGE));

  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    return filteredRows.slice(startIndex, startIndex + ROWS_PER_PAGE);
  }, [currentPage, filteredRows]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleSearch = event => {
    event.preventDefault();
    setKeyword(searchInput);
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

  return (
    <div
      className="relative left-1/2 min-h-screen w-screen -translate-x-1/2 bg-white bg-top bg-no-repeat pb-10 pt-12"
      style={{
        backgroundImage: `url(${RankBgImage})`,
        backgroundSize: '100% 100%',
      }}
    >
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8 lg:px-0">
        <header className="mb-20 text-center">
          <h1 className="text-[42px] font-900 leading-tight text-[#111827]">2026 시즌 1 랭킹</h1>
          <p className="mt-4 text-[16px]  font-600 text-[#4B5563]">
            이번 시즌 최고의 도전자들을 확인해 보세요.
          </p>
        </header>

        <section className="grid items-end gap-5 md:grid-cols-3 md:px-14">
          {topRanks.map(row => (
            <TopRankCard key={row.rank} row={row} />
          ))}
        </section>

        <MyRankCard />

        <section className="mt-10 flex h-[2580px] flex-col rounded-[24px] border border-white/65 bg-white/65 px-6 py-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_3px_8px_rgba(15,23,42,0.05)] backdrop-blur-md sm:px-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-end gap-8">
              <button
                type="button"
                className="border-b-[3px] border-[#F52F45] pb-5 text-[21px] font-900 text-[#F52F45]"
              >
                전체 랭킹
              </button>
            </div>

            <form
              onSubmit={handleSearch}
              className="flex w-full gap-3 sm:w-[min(100%,500px)]"
            >
              <label className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A4ADB8]" />
                <input
                  type="search"
                  value={searchInput}
                  onChange={event => setSearchInput(event.target.value)}
                  placeholder="유저 닉네임을 검색해 보세요."
                  className="h-11 w-full rounded-[12px] border border-[#D8DDE4] bg-white pl-11 pr-4 text-[13px] outline-none transition focus:border-[#FF4854]"
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

          <div className="mt-10 h-[2260px] overflow-x-auto overflow-y-hidden">
            <table className="w-full min-w-[920px] border-separate border-spacing-y-[14px] text-left">
              <thead>
                <tr className="text-[14px] font-900 text-[#99A5B8]">
                  <th className="w-[88px] ">순위</th>
                  <th>유저 정보</th>
                  <th className="w-[190px]">
                    <span className="inline-flex items-center gap-2">점수</span>
                  </th>
                  <th className="w-[190px] text-center">참여 챌린지 수</th>
                  <th className="w-[170px] text-center">최소 토큰</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRows.map(row => (
                  <LeaderboardRow key={`${row.rank}-${row.name}`} row={row} />
                ))}
              </tbody>
            </table>
          </div>

          <nav className="mt-6 flex items-center justify-center gap-2 text-[16px] font-600 text-[#111827]">
            <button
              type="button"
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E2E5EA] text-[#9AA3AF] disabled:cursor-not-allowed disabled:opacity-45"
            >
              <ChevronsLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E2E5EA] text-[#9AA3AF] disabled:cursor-not-allowed disabled:opacity-45"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
              <button
                key={page}
                type="button"
                onClick={() => goToPage(page)}
                className={`h-10 min-w-10 rounded-full px-3 ${page === currentPage ? 'bg-[#F52F45] text-white shadow-[0_6px_14px_rgba(245,47,69,0.28)]' : 'text-[#111827]'}`}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E2E5EA] text-[#9AA3AF] disabled:cursor-not-allowed disabled:opacity-45"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E2E5EA] text-[#9AA3AF] disabled:cursor-not-allowed disabled:opacity-45"
            >
              <ChevronsRight className="h-5 w-5" />
            </button>
          </nav>

          <p className="mt-7 border-t border-[#E5E7EB] pt-6 text-center text-[15px] font-500 text-[#8A93A0]">
            랭킹 데이터는 매일 00:00 기준으로 갱신됩니다.
          </p>
        </section>
      </div>
    </div>
  );
}
