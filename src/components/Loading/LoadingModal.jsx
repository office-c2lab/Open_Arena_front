import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingModal({ isOpen, onClose, progress = 0 }) {
  const circleRadius = 290;
  const circumference = 2 * Math.PI * circleRadius;
  const containerSize = 680;
  const containerCenter = containerSize / 2;

  const dashOffset = circumference * (1 - progress);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="relative flex flex-col items-center justify-center bg-[#ffffff] text-white rounded-2xl overflow-hidden shadow-2xl"
            style={{ width: '990px', height: '680px' }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* ✅ 원형 진행도 */}
            <svg
              className="absolute"
              width={containerSize}
              height={containerSize}
              viewBox={`0 0 ${containerSize} ${containerSize}`}
              fill="none"
              style={{ transform: 'rotate(-90deg)', zIndex: 1 }}
            >
              {/* 배경 원 */}
              <circle
                cx={containerCenter}
                cy={containerCenter}
                r={circleRadius}
                stroke="#FFD5D5"
                strokeWidth="2"
              />

              {/* 진행 원 (부드럽게 채워짐) */}
              <motion.circle
                cx={containerCenter}
                cy={containerCenter}
                r={circleRadius}
                stroke="#FF4854"
                strokeOpacity="0.85"
                strokeWidth="4"
                strokeLinecap="round" // 끝부분 둥글게
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                transition={{
                  duration: 1.2, // 💡 천천히 따라오게
                  ease: 'easeInOut',
                }}
              />
            </svg>

            {/* 중앙 로고 */}
            <motion.h1
              className="font-[Orbitron] text-6xl md:text-6xl tracking-[0.25em] z-10"
              style={{
                color: '#FF4854',
                textShadow: '0 0 20px #FF4854',
                lineHeight: 1.1,
                zIndex: 2,
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              ARENA
            </motion.h1>

            {/* 풀네임 (짧은 주기로 반복) */}
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

            {/* 진행률 표시 (고정, 깜빡임 없음) */}
            <div
              className="absolute bottom-30 text-[#6B6B6B] font-light tracking-wider text-sm"
              style={{ transition: 'color 0.3s ease-out' }}
            >
              {Math.round(progress * 100)}%
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
