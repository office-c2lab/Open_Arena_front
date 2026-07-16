import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { CHALLENGE_CATEGORY, normalizeProblemCategory } from '@/utils/problemCategory';

// 컴포넌트
import Banner from '../../components/Banner/Banner';
import ProblemCard from '../../components/ProblemCard/ProblemCard';

// 스켈레톤 개수
const SKELETON_COUNT = 9;

const getProblemRouteId = problem => problem?.problem_id ?? problem?.problemId ?? problem?.id;

const ChallengeSection = () => {
  const navigate = useNavigate();

  const {
    data: challenges = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['problems'],
    queryFn: async () => [],
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  // --- 데이터 필터링 ---
  const processedChallenges = useMemo(() => {
    if (isLoading || isError) return [];

    return challenges.filter(
      challenge => normalizeProblemCategory(challenge.category) === CHALLENGE_CATEGORY
    );
  }, [challenges, isLoading, isError]);

  // --- Solve 버튼 ---
  const handleSolveProblem = useCallback(
    problemId => {
      navigate(`/challenge/${problemId}`);
    },
    [navigate]
  );

  const titleText = `${CHALLENGE_CATEGORY} 목록`;

  return (
    <div className="w-full min-h-screen flex flex-col items-center gap-8">
      <Banner />

      <h1 className="heading-1 font-700 text-left w-full text-[#FF4854]">
        {titleText}
      </h1>

      {/* 챌린지 카드 리스트 */}
      <div className="w-full flex justify-center">
        <div
          className="
            grid
            grid-cols-[repeat(auto-fit,minmax(339px,1fr))]
            gap-3
            justify-items-center
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
              {`${CHALLENGE_CATEGORY} 카테고리에 해당하는 문제가 없습니다.`}
            </p>
          ) : (
            processedChallenges.map(challenge => (
              <ProblemCard
                key={getProblemRouteId(challenge)}
                challenge={challenge}
                onSolveClick={() => handleSolveProblem(getProblemRouteId(challenge))}
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
