// src/components/TeamInfoSection/TeamInfoCard.jsx (단일 수평 Flexbox 버전)

import React from 'react';
// SVG 파일 임포트 (경로는 프로젝트 구조에 맞게 조정 필요)
import AiModelIconSvg from '@/assets/icons/blue-ai-model.svg';
import PointIconSvg from '@/assets/icons/Point.svg';

const TeamInfoCard = ({ title, value, iconType, valueColor, cardStyle }) => {
  const cardWidth = '500px';
  const cardHeight = '150px';

  const iconWrapperSize = '84px';
  const iconBackground = '#000000';

  const IconComponentSrc = iconType === 'coin' ? PointIconSvg : AiModelIconSvg;

  return (
    <div
      // 💡 전체 카드를 수평 Flex 컨테이너로 사용
      className="rounded-[20px] drop-shadow-md p-[33px] flex items-center gap-[30px]"
      style={{
        width: cardWidth,
        height: cardHeight,
        background: 'rgba(255, 255, 255, 0.8)',
        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.25)',
        ...cardStyle,
      }}
    >
      {/* 1. 아이콘 래퍼 (고정) */}
      <div
        className="flex-shrink-0 flex items-center justify-center rounded-[10px]"
        style={{
          width: iconWrapperSize,
          height: iconWrapperSize,
          background: iconBackground,
        }}
      >
        <img
          src={IconComponentSrc}
          alt={`${iconType} icon`}
          style={{
            width: iconType === 'coin' ? '58px' : '58px',
            height: iconType === 'coin' ? '57px' : '58px',
          }}
        />
      </div>

      {/* 2. 텍스트 컨테이너: 제목과 값을 한 줄에 나란히 배치 */}
      <div
        className="flex-1 flex items-center justify-between" // 💡 한 줄 수평 배치: items-center, justify-between
        style={{ height: '44px' }} // 제목/값의 텍스트 라인 높이에 맞춤
      >
        {/* 2-1. 제목 (왼쪽 끝) */}
        <div>
          <span className="heading-1 font-500 text-[#000000]">{title}</span>
        </div>

        {/* 2-2. 값 (오른쪽 끝) */}
        <div>
          <span className="heading-1 font-700 text-right" style={{ color: valueColor }}>
            {value}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TeamInfoCard;
