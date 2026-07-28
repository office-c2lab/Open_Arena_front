import React, { useMemo, useState } from 'react';
import {
  ArrowUp,
  BarChart3,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CircleDollarSign,
  Flag,
  Info,
  Search,
  ShieldCheck,
  Star,
  Target,
} from 'lucide-react';
import UserIcon from '@/assets/icons/user.svg';
import DragonImage from '@/assets/images/dragon.png';
import GreenDragonImage from '@/assets/images/green_dragon.png';
import GreenPhoenixImage from '@/assets/images/green_phoenix.png';
import GreenTigerImage from '@/assets/images/green_tiger.png';
import PhoenixImage from '@/assets/images/phoenix.png';
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

const summaryItems = [
  { label: '시즌 점수', value: '2,480점', icon: Star },
  { label: '성공 챌린지', value: '18개', icon: Flag },
  { label: '사용 토큰', value: '14,200', icon: CircleDollarSign },
];

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
      className={`${sizeClass} flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-white bg-[#F4F6F8] shadow-[0_2px_10px_rgba(15,23,42,0.12)] ${className}`}
    >
      <img
        src={image || UserIcon}
        alt=""
        className={`${image ? 'h-full w-full object-cover' : 'h-6 w-6 opacity-45 grayscale'} ${rank === 1 ? 'scale-110' : ''}`}
      />
    </div>
  );
}

function RankMedal({ rank, tone }) {
  const toneClass = {
    gold: 'border-[#FFB51F] bg-[#FFC72B] text-white shadow-[0_4px_12px_rgba(255,193,7,0.35)]',
    silver: 'border-[#9FA8B2] bg-[#AEB7C0] text-white',
    bronze: 'border-[#AD6728] bg-[#B66628] text-white',
  }[tone];

  return (
    <div
      className={`absolute left-6 top-5 flex h-11 w-11 items-center justify-center rounded-full border-2 text-[21px] font-900 ${toneClass}`}
    >
      {rank}
    </div>
  );
}

function StatPair({ icon, value, label }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      {icon}
      <div className="min-w-0">
        <strong className="block text-[17px] font-900 leading-5 text-[#111827]">{value}</strong>
        <span className="block truncate text-[13px] font-600 text-[#525B66]">{label}</span>
      </div>
    </div>
  );
}

function TopRankCard({ row }) {
  const isFirst = row.rank === 1;
  const borderClass = isFirst
    ? 'border-[#FF4854] bg-[radial-gradient(circle_at_50%_0%,#FFF1F2_0%,#FFFFFF_58%)]'
    : row.rank === 2
      ? 'border-[#C9CED6]'
      : 'border-[#E1B895] bg-[linear-gradient(135deg,#FFFFFF_0%,#FFF8F3_100%)]';

  return (
    <article
      className={`relative flex min-h-[330px] flex-col items-center rounded-[12px] border px-8 pb-7 pt-12 shadow-[0_14px_28px_rgba(15,23,42,0.06)] ${borderClass} ${isFirst ? 'md:-mt-10 md:min-h-[420px]' : 'md:mt-0'}`}
    >
      <RankMedal rank={row.rank} tone={row.tone} />
      <Avatar image={row.image} rank={row.rank} size="lg" className={isFirst ? 'mt-4' : 'mt-2'} />
      <h2 className="mt-6 text-center text-[20px] font-900 text-[#111827]">{row.name}</h2>
      <p className={`mt-1 text-[30px] font-900 ${isFirst ? 'text-[#F52F45]' : 'text-[#111827]'}`}>
        {formatNumber(row.score)}점
      </p>
      <div className="mt-5 h-px w-full bg-[#E8EAEE]" />
      <div className="mt-5 grid w-full grid-cols-2 gap-4">
        <StatPair
          icon={<Flag className="h-5 w-5 shrink-0 text-[#111827]" strokeWidth={2.2} />}
          value={`${row.challenges}개`}
          label="성공 챌린지"
        />
        <StatPair
          icon={<CircleDollarSign className="h-5 w-5 shrink-0 text-[#111827]" strokeWidth={2.2} />}
          value={formatNumber(row.tokens)}
          label="사용 토큰"
        />
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
        <span className="inline-flex items-center gap-3 font-900 text-[#FF4854]">
          <ShieldCheck className="h-4 w-4 fill-[#FF4854] text-white" />
          {row.score}
        </span>
      </td>
      <td className="w-[190px] text-center text-[#7C8797]">{row.challenges || ''}</td>
      <td className="w-[170px] text-center text-[#7C8797]">{formatToken(row.tokens)}</td>
    </tr>
  );
}

