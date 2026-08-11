import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, RefreshCw, Search, Trash2 } from 'lucide-react';
import { appToast } from '@/components/Toast/appToast';
import { useAdminNotice, useAdminNoticeActions, useAdminNotices } from '@/hooks/useAdminNotices';
import { ChallengeSetting } from './AdminChallengeResourceManagement';

const PAGE_SIZE = 20;
const emptyNoticeForm = {
  title: '',
  body: '',
  body_format: 'plain',
  status: 'draft',
  is_pinned: false,
  published_at: '',
};

const STATUS_LABELS = { draft: '초안', published: '게시', hidden: '숨김' };

const toDateTimeLocal = value => {
  if (!value) return '';
  const date = new Date(value);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
};

export default function AdminOperationsPage() {
  const [tab, setTab] = useState('notices');

  return (
    <div className="min-h-screen w-full px-6 py-8 pb-40 text-white xl:px-10 xl:py-10">
      <div className="mb-8 flex justify-center gap-3">
        {[
          ['notices', '공지사항 관리'],
          ['challenge', '챌린지 운영 설정'],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setTab(value)}
            className={`rounded-xl border px-6 py-3 font-bold transition ${tab === value ? 'border-[#FF4854] bg-[#FF4854] text-white shadow-[0_0_15px_rgba(255,72,84,0.5)]' : 'border-gray-600 bg-[#1A0B15]/60 text-gray-300 hover:bg-[#2a0f1f]'}`}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === 'notices' && <NoticeManagement />}
      {tab === 'challenge' && <ChallengeSetting />}
    </div>
  );
}

