import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import { requestPasswordReset } from '@/api/auth';
import { appToast } from '@/components/Toast/appToast';

export default function PasswordResetRequest() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const mutation = useMutation({
    mutationFn: requestPasswordReset,
    onSuccess: data => setMessage(data.message),
    onError: error => appToast.error(error.message),
  });

  const handleSubmit = event => {
    event.preventDefault();

    if (!email) {
      appToast.info('이메일을 입력해 주세요.');
      return;
    }

    mutation.mutate(email);
  };

  return (
    <div className="flex justify-center bg-white px-[10px] py-14">
      <div className="flex w-full max-w-[675px] flex-col px-2">
        <h1 className="text-card-title font-medium text-black">비밀번호 재설정</h1>
        <h2 className="mb-10 mt-8 text-section-title font-medium text-black">
          가입한 이메일을
          <br /> 입력해 주세요.
        </h2>

        {message ? (
          <div className="rounded-2xl bg-[#FFF0F2] p-5 text-body-lg font-medium text-[#3D4754]">
            {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div className="flex flex-col">
              <label
                htmlFor="password-reset-email"
                className="mb-4 cursor-pointer text-card-title font-medium text-[#6B6B6B]"
              >
                이메일
              </label>
              <input
                id="password-reset-email"
                type="email"
                value={email}
                onChange={event => setEmail(event.target.value)}
                placeholder="이메일 주소 입력"
                className="w-full border-b border-[#D9DADB] bg-transparent pb-2 text-card-title font-strong text-[#6B6B6B] outline-none placeholder:text-[#D9DADB] focus:border-[#6B6B6B]"
              />
            </div>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="btn btn-primary btn-cta btn-block"
            >
              {mutation.isPending ? '요청 중...' : '재설정 메일 받기'}
            </button>
          </form>
        )}

        <Link
          to="/login"
          className="mt-7 text-center text-body-lg font-medium text-[#FF4854] underline underline-offset-2"
        >
          로그인으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
