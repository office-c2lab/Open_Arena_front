import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { appToast } from '@/components/Toast/appToast';
import { useAdminProblemActions } from '@/hooks/useAdminProblemActions';
import { useAdminProblemQuery, useAdminProblemsQuery } from '@/hooks/useAdminProblemsQuery';
import { useAdminEndpoints } from '@/hooks/useAdminChallengeResources';

const emptyJudgeForm = {
  enabled: false,
  system_prompt: '',
  max_attempts: '0',
  timeout_seconds: '60',
  judge_endpoint_ids: [],
};

export default function AdminJudgePromptEditor() {
  const [searchInput, setSearchInput] = useState('');
  const [query, setQuery] = useState('');
  const [selectedProblemId, setSelectedProblemId] = useState(null);
  const [form, setForm] = useState(emptyJudgeForm);

  const filters = useMemo(() => ({ query: query || undefined, offset: 0, limit: 100 }), [query]);
  const problemsQuery = useAdminProblemsQuery(filters);
  const problemQuery = useAdminProblemQuery(selectedProblemId);
  const judgeEndpointsQuery = useAdminEndpoints('judge');
  const actions = useAdminProblemActions();
  const problems = problemsQuery.data?.items ?? [];
  const judgeEndpoints = judgeEndpointsQuery.data?.items ?? [];

  useEffect(() => {
    const setting = problemQuery.data?.judgement_setting;
    if (!problemQuery.data) return;
    setForm(
      setting
        ? {
            enabled: true,
            system_prompt: setting.system_prompt,
            max_attempts: String(setting.max_attempts),
            timeout_seconds: String(setting.timeout_seconds),
            judge_endpoint_ids: setting.judge_endpoint_ids,
          }
        : emptyJudgeForm
    );
  }, [problemQuery.data]);

  const toggleEndpoint = endpointId => {
    setForm(current => {
      const selected = current.judge_endpoint_ids.includes(endpointId);
      if (!selected && current.judge_endpoint_ids.length >= 3) return current;
      return {
        ...current,
        judge_endpoint_ids: selected
          ? current.judge_endpoint_ids.filter(id => id !== endpointId)
          : [...current.judge_endpoint_ids, endpointId],
      };
    });
  };

  const save = async event => {
    event.preventDefault();
    if (form.enabled && form.judge_endpoint_ids.length === 0) {
      appToast.error('Judge endpoint를 하나 이상 선택해 주세요.');
      return;
    }
    try {
      await actions.updateProblem({
        id: selectedProblemId,
        payload: {
          judgement_setting: form.enabled
            ? {
                system_prompt: form.system_prompt.trim(),
                max_attempts: Number(form.max_attempts),
                timeout_seconds: Number(form.timeout_seconds),
                judge_endpoint_ids: form.judge_endpoint_ids,
              }
            : null,
        },
      });
      await problemQuery.refetch();
      appToast.success('Judge 프롬프트와 설정을 수정했습니다.');
    } catch (error) {
      appToast.error(error.message);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col gap-6 px-6 py-8 pb-40 text-white xl:flex-row xl:px-10 xl:py-10">
      <aside className="w-full shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#0B021C]/70 xl:w-[320px]">
        <div className="border-b border-white/10 p-5">
          <h1 className="text-card-title font-bold text-[#FF4854]">Judge 프롬프트 관리</h1>
          <form
            onSubmit={event => {
              event.preventDefault();
              setQuery(searchInput.trim());
            }}
            className="mt-4 flex gap-2"
          >
            <label className="relative min-w-0 flex-1">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={searchInput}
                onChange={event => setSearchInput(event.target.value)}
                placeholder="챌린지 검색"
                className="h-10 w-full rounded-lg border border-white/10 bg-[#1A0B15] pl-9 pr-3 outline-none focus:border-[#FF4854]"
              />
            </label>
            <button type="submit" className="rounded-lg bg-[#FF4854] px-3 font-bold">
              검색
            </button>
          </form>
        </div>
        <div className="max-h-[75vh] overflow-y-auto p-3">
          {problemsQuery.isLoading && <State>챌린지를 불러오는 중...</State>}
          {problemsQuery.error && <State error>{problemsQuery.error.message}</State>}
          {problems.map(problem => (
            <button
              key={problem.id}
              type="button"
              onClick={() => setSelectedProblemId(problem.id)}
              className={`mb-2 w-full rounded-lg border p-3 text-left transition ${selectedProblemId === problem.id ? 'border-[#FF4854] bg-[#FF4854]' : 'border-white/10 bg-[#10050F]/60 hover:bg-[#1A0B15]'}`}
            >
              <div className="font-bold">{problem.title}</div>
              <div className="mt-1 truncate text-label opacity-65">{problem.slug}</div>
              <div className="mt-2 text-caption opacity-60">
                {problem.judgement_setting ? 'Judge 설정됨' : 'Judge 미설정'}
              </div>
            </button>
          ))}
          {!problemsQuery.isLoading && problems.length === 0 && (
            <State>표시할 챌린지가 없습니다.</State>
          )}
        </div>
      </aside>

      <main className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#0B021C]/70 p-6">
        {!selectedProblemId && (
          <State>왼쪽에서 챌린지를 선택하면 Judge 프롬프트를 수정할 수 있습니다.</State>
        )}
        {problemQuery.isLoading && <State>챌린지 Judge 설정을 불러오는 중...</State>}
        {problemQuery.error && <State error>{problemQuery.error.message}</State>}
        {problemQuery.data && (
          <form onSubmit={save}>
            <div className="flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-label text-gray-400">{problemQuery.data.slug}</p>
                <h2 className="mt-1 text-section-title font-bold text-[#FF4854]">
                  {problemQuery.data.title}
                </h2>
              </div>
              <label className="flex items-center gap-3 rounded-lg bg-[#1A0B15] px-4 py-3">
                <input
                  type="checkbox"
                  checked={form.enabled}
                  onChange={event =>
                    setForm(current => ({ ...current, enabled: event.target.checked }))
                  }
                  className="h-5 w-5 accent-[#FF4854]"
                />{' '}
                Judge 사용
              </label>
            </div>

            {form.enabled ? (
              <div className="mt-6 space-y-5">
                <label className="block">
                  <span className="text-label text-gray-300">Judge 시스템 프롬프트</span>
                  <textarea
                    value={form.system_prompt}
                    onChange={event =>
                      setForm(current => ({ ...current, system_prompt: event.target.value }))
                    }
                    required
                    className="mt-2 h-[420px] w-full rounded-xl border border-white/10 bg-[#1A0B15] p-4 font-mono text-body outline-none focus:border-[#FF4854]"
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <NumberField
                    label="최대 재시도"
                    min="0"
                    max="10"
                    value={form.max_attempts}
                    onChange={value => setForm(current => ({ ...current, max_attempts: value }))}
                  />
                  <NumberField
                    label="Timeout(초)"
                    min="1"
                    max="600"
                    value={form.timeout_seconds}
                    onChange={value => setForm(current => ({ ...current, timeout_seconds: value }))}
                  />
                </div>
                <div>
                  <div className="text-label text-gray-300">Judge endpoint (1~3개)</div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {judgeEndpoints.map(endpoint => (
                      <label
                        key={endpoint.id}
                        className="flex items-center gap-3 rounded-lg border border-white/10 bg-[#1A0B15] p-3"
                      >
                        <input
                          type="checkbox"
                          checked={form.judge_endpoint_ids.includes(endpoint.id)}
                          onChange={() => toggleEndpoint(endpoint.id)}
                          className="h-5 w-5 accent-[#FF4854]"
                        />
                        <span>
                          {endpoint.name} · {endpoint.model_alias}
                        </span>
                      </label>
                    ))}
                  </div>
                  {judgeEndpointsQuery.error && (
                    <p className="mt-2 text-red-300">{judgeEndpointsQuery.error.message}</p>
                  )}
                </div>
              </div>
            ) : (
              <State>Judge 사용을 켜면 프롬프트와 모델 설정을 입력할 수 있습니다.</State>
            )}

            <button
              type="submit"
              disabled={actions.isUpdating}
              className="mt-6 h-12 w-full rounded-xl bg-[#FF4854] font-bold hover:bg-[#ff3242] disabled:opacity-50"
            >
              {actions.isUpdating ? '저장 중...' : 'Judge 설정 저장'}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}

function NumberField({ label, value, onChange, ...props }) {
  return (
    <label>
      <span className="text-label text-gray-300">{label}</span>
      <input
        type="number"
        value={value}
        onChange={event => onChange(event.target.value)}
        required
        className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-[#1A0B15] px-3 outline-none focus:border-[#FF4854]"
        {...props}
      />
    </label>
  );
}
function State({ children, error }) {
  return (
    <div
      className={`rounded-lg border p-5 text-center ${error ? 'border-red-400/30 text-red-300' : 'border-white/10 text-gray-400'}`}
    >
      {children}
    </div>
  );
}
