import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFavoriteProblemsStore = create(
  persist(
    set => ({
      favoriteProblemIds: [],
      toggleFavorite: problemId =>
        set(state => ({
          favoriteProblemIds: state.favoriteProblemIds.includes(problemId)
            ? state.favoriteProblemIds.filter(id => id !== problemId)
            : [...state.favoriteProblemIds, problemId],
        })),
    }),
    { name: 'favorite-problems-storage' }
  )
);
