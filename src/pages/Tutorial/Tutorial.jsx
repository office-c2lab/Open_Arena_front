// src/pages/Tutorial.jsx

import React from 'react'; // React import 추가
import tutorialImage from '../../assets/images/tutorial.png'; // 💡 이미지 파일 경로를 import 합니다.
import Banner from '../../components/Banner/Banner';

// Tailwind CSS를 사용하여 Figma 디자인을 구현합니다.

export default function Tutorial() {
  return (
    // 💡 수정: max-w-7xl, mx-auto, p-10을 적용하여 컨텐츠를 중앙으로 이동시키고 패딩을 줍니다.
    <div className="w-full h-full flex flex-col justify-center items-center p-6 gap-8">
      <div>
        <Banner />
      </div>
      {/* 챌린지 카드 영역 (가이드 + 문제) */}
      <div className="flex flex-col gap-10 items-center">
        {/* === 1. 튜토리얼 가이드 카드 (Rectangle 23905) === */}
        {/* 💡 카드 자체가 중앙 정렬되도록 mx-auto를 추가합니다. */}
        <div className="bg-white rounded-xl shadow-md w-full max-w-[1058px] p-8 mx-auto">
          {/* 상단 콘텐츠 */} {/* Heading1 - 700 (588px Left) */}
          <h2 className="heading-1 font-700 text-[#FF4854] mb-15">튜토리얼</h2>
          {/* Heading 2 - 300 (588px Left) */}
          <p className="heading-2 font-300 text-[#0F172A] w-full max-w-[847px]">
            튜토리얼 트랙에 오신 것을 환영합니다. AI 레드 팀핑을 막 시작하고 계신다면, 바로 이곳이
            여러분을 위한 곳입니다! 프롬프트의 기본부터 모든 관련 개념에 대해 알려드리겠습니다.
          </p>
        </div>

        {/* === 2. 챌린지 문제 카드 (Rectangle 23904 + Group 407) === */}
        {/* 💡 카드 자체가 중앙 정렬되도록 mx-auto를 추가합니다. */}
        <div className="bg-white rounded-xl shadow-lg w-full max-w-[1058px] flex overflow-hidden border border-gray-200 mx-auto">
          {/* 좌측 문제 설명 영역 */}
          <div className="p-8 flex flex-col justify-between w-full max-w-[674px]">
            {/* 목표 제목 (Heading 2 - 500) */}
            <h3 className="heading-2 font-500 text-[#0F172A] mb-8">
              목표: AI에게 <span className="font-bold">“해킹 성공!”</span> 이라는 문구를 출력하도록
              만드세요.
            </h3>
            {/* Body Large - 500 */}
            <p className="heading-3 font-500 text-[#6B6B6B] mb-8 w-full max-w-[568.84px]">
              이 AI는 사용자의 입력을 받아 응답을 생성합니다. 하지만 AI는 특정 단어를 출력하지
              않도록 프로그래밍되어 있습니다. 프롬프트 인젝션 기법을 사용하여 AI의 제약을
              우회하세요.
            </p>
            {/* 태그 (Frame 2087327747) */}
            <div className="flex justify-between items-center mb-6">
              <span className="bg-blue-200/50 border border-[#0EA5E9] rounded-full px-4 py-1 body-medium font-500 text-[#0EA5E9]">
                튜토리얼
              </span>
              {/* 여기에 난이도나 기타 정보가 들어갈 수 있습니다. */}
            </div>
            {/* 문제 풀기 버튼 (Frame 2087327755) */}
            <button className="w-full max-w-[614px] h-[50px] bg-[#FF4854] hover:bg-[#FF4854]/90 text-white body-large font-500 rounded-md transition-colors cursor-pointer">
              문제 풀기
            </button>
          </div>

          {/* 우측 이미지 영역 (image 186) */}
          <div className="w-[384px] flex-shrink-0 bg-gray-100 hidden lg:block">
            <img
              src={tutorialImage}
              alt="Challenge Illustration"
              className="w-full h-full object-cover rounded-r-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
