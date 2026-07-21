// src/pages/Signup/Signup.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import ArenaSymbol from '@/assets/icons/Arena.svg';
import BackBtn from '@/assets/icons/backbtn.svg';

/* 이전 인라인 약관 내용은 /terms 및 /privacy 상세 페이지로 이동했습니다.
  terms: {
    title: '서비스 이용약관',
    sections: [
      {
        heading: '제1조(목적)',
        content:
          '본 약관은 ARENA가 제공하는 AI 기반 학습 및 챌린지 서비스(이하 “서비스”)의 이용과 관련하여 ARENA와 회원 간의 권리, 의무 및 책임사항을 정하는 것을 목적으로 합니다.',
      },
      {
        heading: '제2조(회원가입 및 계정 관리)',
        content:
          '① 회원은 정확한 정보를 제공하여 회원가입을 신청해야 합니다.\n② 회원은 자신의 계정과 비밀번호를 안전하게 관리해야 하며, 이를 타인에게 양도하거나 공유해서는 안 됩니다.\n③ 회원은 타인의 정보를 이용하여 가입하거나 타인의 계정에 무단으로 접근해서는 안 됩니다.\n④ 계정의 부정 사용이나 보안 문제가 발생한 경우 회원은 즉시 서비스에 알려야 합니다.',
      },
      {
        heading: '제3조(서비스 이용)',
        content:
          '① 회원은 관계 법령, 본 약관 및 서비스 내 안내사항을 준수해야 합니다.\n② 회원은 다음 행위를 해서는 안 됩니다.\n\n• 서비스의 정상적인 운영을 방해하는 행위\n• 다른 회원 또는 제3자의 권리를 침해하는 행위\n• 부정한 방법으로 챌린지에 참여하거나 결과를 조작하는 행위\n• 서비스의 시스템 또는 보안 기능을 무단으로 분석·침해하는 행위\n• 기타 관계 법령에 위반되는 행위',
      },
      {
        heading: '제4조(서비스의 변경 및 중단)',
        content:
          'ARENA는 운영상 또는 기술상 필요한 경우 서비스의 전부 또는 일부를 변경하거나 일시적으로 중단할 수 있습니다. 중요한 변경이나 중단이 있는 경우 서비스 내 공지 등의 방법으로 사전에 안내합니다. 다만, 긴급한 장애나 보안 문제 등 사전 안내가 어려운 경우에는 사후에 안내할 수 있습니다.',
      },
      {
        heading: '제5조(이용 제한)',
        content:
          '회원이 관계 법령 또는 본 약관을 위반하거나 서비스의 정상적인 운영을 방해한 경우 ARENA는 사전 안내 후 서비스 이용을 제한하거나 계정을 정지할 수 있습니다. 다만, 긴급한 보안 문제나 중대한 부정 이용이 확인된 경우에는 우선 조치한 후 안내할 수 있습니다.',
      },
      {
        heading: '제6조(회원 탈퇴)',
        content:
          '회원은 언제든지 서비스에서 회원 탈퇴를 요청할 수 있습니다. 회원 탈퇴가 완료되면 관계 법령에 따라 보관해야 하는 정보를 제외한 회원의 개인정보는 개인정보처리방침에 따라 처리됩니다.',
      },
      {
        heading: '제7조(책임의 제한)',
        content:
          'ARENA는 천재지변, 통신 장애, 외부 서비스 장애 등 합리적으로 통제하기 어려운 사유로 서비스를 제공하지 못한 경우 책임을 지지 않습니다. 또한 회원의 귀책사유로 발생한 손해에 대해서는 책임을 지지 않습니다.',
      },
      {
        heading: '제8조(약관의 변경)',
        content:
          'ARENA는 관계 법령 또는 서비스 운영상 필요한 경우 본 약관을 변경할 수 있습니다. 변경되는 약관의 내용과 시행일은 시행 전에 서비스 내 공지 등의 방법으로 안내합니다.',
      },
      {
        heading: '제9조(분쟁 해결)',
        content:
          '본 약관과 관련하여 분쟁이 발생한 경우 ARENA와 회원은 원만한 해결을 위해 성실히 협의합니다. 협의로 해결되지 않는 경우에는 관계 법령에서 정한 절차와 관할에 따릅니다.',
      },
    ],
  },
  privacy: {
    title: '개인정보 수집 및 이용 동의',
    sections: [
      {
        heading: '수집·이용 목적',
        content:
          '회원 가입, 본인 확인 및 계정 관리, 서비스 제공, 부정 이용 방지, 문의 및 고지사항 전달',
      },
      {
        heading: '수집 항목',
        content: '닉네임, 이메일 주소, 비밀번호',
      },
      {
        heading: '보유·이용 기간',
        content:
          '회원 탈퇴 시까지 보유·이용합니다. 다만, 관계 법령에 따라 보존할 필요가 있는 경우 해당 법령에서 정한 기간 동안 보관합니다.',
      },
      {
        heading: '동의 거부 권리 및 불이익',
        content:
          '귀하는 개인정보 수집·이용에 대한 동의를 거부할 권리가 있습니다. 다만, 필수 항목에 동의하지 않으면 회원가입 및 서비스 이용이 제한됩니다.',
      },
    ],
  },
}; */

