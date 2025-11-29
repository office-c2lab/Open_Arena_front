// src/features/Challenge/components/TokenInfoCard.jsx
import React from 'react';
import TokenSvg from '../../../assets/icons/Token.svg';

const TokenInfoCard = ({ usedToken }) => {
  return (
    <div
      className="
        w-full 
        h-[80px]          
        flex flex-col justify-center 
        p-4 flex-shrink-0
        bg-white rounded-[20px] shadow-lg
      "
      style={{ boxShadow: '0px 2px 10px rgba(0,0,0,0.25)' }}
    >
      <div className="flex items-center">
        {/* 아이콘 영역 */}
        <div
          className="
            w-[49px] h-[49px] 
            flex justify-center items-center 
            rounded-[10px] flex-shrink-0 
            bg-black
          "
        >
          <img src={TokenSvg} alt="Token Icon" className="w-[28px] h-[28px]" />
        </div>

        {/* 텍스트 영역 */}
        <div className="flex flex-row ml-4 items-center flex-1 justify-between">
          <span className="heading-3 font-500 text-black">사용한 토큰</span>

          <div className="flex items-baseline">
            <span className="heading-1 font-700 text-black">{usedToken}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenInfoCard;
