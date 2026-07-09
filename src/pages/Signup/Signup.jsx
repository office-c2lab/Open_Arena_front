// src/pages/Signup/Signup.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import BackBtn from '@/assets/icons/backbtn.svg';

export default function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const PasswordRevealIcon = showPassword ? EyeOff : Eye;
  const PasswordConfirmRevealIcon = showPasswordConfirm ? EyeOff : Eye;
  const [formData, setFormData] = useState({
    nickname: '',
    verificationCode: '',
    login_id: '',
    password: '',
    passwordConfirm: '',
  });

  const handleChange = e => {
    const { name, value } = e.target;
    const nextValue = name === 'verificationCode' ? value.slice(0, 8) : value;

    setFormData(prev => ({
      ...prev,
      [name]: nextValue,
    }));
  };

  const handleSubmit = () => {
    const { nickname, verificationCode, login_id, password, passwordConfirm } = formData;

    if (!nickname || !verificationCode || !login_id || !password || !passwordConfirm) {
      alert('회원 정보를 모두 입력해 주세요.');
      return;
    }

    if (password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    alert('회원가입 API 연결이 필요합니다.');
  };

  const inputLabelStyle = 'heading-3 font-500 text-[#6B6B6B] mb-2 md:mb-4 cursor-pointer';
  const inputFieldStyle =
    'w-full heading-3 font-700 outline-none border-b border-[#D9DADB] focus:border-[#6B6B6B] pb-2 text-[#6B6B6B] bg-transparent placeholder:text-[#D9DADB]';

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#F7F8FA] md:py-10">
      <div
        className="max-w-[675px] w-full rounded-[24px] border border-white/80 bg-white/78 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_14px_32px_rgba(15,23,42,0.08)] backdrop-blur-md flex flex-col
                  min-h-screen md:min-h-0 overflow-hidden"
      >
        <header className="px-8 pt-8 pb-4 border-b border-white/75 rounded-t-[24px] bg-white/45">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-[24px] w-[14px] items-center justify-center cursor-pointer"
              aria-label="뒤로가기"
            >
              <img src={BackBtn} alt="" className="w-[10px] h-[18px]" />
            </button>
            <h1 className="heading-3 font-500 text-black ml-4">회원가입</h1>
          </div>
        </header>

        <main className="flex flex-1 flex-col p-8 md:p-10">
          <h2 className="heading-2 font-500 text-black mt-8 mb-12">
            회원 정보를
            <br /> 입력해 주세요.
          </h2>

          <form className="flex flex-col gap-7" onSubmit={e => e.preventDefault()}>
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 sm:gap-8">
              <div className="flex flex-col">
                <label htmlFor="nickname-input" className={inputLabelStyle}>
                  닉네임
                </label>
                <input
                  id="nickname-input"
                  name="nickname"
                  type="text"
                  className={inputFieldStyle}
                  placeholder="띄어쓰기 없이 2~8자 입력"
                  value={formData.nickname}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="verification-code-input" className={inputLabelStyle}>
                  고유인증번호
                </label>
                <input
                  id="verification-code-input"
                  name="verificationCode"
                  type="text"
                  maxLength={8}
                  className={inputFieldStyle}
                  placeholder="8자리 입력"
                  value={formData.verificationCode}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="signup-id-input" className={inputLabelStyle}>
                아이디
              </label>
              <input
                id="signup-id-input"
                name="login_id"
                type="email"
                className={inputFieldStyle}
                placeholder="이메일 주소 입력"
                value={formData.login_id}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="signup-password-input" className={inputLabelStyle}>
                비밀번호
              </label>
              <div className="relative">
                <input
                  id="signup-password-input"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`${inputFieldStyle} pr-10`}
                  placeholder="비밀번호"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  aria-label={`비밀번호 ${showPassword ? '숨기기' : '보기'}`}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-0 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-[#8A93A5] transition hover:bg-[#F4F6FA] hover:text-[#FF4854] cursor-pointer"
                >
                  <PasswordRevealIcon className="h-5 w-5" strokeWidth={2} />
                </button>
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="signup-password-confirm-input" className={inputLabelStyle}>
                비밀번호 확인
              </label>
              <div className="relative">
                <input
                  id="signup-password-confirm-input"
                  name="passwordConfirm"
                  type={showPasswordConfirm ? 'text' : 'password'}
                  className={`${inputFieldStyle} pr-10`}
                  placeholder="비밀번호 확인"
                  value={formData.passwordConfirm}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  aria-label={`비밀번호 확인 ${showPasswordConfirm ? '숨기기' : '보기'}`}
                  aria-pressed={showPasswordConfirm}
                  onClick={() => setShowPasswordConfirm(prev => !prev)}
                  className="absolute right-0 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-[#8A93A5] transition hover:bg-[#F4F6FA] hover:text-[#FF4854] cursor-pointer"
                >
                  <PasswordConfirmRevealIcon className="h-5 w-5" strokeWidth={2} />
                </button>
              </div>
            </div>
          </form>

          {/* <p className="mt-8 body-medium font-500 text-[#6B6B6B]">
            * 비밀번호는 영문, 숫자, 특수문자를 조합하여 10~20자 이내로 입력해 주세요.
          </p> */}
        </main>

        <footer className="px-8 pt-4 pb-8">
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full h-[58px] rounded-[16px] bg-[#FF4854] text-white heading-3 font-700 shadow-[0_8px_18px_rgba(255,72,84,0.18)] transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#FF4854]/90 hover:shadow-[0_10px_22px_rgba(255,72,84,0.22)] cursor-pointer"
          >
            회원가입
          </button>
        </footer>
      </div>
    </div>
  );
}
