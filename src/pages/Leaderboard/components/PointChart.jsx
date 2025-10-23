// src/pages/Leaderboard/components/PointChart.jsx (최종 Tailwind 수정)

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { CHART_TIME_SERIES_DATA, TEAM_COLORS } from '../data/leaderboardData';

const PointChart = () => {
  const teamKeys = Object.keys(TEAM_COLORS);
  const sortedTeamKeys = teamKeys.sort();

  return (
    <div // Tailwind 클래스 수정: drop-shadow 스타일을 shadow-lg로 대체
      className="w-[1027px] h-[595px] rounded-[10px] z-20 p-6 bg-white/80 shadow-lg"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={CHART_TIME_SERIES_DATA}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          {sortedTeamKeys.map(key => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              name={key.replace('_', ' ')}
              stroke={TEAM_COLORS[key]}
              activeDot={{ r: 6 }}
              strokeWidth={3}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PointChart;
