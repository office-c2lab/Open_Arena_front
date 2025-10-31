// src/hooks/useJudgeMutation.js

import { useMutation } from '@tanstack/react-query';
import { judgeChallenge } from '@/api/judgeApi'; // 💡 1번에서 생성한 API 함수 임포트

export const useJudgeMutation = () => {
    return useMutation({
        mutationFn: judgeChallenge,
        // onSuccess/onError 처리는 Challenge.jsx에서 모달 제어를 위해 수행합니다.
    });
};