import { useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { completePasswordReset } from '@/api/auth';
import { appToast } from '@/components/Toast/appToast';
import PasswordPolicyChecklist from '@/components/Auth/PasswordPolicyChecklist';
import { isPasswordValid, PASSWORD_POLICY_MESSAGE, sanitizePassword } from '@/utils/passwordPolicy';

export default function PasswordResetComplete() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const hashParams = useMemo(
    () => new URLSearchParams(window.location.hash.replace(/^#\/?/, '')),
    []
  );
  const resetTokenId = useMemo(
    () =>
      searchParams.get('reset_token_id') ||
      searchParams.get('token_id') ||
      hashParams.get('reset_token_id') ||
      hashParams.get('token_id'),
    [hashParams, searchParams]
  );
  const resetToken = useMemo(
    () =>
      searchParams.get('reset_token') ||
      searchParams.get('token') ||
      hashParams.get('reset_token') ||
      hashParams.get('token'),
    [hashParams, searchParams]
  );
  const hasValidLink = Boolean(resetTokenId && resetToken);

  const mutation = useMutation({
    mutationFn: completePasswordReset,
    onSuccess: data => {
      appToast.success(data.message);
      navigate('/login', { replace: true });
    },
    onError: error => appToast.error(error.message),
  });

  const handleSubmit = event => {
    event.preventDefault();

    if (!isPasswordValid(newPassword)) {
      appToast.info(PASSWORD_POLICY_MESSAGE);
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      appToast.info('비밀번호가 일치하지 않습니다.');
      return;
    }

    mutation.mutate({
      reset_token_id: resetTokenId,
      reset_token: resetToken,
      new_password: newPassword,
      new_password_confirm: newPasswordConfirm,
    });
  };

  return (
    <div className="flex justify-center bg-white px-[10px] py-14">
      <div className="flex w-full max-w-[675px] flex-col px-2">
        <h1 className="text-card-title font-medium text-black">비밀번호 재설정</h1>
        <h2 className="mb-10 mt-8 text-section-title font-medium text-black">
          새 비밀번호를
          <br /> 입력해 주세요.
        </h2>

        {!hasValidLink ? (
          <div className="rounded-2xl bg-[#FFF0F2] p-5 text-body-lg font-medium text-[#D92D3A]">
            재설정 링크가 올바르지 않거나 필요한 토큰이 없습니다.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-7">
            <label className="flex flex-col gap-4 text-card-title font-medium text-[#6B6B6B]">
              새 비밀번호
              <input
                type="password"
                minLength={8}
                maxLength={128}
                autoComplete="new-password"
                value={newPassword}
                onChange={event => setNewPassword(sanitizePassword(event.target.value))}
                className="border-b border-[#D9DADB] bg-transparent pb-2 font-strong outline-none focus:border-[#6B6B6B]"
              />
              <PasswordPolicyChecklist password={newPassword} />
            </label>
            <label className="flex flex-col gap-4 text-card-title font-medium text-[#6B6B6B]">
              새 비밀번호 확인
              <input
                type="password"
                minLength={8}
                maxLength={128}
                autoComplete="new-password"
                value={newPasswordConfirm}
                onChange={event => setNewPasswordConfirm(sanitizePassword(event.target.value))}
                className="border-b border-[#D9DADB] bg-transparent pb-2 font-strong outline-none focus:border-[#6B6B6B]"
              />
              {newPasswordConfirm ? (
                <span
                  className={`text-label font-medium ${
                    newPassword === newPasswordConfirm ? 'text-[#169B62]' : 'text-[#D92D3A]'
                  }`}
                >
                  {newPassword === newPasswordConfirm
                    ? '비밀번호가 일치합니다.'
                    : '비밀번호가 일치하지 않습니다.'}
                </span>
              ) : null}
            </label>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="btn btn-primary btn-cta btn-block"
            >
              {mutation.isPending ? '변경 중...' : '비밀번호 변경'}
            </button>
          </form>
        )}

        <Link
          to="/password-reset"
          className="mt-7 text-center text-body-lg font-medium text-[#FF4854] underline underline-offset-2"
        >
          재설정 메일 다시 받기
        </Link>
      </div>
    </div>
  );
}
