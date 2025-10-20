// src/features/challenge/ChallengeModals/DebugModal.jsx (예시 경로)
import React, { useCallback, useState } from 'react';

// === 아이콘 import (SVG를 URL/경로로 임포트) ===
// 이 방식은 일반적인 이미지처럼 SVG 파일의 경로(URL)를 가져옵니다.
import CopySvg from '../../../assets/icons/copy.svg';
import HelpSvg from '../../../assets/icons/question.svg';
import CancelSvg from '../../../assets/icons/cancel.svg';
// ===========================================

// 디버그 정보 (이전과 동일)
const DEBUG_INFO = `
Debug Information:
Username: Unknown
User ID: 244b1780-d8a6-4705-bea4-39dc67feb65e
Session ID: 0e6ab5f6-794b-45ab-9649-28743a8b7ac5
Submission ID: Not Submitted
Challenge: getting_started
Track: tutorial_competition
Model: Unknown
`.trim();

// 닫기 버튼 컴포넌트: <img> 태그 사용
const CancelIcon = ({ onClick }) => (
  <div
    onClick={onClick}
    // position: absolute, width: 42px, height: 42px, right: 25px, top: 25px, cursor: pointer
    className="absolute top-[36px] right-[42px] w-[18px] h-[18px]  cursor-pointer"
  >
    {/* SVG를 이미지로 사용. 색상 제어는 SVG 파일 내부에서 해야 함. */}
    <img src={CancelSvg} alt="닫기" className="w-full h-full" />
  </div>
);

/**
 * 챌린지 디버그 정보 모달 컴포넌트
 */
const DebugModal = ({ isOpen, onClose }) => {
  const [isCopied, setIsCopied] = useState(false);

  // '디버그 정보 복사' 버튼 클릭 핸들러
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(DEBUG_INFO);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      alert('디버그 정보 복사에 실패했습니다.');
    }
  }, []);

  // '도움 요청' 버튼 클릭 핸들러
  const handleHelpRequest = useCallback(() => {
    alert('도움 요청 기능을 구현해야 합니다.');
  }, []);

  if (!isOpen) return null;

  return (
    // Overlay: fixed, full size, semi-transparent black background, flex center
    <div className="fixed inset-0 bg-[rgba(1,1,1,0.6)] flex justify-center items-center z-[1000]">
      <div
        // Modal Container: 684x572px, bg-white, rounded-xl(16px)
        className="relative w-[684px] h-[572px] bg-white rounded-[16px] px-[42px] box-border"
      >
        {/* 닫기 버튼 */}
        <CancelIcon onClick={onClose} />

        {/* Header (Help Icon + Title) */}
        <div
          // absolute, left: 42px, top: 67px, flex items-center, gap: 13px
          className="absolute left-[42px] top-[67px] flex items-center gap-[13px]"
        >
          {/* Help Icon: w-11(44px), h-11(44px) */}
          <div className="w-11 h-11 flex justify-center items-center">
            {/* SVG를 이미지로 사용 */}
            <img src={HelpSvg} alt="도움" className="w-full h-full" />
            {/* * 주의: question.svg의 배경색(#837BBD)은 SVG 파일 내부에서 설정되어 있거나,
             * 별도의 Tailwind 클래스로 테두리/배경을 만들어 줘야 합니다.
             * 여기서는 SVG 파일 자체에 색상이 포함되어 있다고 가정합니다.
             */}
          </div>

          <h2
            // Heading2 - 700, text-2xl, leading-9
            className="font-['Noto Sans KR'] font-extrabold text-2xl leading-9 text-black m-0"
          >
            챌린지 디버그 정보
          </h2>
        </div>

        {/* Description */}
        <p
          // Heading 3 - 500, text-xl, leading-[26px], text-[#6B6B6B]
          className="absolute w-[567px] left-[42px] top-[141px] 
                       font-['Noto Sans KR'] font-medium text-xl leading-[26px] 
                       text-[#6B6B6B] m-0"
        >
          아래 디버그 정보를 복사하고 서버에 지원 요청을 보내주세요.
        </p>

        {/* Debug Information Box */}
        <div
          // absolute, 600px x 220px, left: 42px, top: 219px, bg-[#F1F1EF]
          className="absolute w-[600px] h-[220px] left-[42px] top-[219px] 
                       bg-[#F1F1EF] rounded-[16px] p-[14px] pl-[28px] pr-7 overflow-auto"
        >
          <pre
            // Body Large - 300, text-base, leading-6
            className="font-['Noto Sans KR'] font-light text-base leading-6 text-black whitespace-pre-wrap m-0"
          >
            {DEBUG_INFO}
          </pre>
        </div>

        {/* Action Buttons Container */}
        <div
          // absolute, left: 42px, top: 495px, w-[600px], flex justify-between
          className="absolute left-[42px] top-[495px] w-[600px] flex justify-between items-center"
        >
          {/* 디버그 정보 복사 버튼 */}
          <div
            onClick={handleCopy}
            // flex items-center, cursor-pointer, gap-[6px]
            className="flex items-center cursor-pointer gap-[6px] transition-opacity hover:opacity-80"
          >
            {/* Copy Icon: w-6, h-6 */}
            <img src={CopySvg} alt="복사" className="w-6 h-6" />

            <span
              // Heading 3 - 500, text-xl, text-[#6B6B6B]
              className="font-['Noto Sans KR'] font-medium text-xl leading-[26px] text-[#6B6B6B]"
            >
              {isCopied ? '복사 완료!' : '디버그 정보 복사'}
            </span>
          </div>

          {/* 도움 요청 버튼 */}
          <button
            type="button"
            onClick={handleHelpRequest}
            // Button Styles
            className="flex justify-center items-center w-[201px] h-[46px] 
                           bg-[#837BBD] rounded-[16px] px-[30px] py-[12px] gap-2.5 
                           font-['Noto Sans KR'] font-medium text-xl leading-[26px] text-white 
                           cursor-pointer border-none transition-colors hover:bg-indigo-500"
          >
            도움 요청
          </button>
        </div>
      </div>
    </div>
  );
};

export default DebugModal;
