import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 챌린지 심사 로딩 모달 컴포넌트
 * @param {boolean} isOpen - 모달 열림/닫힘 상태
 * @param {function} onClose - 모달 닫기 핸들러 (현재 컴포넌트 내부에서는 사용되지 않고 외부에서 제어)
 */
export default function LoadingModal({ isOpen, onClose }) {
// ⚠️ 이전 코드에 있던 useEffect와 타이머 로직은 외부(API 요청 완료)에 의해
// 모달이 닫히도록 하기 위해 제거되었습니다.

const circleRadius = 290;
const circumference = 2 * Math.PI * circleRadius;
const containerSize = 680;
const containerCenter = containerSize / 2;

return (
 <AnimatePresence>
  {/* 💡 isOpen 상태가 true일 때만 렌더링합니다. */}
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
     {/* 원이 그려지는 효과 */}
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
       // 💡 무한 반복 애니메이션
       animate={{
        strokeDashoffset: [circumference, 0, -circumference], // 채워지고 다시 사라지는 효과를 반복
       }}
       transition={{
        duration: 3, 
        repeat: Infinity, // 무한 반복
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

     {/* 풀네임 */}
     <motion.p
      className="text-sm md:text-base text-[#6B6B6B] mt-20 tracking-wide text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 1 }}
      style={{ zIndex: 2 }}
     >
      <motion.span
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       transition={{ delay: 0.8, duration: 0.4 }}
      >
       <span className="text-[#FF4854]">A</span>I{' '}
      </motion.span>
      <motion.span
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       transition={{ delay: 1.1, duration: 0.4 }}
      >
       <span className="text-[#FF4854]">R</span>edteam{' '}
      </motion.span>
      <motion.span
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       transition={{ delay: 1.4, duration: 0.4 }}
      >
       and <span className="text-[#FF4854]">E</span>valuation for{' '}
      </motion.span>
      <motion.span
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       transition={{ delay: 1.7, duration: 0.4 }}
      >
       <span className="text-[#FF4854]">N</span>ext-gen{' '}
      </motion.span>
      <motion.span
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       transition={{ delay: 2.0, duration: 0.4 }}
      >
       <span className="text-[#FF4854]">A</span>I
      </motion.span>
     </motion.p>

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