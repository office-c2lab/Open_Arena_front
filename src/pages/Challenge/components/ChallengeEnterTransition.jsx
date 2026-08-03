import { useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { LoaderCircle } from 'lucide-react';

const MotionDiv = motion.div;
const MotionSpan = motion.span;

export default function ChallengeEnterTransition({ isOpen, title, onComplete }) {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isOpen || !shouldReduceMotion) return undefined;

    const timeoutId = window.setTimeout(onComplete, 90);
    return () => window.clearTimeout(timeoutId);
  }, [isOpen, onComplete, shouldReduceMotion]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <MotionDiv
          className="fixed inset-0 z-[120] flex items-center justify-center overflow-hidden bg-white/82 backdrop-blur-md"
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(18px)' }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.24, ease: 'easeOut' }}
          onAnimationComplete={() => {
            if (shouldReduceMotion) onComplete();
          }}
        >
          <MotionDiv
            className="relative z-10 flex w-full max-w-[520px] flex-col items-center px-6 text-center"
            initial={
              shouldReduceMotion ? false : { y: 28, opacity: 0, filter: 'blur(12px)', scale: 0.98 }
            }
            animate={
              shouldReduceMotion ? undefined : { y: 0, opacity: 1, filter: 'blur(0px)', scale: 1 }
            }
            transition={{ duration: shouldReduceMotion ? 0 : 0.34, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="mt-6 text-[18px] font-900 uppercase text-[#FF4854]">ARENA</p>
            <h2 className="mt-3 max-w-[680px] text-[48px] font-900 leading-tight text-[#202832]">
              {title || '챌린지 진입 중'}
            </h2>
            <p className="mt-5 text-[24px] font-700 text-[#66717E]">챌린지 환경 준비 중</p>
          </MotionDiv>

          <MotionDiv
            className="pointer-events-none absolute inset-0 bg-[#F5F7FA]"
            initial={{ y: '100%', opacity: 0 }}
            animate={
              shouldReduceMotion
                ? { y: '100%', opacity: 0 }
                : { y: ['100%', '100%', '0%'], opacity: [0, 0, 1] }
            }
            transition={{ duration: 0.68, times: [0, 0.62, 1], ease: [0.4, 0, 0.2, 1] }}
            onAnimationComplete={() => {
              if (!shouldReduceMotion) onComplete();
            }}
          />
        </MotionDiv>
      ) : null}
    </AnimatePresence>
  );
}
