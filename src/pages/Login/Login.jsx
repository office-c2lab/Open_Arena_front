// src/pages/Login/Login.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff } from 'lucide-react';
import { login } from '@/api/auth';
import { appToast } from '@/components/Toast/appToast';
import { useAuthStore } from '@/stores/authStore';

export default function Login() {
  const navigate = useNavigate();
  const loginToStore = useAuthStore(state => state.login);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const PasswordRevealIcon = isPasswordVisible ? EyeOff : Eye;

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember_me: false,
  });

  //  formData 변경 핸들러
  const handleChange = e => {
    const { name, type, checked, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  //  로그인 요청
  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: data => {
      loginToStore(data); //스토어에 저장
      navigate('/dashboard');
    },
    onError: error => {
      appToast.error(error.message || '로그인에 실패했습니다.');
    },
  });

  //  로그인 제출
  const handleSubmit = useCallback(() => {
    if (!formData.email || !formData.password) {
      appToast.info('이메일과 비밀번호를 입력해 주세요.');
      return;
    }
    loginMutation.mutate(formData);
  }, [formData, loginMutation]);

  //  전역 엔터키 이벤트 등록 (어디에서든 엔터 누르면 로그인)
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSubmit]);

  const isPending = loginMutation.isPending;

  const inputLabelStyle = 'text-card-title font-medium text-[#6B6B6B] mb-2 md:mb-4 cursor-pointer';
  const inputFieldStyle =
    'w-full text-card-title font-strong outline-none border-b border-[#D9DADB] focus:border-[#6B6B6B] pb-2 text-[#6B6B6B] bg-transparent placeholder:text-[#D9DADB]';

  return (
    <div className="flex justify-center bg-white px-[10px] py-14">
      <div className="max-w-[675px] w-full flex flex-col">
        {/* Header */}
        <header className="px-2 pt-4 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-card-title font-medium text-black">로그인</h1>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="flex flex-col px-2 pb-8 pt-3 md:pb-10 md:pt-4">
          <h2 className="text-section-title font-medium text-black mb-10">
            로그인 정보를
            <br /> 입력해 주세요.
          </h2>

          <form className="flex flex-col space-y-6" onSubmit={e => e.preventDefault()}>
            {/* 이메일 */}
            <div className="flex flex-col">
              <label htmlFor="id-input" className={inputLabelStyle}>
                이메일
              </label>
              <input
                id="id-input"
                name="email"
                type="email"
                className={inputFieldStyle}
                placeholder="이메일"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* 비밀번호 */}
            <div className="flex flex-col">
              <label htmlFor="pw-input" className={inputLabelStyle}>
                비밀번호
              </label>
              <div className="relative">
                <input
                  id="pw-input"
                  name="password"
                  type={isPasswordVisible ? 'text' : 'password'}
                  className={`${inputFieldStyle} pr-10`}
                  placeholder="비밀번호"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  aria-label={`비밀번호 ${isPasswordVisible ? '숨기기' : '보기'}`}
                  aria-pressed={isPasswordVisible}
                  onClick={() => setIsPasswordVisible(current => !current)}
                  className="absolute right-0 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-[#8A93A5] transition hover:bg-[#F4F6FA] hover:text-[#FF4854] cursor-pointer"
                >
                  <PasswordRevealIcon className="h-5 w-5" strokeWidth={2} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <label className="flex cursor-pointer items-center gap-2 text-body font-medium text-[#6B6B6B]">
                <input
                  name="remember_me"
                  type="checkbox"
                  checked={formData.remember_me}
                  onChange={handleChange}
                  className="h-5 w-5 accent-[#FF4854]"
                />
                로그인 상태 유지
              </label>
              <Link
                to="/password-reset"
                className="text-body font-medium text-[#6B6B6B] underline underline-offset-2 hover:text-[#FF4854]"
              >
                비밀번호 찾기
              </Link>
            </div>
          </form>
        </main>

        {/* Footer */}
        <footer className="px-2 pt-4 pb-8 mt-8">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="btn btn-primary btn-cta btn-block"
          >
            {isPending ? '로그인 중...' : '로그인'}
          </button>

          <div className="mt-7 text-center text-body-lg font-medium text-[#6B6B6B]">
            <span>계정이 없으신가요? </span>
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="text-[#FF4854] underline decoration-[#FF4854] underline-offset-2 cursor-pointer"
            >
              회원가입
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
