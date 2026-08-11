import { useAdminCategories, useAdminEndpoints } from '@/hooks/useAdminChallengeResources';

export const emptyProblemForm = {
  category_id: '',
  chat_endpoint_id: '',
  title: '',
  sub_title: '',
  slug: '',
  description: '',
  sub_description: '',
  goal: '',
  success_criteria: '',
  failure_criteria: '',
  system_prompt: '',
  temperature: '0',
  difficulty: 'normal',
  max_score: '100',
  is_tutorial: false,
  judge_enabled: false,
  judge_system_prompt: '',
  judge_max_attempts: '0',
  judge_timeout_seconds: '60',
  judge_endpoint_ids: [],
};

export const problemToForm = problem => ({
  ...emptyProblemForm,
  category_id: problem.category_id ?? '',
  chat_endpoint_id: problem.chat_endpoint_id ?? '',
  title: problem.title ?? '',
  sub_title: problem.sub_title ?? '',
  slug: problem.slug ?? '',
  description: problem.description ?? '',
  sub_description: problem.sub_description ?? '',
  goal: problem.goal ?? '',
  success_criteria: problem.success_criteria ?? '',
  failure_criteria: problem.failure_criteria ?? '',
  system_prompt: problem.system_prompt ?? '',
  temperature: String(problem.temperature ?? 0),
  difficulty: problem.difficulty ?? 'normal',
  max_score: String(problem.max_score ?? 100),
  is_tutorial: Boolean(problem.is_tutorial),
  judge_enabled: Boolean(problem.judgement_setting),
  judge_system_prompt: problem.judgement_setting?.system_prompt ?? '',
  judge_max_attempts: String(problem.judgement_setting?.max_attempts ?? 0),
  judge_timeout_seconds: String(problem.judgement_setting?.timeout_seconds ?? 60),
  judge_endpoint_ids: problem.judgement_setting?.judge_endpoint_ids ?? [],
});

const optional = value => (String(value ?? '').trim() ? value : null);

export const formToProblemPayload = form => ({
  category_id: optional(form.category_id),
  chat_endpoint_id: form.chat_endpoint_id,
  title: form.title.trim(),
  sub_title: optional(form.sub_title),
  slug: form.slug.trim(),
  description: form.description.trim(),
  sub_description: optional(form.sub_description),
  goal: optional(form.goal),
  success_criteria: optional(form.success_criteria),
  failure_criteria: optional(form.failure_criteria),
  system_prompt: form.system_prompt.trim(),
  temperature: Number(form.temperature),
  difficulty: form.difficulty,
  max_score: Number(form.max_score),
  is_tutorial: Boolean(form.is_tutorial),
  judgement_setting: form.judge_enabled
    ? {
        system_prompt: form.judge_system_prompt.trim(),
        max_attempts: Number(form.judge_max_attempts),
        timeout_seconds: Number(form.judge_timeout_seconds),
        judge_endpoint_ids: form.judge_endpoint_ids,
      }
    : null,
});

