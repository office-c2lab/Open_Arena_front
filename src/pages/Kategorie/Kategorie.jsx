import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// ⭐️ axiosInstance 임포트
import api from '@/api/axiosInstance'; 

// 컴포넌트 임포트
import Banner from '../../components/Banner/Banner';
import ProblemCard from '../../components/ProblemCard/ProblemCard.jsx';

// API 정보 (baseURL은 axiosInstance에 설정되어 있으므로 경로만 사용)
const API_PATH = '/problem/all'; 

// 임시 난이도 배열 (API에 난이도가 없는 경우를 대비)
const difficulties = ['초급', '중급', '고급'];

// 스켈레톤 카드의 개수를 정의합니다.
const SKELETON_COUNT = 9; 

const ChallengeSection = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const currentCategory = searchParams.get('category');

    // 로딩 상태 관리
    const [isLoading, setIsLoading] = useState(true);
    // API에서 가져온 원본 문제 목록 상태
    const [challenges, setChallenges] = useState([]); 
    // 에러 상태
    const [error, setError] = useState(null); 

    // 🔽 API 호출 로직: axios 사용
    useEffect(() => {
        const fetchProblems = async () => {
            setIsLoading(true); // 로딩 시작
            setError(null);
            
            try {
                // ⭐️ api 인스턴스 사용
                const response = await api.get(API_PATH);
                // axios는 응답 데이터를 자동으로 .data에 넣어줍니다.
                const data = response.data; 
                
                // ⚠️ API 응답 데이터에 difficulty와 id를 추가하는 로직 (이전과 동일)
                let index = 0;
                const problemsWithMeta = data.map(problem => {
                    index++;
                    return {
                        ...problem,
                        // 임시 난이도 할당
                        difficulty: difficulties[index % difficulties.length],
                        // 임시 ID 할당 (문제 해결 버튼에 필요)
                        // 'title'을 기반으로 하는 것이 더 안전할 수 있지만, 여기서는 index 사용
                        id: `problem-${index}`, 
                    };
                });
                
                setChallenges(problemsWithMeta);

            } catch (err) {
                // ⭐️ axios의 에러 처리: err.message나 err.response 등을 확인
                console.error("문제 목록을 불러오는 중 오류 발생:", err);
                // 사용자에게 보여줄 에러 메시지 설정
                setError("문제 목록을 불러오는 데 실패했습니다. 서버 상태를 확인해주세요.");
                setChallenges([]); 
            } finally {
                setIsLoading(false); // 로딩 종료
            }
        };

        fetchProblems();
    }, []); // 최초 마운트 시에만 API 호출

    // --- 데이터 필터링 (useMemo 로직은 이전과 동일) ---
    const processedChallenges = useMemo(() => {
        if (isLoading || error) return [];
        
        if (currentCategory) {
            return challenges.filter(challenge => challenge.category === currentCategory);
        }

        return challenges;
    }, [currentCategory, challenges, isLoading, error]);

    // --- ProblemCard Solve 버튼 액션 핸들러 (이전과 동일) ---
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
                    {/* 조건부 렌더링 (이전과 동일) */}
                    {isLoading ? (
                        [...Array(SKELETON_COUNT)].map((_, index) => (
                            <ProblemCard key={index} isLoading={true} />
                        ))
                    ) : error ? (
                        // 에러 메시지 렌더링
                        <p className="text-lg text-red-600 col-span-full">오류: {error}</p>
                    ) : processedChallenges.length === 0 ? (
                        // 데이터 없음 메시지 렌더링
                        <p className="text-lg text-gray-500 col-span-full">{currentCategory ? `${currentCategory}에 해당하는 문제가 없습니다.` : '등록된 문제가 없습니다.'}</p>
                    ) : (
                        // 실제 데이터 렌더링
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