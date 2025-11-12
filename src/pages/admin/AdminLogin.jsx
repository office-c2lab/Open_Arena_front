// src/pages/Login/Login.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import BackBtn from '@/assets/icons/backbtn.svg';
import PasswordToggle from '@/assets/icons/passwordtoggle.svg';

export default function Login() {
  const navigate = useNavigate(); // 페이지 이동용

  // 반응형 스타일 변수 정의
  const inputLabelStyle = 'heading-3 font-500 text-[#6B6B6B] mb-2 md:mb-4';
  const inputFieldStyle =
    'w-full heading-3 font-700 outline-none border-b border-[#D9DADB] focus:border-[#6B6B6B] pb-2 text-[#6B6B6B] bg-transparent placeholder:text-[#D9DADB]';
  const linkStyle =
    'heading-3 font-500 text-[#6B6B6B] hover:text-black transition-colors duration-200 no-underline';

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div
        className="max-w-[675px] w-full bg-white rounded-[16px] shadow-xl flex flex-col 
                   min-h-screen md:min-h-0 md:my-10 overflow-hidden"
      >
        {/* Header Area */}
        <header className="px-8 pt-8 pb-4 border-b border-[#D9DADB] rounded-t-[16px]">
          <div className="flex items-center">
           <img
        src={BackBtn}
        alt="back"
        className="w-[10px] h-[18px] cursor-pointer"
        onClick={() => navigate(-1)} // 뒤로가기 기능
      />
            <h1 className="heading-3 font-500 text-black ml-4">관리자 로그인</h1>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex flex-col p-8 md:p-10">
          <h2 className="heading-2 font-500 text-black mt-8 mb-12">
            로그인 정보를
            <br /> 입력해 주세요.
          </h2>

          <form className="flex flex-col space-y-6">
            {/* 아이디 입력 */}
            <div className="flex flex-col">
              <label htmlFor="id-input" className={inputLabelStyle}>
                관리자 아이디
              </label>
              <input id="id-input" type="text" className={inputFieldStyle} placeholder="이메일" />
            </div>

            {/* 아이디 저장 */}
            {/* <div className="flex justify-end mb-6">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="save-id"
                  className="w-5 h-5 border border-[#6B6B6B] rounded-[2px] appearance-none 
                             checked:bg-[#6B6B6B] focus:ring-0 cursor-pointer"
                />
                <label htmlFor="save-id" className={linkStyle}>
                  아이디 저장
                </label>
              </div>
            </div> */}

            {/* 비밀번호 입력 */}
            <div className="flex flex-col">
              <label htmlFor="pw-input" className={inputLabelStyle}>
                관리자 비밀번호 아 제발
              </label>
              <div className="relative">
                <input
                  id="pw-input"
                  type="password"
                  className={`${inputFieldStyle} pr-8`}
                  placeholder="비밀번호"
                />
                {/* <img
                  src={PasswordToggle}
                  alt="toggle"
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6B6B] cursor-pointer"
                /> */}
              </div>
            </div>
          </form>

          {/* 옵션 및 링크 */}
          {/* <div className="flex flex-col mt-8 items-center space-y-4">
            <div className="flex flex-col items-center">
              <a href="#" className={linkStyle}>
                아이디 / 비밀번호 찾기
              </a>
              <div className="w-[182px] border-t border-[#6B6B6B] mt-[4px]"></div>
            </div>

            <div className="flex flex-col items-center mt-4">
              <a href="#" className={linkStyle}>
                회원가입
              </a>
              <div className="w-[75px] border-t border-[#6B6B6B] mt-1"></div>
            </div>
          </div> */}
        </main>

        {/* Footer: 로그인 버튼 */}
        <footer className="px-8 pt-4 pb-8 mt-8">
          <button
            onClick={() => navigate('/admin/leaderboard')} // ← 클릭 시 대시보드 이동
            className="w-full h-[58px] bg-[#FF4854] rounded-[16px] 
                       text-white heading-3 font-500 hover:bg-red-600 transition-colors"
          >
          관리자 로그인
          </button>
        </footer>
      </div>
    </div>
  );
}
