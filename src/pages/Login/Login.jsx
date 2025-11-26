// src/pages/Login/Login.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { login } from '@/api/auth';
import { useAuthStore } from '@/stores/authStore';

export default function Login() {
  const navigate = useNavigate();
  const loginToStore = useAuthStore(state => state.login);

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
    onError: error => {
      const errorMessage = '로그인 실패: 아이디/비번을 확인해주세요.';
      alert(errorMessage);
    },
  });

  //  로그인 제출
  const handleSubmit = () => {
    if (!formData.login_id || !formData.password) {
      alert('아이디와 비밀번호를 입력해 주세요.');
      return;
    }
    loginMutation.mutate(formData);
  };

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
  }, [formData]); // formData 최신 상태 유지

  const isPending = loginMutation.isPending;

  const inputLabelStyle = 'heading-3 font-500 text-[#6B6B6B] mb-2 md:mb-4';
  const inputFieldStyle =
    'w-full heading-3 font-700 outline-none border-b border-[#D9DADB] focus:border-[#6B6B6B] pb-2 text-[#6B6B6B] bg-transparent placeholder:text-[#D9DADB]';

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div
        className="max-w-[675px] w-full bg-white rounded-[16px] shadow-xl flex flex-col 
                  min-h-screen md:min-h-0 md:my-10 overflow-hidden"
      >
        {/* Header */}
        <header className="px-8 pt-8 pb-4 border-b border-[#D9DADB] rounded-t-[16px]">
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
            {/* 아이디 */}
            <div className="flex flex-col">
              <label htmlFor="id-input" className={inputLabelStyle}>
                아이디
              </label>
              <input
                id="id-input"
                type="text"
                className={inputFieldStyle}
                placeholder="아이디"
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
                  type="password"
                  className={`${inputFieldStyle} pr-8`}
                  placeholder="비밀번호"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>
          </form>
        </main>

        {/* Footer */}
        <footer className="px-8 pt-4 pb-8 mt-8">
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className={`w-full h-[58px] rounded-[16px] text-white heading-3 font-500 transition-colors cursor-pointer
              ${isPending ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#FF4854] hover:bg-red-600'}`}
          >
            {isPending ? '로그인 중...' : '로그인'}
          </button>
        </footer>
      </div>
    </div>
  );
}
