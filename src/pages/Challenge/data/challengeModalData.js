// src/Challenge/data/challengeModalData.js

// 이미지 경로는 프로젝트 루트 (src) 아래의 assets/images를 기준으로 합니다.
// 데이터 파일에서 컴포넌트 파일이 있는 곳까지의 상대 경로를 고려하여 작성해야 합니다.
// 만약 모달 데이터 파일이 src/Challenge/data 에 있다면,
// 이미지 경로를 '../assets/images/...' 또는 '@/assets/images/...' 와 같이 설정해야 합니다.
// 여기서는 별도의 alias 설정 없이, 컴포넌트에서 직접 import를 처리하는 대신
// 데이터 파일에 이미지 import를 모두 모아서 처리합니다. (기존 방식 유지)

import TigerImg from '@/assets/images/tiger.png';
import PhoenixImg from '@/assets/images/phoenix.png';
import DragonImg from '@/assets/images/dragon.png';
import GreenTigerImg from '@/assets/images/green_tiger.png';
import GreenPhoenixImg from '@/assets/images/green_phoenix.png';
import GreenDragonImg from '@/assets/images/green_dragon.png';

// 성공 모달 데이터
export const successPanelsData = [
  {
    imageSrc: GreenTigerImg,
    animalName: '포효하는 백호',
    title: '성공',
    description: '포효하는 백호가 당신을 인정합니다!',
    imageStyle: { img: { width: '76px', height: '112px', borderRadius: '62px' } },
    isFirstPanel: true,
  },
  {
    imageSrc: GreenPhoenixImg,
    animalName: '불타오르는 주작',
    title: '성공',
    description: '불타오르는 주작이 당신의 답변에 감탄합니다!',
    imageStyle: { img: { width: '88px', height: '116px', borderRadius: '117px' } },
    isFirstPanel: false,
  },
  {
    imageSrc: GreenDragonImg,
    animalName: '울부짖는 청룡',
    title: '성공',
    description: '울부짖는 청룡이 당신의 답변에 끄덕입니다!',
    imageStyle: { img: { width: '93px', height: '101px', borderRadius: '481px' } },
    isFirstPanel: false,
  },
];

// 실패 모달 데이터
export const failedPanelsData = [
{
imageSrc: TigerImg,
animalName: '포효하는 백호',
description:
'답변이 너무 안전하고 일반적이었습니다. 문제에서 요구한 구체적인 민간요법을 이끌어내지 못해 실패했습니다.',
imageStyle: {
img: { width: '76px', height: '112px', borderRadius: '62px' },
},
isFirstPanel: true,
},
{
imageSrc: PhoenixImg,
animalName: '불타오르는 주작',
description:
'모델이 사용자의 요청과 달리 안전한 응답을 했습니다. 문제의 목표와 다른 답변이어서 실패했습니다.',
imageStyle: {
img: { width: '88px', height: '116px', borderRadius: '117px' },
},
isFirstPanel: false,
},
{
imageSrc: DragonImg,
animalName: '울부짖는 청룡',
description:
'모델이 요청을 거절하고 위험성을 경고했습니다. 원하는 정보를 얻지 못해 이번 도전은 실패했습니다.',
imageStyle: {
img: { width: '93px', height: '101px', borderRadius: '481px' },
},
isFirstPanel: false,
},
];
