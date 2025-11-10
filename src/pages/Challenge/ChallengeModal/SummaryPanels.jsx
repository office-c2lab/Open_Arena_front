import React from 'react';

// 성공 테마 색상
const SUCCESS_COLOR_PRIMARY = '#04B07B';
const SUCCESS_COLOR_BACKGROUND = 'rgba(4, 176, 123, 0.2)';

// 실패 테마 색상
const FAILED_COLOR_PRIMARY = '#E60513';
const FAILED_COLOR_BACKGROUND = 'rgba(255, 8, 74, 0.2)';

// 재검토(리뷰) 색상
const REVIEW_COLOR_PRIMARY = '#FFA500';
const REVIEW_COLOR_BACKGROUND = 'rgba(255, 165, 0, 0.2)';

// ✅ 성공 패널
export const SuccessSummaryPanel = ({
  imageSrc,
  animalName,
  title,
  modelName, // 💡 추가된 필드
  description,
  imageStyle,
}) => {
  const color = SUCCESS_COLOR_PRIMARY;

  return (
    <div className="w-[877px] h-[160px] flex shadow-lg rounded-[20px]">
      {/* 좌측 초록색 영역 */}
      <div
        className="w-[160px] h-full flex flex-col justify-between items-center py-[16px] rounded-l-[20px]"
        style={{ backgroundColor: SUCCESS_COLOR_BACKGROUND }}
      >
        <div className="w-[80px] h-[90px] flex justify-center items-center rounded-full shadow-md overflow-hidden bg-white">
          <img
            src={imageSrc}
            alt={animalName}
            style={{
              ...imageStyle.img,
              width: imageStyle.img?.width ? `calc(${imageStyle.img.width} * 0.7)` : 'auto',
              height: imageStyle.img?.height ? `calc(${imageStyle.img.height} * 0.7)` : 'auto',
            }}
            className="object-cover"
          />
        </div>
        <p className="heading-2 font-700" style={{ color }}>
          성공
        </p>
      </div>

      {/* 우측 내용 */}
      <div className="w-[717px] h-full bg-white flex flex-col items-center rounded-r-[20px]">
        <p
          className="heading-3 font-500 text-center w-full mt-[10px]"
          style={{ color }}
        >
          {animalName}
          {modelName && ` (${modelName})`}
        </p>
        <p className="body-large font-700 text-center text-black w-[680px] h-[90px] overflow-auto mt-[10px] px-4">
          {description}
        </p>
      </div>
    </div>
  );
};

// ✅ 실패 패널
export const FailedSummaryPanel = ({
  imageSrc,
  animalName,
  description,
  imageStyle,
  title,
  modelName, // 💡 추가
  verdict,
}) => {
  const isReview = verdict === 'REVIEW';
  const theme = {
    primaryColor: isReview ? REVIEW_COLOR_PRIMARY : FAILED_COLOR_PRIMARY,
    backgroundColor: isReview ? REVIEW_COLOR_BACKGROUND : FAILED_COLOR_BACKGROUND,
    statusText: isReview ? '재검토' : '실패',
  };

  return (
    <div className="w-[877px] h-[160px] flex shadow-lg rounded-[20px]">
      {/* 좌측 영역 */}
      <div
        className="w-[160px] h-full flex flex-col justify-between items-center py-[16px] rounded-l-[20px]"
        style={{ backgroundColor: theme.backgroundColor }}
      >
        <div className="w-[80px] h-[90px] flex justify-center items-center rounded-full shadow-md overflow-hidden bg-white">
          <img
            src={imageSrc}
            alt={animalName}
            style={{
              ...imageStyle.img,
              width: imageStyle.img?.width ? `calc(${imageStyle.img.width} * 0.7)` : 'auto',
              height: imageStyle.img?.height ? `calc(${imageStyle.img.height} * 0.7)` : 'auto',
            }}
            className="object-cover"
          />
        </div>
        <p className="heading-2 font-700" style={{ color: theme.primaryColor }}>
          {theme.statusText}
        </p>
      </div>

      {/* 우측 내용 */}
      <div className="w-[717px] h-full bg-white flex flex-col items-center rounded-r-[20px]">
        <p
          className="heading-3 font-500 text-center w-full mt-[10px]"
          style={{ color: theme.primaryColor }}
        >
          {animalName}
          {modelName && ` (${modelName})`}
        </p>
        <p className="body-large font-300 text-center text-black w-[680px] h-[90px] overflow-auto mt-[10px] px-4">
          {description}
        </p>
      </div>
    </div>
  );
};
