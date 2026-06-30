export const CHALLENGE_CATEGORY = '챌린지';
export const TUTORIAL_CATEGORY = '튜토리얼';

export function normalizeProblemCategory(category) {
  return category === TUTORIAL_CATEGORY ? CHALLENGE_CATEGORY : category;
}