export default function Leaderboard() {
  const [keyword, setKeyword] = useState('');

  const filteredRows = useMemo(() => {
    const query = keyword.trim().toLowerCase();
    if (!query) return leaderboardRows;

    return leaderboardRows.filter(row =>
      [row.name, row.score, row.challenges, row.tokens].join(' ').toLowerCase().includes(query)
    );
  }, [keyword]);

  return (
    <div className="mx-auto w-full max-w-[1200px] bg-white px-5 pb-10 pt-9 sm:px-8 lg:px-0">
      <section className="mt-9 rounded-[10px] border border-[#DDE1E7] bg-white px-6 py-7 shadow-[0_10px_28px_rgba(15,23,42,0.06)] sm:px-10">
        <div className="grid gap-7 lg:grid-cols-[1fr_2fr_1.35fr] lg:divide-x lg:divide-[#E2E5EA]">
          <div>
            <span className="text-[15px] font-800 text-[#F52F45]">내 순위</span>
            <div className="mt-2 flex items-end gap-2">
              <strong className="text-[52px] font-900 leading-none text-[#111827]">12</strong>
              <span className="pb-1 text-[25px] font-900 text-[#111827]">위</span>
            </div>
            <p className="mt-2 text-[16px] font-500 text-[#6B7280]">/ 12,856명</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-3 lg:px-9">
            {summaryItems.map(item => (
              <div
                key={item.label}
                className="border-[#E2E5EA] sm:border-l sm:first:border-l-0 sm:pl-8 sm:first:pl-0"
              >
                <div className="flex items-center gap-2 text-[15px] font-600 text-[#4D5662]">
                  <item.icon className="h-5 w-5 text-[#111827]" />
                  {item.label}
                </div>
                <strong className="mt-4 block text-[34px] font-900 leading-none text-[#111827]">
                  {item.value}
                </strong>
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:pl-9">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ArrowUp className="h-5 w-5 text-[#F52F45]" strokeWidth={3} />
                <strong className="text-[17px] font-900 text-[#111827]">3단계 상승</strong>
              </div>
              <span className="text-[14px] font-500 text-[#6B7280]">(지난주 대비)</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-[#111827]" />
                <span className="text-[16px] font-800 text-[#111827]">다음 순위까지</span>
              </div>
              <strong className="text-[17px] font-900 text-[#111827]">120점</strong>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-5 w-5 text-[#111827]" />
                <span className="text-[16px] font-800 text-[#111827]">상위</span>
              </div>
              <strong className="text-[17px] font-900 text-[#111827]">8%</strong>
            </div>
          </div>
        </div>
      </section>

      <aside className="mt-7 flex flex-col gap-4 rounded-[10px] bg-[#F7F7F8] px-6 py-4 text-[15px] text-[#4B5563] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#697281]" />
          <p className="font-600">
            랭킹은 챌린지 성공으로 획득한 시즌 점수를 기준으로 산정됩니다.
            <span className="hidden md:inline">
              {' '}
              동점일 경우 먼저 점수를 달성한 사용자가 높은 순위를 차지합니다.
            </span>
          </p>
        </div>
        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-2 font-800 text-[#111827]"
        >
          자세히 보기
          <ChevronRight className="h-4 w-4" />
        </button>
      </aside>

      <section className="mt-20 grid items-end gap-5 md:grid-cols-3 md:px-14">
        {topRanks.map(row => (
          <TopRankCard key={row.rank} row={row} />
        ))}
      </section>

      <section className="mt-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-end gap-8">
            <button
              type="button"
              className="border-b-[3px] border-[#F52F45] pb-5 text-[21px] font-900 text-[#F52F45]"
            >
              전체 랭킹
            </button>
          </div>
        </div>

        <label className="relative mt-7 block w-full max-w-[360px]">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#AAB4C2]" />
          <input
            type="search"
            value={keyword}
            onChange={event => setKeyword(event.target.value)}
            placeholder="유저 닉네임을 검색해 보세요."
            className="h-10 w-full rounded-[3px] border border-[#D8E0EA] bg-white pl-11 pr-4 text-[13px] font-500 text-[#344050] outline-none transition placeholder:text-[#8A96A8] focus:border-[#FF4854]"
          />
        </label>

        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[920px] border-separate border-spacing-y-[14px] text-left">
            <thead>
              <tr className="text-[14px] font-900 text-[#99A5B8]">
                <th className="w-[88px] ">순위</th>
                <th>유저 정보</th>
                <th className="w-[190px]">
                  <span className="inline-flex items-center gap-2">
                    RATING
                    <ChevronDown className="h-4 w-4" />
                  </span>
                </th>
                <th className="w-[190px] text-center">참여 챌린지 수</th>
                <th className="w-[170px] text-center">최소 토큰</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map(row => (
                <LeaderboardRow key={`${row.rank}-${row.name}`} row={row} />
              ))}
            </tbody>
          </table>
        </div>

        <nav className="mt-6 flex items-center justify-center gap-2 text-[16px] font-600 text-[#111827]">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E2E5EA] text-[#9AA3AF]"
          >
            <ChevronsLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E2E5EA] text-[#9AA3AF]"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          {[1, '...', 10, 11, 12, 13, 14, '...', 100].map((page, index) => (
            <button
              key={`${page}-${index}`}
              type="button"
              className={`h-10 min-w-10 rounded-full px-3 ${page === 12 ? 'bg-[#F52F45] text-white shadow-[0_6px_14px_rgba(245,47,69,0.28)]' : 'text-[#111827]'}`}
            >
              {page}
            </button>
          ))}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E2E5EA] text-[#9AA3AF]"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E2E5EA] text-[#9AA3AF]"
          >
            <ChevronsRight className="h-5 w-5" />
          </button>
        </nav>

        <p className="mt-7 border-t border-[#E5E7EB] pt-6 text-center text-[15px] font-500 text-[#8A93A0]">
          랭킹 데이터는 매일 00:00 기준으로 갱신됩니다.
        </p>
      </section>
    </div>
  );
}
