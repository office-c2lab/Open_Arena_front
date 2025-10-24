// src/components/Banner/Banner.jsx (Flexbox/Relative 기반 재구성)

import React from 'react';
// 아이콘 파일 경로 가정
import ArenaIcon from '@/assets/icons/Arena.svg';

// === 상수 데이터 (하드코딩) ===
const BANNER_TITLE = 'LLM Safety 챌린지';
const BANNER_SUBTITLE = '다양한 분야의 챗봇을 공격적으로 검증하라';
const BANNER_SPONSORED_BY = 'Sponsered by';
const BANNER_SPONSORS = ['Open AI', 'Anthropic', 'Google', 'Kakao', 'Naver', 'SKT'];

// === 스타일 정의 ===
const BG_GRADIENT = 'linear-gradient(132.45deg, #1B0028 25.16%, #3C1E4F 73.13%)';
const OVERLAY_GRADIENT =
  'linear-gradient(180deg, rgba(252, 52, 104, 0) 25.56%, rgba(252, 52, 104, 0.7) 100%)';
const VECTOR_COLOR = '#FF084A';
const SPONSOR_TAG_TEXT_COLOR = '#000000';

/**
 * Challenge 페이지 상단에 표시되는 단일 목적의 배너 컴포넌트 (Flexbox 기반)
 */
export default function Banner({ className = '' }) {
  // 배경 아이콘의 위치를 조정하기 위해 relative/absolute 및 translate를 사용합니다.

  return (
    <div
      className={`relative w-full h-[356px] flex-shrink-0 overflow-hidden ${className}`}
      style={{
        filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))',
        borderRadius: '20px',
      }}
    >
      {/* Rectangle 23958: 주 배경 (z-index 0) */}
      <div
        className="absolute inset-0 rounded-[20px] z-0"
        style={{
          background: BG_GRADIENT,
          boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        }}
      />
      {/* Rectangle 23959: 하단 오버레이 그라데이션 (z-index 10) */}
      <div
        className="absolute w-full h-[180px] bottom-0 z-10" // bottom-0으로 위치 지정
        style={{ background: OVERLAY_GRADIENT, borderRadius: '0 0 20px 20px' }}
      />
      {/* 💡 아이콘 (Vector 18 대체): 상대적 위치 지정으로 변경 (z-index 1) */}
      {/* 아이콘이 오른쪽에서 중앙보다 왼쪽으로 오도록 -translate-x-1/2 및 right-[150px] 사용 */}
      <img
        src={ArenaIcon}
        alt="Decorative Arena Icon"
        className="absolute w-[246.5px] h-[361.5px] top-[-2px] object-cover opacity-80 z-[1]" // right-0에서 픽셀 단위로 왼쪽으로 이동: 대략 1069px 배너 기준 830.5px은 오른쪽에서 238.5px
        style={{
          right: '30px', // 1069px - 830.5px = 238.5px
        }}
      />
      {/* 텍스트/스폰서 컨테이너: Flexbox를 사용하여 내부 요소 배치 (z-index 30) */}
      {/* Figma의 55px left 패딩을 px-14 (56px)로 사용 */}
      <div className="relative h-full flex flex-col pt-[45px] px-[55px] z-30">
        {/* LLM Safety 챌린지 */}
        <p
          className="heading-1 font-700 mb-[33px]" // 45px top -> pt-[45px]로 처리, 122px top -> mb-[33px] (122-45-44=33)
          style={{ color: VECTOR_COLOR }}
        >
          {BANNER_TITLE}
        </p>

        {/* 다양한 분야의 챗봇을 공격적으로 검증하라 */}
        <p
          className="heading-2 font-700 mb-[33px]" // 191px top -> mb-[33px] (191-122-36=33)
          style={{ color: '#FFFFFF' }}
        >
          {BANNER_SUBTITLE}
        </p>

        {/* Sponsered by */}
        <p
          className="heading-2 font-500 mb-[15px]" // 242px top -> mb-[15px] (242-191-36=15)
          style={{ color: '#FFFFFF' }}
        >
          {BANNER_SPONSORED_BY}
        </p>

        {/* 스폰서 태그 목록 */}
        <div className="flex flex-row gap-[12px] overflow-x-auto pb-2">
          {BANNER_SPONSORS.map((sponsor, index) => (
            <SponsorTag key={index} text={sponsor} icon={ArenaIcon} />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * 스폰서 로고/텍스트 태그 컴포넌트
 */
const SponsorTag = ({ text, icon }) => (
  <div
    className="w-[135px] h-[42px] flex flex-row justify-center items-center gap-2 flex-shrink-0
    bg-white rounded-[8px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] px-4"
  >
    {/* 아이콘 */}
    <img src={icon} alt={`${text} logo`} className="w-[20px] h-[20px] flex-shrink-0" />
    {/* 텍스트 (Open AI) */}
    <span
      className="body-large font-500 whitespace-nowrap overflow-hidden"
      style={{ color: SPONSOR_TAG_TEXT_COLOR }}
    >
      {text}
    </span>
  </div>
);
