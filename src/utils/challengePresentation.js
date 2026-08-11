import ProblemImage1 from '@/assets/images/problemimages/p1.png';
import ProblemImage2 from '@/assets/images/problemimages/p2.png';
import ProblemImage3 from '@/assets/images/problemimages/p3.png';
import ProblemImage4 from '@/assets/images/problemimages/p4.png';
import ProblemImage5 from '@/assets/images/problemimages/p5.png';
import ProblemImage6 from '@/assets/images/problemimages/p6.png';
import ProblemImage7 from '@/assets/images/problemimages/p7.png';
import ProblemImage8 from '@/assets/images/problemimages/p8.png';
import ProblemImage9 from '@/assets/images/problemimages/p9.png';
import ProblemImage10 from '@/assets/images/problemimages/p10.png';
import ProblemImage11 from '@/assets/images/problemimages/p11.png';

const PROBLEM_IMAGES = [
  ProblemImage1,
  ProblemImage2,
  ProblemImage3,
  ProblemImage4,
  ProblemImage5,
  ProblemImage6,
  ProblemImage7,
  ProblemImage8,
  ProblemImage9,
  ProblemImage10,
  ProblemImage11,
];

export const getChallengeImage = problemId => {
  const imageIndex = [...String(problemId)].reduce(
    (sum, character) => sum + character.charCodeAt(0),
    0
  );
  return PROBLEM_IMAGES[imageIndex % PROBLEM_IMAGES.length];
};

export const getChallengeDifficultyMeta = difficulty => {
  const normalizedDifficulty = String(difficulty || '').toLowerCase();
  const label =
    normalizedDifficulty === 'easy'
      ? 'Easy'
      : ['normal', 'medium'].includes(normalizedDifficulty)
        ? 'Normal'
        : 'Hard';

  return {
    label,
    className: 'bg-[#353B44] text-white',
  };
};
