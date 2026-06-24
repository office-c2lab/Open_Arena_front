import React from 'react';

const ScoreTag = ({ score, compact = false }) => {
  const classes = compact
    ? 'h-[26px] px-2 rounded-full bg-red-100 text-red-600 text-[11px] leading-[14px] font-semibold flex items-center justify-center whitespace-nowrap'
    : 'px-3 py-1 rounded-full bg-red-100 text-red-600 text-sm font-semibold';

  return (
    <p className={classes}>
      점수: {score}점
    </p>
  );
};

export default ScoreTag;
