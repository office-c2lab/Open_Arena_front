import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { useAdminToggleProblemActive } from '@/hooks/useAdminToggleProblemActive';
import { getAdminProblems } from '@/api/adminProblemsApi';
import ToggleSwitch from './ToggleSwitch';

const AdminProblemToggleList = ({ activeOnly = false, onActiveOnlyToggle }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['adminProblems', { activeOnly }],
    queryFn: () => getAdminProblems({ activeOnly }),
  });

  const toggleMutation = useAdminToggleProblemActive();
  const [searchInput, setSearchInput] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredProblems = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();
    const problems = Array.isArray(data) ? data : [];

    if (!keyword) return problems;

    return problems.filter(problem => {
      const searchableText = [problem.id, problem.title, problem.description]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchableText.includes(keyword);
    });
  }, [data, searchKeyword]);

  const handleSearch = () => {
    setSearchKeyword(searchInput);
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (!data) return <div>문제를 불러올 수 없습니다.</div>;

  return (
    <div className="w-full flex flex-col gap-6 mt-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="heading-1 font-700 text-[#FF4854]">문제 활성/비활성 관리</h1>

        <label className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0B021C]/70 border border-white/10 text-white cursor-pointer">
          <ToggleSwitch enabled={activeOnly} onToggle={onActiveOnlyToggle} />
          <span className="font-bold whitespace-nowrap">활성 문제만 보기</span>
        </label>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-[#0B021C]/70 p-4 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={searchInput}
            onChange={event => setSearchInput(event.target.value)}
            onKeyDown={event => {
              if (event.key === 'Enter') handleSearch();
            }}
            placeholder="문제 제목, 설명, ID 검색"
            className="h-11 w-full rounded-lg border border-white/10 bg-[#1A0B15] pl-10 pr-4 text-white outline-none placeholder:text-gray-500 focus:border-[#FF4854]"
          />
        </label>
        <button
          type="button"
          onClick={handleSearch}
          className="h-11 rounded-lg bg-[#FF4854] px-5 font-bold text-white transition hover:bg-[#ff3242]"
        >
          검색
        </button>
      </div>

      {/*  3개씩 가로 배치되는 grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {filteredProblems.map(p => (
          <div
            key={p.id}
            className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col gap-2"
          >
            {/* 첫 줄: 제목 + 토글 */}
            <div className="flex items-center justify-between">
              <span className="heading-3 font-700">{p.title}</span>

              <ToggleSwitch enabled={p.is_active} onToggle={() => toggleMutation.mutate(p.id)} />
            </div>

            {/* 둘째 줄 */}
            <div className="body-large font-500 text-gray-500 pl-1">
              ID: {p.id} · 상태: {p.is_active ? '활성화됨' : '비활성화됨'}
            </div>
          </div>
        ))}
      </div>

      {filteredProblems.length === 0 && (
        <div className="rounded-xl border border-white/10 bg-[#0B021C]/70 p-10 text-center text-gray-400">
          검색 결과가 없습니다.
        </div>
      )}
    </div>
  );
};

export default AdminProblemToggleList;
