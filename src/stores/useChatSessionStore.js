// src/stores/useChatSessionStore.js (최종 - 팀 ID 분리 적용)

import { create } from 'zustand';
import { useAuthStore } from './authStore'; // useAuthStore가 같은 디렉토리나 접근 가능한 경로에 있다고 가정
import { persist, createJSONStorage } from 'zustand/middleware'; // persist 미들웨어 사용 가정

// 세션 스토어 생성
const useChatSessionStore = create(
    // 💡 persist 미들웨어 적용 (로컬 스토리지 유지)
    persist(
        (set, get) => ({
            sessionId: null,
            isSessionLoading: false,

            /**
             * 💡 [핵심] 로컬 스토리지 키 생성 (challengeId와 teamId 포함)
             * @param {string} challengeId 
             * @param {number} teamId
             * @returns {string} 고유한 로컬 스토리지 키
             */
            createSessionStorageKey: (challengeId, teamId) => {
                // 예: 'chat-session-C01-team-1'
                return `chat-session-${challengeId}-team-${teamId}`;
            },

            /**
             * 세션 ID 저장 및 상태 업데이트
             * @param {string} challengeId
             * @param {string | number} newSessionId
             * @param {number} teamId 
             */
            setSessionId: (challengeId, newSessionId, teamId) => {
                const key = get().createSessionStorageKey(challengeId, teamId);
                // 로컬 스토리지에 저장
                localStorage.setItem(key, JSON.stringify({ sessionId: newSessionId }));
                set({ sessionId: newSessionId, isSessionLoading: false });
            },

            /**
             * 세션 ID 로드
             * @param {string} challengeId
             * @param {number} teamId 
             * @returns {string | null} 로드된 세션 ID
             */
            loadSessionId: (challengeId, teamId) => {
                const key = get().createSessionStorageKey(challengeId, teamId);
                const stored = localStorage.getItem(key);
                if (stored) {
                    const data = JSON.parse(stored);
                    set({ sessionId: data.sessionId, isSessionLoading: false });
                    return data.sessionId;
                }
                set({ sessionId: null, isSessionLoading: false });
                return null;
            },

            /**
             * 세션 상태 초기화 (sessionId만 null로 설정)
             */
            resetSessionState: () => set({ sessionId: null, isSessionLoading: false }),
        }),
        {
            // persist 설정
            name: 'chat-session-store', 
            storage: createJSONStorage(() => localStorage), 
            // ⚠️ 세션 ID는 매번 고유 키로 로드되므로, 여기에 저장되는 상태는 sessionId만 아니면 무방함.
            // 하지만 sessionId만 저장하므로, 이 persist는 실질적으로는 사용되지 않을 수 있음.
            // 핵심 로직은 setSessionId와 loadSessionId 내의 localStorage 직접 접근입니다.
            partialize: (state) => ({ 
                // 스토어 자체에는 sessionId를 저장하지 않고 로컬스토리지에만 저장하는 방식을 위해 비워둡니다.
            }),
        }
    )
);

export default useChatSessionStore;