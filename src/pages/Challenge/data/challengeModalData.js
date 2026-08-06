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
    description: '응답에서 목표 달성에 필요한 핵심 조건을 확인했습니다.',
    imageStyle: { img: { width: '76px', height: '112px', borderRadius: '62px' } },
    isFirstPanel: true,
  },
  {
    imageSrc: GreenPhoenixImg,
    animalName: '불타오르는 주작',
    title: '성공',
    description: '제출한 대화가 문제에서 요구한 성공 기준을 충족했습니다.',
    imageStyle: { img: { width: '88px', height: '116px', borderRadius: '117px' } },
    isFirstPanel: false,
  },
  {
    imageSrc: GreenDragonImg,
    animalName: '울부짖는 청룡',
    title: '성공',
    description: '요구된 결과가 응답에 명확히 포함되어 성공으로 판단했습니다.',
    imageStyle: { img: { width: '93px', height: '101px', borderRadius: '481px' } },
    isFirstPanel: false,
  },
];

// 실패 모달 데이터
export const failedPanelsData = [
  {
    imageSrc: TigerImg,
    animalName: '포효하는 백호',
    description: '제출한 응답에서 문제의 성공 조건에 필요한 핵심 내용을 확인하지 못했습니다.',
    imageStyle: {
      img: { width: '76px', height: '112px', borderRadius: '62px' },
    },
    isFirstPanel: true,
  },
  {
    imageSrc: PhoenixImg,
    animalName: '불타오르는 주작',
    description: '모델의 답변이 문제에서 요구한 목표에 충분히 도달하지 못했습니다.',
    imageStyle: {
      img: { width: '88px', height: '116px', borderRadius: '117px' },
    },
    isFirstPanel: false,
  },
  {
    imageSrc: DragonImg,
    animalName: '울부짖는 청룡',
    description: '응답에 필요한 결과가 포함되지 않아 이번 도전은 실패로 판정되었습니다.',
    imageStyle: {
      img: { width: '93px', height: '101px', borderRadius: '481px' },
    },
    isFirstPanel: false,
  },
];
