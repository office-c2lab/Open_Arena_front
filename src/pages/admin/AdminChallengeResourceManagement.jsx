import { useEffect, useState } from 'react';
import { Plus, Save, Trash2, X } from 'lucide-react';
import { appToast } from '@/components/Toast/appToast';
import {
  useAdminCategories,
  useAdminChallengeResourceActions,
  useAdminChallengeSetting,
  useAdminEndpoints,
} from '@/hooks/useAdminChallengeResources';
import { useLeaderboardSetting } from '@/hooks/useLeaderboardSetting';

const categoryInitial = { name: '', slug: '', sort_order: 0, is_active: true };
const endpointInitial = {
  name: '',
  model_alias: '',
  provider_options: '{}',
  timeout_seconds: 60,
  max_output_tokens: 4096,
  is_active: true,
};

export function CategoryManagement() {
  const { data, isLoading, error } = useAdminCategories();
  const actions = useAdminChallengeResourceActions();
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(categoryInitial);
  const items = data?.items ?? [];

  const reset = () => {
    setEditingId(null);
    setForm(categoryInitial);
  };

  const save = async event => {
    event.preventDefault();
    const payload = { ...form, sort_order: Number(form.sort_order) };
    try {
      if (editingId) await actions.updateCategory({ categoryId: editingId, payload });
      else await actions.createCategory(payload);
      appToast.success(editingId ? '카테고리를 수정했습니다.' : '카테고리를 생성했습니다.');
      reset();
    } catch (caughtError) {
      appToast.error(caughtError.message);
    }
  };

  const remove = async category => {
    if (!window.confirm(`${category.name} 카테고리를 삭제할까요?`)) return;
    try {
      await actions.deleteCategory(category.id);
      appToast.success('카테고리를 삭제했습니다.');
      if (editingId === category.id) reset();
    } catch (caughtError) {
      appToast.error(caughtError.message);
    }
  };

  return (
    <ResourceLayout title="카테고리 관리" description="문제 분류와 노출 순서를 관리합니다.">
      <ResourceForm onSubmit={save}>
        <Field
          label="이름"
          value={form.name}
          onChange={value => setForm(current => ({ ...current, name: value }))}
          required
        />
        <Field
          label="Slug"
          value={form.slug}
          onChange={value => setForm(current => ({ ...current, slug: value }))}
          placeholder="security-basics"
          required
        />
        <Field
          label="정렬 순서"
          type="number"
          min="0"
          value={form.sort_order}
          onChange={value => setForm(current => ({ ...current, sort_order: value }))}
          required
        />
        <CheckField
          label="활성"
          checked={form.is_active}
          onChange={checked => setForm(current => ({ ...current, is_active: checked }))}
        />
        <FormButtons editing={Boolean(editingId)} disabled={actions.isSaving} onCancel={reset} />
      </ResourceForm>
      <ResourceState isLoading={isLoading} error={error} empty={!items.length} />
      <div className="grid gap-3 md:grid-cols-2">
        {items.map(category => (
          <ResourceCard
            key={category.id}
            title={category.name}
            subtitle={category.slug}
            active={category.is_active}
          >
            <span>정렬 {category.sort_order}</span>
            <CardActions
              onEdit={() => {
                setEditingId(category.id);
                setForm({
                  name: category.name,
                  slug: category.slug,
                  sort_order: category.sort_order,
                  is_active: category.is_active,
                });
              }}
              onDelete={() => remove(category)}
            />
          </ResourceCard>
        ))}
      </div>
    </ResourceLayout>
  );
}

