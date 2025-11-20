// src/pages/Login/Login.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query'; // React Query
import BackBtn from '@/assets/icons/backbtn.svg';
// import PasswordToggle from '@/assets/icons/passwordtoggle.svg';
import { login } from '@/api/auth'; // 로그인 API 함수
import { useAuthStore } from '@/stores/authStore'; // Zustand 스토어

export default function Login() {
  const navigate = useNavigate();

  // 1. Zustand 스토어에서 로그인 액션 함수 가져오기
  const loginToStore = useAuthStore(state => state.login);

  // 2. 폼 입력 상태 관리
  const [formData, setFormData] = useState({
    login_id: '',
    password: '',
  });

  // 3. 입력 변경 핸들러
  const handleChange = e => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id === 'id-input' ? 'login_id' : 'password']: value,
    }));
  };

  // 4. React Query useMutation: 로그인 API 호출
  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: data => {
      // 🚀 1. 로그인 성공 시 응답 데이터를 Zustand 스토어에 저장
      loginToStore(data);

      // console.log('로그인 성공:', data);
      // alert(`${data.teamname}님 환영합니다!`);

      // 🚀 2. 대시보드로 이동
      navigate('/dashboard');
    },
    onError: error => {
      // 🚨 로그인 실패 시 처리
      console.error('로그인 실패:', error);
      const errorMessage =
        error.response?.data?.detail || '로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.';
      alert(errorMessage);
    },
  });

  // 5. 폼 제출 핸들러
  const handleSubmit = () => {
    if (!formData.login_id || !formData.password) {
      alert('아이디와 비밀번호를 모두 입력해 주세요.');
      return;
    }
    loginMutation.mutate(formData);
  };

  // 로딩 상태 (버튼 UI 처리용)
  const isPending = loginMutation.isPending;

  // 반응형 스타일 변수 정의 (기존 코드 유지)
  const inputLabelStyle = 'heading-3 font-500 text-[#6B6B6B] mb-2 md:mb-4';
  const inputFieldStyle =
    'w-full heading-3 font-700 outline-none border-b border-[#D9DADB] focus:border-[#6B6B6B] pb-2 text-[#6B6B6B] bg-transparent placeholder:text-[#D9DADB]';
  // const linkStyle = 'heading-3 font-500 text-[#6B6B6B] hover:text-black transition-colors duration-200 no-underline'; // 사용되지 않아 주석 유지

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div
        className="max-w-[675px] w-full bg-white rounded-[16px] shadow-xl flex flex-col 
                  min-h-screen md:min-h-0 md:my-10 overflow-hidden"
      >
        {/* Header Area */}
        <header className="px-8 pt-8 pb-4 border-b border-[#D9DADB] rounded-t-[16px]">
          <div className="flex items-center justify-between">
            {/* 왼쪽 영역: 뒤로가기 + 로그인 텍스트 */}
            <div className="flex items-center">
              {/* <img
        src={BackBtn}
        alt="back"
        className="w-[10px] h-[18px] cursor-pointer"
        onClick={() => navigate(-1)} // 뒤로가기 기능
      /> */}
              <h1 className="heading-3 font-500 text-black">로그인</h1>
              {/* ml-4 주석처리 */}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex flex-col p-8 md:p-10">
          <h2 className="heading-2 font-500 text-black mt-8 mb-12">
            로그인 정보를
            <br /> 입력해 주세요.
          </h2>

          <form className="flex flex-col space-y-6" onSubmit={e => e.preventDefault()}>
            {/* 아이디 입력 */}
            <div className="flex flex-col">
              <label htmlFor="id-input" className={inputLabelStyle}>
                아이디
              </label>
              <input
                id="id-input"
                type="text"
                className={inputFieldStyle}
                placeholder="아이디"
                value={formData.login_id} // 👈 상태 연결
                onChange={handleChange} // 👈 핸들러 연결
              />
            </div>

            {/* 비밀번호 입력 */}
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
                  value={formData.password} // 👈 상태 연결
                  onChange={handleChange} // 👈 핸들러 연결
                />
                {/* <img ... (PasswordToggle 주석 유지) */}
              </div>
            </div>
          </form>
        </main>

        {/* Footer: 로그인 버튼 */}
        <footer className="px-8 pt-4 pb-8 mt-8">
          <button
            onClick={handleSubmit} // 👈 로그인 API 호출 핸들러 연결
            disabled={isPending} // 👈 로딩 중 비활성화
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
