// src/stores/useModalStore.js

import { create } from 'zustand';

/**
 * Zustand 모달 상태 관리 스토어
 */
const useModalStore = create((set, get) => ({
  // --------------------------------------------------------
  // 💡 1. 상태 정의
  // --------------------------------------------------------
  isDebugModalOpen: false,
  isResetModalOpen: false,
  isSubmitModalOpen: false,
  isLoadingModalOpen: false,
  isFailedModalOpen: false,
  isSuccessModalOpen: false,

  /**
   * Challenge.jsx의 handleResetChat 함수를 저장하는 상태
   */
  resetChatAction: () => {
    console.error('Reset action not yet registered in store.');
  },

  /**
   * Challenge.jsx의 handleSubmit 함수를 저장하는 상태
   */
  submitAction: () => {
    console.error('Submit action not yet registered in store.');
  },

  // --------------------------------------------------------
  // 💡 2. 액션 정의
  // --------------------------------------------------------

  /**
   * Challenge.jsx에서 handleResetChat을 스토어에 등록하는 액션
   */
  setResetChatAction: action => set({ resetChatAction: action }),

  /**
   * Challenge.jsx에서 handleSubmit을 스토어에 등록하는 액션
   */
  setSubmitAction: action => set({ submitAction: action }),

  // 모든 모달 닫기 함수 (내부 사용)
  closeAllModals: () =>
    set({
      isDebugModalOpen: false,
      isResetModalOpen: false,
      isSubmitModalOpen: false,
      isLoadingModalOpen: false,
      isFailedModalOpen: false,
      isSuccessModalOpen: false,
    }),

  // 디버그 모달
  openDebugModal: () => {
    get().closeAllModals();
    set({ isDebugModalOpen: true });
  },
  closeDebugModal: () => set({ isDebugModalOpen: false }),

  // 초기화 모달
  openResetModal: () => {
    get().closeAllModals();
    set({ isResetModalOpen: true });
  },
  closeResetModal: () => set({ isResetModalOpen: false }),

  // 제출 모달
  openSubmitModal: () => {
    get().closeAllModals();
    set({ isSubmitModalOpen: true });
  },
  closeSubmitModal: () => set({ isSubmitModalOpen: false }),

  // 로딩 모달
  openLoadingModal: () => {
    get().closeAllModals();
    set({ isLoadingModalOpen: true });
  },
  closeLoadingModal: () => set({ isLoadingModalOpen: false }),

  // 실패 모달
  openFailedModal: () => {
    get().closeAllModals();
    set({ isFailedModalOpen: true });
  },
  closeFailedModal: () => set({ isFailedModalOpen: false }),

  // 성공 모달
  openSuccessModal: () => {
    get().closeAllModals();
    set({ isSuccessModalOpen: true });
  },
  closeSuccessModal: () => set({ isSuccessModalOpen: false }),
}));

export default useModalStore;
