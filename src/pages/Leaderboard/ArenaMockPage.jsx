import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Search, ShieldCheck } from 'lucide-react';
import UserIcon from '@/assets/icons/user.svg';
import TigerImage from '@/assets/images/tiger.png';

const LEADERBOARD_ROWS = [
  ['zatsu', 2321, 20, 'JP 일본'],
  ['GORiyA', 2300, 39, 'KR 대한민국'],
  ['4ncientH', 2288, 10, 'KR 대한민국'],
  ['posix', 2244, 11, ''],
  ['zzzzzzzz', 2243, 7, ''],
  ['비포맷', 2238, 19, 'KR 대한민국'],
  ['Tara', 2237, 7, 'CX 크리스마스 섬'],
  ['Rootsquare', 2225, 15, 'KR 대한민국'],
  ['EDcBA', 2183, 6, 'KR 대한민국'],
  ['BlackCat', 2124, 46, ''],
  ['zetacode', 2070, 13, 'KR 대한민국'],
  ['c0met', 2066, 25, 'KR 대한민국'],
  ['keymoon', 2047, 27, 'JP 일본'],
  ['KLPP', 2045, 3, 'PT 포르투갈'],
  ['Axii', 2031, 6, ''],
  ['metamong', 2014, 11, ''],
  ['ReverserInThirties', 2011, 16, 'KR 대한민국'],
  ['Unbbal', 2010, 31, 'KR 대한민국'],
  ['당근마켓', 1993, 8, 'KR 대한민국'],
  ['physicube', 1971, 32, ''],
  ['kq5y', 1970, 12, 'JP 일본'],
  ['ONE', 1969, 16, 'JP 일본'],
  ['roaris', 1968, 4, 'JP 일본'],
  ['AngGimotti', 1968, 2, 'KR 대한민국'],
  ['camo132108', 1957, 3, ''],
  ['kam1tsur3', 1939, 8, 'JP 일본'],
  ['Giappppp', 1917, 14, 'VN 베트남'],
  ['탐오가', 1916, 15, ''],
  ['leehjune', 1914, 8, 'KR 대한민국'],
  ['석정원_', 1912, 16, ''],
  ['PieCer', 1897, 28, 'KR 대한민국'],
  ['Sechack', 1896, 31, 'KR 대한민국'],
  ['vanitas1209', 1895, 4, ''],
  ['G1nM0o', 1890, 14, 'KR 대한민국'],
  ['zarfix', 1888, 7, 'US 미국'],
  ['BYTE256', 1883, 6, ''],
  ['shpark1104', 1873, 22, 'KR 대한민국'],
  ['yuseong', 1872, 17, ''],
  ['DDING', 1867, 11, ''],
  ['n0ha', 1866, 32, ''],
  ['Yu_212', 1847, 29, 'JP 일본'],
  ['mobydick', 1834, 3, 'KR 대한민국'],
  ['lyed', 1832, 8, 'TN 튀니지'],
  ['kakur41', 1829, 14, ''],
  ['m0nd2y', 1827, 25, 'KR 대한민국'],
  ['jirabbit', 1826, 4, 'KR 대한민국'],
  ['wy', 1823, 28, 'KR 대한민국'],
  ['gkljasoickl', 1816, 2, 'KR 대한민국'],
  ['minnnjuuu', 1815, 23, 'KR 대한민국'],
  ['lydxn', 1806, 3, 'CA 캐나다'],
].map(([name, rating, ctfCount, country], index) => ({
  rank: index + 1,
  name,
  rating,
  ctfCount,
  country,
}));

const avatarColors = [
  'bg-[#E7F0FF]',
  'bg-[#F2F4F6]',
  'bg-[#FFF2D8]',
  'bg-[#FFE8EF]',
  'bg-[#EAF8F0]',
  'bg-[#F1EDFF]',
];

const rankingTabs = ['개인', '학교', '회사 · 기관', 'Snapshot'];

