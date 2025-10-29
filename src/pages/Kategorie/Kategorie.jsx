import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// 데이터 임포트
import challengeData from '@/data/challengedata.json';

// 컴포넌트 임포트
import Banner from '../../components/Banner/Banner';
import ProblemCard from '../../components/ProblemCard/ProblemCard.jsx';

// 임시 난이도 배열
const difficulties = ['초급', '중급', '고급'];

// 스켈레톤 카드의 개수를 정의합니다.
const SKELETON_COUNT = 9; 

const ChallengeSection = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentCategory = searchParams.get('category');

  // 로딩 상태 관리
  const [isLoading, setIsLoading] = useState(true);

  // 데이터 로딩 시뮬레이션 및 로딩 상태 변경
  useEffect(() => {
    // 실제 API 호출 로직이 이 위치에 들어갑니다.
    // 여기서는 로딩 스켈레톤을 1.5초간 보여준 후 데이터 로드가 완료되었다고 가정합니다.
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); 

    return () => clearTimeout(timer); // 클린업 함수
  }, [currentCategory]);


  // --- 데이터 가공 및 필터링 ---
  const processedChallenges = useMemo(() => {
    // 로딩 중일 때는 데이터 처리를 건너뛰고 빈 배열을 반환합니다.
    if (isLoading) return []; 
      
    let index = 0;
    const allChallenges = [];

    for (const [categoryName, sectionData] of Object.entries(challengeData)) {
      sectionData.challenges.forEach(challenge => {
        allChallenges.push({
          ...challenge,
          category: categoryName,
          difficulty: difficulties[index % difficulties.length],
        });
        index++;
      });
    }

    if (currentCategory) {
      return allChallenges.filter(challenge => challenge.category === currentCategory);
    }

    return allChallenges;
  }, [currentCategory, isLoading]);

  // --- ProblemCard Solve 버튼 액션 핸들러 (라우팅) ---
  const handleSolveProblem = useCallback(
    challengeId => {
      console.log(`Problem ID: ${challengeId} - 문제풀기 버튼 클릭!`);
      navigate(`/challenge/${challengeId}`);
    },
    [navigate]
  );

  const titleText = currentCategory ? `${currentCategory} 챌린지 목록` : '전체 챌린지 목록';

  return (
    <div className="w-full min-h-screen flex flex-col items-center p-6 gap-8">
      <div>
        <Banner />
      </div>
      
      <h1
        className="heading-1 font-700 text-left max-w-[1080px] w-full mx-auto"
        style={{ color: '#FF4854' }}
      >
        {titleText}
      </h1>
      
      {/* 챌린지 카드 리스트 렌더링 영역 */}
      <div className="w-full p-4 flex justify-center">
        <div
          className={`
          grid 
          grid-cols-[repeat(auto-fit,minmax(339px,1fr))] 
          gap-3
          justify-items-center 
          mx-auto 
          max-w-[1080px] 
          w-full
          `}
        >
          {/* 조건부 렌더링 */}
          {isLoading ? (
            // 로딩 중일 때: 스켈레톤 카드를 SKELETON_COUNT만큼 반복하여 렌더링
            [...Array(SKELETON_COUNT)].map((_, index) => (
              <ProblemCard key={index} isLoading={true} />
            ))
          ) : (
            // 로딩 완료 후: 실제 데이터를 매핑하여 렌더링
            processedChallenges.map(challenge => (
              <ProblemCard
                key={challenge.id}
                challenge={challenge}
                onSolveClick={() => handleSolveProblem(challenge.id)}
                isLoading={false} 
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ChallengeSection;