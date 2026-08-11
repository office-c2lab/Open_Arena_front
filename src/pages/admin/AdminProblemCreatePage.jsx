import { useState } from 'react';
import { appToast } from '@/components/Toast/appToast';
import { useCreateProblem } from '@/hooks/useCreateProblem';
import AdminProblemForm, { emptyProblemForm, formToProblemPayload } from './AdminProblemForm';

export default function AdminProblemCreatePage() {
  const createMutation = useCreateProblem();
  const [form, setForm] = useState(emptyProblemForm);

  const submit = async event => {
    event.preventDefault();
    const payload = formToProblemPayload(form);
    if (form.judge_enabled && form.judge_endpoint_ids.length === 0) {
      appToast.error('Judge endpoint를 하나 이상 선택해 주세요.');
      return;
    }

    try {
      await createMutation.mutateAsync(payload);
      appToast.success('문제를 생성했습니다.');
      setForm(emptyProblemForm);
    } catch (error) {
      appToast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="mx-auto w-full max-w-5xl rounded-2xl border border-white/10 bg-[#0B021C]/70 p-8 text-white shadow-xl"
    >
      <h1 className="mb-8 text-section-title font-bold text-[#FF4854]">문제 생성</h1>
      <AdminProblemForm form={form} setForm={setForm} />
      <button
        type="submit"
        disabled={createMutation.isPending}
        className="mt-8 h-12 w-full rounded-xl bg-[#FF4854] font-bold text-white transition hover:bg-[#ff3242] disabled:opacity-50"
      >
        {createMutation.isPending ? '생성 중...' : '문제 생성'}
      </button>
    </form>
  );
}