function Avatar({ name, rank, large = false }) {
  const showPhoto = rank === 1;
  const color = avatarColors[rank % avatarColors.length];

  if (showPhoto) {
    return (
      <div className={`${large ? 'h-[86px] w-[86px]' : 'h-8 w-8'} overflow-hidden rounded-full border border-[#E5E9EF] bg-[#F5F7FA]`}>
        <img src={TigerImage} alt="" className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={`${large ? 'h-[86px] w-[86px]' : 'h-8 w-8'} flex items-center justify-center rounded-full border border-[#E5E9EF] ${color}`}
    >
      <img
        src={UserIcon}
        alt=""
        className={`${large ? 'h-12 w-12' : 'h-5 w-5'} opacity-35 grayscale`}
      />
    </div>
  );
}

function RankRibbon({ rank }) {
  const colors = {
    1: 'from-[#FF3946] to-[#B30010] border-[#FFBE3D]',
    2: 'from-[#319DFF] to-[#1263BA] border-[#9AD0FF]',
    3: 'from-[#26B94A] to-[#0E872B] border-[#86E293]',
  };

  return (
    <div
      className={`absolute left-7 top-0 flex h-[62px] w-[43px] items-start justify-center border-x-2 border-b-2 bg-gradient-to-b ${colors[rank]} pt-2 text-[18px] font-800 text-white shadow-sm [clip-path:polygon(0_0,100%_0,100%_82%,50%_100%,0_82%)]`}
    >
      {rank}위
    </div>
  );
}

function TopRankCard({ row }) {
  const rankTextColor = row.rank === 1 ? 'text-[#4EA1FF]' : row.rank === 2 ? 'text-[#4EA1FF]' : 'text-[#52A8FF]';

  return (
    <article className="relative min-h-[282px] rounded-[3px] border border-[#DDE3EA] bg-white px-7 pb-7 pt-8">
      <RankRibbon rank={row.rank} />
      <div className="flex flex-col items-center">
        <Avatar name={row.name} rank={row.rank} large />
        <div className="mt-6 flex items-center gap-1.5 text-[14px] font-800 text-[#4A515B]">
          {row.name}
          <ShieldCheck className="h-4 w-4 fill-[#4EA1FF] text-white" />
        </div>
        <div className="mt-4 grid w-full grid-cols-2 divide-x divide-[#E5E9EF] text-center">
          <div>
            <strong className={`block text-[22px] font-800 ${rankTextColor}`}>{row.rating}</strong>
            <span className="text-[12px] font-700 text-[#A0A8B3]">RATING</span>
          </div>
          <div>
            <strong className="block text-[22px] font-800 text-[#777F8C]">{row.ctfCount}</strong>
            <span className="text-[12px] font-700 text-[#A0A8B3]">참여 CTF 수</span>
          </div>
        </div>
      </div>
    </article>
  );
}

function RatingBadge({ rank, rating }) {
  const isTop10 = rank <= 10;

  return (
    <span className={`inline-flex items-center gap-2 text-[14px] font-800 ${isTop10 ? 'text-[#4EA1FF]' : 'text-[#59BF89]'}`}>
      <ShieldCheck className={`h-5 w-5 ${isTop10 ? 'fill-[#4EA1FF]' : 'fill-[#59BF89]'} text-white`} />
      {rating}
    </span>
  );
}

export default function Leaderboard() {
  const [keyword, setKeyword] = useState('');
  const [activeCategory, setActiveCategory] = useState('Wargame');
  const [activeScope, setActiveScope] = useState('개인');

  const filteredRows = useMemo(() => {
    const query = keyword.trim().toLowerCase();
    if (!query) return LEADERBOARD_ROWS;

    return LEADERBOARD_ROWS.filter(row =>
      [row.name, row.country, row.rating, row.ctfCount].join(' ').toLowerCase().includes(query)
    );
  }, [keyword]);

  const topRows = LEADERBOARD_ROWS.slice(0, 3);

  return (
    <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-10 bg-white px-4 py-8 sm:px-6 lg:grid-cols-[160px_minmax(0,1fr)] lg:px-0">
      <aside className="hidden lg:block">
        <nav className="sticky top-24 space-y-8">
          <button
            type="button"
            onClick={() => setActiveCategory('CTF')}
            className={`block cursor-pointer text-left text-[21px] font-800 transition-colors ${
              activeCategory === 'CTF' ? 'text-[#6973FF]' : 'text-[#6A7482] hover:text-[#6973FF]'
            }`}
          >
            CTF
          </button>
          <div>
            <button
              type="button"
              onClick={() => setActiveCategory('Wargame')}
              className={`block cursor-pointer text-left text-[21px] font-800 transition-colors ${
                activeCategory === 'Wargame'
                  ? 'text-[#6973FF]'
                  : 'text-[#6A7482] hover:text-[#6973FF]'
              }`}
            >
              Wargame
            </button>
            <div className="mt-5 space-y-5 pl-4">
              {rankingTabs.map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setActiveCategory('Wargame');
                    setActiveScope(tab);
                  }}
                  className={`block cursor-pointer text-left text-[17px] font-800 transition-colors ${
                    activeCategory === 'Wargame' && activeScope === tab
                      ? 'text-[#111827]'
                      : 'text-[#A0A8B3] hover:text-[#6973FF]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveCategory('커뮤니티')}
            className={`block cursor-pointer text-left text-[21px] font-800 transition-colors ${
              activeCategory === '커뮤니티' ? 'text-[#6973FF]' : 'text-[#6A7482] hover:text-[#6973FF]'
            }`}
          >
            커뮤니티
          </button>
        </nav>
      </aside>

      <main className="min-w-0">
        <div className="mb-7 flex flex-wrap gap-2 lg:hidden">
          {['CTF', 'Wargame', '커뮤니티'].map(category => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`h-9 cursor-pointer rounded-full px-4 text-[14px] font-700 transition-colors ${
                activeCategory === category
                  ? 'bg-[#F0F2FF] text-[#6973FF]'
                  : 'text-[#7B8491] hover:bg-[#F6F8FB]'
              }`}
            >
              {category}
            </button>
          ))}
          {rankingTabs.map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveCategory('Wargame');
                setActiveScope(tab);
              }}
              className={`h-9 cursor-pointer rounded-full px-4 text-[14px] font-700 transition-colors ${
                activeCategory === 'Wargame' && activeScope === tab
                  ? 'bg-[#F0F2FF] text-[#6973FF]'
                  : 'text-[#7B8491] hover:bg-[#F6F8FB]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mb-4 flex items-center gap-2 text-[14px] font-800 text-[#9AA3AF]">
          <span>{activeCategory}</span>
          {activeCategory === 'Wargame' && (
            <>
              <span>/</span>
              <span className="text-[#6973FF]">{activeScope}</span>
            </>
          )}
        </div>

        <div className="mb-7 hidden items-center gap-3 lg:flex">
          {rankingTabs.map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveCategory('Wargame');
                setActiveScope(tab);
              }}
              className={`h-11 cursor-pointer rounded-full px-5 text-[17px] font-800 transition-colors ${
                activeCategory === 'Wargame' && activeScope === tab
                  ? 'bg-[#F0F2FF] text-[#6973FF]'
                  : 'text-[#7B8491] hover:bg-[#F6F8FB]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid gap-7 md:grid-cols-3">
          {topRows.map(row => (
            <TopRankCard key={row.rank} row={row} />
          ))}
        </div>

        <div className="mt-7 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <select className="h-10 w-full rounded-[3px] border border-[#DCE2EA] bg-white px-4 text-[13px] font-500 text-[#606B78] outline-none md:w-[200px]">
            <option>전체 국가</option>
            <option>KR 대한민국</option>
            <option>JP 일본</option>
          </select>

          <label className="relative block w-full md:w-[360px]">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B0B8C2]" />
            <input
              type="search"
              value={keyword}
              onChange={event => setKeyword(event.target.value)}
              placeholder="유저 닉네임을 검색해 보세요."
              className="h-10 w-full rounded-[3px] border border-[#DCE2EA] bg-white pl-11 pr-4 text-[13px] outline-none transition focus:border-[#FF4854]"
            />
          </label>
        </div>

        <div className="mt-7 overflow-x-auto">
        <table className="w-full min-w-[850px] border-collapse text-left">
          <thead>
            <tr className="text-[13px] font-800 text-[#9AA3AF]">
              <th className="w-[90px] py-4">순위</th>
              <th className="py-4">유저 정보</th>
              <th className="w-[170px] py-4">RATING</th>
              <th className="w-[170px] py-4 text-center">참여 CTF 수</th>
              <th className="w-[180px] py-4 text-center">국가</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map(row => (
              <tr key={row.rank} className="h-[58px] text-[14px] font-700 text-[#4C5663]">
                <td className="text-[#4A515B]">{row.rank}위</td>
                <td>
                  <div className="flex items-center gap-3">
                    <Avatar name={row.name} rank={row.rank} />
                    <span>{row.name}</span>
                  </div>
                </td>
                <td>
                  <RatingBadge rank={row.rank} rating={row.rating} />
                </td>
                <td className="text-center text-[#697281]">{row.ctfCount}</td>
                <td className="text-center text-[12px] text-[#7B8491]">{row.country}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-[13px] font-700 text-[#B2BAC5]">
        <button type="button" className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-[4px] hover:bg-[#F1F4F8]">
          <ChevronLeft className="h-4 w-4" />
        </button>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(page => (
          <button
            key={page}
            type="button"
            className={`h-7 w-7 cursor-pointer rounded-[4px] ${
              page === 1 ? 'bg-[#6B73FF] text-white' : 'hover:bg-[#F1F4F8]'
            }`}
          >
            {page}
          </button>
        ))}
        <button type="button" className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-[4px] hover:bg-[#F1F4F8]">
          <ChevronRight className="h-4 w-4" />
        </button>
        </div>
      </main>
    </div>
  );
}