function NoticeManagement() {
  const [filterInputs, setFilterInputs] = useState({ query: '', status: '', pinned: '' });
  const [filters, setFilters] = useState({ query: '', status: '', pinned: '' });
  const [offset, setOffset] = useState(0);
  const [selectedNoticeId, setSelectedNoticeId] = useState(null);
  const [form, setForm] = useState(emptyNoticeForm);

  const queryFilters = useMemo(
    () => ({
      query: filters.query || undefined,
      status: filters.status || undefined,
      isPinned: filters.pinned === '' ? undefined : filters.pinned === 'true',
      offset,
      limit: PAGE_SIZE,
    }),
    [filters, offset]
  );
  const noticesQuery = useAdminNotices(queryFilters);
  const noticeQuery = useAdminNotice(selectedNoticeId);
  const actions = useAdminNoticeActions();
  const notices = noticesQuery.data?.items ?? [];
  const total = noticesQuery.data?.total ?? 0;

  useEffect(() => {
    if (!noticeQuery.data) return;
    setForm({
      title: noticeQuery.data.title,
      body: noticeQuery.data.body,
      body_format: noticeQuery.data.body_format,
      status: noticeQuery.data.status,
      is_pinned: noticeQuery.data.is_pinned,
      published_at: toDateTimeLocal(noticeQuery.data.published_at),
    });
  }, [noticeQuery.data]);

  const startCreate = () => {
    setSelectedNoticeId(null);
    setForm(emptyNoticeForm);
  };

  const save = async event => {
    event.preventDefault();
    const payload = {
      title: form.title.trim(),
      body: form.body.trim(),
      body_format: form.body_format,
      status: form.status,
      is_pinned: form.is_pinned,
      published_at: form.published_at ? new Date(form.published_at).toISOString() : null,
    };
    try {
      if (selectedNoticeId) {
        await actions.updateNotice({ noticeId: selectedNoticeId, payload });
        appToast.success('공지사항을 수정했습니다.');
      } else {
        const created = await actions.createNotice(payload);
        setSelectedNoticeId(created.id);
        appToast.success('공지사항을 생성했습니다.');
      }
    } catch (error) {
      appToast.error(error.message);
    }
  };

  const remove = async () => {
    if (!selectedNoticeId || !window.confirm('이 공지사항을 삭제할까요?')) return;
    try {
      await actions.deleteNotice(selectedNoticeId);
      startCreate();
      appToast.success('공지사항을 삭제했습니다.');
    } catch (error) {
      appToast.error(error.message);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-page-title font-bold text-[#FF4854]">공지사항 관리</h1>
          <p className="mt-2 text-gray-400">
            초안 작성, 게시·숨김, 상단 고정과 예약 공개 시각을 관리합니다.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => noticesQuery.refetch()}
            disabled={noticesQuery.isFetching}
            className="flex h-11 items-center gap-2 rounded-lg bg-white/10 px-4 font-bold hover:bg-white/15 disabled:opacity-50"
          >
            <RefreshCw size={17} className={noticesQuery.isFetching ? 'animate-spin' : ''} />{' '}
            새로고침
          </button>
          <button
            type="button"
            onClick={startCreate}
            className="flex h-11 items-center gap-2 rounded-lg bg-[#FF4854] px-4 font-bold hover:bg-[#ff3242]"
          >
            <Plus size={17} /> 새 공지
          </button>
        </div>
      </div>

      <form
        onSubmit={event => {
          event.preventDefault();
          setFilters(filterInputs);
          setOffset(0);
        }}
        className="mt-6 grid gap-3 rounded-xl border border-white/10 bg-[#0B021C]/70 p-5 md:grid-cols-[1fr_180px_160px_auto]"
      >
        <label className="relative">
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={filterInputs.query}
            onChange={event =>
              setFilterInputs(current => ({ ...current, query: event.target.value }))
            }
            placeholder="공지 제목 검색"
            className="h-11 w-full rounded-lg border border-white/10 bg-[#1A0B15] pl-9 pr-3 outline-none focus:border-[#FF4854]"
          />
        </label>
        <select
          value={filterInputs.status}
          onChange={event =>
            setFilterInputs(current => ({ ...current, status: event.target.value }))
          }
          className="h-11 rounded-lg border border-white/10 bg-[#1A0B15] px-3 outline-none"
        >
          <option value="">모든 상태</option>
          <option value="draft">초안</option>
          <option value="published">게시</option>
          <option value="hidden">숨김</option>
        </select>
        <select
          value={filterInputs.pinned}
          onChange={event =>
            setFilterInputs(current => ({ ...current, pinned: event.target.value }))
          }
          className="h-11 rounded-lg border border-white/10 bg-[#1A0B15] px-3 outline-none"
        >
          <option value="">고정 전체</option>
          <option value="true">고정</option>
          <option value="false">일반</option>
        </select>
        <button type="submit" className="h-11 rounded-lg bg-[#FF4854] px-5 font-bold">
          검색
        </button>
      </form>

      <div className="mt-6 grid gap-6 xl:grid-cols-[360px_1fr]">
        <section className="overflow-hidden rounded-xl border border-white/10 bg-[#0B021C]/70">
          <div className="border-b border-white/10 p-4 font-bold text-[#FF4854]">
            공지 목록 · {total.toLocaleString()}개
          </div>
          {noticesQuery.isLoading && <State>목록을 불러오는 중...</State>}
          {noticesQuery.error && <State error>{noticesQuery.error.message}</State>}
          <div className="max-h-[70vh] overflow-y-auto p-3">
            {notices.map(notice => (
              <button
                key={notice.id}
                type="button"
                onClick={() => setSelectedNoticeId(notice.id)}
                className={`mb-2 w-full rounded-lg border p-3 text-left transition ${selectedNoticeId === notice.id ? 'border-[#FF4854] bg-[#2A0B15]' : 'border-white/10 bg-[#10050F]/60 hover:bg-[#1A0B15]'}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <strong className="line-clamp-2">
                    {notice.is_pinned && <span className="mr-1 text-[#FFB155]">[고정]</span>}
                    {notice.title}
                  </strong>
                  <StatusBadge status={notice.status} />
                </div>
                <div className="mt-2 text-caption text-gray-500">
                  {notice.published_at
                    ? `공개 ${new Date(notice.published_at).toLocaleString('ko-KR')}`
                    : `수정 ${new Date(notice.updated_at).toLocaleString('ko-KR')}`}
                </div>
              </button>
            ))}
            {!noticesQuery.isLoading && notices.length === 0 && (
              <State>표시할 공지가 없습니다.</State>
            )}
          </div>
          {total > 0 && (
            <div className="flex items-center justify-between border-t border-white/10 p-3 text-label">
              <button
                type="button"
                disabled={offset === 0}
                onClick={() => setOffset(value => Math.max(0, value - PAGE_SIZE))}
                className="flex h-8 w-8 items-center justify-center rounded bg-white/10 disabled:opacity-30"
              >
                <ChevronLeft size={17} />
              </button>
              <span>
                {Math.floor(offset / PAGE_SIZE) + 1} / {Math.max(1, Math.ceil(total / PAGE_SIZE))}
              </span>
              <button
                type="button"
                disabled={offset + PAGE_SIZE >= total}
                onClick={() => setOffset(value => value + PAGE_SIZE)}
                className="flex h-8 w-8 items-center justify-center rounded bg-white/10 disabled:opacity-30"
              >
                <ChevronRight size={17} />
              </button>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-white/10 bg-[#0B021C]/70 p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-label text-gray-400">
                {selectedNoticeId ? '공지 상세·수정' : '새 공지 작성'}
              </p>
              <h2 className="mt-1 text-section-title font-bold text-[#FF4854]">
                {selectedNoticeId ? noticeQuery.data?.title || '불러오는 중...' : '공지사항 생성'}
              </h2>
            </div>
            {selectedNoticeId && (
              <button
                type="button"
                onClick={remove}
                disabled={actions.isDeleting}
                className="flex h-10 items-center gap-2 rounded-lg bg-red-600 px-4 font-bold hover:bg-red-500 disabled:opacity-50"
              >
                <Trash2 size={16} /> 삭제
              </button>
            )}
          </div>
          {noticeQuery.isLoading && <State>공지 상세를 불러오는 중...</State>}
          {noticeQuery.error && <State error>{noticeQuery.error.message}</State>}
          {(!selectedNoticeId || noticeQuery.data) && (
            <NoticeForm form={form} setForm={setForm} onSubmit={save} isSaving={actions.isSaving} />
          )}
        </section>
      </div>
    </div>
  );
}

function NoticeForm({ form, setForm, onSubmit, isSaving }) {
  const change = (key, value) => setForm(current => ({ ...current, [key]: value }));
  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-5">
      <label className="block">
        <span className="text-label text-gray-300">제목</span>
        <input
          value={form.title}
          onChange={event => change('title', event.target.value)}
          required
          maxLength="200"
          className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-[#1A0B15] px-3 outline-none focus:border-[#FF4854]"
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-3">
        <label>
          <span className="text-label text-gray-300">상태</span>
          <select
            value={form.status}
            onChange={event => change('status', event.target.value)}
            className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-[#1A0B15] px-3"
          >
            <option value="draft">초안</option>
            <option value="published">게시</option>
            <option value="hidden">숨김</option>
          </select>
        </label>
        <label>
          <span className="text-label text-gray-300">본문 형식</span>
          <select
            value={form.body_format}
            onChange={event => change('body_format', event.target.value)}
            className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-[#1A0B15] px-3"
          >
            <option value="plain">Plain text</option>
            <option value="markdown">Markdown</option>
            <option value="rich_text">Rich text</option>
          </select>
        </label>
        <label>
          <span className="text-label text-gray-300">공개 시각</span>
          <input
            type="datetime-local"
            value={form.published_at}
            onChange={event => change('published_at', event.target.value)}
            className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-[#1A0B15] px-3"
          />
        </label>
      </div>
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={form.is_pinned}
          onChange={event => change('is_pinned', event.target.checked)}
          className="h-5 w-5 accent-[#FF4854]"
        />{' '}
        상단 고정
      </label>
      <label className="block">
        <span className="text-label text-gray-300">본문</span>
        <textarea
          value={form.body}
          onChange={event => change('body', event.target.value)}
          required
          className="mt-2 h-[430px] w-full rounded-xl border border-white/10 bg-[#1A0B15] p-4 outline-none focus:border-[#FF4854]"
        />
      </label>
      <button
        type="submit"
        disabled={isSaving}
        className="h-12 w-full rounded-xl bg-[#FF4854] font-bold hover:bg-[#ff3242] disabled:opacity-50"
      >
        {isSaving ? '저장 중...' : '공지 저장'}
      </button>
    </form>
  );
}

function StatusBadge({ status }) {
  const style =
    status === 'published'
      ? 'bg-emerald-500/15 text-emerald-300'
      : status === 'hidden'
        ? 'bg-gray-500/15 text-gray-300'
        : 'bg-amber-500/15 text-amber-300';
  return (
    <span className={`shrink-0 rounded-full px-2 py-1 text-caption font-bold ${style}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
function State({ children, error }) {
  return (
    <div
      className={`m-4 rounded-lg border p-5 text-center ${error ? 'border-red-400/30 text-red-300' : 'border-white/10 text-gray-400'}`}
    >
      {children}
    </div>
  );
}
