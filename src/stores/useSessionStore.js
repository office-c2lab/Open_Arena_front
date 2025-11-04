import { create } from "zustand";

export const useSessionStore = create((set) => ({
  sessionId: null,
  setSessionId: (id) => set({ sessionId: id }),
  clearSession: () => set({ sessionId: null }),
}));
