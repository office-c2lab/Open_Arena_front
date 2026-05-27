import React, { useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

// ⭐ axiosInstance
import api from '@/api/axiosInstance';

// 컴포넌트
import Banner from '../../components/Banner/Banner';
import ProblemCard from '../../components/ProblemCard/ProblemCard';

// API 경로
const API_PATH = '/problem/all';

// 스켈레톤 개수
const SKELETON_COUNT = 9;

const ChallengeSection = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentCategory = searchParams.get('category');

  // 🔥 React Query 기반 API 호출 + 폴링
  const {
    data: challenges = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['problems'],
    queryFn: async () => {
      const res = await api.get(API_PATH);
      return res.data.map(problem => ({
        ...problem,
        id: problem.id,
        score: problem.score,
      }));
    },
    refetchInterval: 1000, // 🔥 1초 폴링
    refetchOnWindowFocus: true, // 포커스 복귀하면 즉시 갱신
    staleTime: 0,
  });

  // --- 데이터 필터링 ---
  const processedChallenges = useMemo(() => {
    if (isLoading || isError) return [];

    if (currentCategory) {
      return challenges.filter(challenge => challenge.category === currentCategory);
    }
    return challenges;
  }, [currentCategory, challenges, isLoading, isError]);

  // --- Solve 버튼 ---
  const handleSolveProblem = useCallback(
    problemId => {
      navigate(`/challenge/${problemId}`);
    },
    [navigate]
  );

  const titleText = currentCategory ? `${currentCategory} 챌린지 목록` : '전체 챌린지 목록';

  return (
    <div className="w-full min-h-screen flex flex-col items-center p-6 gap-8">
      <Banner />

      <h1 className="heading-1 font-700 text-left max-w-[1080px] w-full mx-auto text-[#FF4854]">
        {titleText}
      </h1>

      {/* 챌린지 카드 리스트 */}
      <div className="w-full p-4 flex justify-center">
        <div
          className="
            grid
            grid-cols-[repeat(auto-fit,minmax(339px,1fr))]
            gap-3
            justify-items-center
            max-w-[1080px]
            w-full
          "
        >
          {isLoading ? (
            [...Array(SKELETON_COUNT)].map((_, index) => (
              <ProblemCard key={index} isLoading={true} />
            ))
          ) : isError ? (
            <p className="text-lg text-red-600 col-span-full">오류: {error?.message}</p>
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
