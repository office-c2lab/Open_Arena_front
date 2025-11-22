// src/features/Challenge/components/TokenInfoCard.jsx
import React from 'react';
import TokenSvg from '../../../assets/icons/Token.svg';

const COLOR_YELLOW = '#FDCA40';

const TokenInfoCard = ({ currentBalance, maxValue }) => {
  const ratio = (currentBalance / maxValue) * 100;

  return (
    <div
      className="
        w-full 
        h-[80px] md:h-[100px]      
        flex flex-col justify-between 
        pt-4 pb-0 flex-shrink-0
        bg-white rounded-[20px] shadow-lg overflow-hidden
      "
      style={{ boxShadow: '0px 2px 10px rgba(0,0,0,0.25)' }}
    >
      {/* 상단 영역 */}
      <div className="flex justify-start items-center px-4 flex-shrink-0">
        {/* 아이콘 영역 */}
        <div
          className="
            w-[40px] h-[40px]      
            md:w-[49px] md:h-[49px] 
            flex justify-center items-center 
            rounded-[10px] flex-shrink-0 
            bg-black
          "
        >
          <img
            src={TokenSvg}
            alt="Token Icon"
            className="
              w-[18px] h-[22px]      
              md:w-[22px] md:h-[26px] 
            "
          />
        </div>

        {/* 텍스트 영역 */}
        <div className="flex flex-col ml-4 justify-center flex-1 h-full">
          <div className="flex flex-row justify-between items-center flex-1">
            {/* '토큰' label */}
            <span
              className="
                font-['Noto Sans KR']
                text-[14px] md:text-[16px]   
                leading-[20px] md:leading-[24px]
                font-medium text-black
              "
            >
              토큰
            </span>

            {/* 숫자 */}
            <div className="flex items-baseline">
              <span
                className="
                  font-['Noto Sans KR']
                  text-[22px] md:text-[28px]  
                  leading-[28px] md:leading-[36px]
                  font-bold text-black
                "
              >
                {currentBalance}
              </span>
              <span
                className="
                  font-['Roboto']
                  text-[11px] md:text-[12px]
                  ml-1 mb-1
                  font-medium text-black
                "
              >
                /{maxValue}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 진행 바 */}
      <div className="w-full h-[6px] md:h-2 mt-2 bg-black">
        <div
          className="h-full rounded-r-full"
          style={{
            width: `${ratio}%`,
            background: COLOR_YELLOW,
            transition: 'width 0.5s ease-in-out',
          }}
        />
      </div>
    </div>
  );
};

export default TokenInfoCard;
