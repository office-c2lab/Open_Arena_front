// src/features/challenge/ChallengeModals/SubmitModal.jsx

import React, { useCallback } from 'react';
import useModalStore from '@/stores/useModalStore';
import { useSessionStore } from '@/stores/useSessionStore'; 
import api from '@/api/axiosInstance'; // axios 인스턴스

// 🚨 [필요] Challenge.jsx에서 사용하던 패널 데이터들을 임포트해야 합니다.
// 경로를 가정하여 추가합니다. 실제 프로젝트 구조에 맞게 수정해주세요.
import { successPanelsData, failedPanelsData } from '../data/challengeModalData'; 

// === 아이콘 import ===
import CancelSvg from '../../../assets/icons/cancel.svg';
import ArenaSvg from '../../../assets/icons/Arena.svg';
// ===================

// 닫기 버튼 컴포넌트
const CancelIcon = ({ onClick }) => (
    <div
        onClick={onClick}
        className="absolute top-[30px] right-[30px] w-[18px] h-[18px] cursor-pointer"
    >
        <img src={CancelSvg} alt="닫기" className="w-full h-full" />
    </div>
);

/**
* 챌린지 제출 확인 모달 컴포넌트
*/
const SubmitModal = () => {
    const isSubmitModalOpen = useModalStore(state => state.isSubmitModalOpen);
    
    // ⭐️ [수정] useModalStore에서 필요한 모든 액션을 가져옵니다.
    const { 
        closeSubmitModal, 
        openLoadingModal, 
        closeLoadingModal, 
        openSuccessModal, 
        openFailedModal, 
        setChallengeResults // 결과 저장 액션
    } = useModalStore();

    // 세션 ID를 가져옵니다.
    const { sessionId } = useSessionStore(); 

    console.log(`[SubmitModal 렌더링 확인] 현재 sessionId: ${sessionId}`);

    // 제출 API 호출 및 모달 제어 로직 통합
    const submitForJudgement = useCallback(async () => {
        if (!sessionId) { 
            console.error('세션 ID가 없습니다. (SubmitModal) - 제출 중단');
            alert('제출할 채팅 세션이 없습니다.');
            return;
        }

        // 🚨 [에러 해결] sessionId가 숫자가 아닌 객체로 인식되는 것을 방지합니다.
        // useSessionStore에서 sessionId가 문자열/숫자가 아닌 객체로 반환되는 경우,
        // 이를 방지하기 위해 useSessionStore의 정의를 확인하거나, 필요 시 여기서 강제 변환합니다.
        const validSessionId = typeof sessionId === 'number' || typeof sessionId === 'string' ? sessionId : null;
        if (!validSessionId) {
            console.error('유효하지 않은 세션 ID 형식입니다. (SubmitModal) - 제출 중단');
            return;
        }
        
        const endpoint = `/judge/sessions/${validSessionId}/submit`; // ⭐️ 유효한 세션 ID 사용
        console.log(`[API 요청 시작] Endpoint: ${endpoint}`);
        
        try {
            // 1. 제출 모달 닫기
            closeSubmitModal();

            // 2. 로딩 모달 열기
            openLoadingModal();

            // 3. 실제 API 호출
            const res = await api.post(endpoint, {}); 
            const resultData = res.data;

            console.log('✅ 제출 API 호출 성공');
            console.log('✅ 제출 결과:', resultData);
            
            // 4. 로딩 모달 닫기
            closeLoadingModal();

            // 5. 결과 데이터 가공 및 저장 (Challenge.jsx의 로직 복사)
            const results = (resultData.results || []).map((vote, index) => {
                const isSuccess = vote.verdict === 'success';
                const baseData = isSuccess
                    ? successPanelsData[index % successPanelsData.length]
                    : failedPanelsData[index % failedPanelsData.length];

                return {
                    status: vote.verdict, 
                    data: {
                        ...baseData,
                        title: vote.model, 
                        description: vote.output || baseData.description, 
                    },
                };
            });
            setChallengeResults(results);

            // 6. 결과 모달 열기: data.status를 기준으로 판단 (Challenge.jsx의 로직 복사)
            if (resultData.status === 'success') {
                openSuccessModal();
                console.log('✅ Success Modal 열기 함수 호출됨');
            }
            else {
                openFailedModal();
                console.log('❌ Failed Modal 열기 함수 호출됨. API Status:', resultData.status);
            }

        } catch (err) {
            console.error('❌ 제출 실패', err);
            
            // 7. 실패 시 로딩 모달 닫기 및 실패 모달 열기
            closeLoadingModal();
            openFailedModal(); 
            alert(`제출 실패: ${err.message}`);
        }
    }, [sessionId, closeSubmitModal, openLoadingModal, closeLoadingModal, openSuccessModal, openFailedModal, setChallengeResults]); 
    // 디펜던시 배열에 사용된 모든 함수와 상태를 포함

    if (!isSubmitModalOpen) return null;

    return (
        // Overlay: z-[1000]로 최상단에 위치
        <div className="fixed inset-0 bg-[rgba(1,1,1,0.6)] flex justify-center items-center z-[1000]">
            <div className="relative w-[403.65px] h-[586.46px] bg-white rounded-[16px] box-border">
                {/* 닫기 버튼 */}
                <CancelIcon onClick={closeSubmitModal} />

                {/* ARENA 로고/헤더 영역 (유지) */}
                <div className="absolute left-[30px] top-[17px] w-[105px] h-[42px] flex items-center">
                    <div className="w-[29px] h-[42px] flex justify-center items-center">
                        <img src={ArenaSvg} alt="ARENA 로고" className="w-full h-full" />
                    </div>
                    <span className="ml-[9px] heading-3 font-700 text-[#FF084A]">ARENA</span>
                </div>

                {/* 메인 아이콘 (유지) */}
                <div
                    className="absolute top-[105px] left-1/2 -translate-x-1/2 w-[148px] h-[218px] 
                    flex justify-center items-center"
                >
                    <img src={ArenaSvg} alt="제출 아이콘" className="w-full h-full opacity-30" />
                </div>

                {/* 경고 메시지 (유지) */}
                <div
                    className="absolute w-[340px] left-[31px] top-[324px]
                    text-center heading-3 font-500 text-black m-0 whitespace-pre-wrap"
                >
                    <p>제출하면 세 개의 JUDGE AI 모델이 각각 판단하여 성공/실패 결과를 제공합니다.</p>
                    <p>대화 내용은 저장되어 챌린지 화면 우측에서 확인 하실 수 있습니다.</p>
                </div>

                {/* 제출하기 버튼 */}
                <button
                    type="button"
                    onClick={submitForJudgement} // ⭐️ API 호출 함수 연결
                    className={`absolute w-[343.2px] h-[60.45px] left-[30.22px] top-[496.28px]
                    flex justify-center items-center 
                    bg-[#FF6289] rounded-[29.25px] cursor-pointer 
                    hover:bg-pink-600 transition duration-200 ${!sessionId ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!sessionId} // 세션 ID가 없으면 모달 내 버튼도 비활성화
                >
                    <span className="heading-3 font-700 text-white">제출하기</span>
                </button>
            </div>
        </div>
    );
};

export default SubmitModal;