// src/pages/Login/Login.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff } from 'lucide-react';
import { login } from '@/api/auth';
import { useAuthStore } from '@/stores/authStore';

export default function Login() {
  const navigate = useNavigate();
  const loginToStore = useAuthStore(state => state.login);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const PasswordRevealIcon = isPasswordVisible ? EyeOff : Eye;

  const [formData, setFormData] = useState({
    login_id: '',
    password: '',
  });

  //  formData 변경 핸들러
  const handleChange = e => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id === 'id-input' ? 'login_id' : 'password']: value,
    }));
  };

  //  로그인 요청
  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: data => {
      loginToStore(data); //스토어에 저장
      navigate('/dashboard');
    },
    onError: () => {
      const errorMessage = '로그인 실패: 이메일/비번을 확인해주세요.';
      alert(errorMessage);
    },
  });

  //  로그인 제출
  const handleSubmit = useCallback(() => {
    if (!formData.login_id || !formData.password) {
      alert('이메일과 비밀번호를 입력해 주세요.');
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

  const inputLabelStyle = 'heading-3 font-500 text-[#6B6B6B] mb-2 md:mb-4 cursor-pointer';
  const inputFieldStyle =
    'w-full heading-3 font-700 outline-none border-b border-[#D9DADB] focus:border-[#6B6B6B] pb-2 text-[#6B6B6B] bg-transparent placeholder:text-[#D9DADB]';

  return (
    <div className="min-h-[calc(100vh-64px)] flex justify-center items-center bg-[#F7F8FA] px-[10px] py-10">
      <div
        className="max-w-[675px] w-full rounded-[24px] border border-white/80 bg-white/78 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_14px_32px_rgba(15,23,42,0.08)] backdrop-blur-md flex flex-col 
                  overflow-hidden"
      >
        {/* Header */}
        <header className="px-8 pt-8 pb-4 border-b border-white/75 rounded-t-[24px] bg-white/45">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="heading-3 font-500 text-black">로그인</h1>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="flex flex-col p-8 md:p-10">
          <h2 className="heading-2 font-500 text-black mt-8 mb-12">
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
                type="text"
                className={inputFieldStyle}
                placeholder="이메일"
                value={formData.login_id}
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
          </form>
        </main>

        {/* Footer */}
        <footer className="px-8 pt-4 pb-8 mt-8">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className={`w-full h-[58px] rounded-[16px] text-white heading-3 font-700 transition-all duration-200 cursor-pointer
              ${
                isPending
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#FF4854] shadow-[0_3px_8px_rgba(255,72,84,0.16)] hover:-translate-y-[1px] hover:bg-[#FF4854]/90 hover:shadow-[0_5px_12px_rgba(255,72,84,0.18)]'
              }`}
          >
            {isPending ? '로그인 중...' : '로그인'}
          </button>

          <div className="mt-7 text-center body-medium font-500 text-[#6B6B6B]">
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
