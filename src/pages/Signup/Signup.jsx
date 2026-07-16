// src/pages/Signup/Signup.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import BackBtn from '@/assets/icons/backbtn.svg';

export default function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [showVerificationCode, setShowVerificationCode] = useState(false);
  const PasswordRevealIcon = showPassword ? EyeOff : Eye;
  const PasswordConfirmRevealIcon = showPasswordConfirm ? EyeOff : Eye;
  const [formData, setFormData] = useState({
    nickname: '',
    login_id: '',
    emailVerificationCode: '',
    password: '',
    passwordConfirm: '',
  });

  const handleChange = e => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const { nickname, login_id, password, passwordConfirm } = formData;

    if (!nickname || !login_id || !password || !passwordConfirm) {
      alert('회원 정보를 모두 입력해 주세요.');
      return;
    }

    if (password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    alert('회원가입 API 연결이 필요합니다.');
  };

  const handleEmailVerification = () => {
    if (!formData.login_id) {
      alert('이메일 주소를 먼저 입력해 주세요.');
      return;
    }

    setShowVerificationCode(true);
  };

  const handleVerificationCodeConfirm = () => {
    if (!formData.emailVerificationCode) {
      alert('인증번호를 입력해 주세요.');
      return;
    }

    alert('이메일 인증 확인 API 연결이 필요합니다.');
  };

  const inputLabelStyle = 'heading-3 font-500 text-[#6B6B6B] mb-2 md:mb-4 cursor-pointer';
  const inputFieldStyle =
    'w-full heading-3 font-700 outline-none border-b border-[#D9DADB] focus:border-[#6B6B6B] pb-2 text-[#6B6B6B] bg-transparent placeholder:text-[#D9DADB]';

  return (
    <div className="flex justify-center bg-white px-[10px] py-14">
      <div
        className="max-w-[675px] w-full flex flex-col"
      >
        <header className="px-2 pt-4 pb-4">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-[#8A93A5] transition hover:bg-[#F4F6FA] hover:text-[#FF4854] cursor-pointer"
              aria-label="뒤로가기"
            >
              <img src={BackBtn} alt="" className="w-[10px] h-[18px]" />
            </button>
            <h1 className="heading-3 font-500 text-black">회원가입</h1>
          </div>
        </header>

        <main className="flex flex-1 flex-col px-2 pb-8 pt-3 md:pb-10 md:pt-4">
          <h2 className="heading-2 font-500 text-black mb-10">
            회원 정보를
            <br /> 입력해 주세요.
          </h2>

          <form className="flex flex-col gap-7" onSubmit={e => e.preventDefault()}>
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
              <label htmlFor="signup-id-input" className={inputLabelStyle}>
                이메일
              </label>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <input
                  id="signup-id-input"
                  name="login_id"
                  type="email"
                  className={inputFieldStyle}
                  placeholder="이메일 주소 입력"
                  value={formData.login_id}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={handleEmailVerification}
                  className="h-[42px] shrink-0 cursor-pointer rounded-[12px] bg-[#FF4854] px-5 body-medium font-700 text-white shadow-[0_3px_8px_rgba(255,72,84,0.16)] transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#FF4854]/90 hover:shadow-[0_5px_12px_rgba(255,72,84,0.18)]"
                >
                  이메일 인증
                </button>
              </div>
              {showVerificationCode && (
                <div className="mt-5 flex flex-col">
                  <label htmlFor="email-verification-code-input" className={inputLabelStyle}>
                    인증번호
                  </label>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                    <input
                      id="email-verification-code-input"
                      name="emailVerificationCode"
                      type="text"
                      inputMode="numeric"
                      className={inputFieldStyle}
                      placeholder="인증번호 입력"
                      value={formData.emailVerificationCode}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      onClick={handleVerificationCodeConfirm}
                      className="h-[42px] shrink-0 cursor-pointer rounded-[12px] bg-[#FF4854] px-5 body-medium font-700 text-white shadow-[0_3px_8px_rgba(255,72,84,0.16)] transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#FF4854]/90 hover:shadow-[0_5px_12px_rgba(255,72,84,0.18)]"
                    >
                      인증번호 확인
                    </button>
                  </div>
                  <p className="mt-2 body-small font-500 text-[#FF4854]">
                    이메일로 발송된 인증번호를 입력해 주세요.
                  </p>
                </div>
              )}
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

        <footer className="px-2 pt-4 pb-8">
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full h-[58px] rounded-[16px] bg-[#FF4854] text-white heading-3 font-700 shadow-[0_3px_8px_rgba(255,72,84,0.16)] transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#FF4854]/90 hover:shadow-[0_5px_12px_rgba(255,72,84,0.18)] cursor-pointer"
          >
            회원가입
          </button>
        </footer>
      </div>
    </div>
  );
}
