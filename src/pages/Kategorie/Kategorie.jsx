import React, { useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom'; // 💡 useSearchParams 임포트

// 💡 데이터 임포트
import challengeData from '../../data/challengeData.json';

// 컴포넌트 임포트
import Banner from '../../components/Banner/Banner';
import ProblemCard from '../../components/ProblemCard/ProblemCard.jsx';

// 임시 난이도 배열
const difficulties = ['초급', '중급', '고급'];

const ChallengeSection = () => {
  const navigate = useNavigate();
  // 💡 URL 쿼리 파라미터 가져오기
  const [searchParams] = useSearchParams();
  const currentCategory = searchParams.get('category'); // 'category' 쿼리 값 (예: '코딩', '상담')
  // --- 데이터 가공 및 필터링 ---

  const processedChallenges = useMemo(() => {
    let index = 0;
    const allChallenges = []; // 1. 전체 데이터 가공

    for (const [categoryName, sectionData] of Object.entries(challengeData)) {
      sectionData.challenges.forEach(challenge => {
        allChallenges.push({
          ...challenge, // 카테고리는 JSON 키(한글 이름)를 그대로 사용
          category: categoryName, // 난이도는 배열을 순환하며 할당
          difficulty: difficulties[index % difficulties.length],
        });
        index++;
      });
    }

    // 2. 💡 필터링 로직 추가
    if (currentCategory) {
      // currentCategory 값과 챌린지 데이터의 category 필드를 비교하여 필터링
      return allChallenges.filter(challenge => challenge.category === currentCategory);
    }

    return allChallenges;
  }, [currentCategory]); // 💡 currentCategory가 변경될 때마다 useMemo 재실행
  // --- ProblemCard Solve 버튼 액션 핸들러 (라우팅) ---

  const handleSolveProblem = useCallback(
    challengeId => {
      console.log(`Problem ID: ${challengeId} - 문제풀기 버튼 클릭!`);
      navigate(`/challenge/${challengeId}`);
    },
    [navigate]
  );

  // 💡 H1 텍스트 업데이트 (필터링 상태 반영)
  const titleText = currentCategory ? `${currentCategory} 챌린지 목록` : '전체 챌린지 목록';

  return (
    <div className="w-full min-h-screen flex flex-col items-center p-6 gap-8">
      <div className="w-full max-w-[1069px] flex justify-center">
        <Banner />
      </div>
      {/* H1 태그: 필터링 상태와 정렬 유지 */}
      <h1
        className="heading-1 font-700  text-left max-w-[1080px] w-full mx-auto"
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
          {processedChallenges.map(challenge => (
            <ProblemCard
              key={challenge.id}
              challenge={challenge}
              onSolveClick={() => handleSolveProblem(challenge.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChallengeSection;
