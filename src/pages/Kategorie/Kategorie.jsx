import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// ⭐️ axiosInstance 임포트
import api from '@/api/axiosInstance'; 

// 컴포넌트 임포트
import Banner from '../../components/Banner/Banner';
import ProblemCard from '../../components/ProblemCard/ProblemCard.jsx';

// API 정보 (baseURL은 axiosInstance에 설정되어 있으므로 경로만 사용)
const API_PATH = '/problem/all'; 

// 스켈레톤 카드 개수
const SKELETON_COUNT = 9; 

const ChallengeSection = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentCategory = searchParams.get('category');

  // 로딩 상태
  const [isLoading, setIsLoading] = useState(true);
  // 문제 목록
  const [challenges, setChallenges] = useState([]); 
  // 에러 상태
  const [error, setError] = useState(null); 

  // 🔽 API 호출 로직
  useEffect(() => {
    const fetchProblems = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // ⭐️ api 인스턴스 사용
        const response = await api.get(API_PATH);
        const data = response.data;

        // 📡 원본 데이터 출력
        console.log("📡 원본 API 응답 데이터:", data);

        // ✅ score 포함 데이터 가공
        const problemsWithMeta = data.map(problem => ({
          ...problem,
          id: problem.id,
          score: problem.score,
        }));

        // 콘솔로 간결하게 표시
        console.log(
          "✅ API에서 받은 문제 목록 (ID 및 점수 포함):",
          problemsWithMeta.map(p => ({
            id: p.id,
            title: p.title,
            score: p.score,
            category: p.category,
          }))
        );

        setChallenges(problemsWithMeta);
      } catch (err) {
        console.error("문제 목록을 불러오는 중 오류 발생:", err);
        setError("문제 목록을 불러오는 데 실패했습니다. 서버 상태를 확인해주세요.");
        setChallenges([]); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchProblems();
  }, []);

  // --- 데이터 필터링 ---
  const processedChallenges = useMemo(() => {
    if (isLoading || error) return [];
    
    if (currentCategory) {
      return challenges.filter(challenge => challenge.category === currentCategory);
    }

    return challenges;
  }, [currentCategory, challenges, isLoading, error]);

  // --- Solve 버튼 액션 ---
  const handleSolveProblem = useCallback(
    problemId => { 
      console.log(`Problem ID: ${problemId} - 문제풀기 버튼 클릭!`);
      navigate(`/challenge/${problemId}`);
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
      
      {/* 챌린지 카드 리스트 */}
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
            [...Array(SKELETON_COUNT)].map((_, index) => (
              <ProblemCard key={index} isLoading={true} />
            ))
          ) : error ? (
            <p className="text-lg text-red-600 col-span-full">오류: {error}</p>
          ) : processedChallenges.length === 0 ? (
            <p className="text-lg text-gray-500 col-span-full">
              {currentCategory
                ? `${currentCategory}에 해당하는 문제가 없습니다.`
                : '등록된 문제가 없습니다.'}
            </p>
          ) : (
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