export default function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [showVerificationCode, setShowVerificationCode] = useState(false);
  const [isSignupComplete, setIsSignupComplete] = useState(false);
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
  });
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

    if (!agreements.terms || !agreements.privacy) {
      alert('필수 약관에 모두 동의해 주세요.');
      return;
    }

    setIsSignupComplete(true);
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

  const handleAgreementChange = e => {
    const { name, checked } = e.target;

    setAgreements(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  const inputLabelStyle = 'heading-3 font-500 text-[#6B6B6B] mb-2 md:mb-4 cursor-pointer';
  const inputFieldStyle =
    'w-full heading-3 font-700 outline-none border-b border-[#D9DADB] focus:border-[#6B6B6B] pb-2 text-[#6B6B6B] bg-transparent placeholder:text-[#D9DADB]';

  if (isSignupComplete) {
    return (
      <div className="flex justify-center bg-white px-[10px] py-4">
        <section className="flex w-full max-w-[675px] flex-col items-center px-2 pb-10 pt-8 text-center">
          <h1 className="heading-1 font-700 text-[#2D3035]">회원가입 완료!</h1>

          <div className="relative mt-14 flex h-[260px] w-full overflow-hidden rounded-[36px] bg-[radial-gradient(circle_at_50%_48%,#FFEFF3_0%,#FFDCE5_42%,#FFB8CA_100%)]">
            <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70 shadow-[0_0_50px_rgba(255,255,255,0.76)]" />
            <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/60" />
            <div className="absolute left-[8%] top-[18%] h-8 w-8 rotate-45 bg-white shadow-[0_0_18px_rgba(255,255,255,0.9)] [clip-path:polygon(50%_0,62%_38%,100%_50%,62%_62%,50%_100%,38%_62%,0_50%,38%_38%)]" />
            <div className="absolute right-[9%] bottom-[24%] h-7 w-7 rotate-45 bg-white/90 shadow-[0_0_16px_rgba(255,255,255,0.84)] [clip-path:polygon(50%_0,62%_38%,100%_50%,62%_62%,50%_100%,38%_62%,0_50%,38%_38%)]" />
            <div className="absolute left-[28%] top-[21%] h-1.5 w-1.5 rounded-full bg-white" />
            <div className="absolute right-[28%] top-[17%] h-3.5 w-3.5 rounded-full bg-white shadow-[0_0_16px_rgba(255,255,255,0.78)]" />
            <div className="absolute bottom-[12%] left-[22%] h-3.5 w-3.5 rounded-full bg-white/90 shadow-[0_0_16px_rgba(255,255,255,0.78)]" />
            <div className="absolute left-[9%] top-[50%] h-1 w-20 rounded-full bg-white/90" />
            <div className="absolute left-[14%] top-[59%] h-1 w-20 rounded-full bg-white/80" />
            <div className="absolute left-[6%] bottom-[16%] h-5 w-32 rounded-full bg-gradient-to-r from-white/0 via-[#FF7B9A]/70 to-white/0" />
            <div className="absolute left-[13%] bottom-[34%] h-7 w-36 rounded-full bg-gradient-to-r from-[#FF6B8D] to-white/20" />
            <div className="absolute right-[13%] top-[33%] h-6 w-32 rounded-full bg-gradient-to-r from-[#FF6B8D] to-white/10" />
            <div className="absolute right-[6%] top-[22%] h-7 w-36 rounded-full bg-gradient-to-r from-[#FF6B8D] to-white/10" />
            <div className="absolute right-[8%] bottom-[39%] h-1.5 w-28 rounded-full bg-gradient-to-r from-[#FF7B9A] to-white/30" />
            <div className="absolute right-[11%] bottom-[31%] h-1.5 w-24 rounded-full bg-gradient-to-r from-[#FF9AAD] to-white/40" />
            <img
              src={ArenaSymbol}
              alt=""
              className="relative z-10 m-auto h-[160px] w-auto drop-shadow-[0_18px_24px_rgba(255,8,74,0.2)]"
            />
          </div>

          <p className="mt-8 text-[17px] font-800 leading-7 text-[#3D4754]">
            관리자 승인 후 <span className="text-[#FF4854]">유료 회원</span>으로 전환됩니다.
            <br />승인 완료 시 서비스를 이용할 수 있습니다.
          </p>

          <button
            type="button"
            onClick={() => navigate('/kategorie')}
            className="mt-8 w-full h-[58px] rounded-[16px] bg-[#FF4854] text-white heading-3 font-700 shadow-[0_3px_8px_rgba(255,72,84,0.16)] transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#FF4854]/90 hover:shadow-[0_5px_12px_rgba(255,72,84,0.18)] cursor-pointer"
          >
            ARENA 시작하기
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-white px-[10px] py-14">
      <div className="max-w-[675px] w-full flex flex-col">
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

            <fieldset className="flex flex-col gap-5 border-0 p-0">
              <legend className="sr-only">필수 약관 동의</legend>
              <div className="flex min-h-8 items-center gap-3">
                <input
                  id="terms-agreement"
                  name="terms"
                  type="checkbox"
                  checked={agreements.terms}
                  onChange={handleAgreementChange}
                  className="h-6 w-6 shrink-0 cursor-pointer accent-[#FF4854]"
                />
                <label
                  htmlFor="terms-agreement"
                  className="heading-3 cursor-pointer font-500 text-[#6B6B6B]"
                >
                  <span className="font-700">[필수]</span> 이용약관에 동의합니다.
                </label>
                <a
                  href="/terms"
                  target="_blank"
                  rel="noreferrer"
                  className="ml-auto shrink-0 body-large font-500 text-[#6B6B6B] underline underline-offset-2 transition hover:text-[#FF4854]"
                >
                  자세히 보기 &gt;
                </a>
              </div>

              <div className="flex min-h-8 items-center gap-3">
                <input
                  id="privacy-agreement"
                  name="privacy"
                  type="checkbox"
                  checked={agreements.privacy}
                  onChange={handleAgreementChange}
                  className="h-6 w-6 shrink-0 cursor-pointer accent-[#FF4854]"
                />
                <label
                  htmlFor="privacy-agreement"
                  className="heading-3 cursor-pointer font-500 text-[#6B6B6B]"
                >
                  <span className="font-700">[필수]</span> 개인정보 수집 및 이용에 동의합니다.
                </label>
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noreferrer"
                  className="ml-auto shrink-0 body-large font-500 text-[#6B6B6B] underline underline-offset-2 transition hover:text-[#FF4854]"
                >
                  자세히 보기 &gt;
                </a>
              </div>
            </fieldset>
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
