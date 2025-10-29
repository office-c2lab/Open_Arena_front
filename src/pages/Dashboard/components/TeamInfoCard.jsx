// src/components/TeamInfoSection/TeamInfoCard.jsx (최종 수정)

import React from 'react';
import AiModelIconSvg from '@/assets/icons/blue-ai-model.svg';
import PointIconSvg from '@/assets/icons/Point.svg';
import Skeleton from '@/components/Skeleton/Skeleton'; 

// 💡 TeamInfoCardSkeleton 컴포넌트 정의 (아이콘 배경색 수정)
const TeamInfoCardSkeleton = ({ cardStyle }) => {
	const cardWidth = '500px';
	const cardHeight = '150px';
	const iconWrapperSize = '84px';
	
	return (
		<div
			className="rounded-[20px] drop-shadow-md p-[33px] flex items-center gap-[30px]"
			style={{
				width: cardWidth,
				height: cardHeight,
				background: 'rgba(255, 255, 255, 0.8)',
				boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.25)',
				...cardStyle,
			}}
		>
			{/* 2. 텍스트 컨테이너 스켈레톤 (이 부분은 변경 없음) */}
			<div className="flex-1 flex items-center justify-between" style={{ height: '44px' }}>
				{/* 제목 스켈레톤 */}
				<Skeleton className="h-[84px] w-[84px]" />
        <Skeleton className="h-[52px] w-[200px]" /> 
				{/* 값 스켈레톤 */}
				<Skeleton className="h-[52px] w-20" /> 
			</div>
		</div>
	);
};


const TeamInfoCard = ({ title, value, iconType, valueColor, cardStyle, isLoading = false }) => {
	
	// 💡 로딩 중일 때 스켈레톤 렌더링
	if (isLoading) {
		return <TeamInfoCardSkeleton cardStyle={cardStyle} />;
	}

	// 로딩 완료 후 실제 콘텐츠 렌더링 (나머지 코드는 변경 없음)
	const cardWidth = '500px';
	const cardHeight = '150px';

	const iconWrapperSize = '84px';
	const iconBackground = '#000000';

	const IconComponentSrc = iconType === 'coin' ? PointIconSvg : AiModelIconSvg;

	return (
		<div
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
				className="flex-1 flex items-center justify-between" 
				style={{ height: '44px' }} 
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