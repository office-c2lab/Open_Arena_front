import React from 'react';
import { useNavigate } from 'react-router-dom';
import tutorialImage from '../../assets/images/tutorial.png';
import Banner from '../../components/Banner/Banner';

export default function Tutorial() {
  const navigate = useNavigate();

  // ✅ 문제 ID 26번으로 이동하도록 수정
  const handleStartChallenge = () => {
    const problemId = 26; // 이동할 문제 ID
    navigate(`/challenge/${problemId}`); // /challenge/26으로 이동
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center p-6">
      <div className="w-full max-w-[1080px] flex flex-col gap-8">
        <Banner />

        <h2 className="heading-1 font-700 text-[#FF4854]">튜토리얼</h2>

        <div className="bg-white rounded-xl shadow-lg w-full grid grid-cols-1 overflow-hidden border border-gray-200 mx-auto lg:grid-cols-[1fr_384px]">
          <div className="p-8 flex flex-col justify-between w-full">
            <h3 className="heading-2 font-500 text-[#0F172A] mb-8">
              <span className="font-bold">목표:</span> 챌린지 진행 방식과 제출 흐름을 익히는 연습 문제입니다.
            </h3>
            <p className="heading-3 font-500 text-[#6B6B6B] mb-8 w-full max-w-[568.84px]">
              튜토리얼에서는 문제 정보 확인, AI와의 대화, 프롬프트 수정, 제출 과정을 차례대로 연습합니다.
              실제 챌린지에 들어가기 전에 왼쪽 설명 탭과 시도 기록, 제출 버튼의 동작을 익혀보세요.
              점수와 성공 여부에 부담 없이 ARENA의 기본 사용 흐름을 확인할 수 있습니다.
            </p>
            {/* ✅ 문제 ID 26번으로 이동 */}
            <button
              onClick={handleStartChallenge}
              className="w-full max-w-[614px] h-[50px] bg-[#FF4854] hover:bg-[#FF4854]/90 text-white body-large font-500 rounded-md transition-colors cursor-pointer"
            >
              문제 풀기
            </button>
          </div>

          <div className="bg-gray-100 hidden lg:block">
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
