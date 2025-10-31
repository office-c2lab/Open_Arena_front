// /src/stores/useChatSessionStore.js

import { create } from 'zustand';

// 로컬 스토리지를 위한 키 프리픽스
const SESSION_KEY_PREFIX = 'chatSessionId_';

const useChatSessionStore = create((set, get) => ({
  // 현재 활성화된 세션 ID
  sessionId: null,
  
  // 세션 생성 또는 로드 중인지 여부
  isSessionLoading: true, 

  /**
   * 세션 ID를 로컬 스토리지에 저장하고 상태를 업데이트합니다.
   */
  setSessionId: (challengeId, newSessionId) => {
    const storageKey = `${SESSION_KEY_PREFIX}${challengeId}`;
    localStorage.setItem(storageKey, newSessionId);
    set({ sessionId: newSessionId, isSessionLoading: false });
  },

  /**
   * 로컬 스토리지에서 세션 ID를 로드하여 상태에 설정합니다.
   */
  loadSessionId: (challengeId) => {
    const storageKey = `${SESSION_KEY_PREFIX}${challengeId}`;
    const storedSessionId = localStorage.getItem(storageKey);
    
    if (storedSessionId) {
      set({ sessionId: storedSessionId, isSessionLoading: false });
      return storedSessionId;
    }

    // 로드 실패 시, 로딩 상태를 'false'로 설정하고 sessionId는 'null' 유지
    set({ isSessionLoading: false });
    return null;
  },
  
  /**
   * 세션 상태를 초기화하고 로딩 상태를 'true'로 설정합니다.
   */
  resetSessionState: () => {
    set({ sessionId: null, isSessionLoading: true });
  }
}));

export default useChatSessionStore;