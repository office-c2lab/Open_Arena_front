// src/hooks/useFetchProblems.js

import { useState, useEffect } from 'react';
import api from '@/api/axiosInstance'; 

const API_PATH = '/problem/all';
const difficulties = ['초급', '중급', '고급'];

/**
 * 모든 문제 목록을 불러오는 커스텀 훅
 * @returns {{
 * challenges: Array<Object>,
 * isLoading: boolean,
 * error: string | null
 * }}
 */
const useFetchProblems = () => {
    const [challenges, setChallenges] = useState([]); 
    const [isLoading, setIsLoading] = useState(true); 
    const [error, setError] = useState(null); 

    useEffect(() => {
        const fetchProblems = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                const response = await api.get(API_PATH);
                const data = response.data; 
                
                // 난이도 및 ID 할당 로직
                let index = 0;
                const problemsWithMeta = data.map(problem => {
                    index++;
                    return {
                        ...problem,
                        difficulty: difficulties[index % difficulties.length],
                        id: `problem-${index}`, 
                    };
                });
                
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
    }, []); // 최초 마운트 시에만 실행

    return { challenges, isLoading, error };
};

export default useFetchProblems;