export function EndpointManagement({ kind }) {
  const label = kind === 'chat' ? 'Chat' : 'Judge';
  const { data, isLoading, error } = useAdminEndpoints(kind);
  const actions = useAdminChallengeResourceActions();
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(endpointInitial);
  const items = data?.items ?? [];

  useEffect(() => {
    setEditingId(null);
    setForm(endpointInitial);
  }, [kind]);

  const reset = () => {
    setEditingId(null);
    setForm(endpointInitial);
  };

  const save = async event => {
    event.preventDefault();
    let providerOptions;
    try {
      providerOptions = JSON.parse(form.provider_options || '{}');
    } catch {
      appToast.error('Provider options는 올바른 JSON 객체여야 합니다.');
      return;
    }
    if (!providerOptions || Array.isArray(providerOptions) || typeof providerOptions !== 'object') {
      appToast.error('Provider options는 JSON 객체여야 합니다.');
      return;
    }

    const payload = {
      name: form.name,
      model_alias: form.model_alias,
      provider_options: providerOptions,
      timeout_seconds: Number(form.timeout_seconds),
      max_output_tokens: Number(form.max_output_tokens),
      is_active: form.is_active,
    };
    try {
      if (editingId) await actions.updateEndpoint({ kind, endpointId: editingId, payload });
      else await actions.createEndpoint({ kind, payload });
      appToast.success(`${label} 엔드포인트를 ${editingId ? '수정' : '생성'}했습니다.`);
      reset();
    } catch (caughtError) {
      appToast.error(caughtError.message);
    }
  };

  const remove = async endpoint => {
    if (!window.confirm(`${endpoint.name} 엔드포인트를 삭제할까요?`)) return;
    try {
      await actions.deleteEndpoint({ kind, endpointId: endpoint.id });
      appToast.success(`${label} 엔드포인트를 삭제했습니다.`);
      if (editingId === endpoint.id) reset();
    } catch (caughtError) {
      appToast.error(caughtError.message);
    }
  };

  return (
    <ResourceLayout
      title={`${label} 엔드포인트 관리`}
      description="모델 별칭과 실행 제한을 관리합니다."
    >
      <ResourceForm onSubmit={save}>
        <Field
          label="이름"
          value={form.name}
          onChange={value => setForm(current => ({ ...current, name: value }))}
          required
        />
        <Field
          label="모델 별칭"
          value={form.model_alias}
          onChange={value => setForm(current => ({ ...current, model_alias: value }))}
          required
        />
        <Field
          label="Timeout(초)"
          type="number"
          min="1"
          max="600"
          value={form.timeout_seconds}
          onChange={value => setForm(current => ({ ...current, timeout_seconds: value }))}
          required
        />
        <Field
          label="최대 출력 토큰"
          type="number"
          min="1"
          max="1000000"
          value={form.max_output_tokens}
          onChange={value => setForm(current => ({ ...current, max_output_tokens: value }))}
          required
        />
        <label className="md:col-span-2">
          <span className="text-label text-gray-300">Provider options (JSON)</span>
          <textarea
            value={form.provider_options}
            onChange={event =>
              setForm(current => ({ ...current, provider_options: event.target.value }))
            }
            className="mt-2 h-28 w-full rounded-lg border border-white/10 bg-[#1A0B15] p-3 font-mono text-body text-white outline-none focus:border-[#FF4854]"
          />
        </label>
        <CheckField
          label="활성"
          checked={form.is_active}
          onChange={checked => setForm(current => ({ ...current, is_active: checked }))}
        />
        <FormButtons editing={Boolean(editingId)} disabled={actions.isSaving} onCancel={reset} />
      </ResourceForm>
      <ResourceState isLoading={isLoading} error={error} empty={!items.length} />
      <div className="grid gap-3 md:grid-cols-2">
        {items.map(endpoint => (
          <ResourceCard
            key={endpoint.id}
            title={endpoint.name}
            subtitle={endpoint.model_alias}
            active={endpoint.is_active}
          >
            <span>
              {endpoint.timeout_seconds}초 · 최대 {endpoint.max_output_tokens.toLocaleString()}토큰
            </span>
            <CardActions
              onEdit={() => {
                setEditingId(endpoint.id);
                setForm({
                  name: endpoint.name,
                  model_alias: endpoint.model_alias,
                  provider_options: JSON.stringify(endpoint.provider_options ?? {}, null, 2),
                  timeout_seconds: endpoint.timeout_seconds,
                  max_output_tokens: endpoint.max_output_tokens,
                  is_active: endpoint.is_active,
                });
              }}
              onDelete={() => remove(endpoint)}
            />
          </ResourceCard>
        ))}
      </div>
    </ResourceLayout>
  );
}

export function ChallengeSetting() {
  const { data, isLoading, error } = useAdminChallengeSetting();
  const leaderboard = useLeaderboardSetting();
  const actions = useAdminChallengeResourceActions();

  const update = async enabled => {
    if (!window.confirm(`전체 챌린지를 ${enabled ? '운영' : '중지'} 상태로 변경할까요?`)) return;
    try {
      await actions.updateChallengeSetting(enabled);
      appToast.success(`챌린지를 ${enabled ? '운영' : '중지'} 상태로 변경했습니다.`);
    } catch (caughtError) {
      appToast.error(caughtError.message);
    }
  };

  const updateLeaderboard = async enabled => {
    if (!window.confirm(`순위표를 ${enabled ? '공개' : '비공개'} 상태로 변경할까요?`)) return;
    try {
      await leaderboard.toggleAsync(enabled);
      appToast.success(`순위표를 ${enabled ? '공개' : '비공개'} 상태로 변경했습니다.`);
    } catch (caughtError) {
      appToast.error(caughtError.message);
    }
  };

  return (
    <ResourceLayout
      title="챌린지 운영 설정"
      description="전체 챌린지 기능과 순위표 공개 상태를 관리합니다."
    >
      {isLoading && <State>운영 설정을 불러오는 중...</State>}
      {error && <State error>{error.message}</State>}
      {data && (
        <div className="flex flex-col gap-5 rounded-xl border border-white/10 bg-[#0B021C]/70 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-card-title font-bold">현재 상태</div>
            <div className={`mt-2 font-bold ${data.enabled ? 'text-emerald-300' : 'text-red-300'}`}>
              {data.enabled ? '운영 중' : '전체 중지'}
            </div>
          </div>
          <button
            type="button"
            disabled={actions.isSaving}
            onClick={() => update(!data.enabled)}
            className={`h-11 rounded-lg px-5 font-bold text-white transition disabled:opacity-50 ${data.enabled ? 'bg-red-600 hover:bg-red-500' : 'bg-emerald-600 hover:bg-emerald-500'}`}
          >
            {data.enabled ? '전체 중지' : '운영 재개'}
          </button>
        </div>
      )}
      {leaderboard.isLoading && <State>순위 공개 설정을 불러오는 중...</State>}
      {leaderboard.isError && <State error>순위 공개 설정을 불러오지 못했습니다.</State>}
      {!leaderboard.isLoading && !leaderboard.isError && (
        <div className="flex flex-col gap-5 rounded-xl border border-white/10 bg-[#0B021C]/70 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-card-title font-bold">순위 공개 설정</div>
            <div
              className={`mt-2 font-bold ${leaderboard.setting ? 'text-emerald-300' : 'text-red-300'}`}
            >
              {leaderboard.setting ? '공개 중' : '비공개'}
            </div>
          </div>
          <button
            type="button"
            disabled={leaderboard.isPending}
            onClick={() => updateLeaderboard(!leaderboard.setting)}
            className={`h-11 rounded-lg px-5 font-bold text-white transition disabled:opacity-50 ${leaderboard.setting ? 'bg-red-600 hover:bg-red-500' : 'bg-emerald-600 hover:bg-emerald-500'}`}
          >
            {leaderboard.setting ? '순위 비공개' : '순위 공개'}
          </button>
        </div>
      )}
    </ResourceLayout>
  );
}

