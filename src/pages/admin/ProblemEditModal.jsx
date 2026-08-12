import { useEffect, useState } from 'react';
import { Trash2, X } from 'lucide-react';
import { appToast } from '@/components/Toast/appToast';
import { useAdminProblemActions } from '@/hooks/useAdminProblemActions';
import { useAdminToggleProblemActive } from '@/hooks/useAdminToggleProblemActive';
import {
  useAdminChallengeResourceActions,
  useProtectedTerms,
} from '@/hooks/useAdminChallengeResources';
import { useAdminProblemQuery } from '@/hooks/useAdminProblemsQuery';
import AdminProblemForm, { formToProblemPayload, problemToForm } from './AdminProblemForm';

export default function ProblemEditModal({ problemId, onClose }) {
  const problemQuery = useAdminProblemQuery(problemId);
  const termsQuery = useProtectedTerms(problemId);
  const problemActions = useAdminProblemActions();
  const stateMutation = useAdminToggleProblemActive();
  const resourceActions = useAdminChallengeResourceActions();
  const [form, setForm] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [termForm, setTermForm] = useState({ label: '', value: '' });

  useEffect(() => {
    if (problemQuery.data) setForm(problemToForm(problemQuery.data));
  }, [problemQuery.data]);

  const update = async event => {
    event.preventDefault();
    if (form.judge_enabled && form.judge_endpoint_ids.length === 0) {
      appToast.error('Judge endpoint를 하나 이상 선택해 주세요.');
      return;
    }
    try {
      await problemActions.updateProblem({ id: problemId, payload: formToProblemPayload(form) });
      appToast.success('챌린지를 수정했습니다.');
      onClose();
    } catch (error) {
      appToast.error(error.message);
    }
  };

  const remove = async () => {
    if (!deleteConfirmation.trim()) {
      appToast.error('삭제 확인 문구를 입력해 주세요.');
      return;
    }
    if (!window.confirm('챌린지와 관련 통계가 함께 제외됩니다. 완전히 삭제할까요?')) return;
    try {
      await problemActions.deleteProblem({
        id: problemId,
        confirmation: deleteConfirmation.trim(),
      });
      appToast.success('챌린지를 삭제했습니다.');
      onClose();
    } catch (error) {
      appToast.error(error.message);
    }
  };

  const changeState = async () => {
    const isActive = !problemQuery.data.is_active;
    if (!window.confirm(`챌린지를 ${isActive ? '공개' : '비공개'} 상태로 변경할까요?`)) return;
    try {
      await stateMutation.mutateAsync({ problemId, isActive });
      await problemQuery.refetch();
      appToast.success(`챌린지를 ${isActive ? '공개' : '비공개'} 상태로 변경했습니다.`);
    } catch (error) {
      appToast.error(error.message);
    }
  };

  const addTerm = async event => {
    event.preventDefault();
    if (!termForm.value.trim()) return;
    try {
      await resourceActions.createProtectedTerm({
        problemId,
        value: termForm.value.trim(),
        label: termForm.label.trim(),
      });
      setTermForm({ label: '', value: '' });
      appToast.success('보호 문자열을 추가했습니다.');
    } catch (error) {
      appToast.error(error.message);
    }
  };

  const removeTerm = async term => {
    if (!window.confirm(`${term.label || '보호 문자열'} 항목을 삭제할까요?`)) return;
    try {
      await resourceActions.deleteProtectedTerm({ problemId, termId: term.id });
      appToast.success('보호 문자열을 삭제했습니다.');
    } catch (error) {
      appToast.error(error.message);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 p-5"
      onMouseDown={event => event.target === event.currentTarget && onClose()}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label="챌린지 상세 수정"
        className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-white/10 bg-[#10050F] text-white shadow-2xl"
      >
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-[#10050F] px-6 py-5">
          <div>
            <p className="text-label text-gray-400">챌린지 상세</p>
            <h2 className="mt-1 text-section-title font-bold text-[#FF4854]">
              {problemQuery.data?.title ?? '불러오는 중...'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-white/10"
            aria-label="닫기"
          >
            <X size={22} />
          </button>
        </header>

        {problemQuery.isLoading && <State>챌린지 상세를 불러오는 중...</State>}
        {problemQuery.error && <State error>{problemQuery.error.message}</State>}
        {problemQuery.data && (
          <section className="mx-6 mt-6 flex flex-col gap-4 rounded-xl border border-white/10 bg-[#0B021C]/70 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-bold text-white">챌린지 공개 상태</h3>
              <p className="mt-1 text-label text-gray-400">
                현재 회원 화면에서 {problemQuery.data.is_active ? '공개 중' : '숨김'} 상태입니다.
              </p>
            </div>
            <button
              type="button"
              onClick={changeState}
              disabled={stateMutation.isPending}
              className={`h-11 rounded-lg px-5 font-bold text-white transition disabled:opacity-50 ${problemQuery.data.is_active ? 'bg-gray-600 hover:bg-gray-500' : 'bg-emerald-600 hover:bg-emerald-500'}`}
            >
              {problemQuery.data.is_active ? '비공개로 전환' : '공개로 전환'}
            </button>
          </section>
        )}
        {form && (
          <form onSubmit={update} className="p-6">
            <AdminProblemForm form={form} setForm={setForm} />
            <button
              type="submit"
              disabled={problemActions.isUpdating}
              className="mt-8 h-12 w-full rounded-xl bg-[#FF4854] font-bold hover:bg-[#ff3242] disabled:opacity-50"
            >
              {problemActions.isUpdating ? '저장 중...' : '챌린지 수정 저장'}
            </button>
          </form>
        )}

        <section className="mx-6 mb-6 rounded-xl border border-white/10 bg-[#0B021C]/70 p-5">
          <h3 className="text-card-title font-bold text-[#FF4854]">보호 문자열</h3>
          <p className="mt-1 text-label text-gray-400">
            등록 후 원문은 관리자에게도 다시 표시되지 않습니다.
          </p>
          <form onSubmit={addTerm} className="mt-4 grid gap-3 md:grid-cols-[1fr_2fr_auto]">
            <input
              value={termForm.label}
              onChange={event =>
                setTermForm(current => ({ ...current, label: event.target.value }))
              }
              placeholder="라벨(선택)"
              className="h-11 rounded-lg border border-white/10 bg-[#1A0B15] px-3 outline-none focus:border-[#FF4854]"
            />
            <input
              value={termForm.value}
              onChange={event =>
                setTermForm(current => ({ ...current, value: event.target.value }))
              }
              placeholder="보호할 문자열"
              required
              className="h-11 rounded-lg border border-white/10 bg-[#1A0B15] px-3 outline-none focus:border-[#FF4854]"
            />
            <button
              type="submit"
              disabled={resourceActions.isSaving}
              className="h-11 rounded-lg bg-[#FF4854] px-4 font-bold disabled:opacity-50"
            >
              추가
            </button>
          </form>
          {termsQuery.isLoading && <p className="mt-4 text-gray-400">목록을 불러오는 중...</p>}
          {termsQuery.error && <p className="mt-4 text-red-300">{termsQuery.error.message}</p>}
          <div className="mt-4 space-y-2">
            {(termsQuery.data?.items ?? []).map(term => (
              <div
                key={term.id}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-[#1A0B15] p-3"
              >
                <div>
                  <div className="font-bold">{term.label || '라벨 없음'}</div>
                  <div className="mt-1 text-label text-gray-500">
                    원문 비공개 · {new Date(term.created_at).toLocaleString('ko-KR')}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeTerm(term)}
                  className="flex h-9 items-center gap-1 rounded-lg bg-red-600 px-3 font-bold"
                >
                  <Trash2 size={15} /> 삭제
                </button>
              </div>
            ))}
          </div>
          {!termsQuery.isLoading && (termsQuery.data?.items ?? []).length === 0 && (
            <p className="mt-4 text-gray-500">등록된 보호 문자열이 없습니다.</p>
          )}
        </section>

        <section className="mx-6 mb-8 rounded-xl border border-red-400/30 bg-red-950/20 p-5">
          <h3 className="font-bold text-red-300">챌린지 완전 삭제</h3>
          <p className="mt-1 text-label text-gray-400">
            통계와 순위에서도 제외됩니다. 백엔드에서 요구하는 삭제 확인 문구를 입력해 주세요.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              value={deleteConfirmation}
              onChange={event => setDeleteConfirmation(event.target.value)}
              placeholder="삭제 확인 문구"
              className="h-11 flex-1 rounded-lg border border-red-400/30 bg-[#1A0B15] px-3 outline-none focus:border-red-400"
            />
            <button
              type="button"
              onClick={remove}
              disabled={problemActions.isDeleting}
              className="flex h-11 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 font-bold hover:bg-red-500 disabled:opacity-50"
            >
              <Trash2 size={17} /> 완전 삭제
            </button>
          </div>
        </section>
      </section>
    </div>
  );
}

function State({ children, error }) {
  return (
    <div
      className={`m-6 rounded-xl border p-8 text-center ${error ? 'border-red-400/30 text-red-300' : 'border-white/10 text-gray-400'}`}
    >
      {children}
    </div>
  );
}
