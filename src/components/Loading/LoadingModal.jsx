import React, { useEffect } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';

export default function LoadingModal({ isOpen }) {
  const circleRadius = 290;
  const circumference = 2 * Math.PI * circleRadius;
  const containerSize = 680;
  const center = containerSize / 2;

  // ✅ 스프링 보간 (progress 0~1)
  const smoothProgress = useSpring(0, {
    stiffness: 80,
    damping: 20,
    mass: 0.3,
  });

  // ✅ 원 진행도와 퍼센트 텍스트 동기화
  const dashOffset = useTransform(smoothProgress, p => circumference * (1 - p));
  const displayPercent = useTransform(smoothProgress, p => `${Math.floor(p * 100)}%`); // floor로 정확히 95까지 표시

  // ✅ 느리게 95%까지만 상승 (약 6초)
  useEffect(() => {
    if (!isOpen) return;
    smoothProgress.set(0);
    let progress = 0;
    const target = 0.95; // ✅ 95%까지만
    const interval = setInterval(() => {
      progress += 0.005; // 천천히 올라감
      smoothProgress.set(Math.min(progress, target));
      if (progress >= target) clearInterval(interval);
    }, 30); // 0.0025씩 30ms마다 → 약 6초 걸림
    return () => clearInterval(interval);
  }, [isOpen, smoothProgress]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="relative flex flex-col items-center justify-center bg-white text-white rounded-2xl overflow-hidden shadow-2xl"
            style={{ width: '990px', height: '680px' }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {/* 🔴 원형 진행도 */}
            <svg
              className="absolute"
              width={containerSize}
              height={containerSize}
              viewBox={`0 0 ${containerSize} ${containerSize}`}
              fill="none"
              style={{ transform: 'rotate(-90deg)', zIndex: 1 }}
            >
              <circle
                cx={center}
                cy={center}
                r={circleRadius}
                stroke="#FFD5D5"
                strokeWidth="2"
              />
              <motion.circle
                cx={center}
                cy={center}
                r={circleRadius}
                stroke="#FF4854"
                strokeOpacity="0.85"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={circumference}
                style={{ strokeDashoffset: dashOffset }}
              />
            </svg>

            {/* 🟣 중앙 로고 */}
            <motion.h1
              className="font-[Orbitron] text-6xl tracking-[0.25em]"
              style={{
                color: '#FF4854',
                textShadow: '0 0 20px #FF4854',
                zIndex: 2,
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              ARENA
            </motion.h1>

            {/* ✨ 풀네임 (순차 깜빡이기) */}
            <motion.div
              key="looped-fullname"
              className="text-sm md:text-base text-[#6B6B6B] mt-20 tracking-wide text-center"
              style={{ zIndex: 2 }}
            >
              {[ 
                { text: <><span className="text-[#FF4854]">A</span>I{' '}</>, delay: 0.2 },
                { text: <><span className="text-[#FF4854]">R</span>edteam{' '}</>, delay: 0.4 },
                { text: <>and <span className="text-[#FF4854]">E</span>valuation for{' '}</>, delay: 0.6 },
                { text: <><span className="text-[#FF4854]">N</span>ext-gen{' '}</>, delay: 0.8 },
                { text: <><span className="text-[#FF4854]">A</span>I</>, delay: 1.0 },
              ].map(({ text, delay }, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 1, 0] }}
                  transition={{
                    delay,
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 0.5,
                    ease: 'easeInOut',
                  }}
                >
                  {text}
                </motion.span>
              ))}
            </motion.div>

            {/* 🧠 진행률 */}
            <motion.div
              className="absolute bottom-30 text-[#6B6B6B] font-light tracking-wider text-sm"
              style={{ zIndex: 10 }}
            >
              {displayPercent}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
