import React from 'react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import { useUserScoreSeriesTotal } from '@/hooks/useUserScoreSeriesTotal';

// 🎨 Y축 TickBox — 레드 테마
const YAxisTickBox = ({ x, y, payload }) => {
  if (payload.value === undefined || payload.value === null) return null;

  return (
    <foreignObject x={x - 150} y={y - 16} width={130} height={32}>
      <div
        style={{
          width: '120px',
          height: '32px',
          background: 'rgba(255,72,84,0.15)',
          border: '1px solid #FF4854',
          borderRadius: '7px',
          boxShadow: '0px 4px 8px rgba(255,72,84,0.35)',
          color: '#FF4854',
          fontFamily: 'Black Han Sans',
          fontWeight: 900,
          fontSize: '18px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {payload.value}
      </div>
    </foreignObject>
  );
};

export default function TotalLeaderboard() {
  const { data, enabled, isLoading, error } = useUserScoreSeriesTotal(2000);

  // ⭐ 404 → 비공개 상태 메시지 출력
  if (error?.response?.status === 404) {
    return (
      <div className="text-white text-center text-2xl mt-10">
        토탈 점수 차트는 현재 비공개 상태입니다.
      </div>
    );
  }

  // ❌ 기타 에러
  if (error) {
    return <div className="text-red-400 text-center text-xl mt-10">데이터 로드 실패</div>;
  }

  // 공개 OFF
  if (enabled === false) {
    return (
      <div className="text-white text-center text-2xl mt-10">
        토탈 점수 차트는 현재 비공개 상태입니다.
      </div>
    );
  }

  // 로딩
  if (isLoading || !data || data.length === 0) {
    return <div className="text-white text-center text-xl mt-10">Loading 점수 변화 차트...</div>;
  }

  // 팀 목록 추출 — 가장 최근 데이터 기준
  const last = data[data.length - 1];

  const teamNames = Object.keys(last).filter(key => key !== 'time');

  // 최대값 계산
  const maxScore = Math.max(...data.flatMap(row => teamNames.map(team => Number(row[team]) || 0)));

  const yMax = Math.ceil((maxScore + 100) / 100) * 100;
  const yTicks = [];
  for (let v = yMax; v >= 0; v -= 100) yTicks.push(v);

  const formatFullTime = iso => new Date(iso).toLocaleString();

  // 색상 팔레트
  const colors = [
    '#FF0000', // 1 - Red
    '#FF7F00', // 2 - Orange
    '#FFFF00', // 3 - Yellow
    '#7FFF00', // 4 - Yellow-Green
    '#a76030ff', // 5 - Green
    '#00FF7F', // 6 - Spring Green
    '#00FFFF', // 7 - Cyan
    '#007FFF', // 8 - Azure
    '#0000FF', // 9 - Blue
    '#7F00FF', // 10 - Violet
    '#FF00FF', // 11 - Magenta
    '#FF007F', // 12 - Rose
    '#A52A2A', // 13 - Brown
    '#ac9200ff', // 14 - Gold
    '#757574ff', // 15 - Turquoise
    '#008080', // 16 - Teal
    '#800080', // 17 - Purple
    '#ffffff', // 18 - Crimson
    '#116291ff', // 19 - Dark Turquoise
    '#556B2F', // 20 - Olive Green
    '#8B4513', // 21 - Saddle Brown
  ];

  return (
    <div className="w-full flex justify-center py-1 px-6">
      <div
        className="
          w-full max-w-[1700px] min-h-[820px]
          rounded-[50px] 
          border border-[#FF4854]
          bg-[#0B021C]/80
          backdrop-blur-[4px]
          flex flex-col p-8
          shadow-[0_0_25px_rgba(255,72,84,0.45)]
        "
      >
        {/* Legend */}
        <div className="flex justify-center flex-wrap gap-10 mb-10">
          {teamNames.map((team, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className="w-[100px] h-[8px] rounded-full"
                style={{ background: colors[i % colors.length] }}
              />
              <span
                className="text-white text-[20px]"
                style={{
                  fontFamily: 'Black Han Sans',
                  textShadow: '0 0 8px rgba(255,72,84,0.7)',
                }}
              >
                {team}
              </span>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="flex gap-6">
          <div className="flex-1 h-[650px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ left: 160 }}>
                <CartesianGrid stroke="#FF4854" strokeOpacity={0.25} />
                <XAxis dataKey="time" tick={false} axisLine={false} />
                <YAxis
                  domain={[0, yMax]}
                  ticks={yTicks}
                  axisLine={false}
                  tickLine={false}
                  tick={<YAxisTickBox />}
                />

                <Tooltip
                  labelFormatter={formatFullTime}
                  contentStyle={{
                    background: '#1A0B15',
                    border: '1px solid #FF4854',
                    borderRadius: '12px',
                    color: '#FFF',
                  }}
                />

                {teamNames.map((team, i) => (
                  <Line
                    key={team}
                    dataKey={team}
                    stroke={colors[i % colors.length]}
                    strokeWidth={4}
                    dot={false}
                    activeDot={{ r: 5 }}
                    isAnimationActive
                    animationDuration={500}
                    animationEasing="ease-out"
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
