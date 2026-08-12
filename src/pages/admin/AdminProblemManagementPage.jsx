import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw, Search } from 'lucide-react';
import { useAdminProblemsQuery } from '@/hooks/useAdminProblemsQuery';
import ProblemEditModal from './ProblemEditModal';

const PAGE_SIZE = 20;

export default function AdminProblemManagementPage() {
  const [searchInput, setSearchInput] = useState('');
  const [query, setQuery] = useState('');
  const [offset, setOffset] = useState(0);
  const [activeOnly, setActiveOnly] = useState(false);
  const [editingProblemId, setEditingProblemId] = useState(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setQuery(searchInput.trim());
      setOffset(0);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const filters = useMemo(
    () => ({ query: query || undefined, offset, limit: PAGE_SIZE }),
    [offset, query]
  );
  const problemsQuery = useAdminProblemsQuery(filters);
  const allItems = problemsQuery.data?.items ?? [];
  const items = activeOnly ? allItems.filter(problem => problem.is_active) : allItems;
  const total = problemsQuery.data?.total ?? 0;

  return (
    <div className="w-full text-white">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center">
        <label className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={searchInput}
            onChange={event => setSearchInput(event.target.value)}
            placeholder="챌린지 제목·설명·Slug 검색"
            className="h-11 w-full rounded-lg border border-white/10 bg-[#1A0B15] pl-10 pr-4 text-white outline-none focus:border-[#FF4854]"
          />
        </label>
        <label className="flex h-11 items-center gap-3 rounded-lg border border-white/10 bg-[#1A0B15] px-4">
          <input
            type="checkbox"
            checked={activeOnly}
            onChange={event => setActiveOnly(event.target.checked)}
            className="h-5 w-5 accent-[#FF4854]"
          />{' '}
          공개 챌린지만
        </label>
        <button
          type="button"
          onClick={() => problemsQuery.refetch()}
          disabled={problemsQuery.isFetching}
          className="flex h-11 items-center gap-2 rounded-lg bg-[#FF4854] px-4 font-bold disabled:opacity-50"
        >
          <RefreshCw size={17} className={problemsQuery.isFetching ? 'animate-spin' : ''} />{' '}
          새로고침
        </button>
      </div>

      {problemsQuery.isLoading && <State>챌린지 목록을 불러오는 중...</State>}
      {problemsQuery.error && <State error>{problemsQuery.error.message}</State>}
      {!problemsQuery.isLoading && !problemsQuery.error && items.length === 0 && (
        <State>표시할 챌린지가 없습니다.</State>
      )}

      <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
        {items.map(problem => (
          <article
            key={problem.id}
            className="rounded-xl border border-white/10 bg-[#0B021C]/70 p-5 shadow-lg"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-card-title font-bold">{problem.title}</h2>
                <p className="mt-1 text-label text-gray-500">{problem.slug}</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-label font-bold ${problem.is_active ? 'bg-emerald-500/15 text-emerald-300' : 'bg-gray-500/15 text-gray-400'}`}
              >
                {problem.is_active ? '공개' : '비공개'}
              </span>
            </div>
            <p className="mt-4 line-clamp-3 text-body text-gray-400">{problem.description}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-label text-gray-300">
              <span className="rounded bg-white/10 px-2 py-1">{problem.difficulty}</span>
              <span className="rounded bg-white/10 px-2 py-1">
                {problem.max_score.toLocaleString()}포인트
              </span>
              {problem.is_tutorial && (
                <span className="rounded bg-[#FFB155]/15 px-2 py-1 text-[#FFD08A]">튜토리얼</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setEditingProblemId(problem.id)}
              className="mt-5 h-10 w-full rounded-lg bg-[#FF4854] font-bold transition hover:bg-[#ff3242]"
            >
              상세·수정·보호 문자열
            </button>
          </article>
        ))}
      </div>

      {total > 0 && (
        <div className="mt-6 flex items-center justify-between rounded-xl border border-white/10 bg-[#0B021C]/70 px-5 py-4">
          <span>
            {total.toLocaleString()}개 중 {offset + 1}–{Math.min(offset + allItems.length, total)}
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={offset === 0}
              onClick={() => setOffset(value => Math.max(0, value - PAGE_SIZE))}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 disabled:opacity-30"
            >
              <ChevronLeft size={18} />
            </button>
            <span>
              {Math.floor(offset / PAGE_SIZE) + 1} / {Math.max(1, Math.ceil(total / PAGE_SIZE))}
            </span>
            <button
              type="button"
              disabled={offset + PAGE_SIZE >= total}
              onClick={() => setOffset(value => value + PAGE_SIZE)}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 disabled:opacity-30"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {editingProblemId && (
        <ProblemEditModal problemId={editingProblemId} onClose={() => setEditingProblemId(null)} />
      )}
    </div>
  );
}

function State({ children, error }) {
  return (
    <div
      className={`rounded-xl border p-10 text-center ${error ? 'border-red-400/30 bg-red-950/20 text-red-300' : 'border-white/10 bg-[#0B021C]/70 text-gray-400'}`}
    >
      {children}
    </div>
  );
}
