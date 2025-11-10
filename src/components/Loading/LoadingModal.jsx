import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 챌린지 심사 로딩 모달 컴포넌트
 * @param {boolean} isOpen - 모달 열림/닫힘 상태
 * @param {function} onClose - 모달 닫기 핸들러 (현재 컴포넌트 내부에서는 사용되지 않고 외부에서 제어)
 */
export default function LoadingModal({ isOpen, onClose }) {
  const circleRadius = 290;
  const circumference = 2 * Math.PI * circleRadius;
  const containerSize = 680;
  const containerCenter = containerSize / 2;

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
          {/* 모달 컨테이너 */}
          <motion.div
            className="relative flex flex-col items-center justify-center bg-[#ffffff] text-white rounded-2xl overflow-hidden shadow-2xl"
            style={{
              width: '990px',
              height: '680px',
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* 원형 효과 */}
            <motion.svg
              className="absolute"
              width={containerSize}
              height={containerSize}
              viewBox={`0 0 ${containerSize} ${containerSize}`}
              fill="none"
              style={{
                transform: 'rotate(-90deg)',
                zIndex: 1,
              }}
            >
              <motion.circle
                cx={containerCenter}
                cy={containerCenter}
                r={circleRadius}
                stroke="#FF4854"
                strokeOpacity="0.8"
                strokeWidth="2"
                initial={{
                  strokeDasharray: circumference,
                  strokeDashoffset: circumference,
                }}
                animate={{
                  strokeDashoffset: [circumference, 0, -circumference],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: 0.8,
                }}
              />
            </motion.svg>

            {/* 중앙 로고 */}
            <motion.h1
              className="font-[Orbitron] text-6xl md:text-6xl tracking-[0.25em] z-10 "
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

            {/* ✅ 풀네임 순차 등장 + 순차 사라짐 반복 */}
            <motion.div
              key="looped-fullname"
              className="text-sm md:text-base text-[#6B6B6B] mt-20 tracking-wide text-center"
              style={{ zIndex: 2 }}
            >
              {/* 공통 설정 */}
              {[
                { text: <><span className="text-[#FF4854]">A</span>I{' '}</>, delay: 0.3 },
                { text: <><span className="text-[#FF4854]">R</span>edteam{' '}</>, delay: 0.7 },
                { text: <>and <span className="text-[#FF4854]">E</span>valuation for{' '}</>, delay: 1.1 },
                { text: <><span className="text-[#FF4854]">N</span>ext-gen{' '}</>, delay: 1.5 },
                { text: <><span className="text-[#FF4854]">A</span>I</>, delay: 1.9 },
              ].map(({ text, delay }, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    delay,
                    duration: 5,
                    repeat: Infinity,
                    repeatDelay: 1.2,
                    ease: 'easeInOut',
                  }}
                >
                  {text}
                </motion.span>
              ))}
            </motion.div>

            {/* 로딩 텍스트 */}
            <motion.div
              className="absolute bottom-30 text-[#6B6B6B] font-light tracking-wider text-sm"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                delay: 2.5,
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              Loading...
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
