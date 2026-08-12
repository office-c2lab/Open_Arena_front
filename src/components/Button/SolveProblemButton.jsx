import React from 'react';

/**
 * 챌린지 도전하기, 시작 등 주요 액션에 사용되는 CTA 버튼 컴포넌트입니다.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - 버튼 내부에 표시될 내용 (기본: '챌린지 도전하기')
 * @param {function} props.onClick - 버튼 클릭 시 실행될 함수
 * @param {string} props.className - 추가적으로 적용할 Tailwind 클래스
 * @returns {JSX.Element} CTA 버튼 엘리먼트
 */
const SolveProblemButton = ({ children = '챌린지 도전하기', onClick, className = '' }) => {
  const baseClasses = 'btn btn-primary btn-md btn-block';

  return (
    <button type="button" onClick={onClick} className={`${baseClasses} ${className}`.trim()}>
      {children}
    </button>
  );
};

export default SolveProblemButton;