export default function AdminProblemForm({ form, setForm }) {
  const categoriesQuery = useAdminCategories();
  const chatEndpointsQuery = useAdminEndpoints('chat');
  const judgeEndpointsQuery = useAdminEndpoints('judge');
  const categories = categoriesQuery.data?.items ?? [];
  const chatEndpoints = chatEndpointsQuery.data?.items ?? [];
  const judgeEndpoints = judgeEndpointsQuery.data?.items ?? [];

  const change = (key, value) => setForm(current => ({ ...current, [key]: value }));
  const toggleJudgeEndpoint = endpointId => {
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

  return (
    <div className="space-y-8">
      <Section title="기본 정보">
        <Input
          label="문제 제목"
          value={form.title}
          onChange={value => change('title', value)}
          required
        />
        <Input
          label="Slug"
          value={form.slug}
          onChange={value => change('slug', value)}
          placeholder="prompt-injection-basic"
          required
        />
        <Input
          label="부 제목"
          value={form.sub_title}
          onChange={value => change('sub_title', value)}
        />
        <Select
          label="카테고리"
          value={form.category_id}
          onChange={value => change('category_id', value)}
        >
          <option value="">카테고리 없음</option>
          {categories.map(item => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </Select>
        <Select
          label="Chat endpoint"
          value={form.chat_endpoint_id}
          onChange={value => change('chat_endpoint_id', value)}
          required
        >
          <option value="">선택</option>
          {chatEndpoints
            .filter(item => item.is_active || item.id === form.chat_endpoint_id)
            .map(item => (
              <option key={item.id} value={item.id}>
                {item.name} · {item.model_alias}
              </option>
            ))}
        </Select>
        <Select
          label="난이도"
          value={form.difficulty}
          onChange={value => change('difficulty', value)}
        >
          <option value="easy">쉬움</option>
          <option value="normal">보통</option>
          <option value="hard">어려움</option>
        </Select>
        <Input
          label="최대 점수"
          type="number"
          min="1"
          max="1000000"
          value={form.max_score}
          onChange={value => change('max_score', value)}
          required
        />
        <Input
          label="Temperature"
          type="number"
          min="0"
          max="2"
          step="0.1"
          value={form.temperature}
          onChange={value => change('temperature', value)}
          required
        />
        <Checkbox
          label="튜토리얼 문제"
          checked={form.is_tutorial}
          onChange={value => change('is_tutorial', value)}
        />
      </Section>

      <Section title="문제 콘텐츠">
        <TextArea
          label="문제 설명"
          value={form.description}
          onChange={value => change('description', value)}
          required
        />
        <TextArea
          label="부 설명"
          value={form.sub_description}
          onChange={value => change('sub_description', value)}
        />
        <TextArea label="목표" value={form.goal} onChange={value => change('goal', value)} />
        <TextArea
          label="성공 기준"
          value={form.success_criteria}
          onChange={value => change('success_criteria', value)}
        />
        <TextArea
          label="실패 기준"
          value={form.failure_criteria}
          onChange={value => change('failure_criteria', value)}
        />
        <TextArea
          label="Chat 시스템 프롬프트"
          value={form.system_prompt}
          onChange={value => change('system_prompt', value)}
          required
          large
        />
      </Section>

      <Section title="Judge 설정">
        <Checkbox
          label="Judge 사용"
          checked={form.judge_enabled}
          onChange={value => change('judge_enabled', value)}
        />
        {form.judge_enabled && (
          <>
            <TextArea
              label="Judge 시스템 프롬프트"
              value={form.judge_system_prompt}
              onChange={value => change('judge_system_prompt', value)}
              required
              large
            />
            <Input
              label="최대 재시도"
              type="number"
              min="0"
              max="10"
              value={form.judge_max_attempts}
              onChange={value => change('judge_max_attempts', value)}
              required
            />
            <Input
              label="Judge Timeout(초)"
              type="number"
              min="1"
              max="600"
              value={form.judge_timeout_seconds}
              onChange={value => change('judge_timeout_seconds', value)}
              required
            />
            <div className="md:col-span-2">
              <div className="text-label text-gray-300">Judge endpoint (1~3개)</div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {judgeEndpoints.map(endpoint => (
                  <label
                    key={endpoint.id}
                    className="flex items-center gap-3 rounded-lg border border-white/10 bg-[#1A0B15] p-3"
                  >
                    <input
                      type="checkbox"
                      checked={form.judge_endpoint_ids.includes(endpoint.id)}
                      onChange={() => toggleJudgeEndpoint(endpoint.id)}
                      className="h-5 w-5 accent-[#FF4854]"
                    />
                    <span>
                      {endpoint.name} · {endpoint.model_alias}
                    </span>
                  </label>
                ))}
              </div>
              {judgeEndpoints.length === 0 && (
                <p className="mt-2 text-label text-amber-300">
                  활성 Judge endpoint를 먼저 등록해 주세요.
                </p>
              )}
            </div>
          </>
        )}
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section>
      <h3 className="mb-4 text-card-title font-bold text-[#FF4854]">{title}</h3>
      <div className="grid gap-5 md:grid-cols-2">{children}</div>
    </section>
  );
}

function Input({ label, value, onChange, ...props }) {
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

function Select({ label, value, onChange, children, ...props }) {
  return (
    <label>
      <span className="text-label text-gray-300">{label}</span>
      <select
        value={value}
        onChange={event => onChange(event.target.value)}
        className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-[#1A0B15] px-3 text-white outline-none focus:border-[#FF4854]"
        {...props}
      >
        {children}
      </select>
    </label>
  );
}

function TextArea({ label, value, onChange, large, ...props }) {
  return (
    <label className="md:col-span-2">
      <span className="text-label text-gray-300">{label}</span>
      <textarea
        value={value}
        onChange={event => onChange(event.target.value)}
        className={`mt-2 w-full rounded-lg border border-white/10 bg-[#1A0B15] p-3 text-white outline-none focus:border-[#FF4854] ${large ? 'h-48' : 'h-28'}`}
        {...props}
      />
    </label>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={event => onChange(event.target.checked)}
        className="h-5 w-5 accent-[#FF4854]"
      />
      <span>{label}</span>
    </label>
  );
}
