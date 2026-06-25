import greenProblemImage from '@/assets/images/greenp.png';
import yellowProblemImage from '@/assets/images/yellowp.png';
import pinkProblemImage from '@/assets/images/pinkp.png';
import purpleProblemImage from '@/assets/images/purplep.png';
import tutorialImage from '@/assets/images/tutorial.png';
import leftGreenBg from '@/assets/images/leftgreen.png';
import leftYellowBg from '@/assets/images/leftyellow.png';
import leftPinkBg from '@/assets/images/leftpink.png';
import leftPurpleBg from '@/assets/images/leftpurple.png';

const APP_IMAGES_TO_PRELOAD = [
  greenProblemImage,
  yellowProblemImage,
  pinkProblemImage,
  purpleProblemImage,
  tutorialImage,
  leftGreenBg,
  leftYellowBg,
  leftPinkBg,
  leftPurpleBg,
];

let hasPreloadedAppImages = false;

const preloadImage = src => {
  const image = new Image();
  image.decoding = 'async';
  image.src = src;
};

export const preloadAppImages = () => {
  if (hasPreloadedAppImages || typeof window === 'undefined') return;
  hasPreloadedAppImages = true;

  const preload = () => {
    APP_IMAGES_TO_PRELOAD.forEach(preloadImage);
  };

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(preload, { timeout: 2000 });
    return;
  }

  window.setTimeout(preload, 0);
};