function ResourceLayout({ title, description, children }) {
  return (
    <div className="w-full p-6 text-white">
      <h1 className="text-section-title font-bold text-[#FF4854]">{title}</h1>
      <p className="mt-1 text-gray-400">{description}</p>
      <div className="mt-6 space-y-6">{children}</div>
    </div>
  );
}

function ResourceForm({ onSubmit, children }) {
  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-4 rounded-xl border border-white/10 bg-[#0B021C]/70 p-5 md:grid-cols-2"
    >
      {children}
    </form>
  );
}

function Field({ label, value, onChange, ...props }) {
  return (
    <label>
      <span className="text-label text-gray-300">{label}</span>
      <input
        value={value}
        onChange={event => onChange(event.target.value)}
        className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-[#1A0B15] px-3 text-white outline-none focus:border-[#FF4854]"
        {...props}
      />
    </label>
  );
}

function CheckField({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 text-gray-200">
      <input
        type="checkbox"
        checked={checked}
        onChange={event => onChange(event.target.checked)}
        className="h-5 w-5 accent-[#FF4854]"
      />
      {label}
    </label>
  );
}

function FormButtons({ editing, disabled, onCancel }) {
  return (
    <div className="flex justify-end gap-2">
      <button
        type="button"
        onClick={onCancel}
        className="flex h-10 items-center gap-2 rounded-lg bg-white/10 px-4 font-bold text-white hover:bg-white/15"
      >
        {editing ? <X size={16} /> : <Plus size={16} />} 초기화
      </button>
      <button
        type="submit"
        disabled={disabled}
        className="flex h-10 items-center gap-2 rounded-lg bg-[#FF4854] px-4 font-bold text-white hover:bg-[#ff3242] disabled:opacity-50"
      >
        <Save size={16} /> {editing ? '수정' : '생성'}
      </button>
    </div>
  );
}

function ResourceCard({ title, subtitle, active, children }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0B021C]/70 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-white">{title}</h3>
          <p className="mt-1 break-all text-label text-gray-400">{subtitle}</p>
        </div>
        <span
          className={`rounded-full px-2 py-1 text-caption font-bold ${active ? 'bg-emerald-500/15 text-emerald-300' : 'bg-gray-500/15 text-gray-400'}`}
        >
          {active ? '활성' : '비활성'}
        </span>
      </div>
      <div className="mt-4 text-label text-gray-400">{children}</div>
    </div>
  );
}

function CardActions({ onEdit, onDelete }) {
  return (
    <div className="mt-4 flex gap-2">
      <button
        type="button"
        onClick={onEdit}
        className="h-9 rounded-lg bg-white/10 px-3 font-bold text-white hover:bg-[#FF4854]"
      >
        수정
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="flex h-9 items-center gap-1 rounded-lg bg-red-600/80 px-3 font-bold text-white hover:bg-red-500"
      >
        <Trash2 size={15} /> 삭제
      </button>
    </div>
  );
}

function ResourceState({ isLoading, error, empty }) {
  if (isLoading) return <State>목록을 불러오는 중...</State>;
  if (error) return <State error>{error.message}</State>;
  if (empty) return <State>등록된 항목이 없습니다.</State>;
  return null;
}

function State({ children, error }) {
  return (
    <div
      className={`rounded-xl border p-6 text-center ${error ? 'border-red-400/30 bg-red-950/20 text-red-300' : 'border-white/10 bg-[#0B021C]/70 text-gray-400'}`}
    >
      {children}
    </div>
  );
}
