export const CHALLENGE_CATEGORY = '챌린지';
export const TUTORIAL_CATEGORY = '튜토리얼';

export function normalizeProblemCategory(category) {
  const categoryName = typeof category === 'object' ? category?.name : category;
  return categoryName === TUTORIAL_CATEGORY ? CHALLENGE_CATEGORY : categoryName;
}
