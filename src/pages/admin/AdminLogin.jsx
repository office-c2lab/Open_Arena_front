// src/pages/Login/Login.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackBtn from '@/assets/icons/backbtn.svg';
import { useMutation } from '@tanstack/react-query';
import { adminLogin } from '@/api/auth';

export default function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // 입력 핸들러
  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id === "id-input" ? "username" : "password"]: value,
    }));
  };

  // 관리자 로그인 API
  const mutation = useMutation({
    mutationFn: adminLogin,
    onSuccess: () => {
      alert("관리자 로그인 성공");
      navigate("/admin/leaderboard");
    },
    onError: (err) => {
      alert("로그인 실패: 관리자 계정을 확인하세요.");
      console.error(err);
    },
  });

  const handleSubmit = () => {
    if (!formData.username || !formData.password) {
      alert("아이디와 비밀번호를 입력하세요.");
      return;
    }
    mutation.mutate(formData);
  };

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
          <div className="flex items-center">
            <img
              src={BackBtn}
              alt="back"
              className="w-[10px] h-[18px] cursor-pointer"
              onClick={() => navigate(-1)}
            />
            <h1 className="heading-3 font-500 text-black ml-4">관리자 로그인</h1>
          </div>
        </header>

        {/* Main */}
        <main className="flex flex-col p-8 md:p-10">
          <h2 className="heading-2 font-500 text-black mt-8 mb-12">
            로그인 정보를
            <br /> 입력해 주세요.
          </h2>

          <form className="flex flex-col space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* 아이디 */}
            <div className="flex flex-col">
              <label htmlFor="id-input" className={inputLabelStyle}>
                관리자 아이디
              </label>
              <input
                id="id-input"
                type="text"
                className={inputFieldStyle}
                placeholder="아이디"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            {/* 비밀번호 */}
            <div className="flex flex-col">
              <label htmlFor="pw-input" className={inputLabelStyle}>
                관리자 비밀번호
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
