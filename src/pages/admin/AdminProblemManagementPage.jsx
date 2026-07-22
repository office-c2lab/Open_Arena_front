// src/pages/AdminProblems/AdminProblemManagementPage.jsx
import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useAdminProblemsQuery } from '@/hooks/useAdminProblemsQuery';
import { useAdminToggleProblemActive } from '@/hooks/useAdminToggleProblemActive';
import ProblemEditModal from './ProblemEditModal';
import ToggleSwitch from './ToggleSwitch';

export default function AdminProblemManagementPage({ activeOnly = false, onActiveOnlyToggle }) {
  const { data, isLoading } = useAdminProblemsQuery({ activeOnly });
  const toggle = useAdminToggleProblemActive();

  const [editingProblem, setEditingProblem] = useState(null);
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

  if (isLoading) return <div className="text-white">로딩 중...</div>;

  return (
    <div className="p-10 text-white max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between gap-4 mb-8">
        <h1 className="text-4xl font-bold text-[#FF4854]">문제 관리</h1>

        <label className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0B021C]/70 border border-white/10 text-white cursor-pointer">
          <ToggleSwitch enabled={activeOnly} onToggle={onActiveOnlyToggle} />
          <span className="font-bold whitespace-nowrap">활성 문제만 보기</span>
        </label>
      </div>

      <div className="mb-6 flex flex-col gap-3 rounded-xl border border-white/10 bg-[#0B021C]/70 p-4 sm:flex-row sm:items-center">
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

      {/* 문제 카드 리스트 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
        {filteredProblems.map(p => (
          <div
            key={p.id}
            className="p-5 bg-[#0B021C]/70 border border-[#FF4854]/40 rounded-xl shadow-lg"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold">{p.title}</h2>

              <button
                onClick={() => toggle.mutate(p.id)}
                className={`px-3 py-1 text-sm rounded-lg  cursor-pointer ${
                  p.is_active ? 'bg-green-600' : 'bg-gray-600'
                }`}
              >
                {p.is_active ? '활성' : '비활성'}
              </button>
            </div>

            <p className="text-gray-400 text-sm mb-4">{p.description?.slice(0, 80)}...</p>

            <button
              onClick={() => setEditingProblem(p)}
              className="w-full py-2 rounded-lg bg-[#FF4854] hover:bg-[#e13a47] transition cursor-pointer"
            >
              수정 / 삭제
            </button>
          </div>
        ))}
      </div>

      {filteredProblems.length === 0 && (
        <div className="mb-14 rounded-xl border border-white/10 bg-[#0B021C]/70 p-10 text-center text-gray-400">
          검색 결과가 없습니다.
        </div>
      )}

      {editingProblem && (
        <ProblemEditModal problem={editingProblem} onClose={() => setEditingProblem(null)} />
      )}
    </div>
  );
}
