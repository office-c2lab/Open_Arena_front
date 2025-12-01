import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { useScoreSeriesQuery } from "@/hooks/useScoreSeriesQuery";

// 🎨 Y축 TickBox — 레드 테마
const YAxisTickBox = ({ x, y, payload }) => {
  if (payload.value === undefined || payload.value === null) return null;

  return (
    <foreignObject x={x - 150} y={y - 16} width={130} height={32}>
      <div
        style={{
          width: "120px",
          height: "32px",
          background: "rgba(255,72,84,0.15)",
          border: "1px solid #FF4854",
          borderRadius: "7px",
          boxShadow: "0px 4px 8px rgba(255,72,84,0.35)",
          color: "#FF4854",
          fontFamily: "Black Han Sans",
          fontWeight: 900,
          fontSize: "18px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {payload.value}
      </div>
    </foreignObject>
  );
};

export default function TotalLeaderboard() {
  const { data, isLoading, error } = useScoreSeriesQuery(1500);

  if (isLoading || !data || data.length === 0)
    return (
      <div className="text-white text-center text-xl mt-10">
        Loading 점수 변화 그래프...
      </div>
    );

  if (error) return <div className="text-red-400 text-center">데이터 로드 실패</div>;

  // ------------------------ 마지막 기록 기준 팀 이름 추출
  const last = data[data.length - 1];
  const teamNames = Object.keys(last).filter((key) => key !== "time");

  // ------------------------ Y축 최대값 계산
  const maxScore = Math.max(
    ...data.flatMap((row) =>
      teamNames.map((team) => Number(row[team]) || 0)
    )
  );

  const yMax = Math.ceil((maxScore + 100) / 200) * 200;

  const yTicks = [];
  for (let v = yMax; v >= 0; v -= 200) yTicks.push(v);

  const formatFullTime = (iso) => new Date(iso).toLocaleString();

  // 🎨 ARENA Red-Pink 기반 차트 색상셋
const colors = [
  "#FF4854", // 1 - ARENA Red
  "#FF6A75", // 2
  "#FF7F8B", // 3
  "#FFA5AC", // 4
  "#FFC7D1", // 5 (연핑크)

  "#FF3466", // 6 - 진한 핑크레드
  "#FC3447", // 7
  "#FF5F89", // 8
  "#FF9BAF", // 9
  "#FFB8C3", // 10

  "#C736FF", // 11 - 네온 퍼플
  "#9B30FF", // 12
  "#7A2CFF", // 13
  "#B66BFF", // 14
  "#D8A6FF", // 15

  "#FFCC4D", // 16 - 대비용 옐로우 (중요팀 강조 시 좋음)
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
        {/* ---------- Legend ---------- */}
        <div className="flex justify-center flex-wrap gap-10 mb-10">
          {teamNames.map((team, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className="w-[100px] h-[8px] rounded-full shadow-[0_0_10px_rgba(255,72,84,0.6)]"
                style={{
                  background: colors[i % colors.length],
                }}
              />
              <span
                className="text-white text-[20px]"
                style={{
                  fontFamily: "Black Han Sans",
                  textShadow: "0 0 8px rgba(255,72,84,0.7)",
                }}
              >
                {team}
              </span>
            </div>
          ))}
        </div>

        {/* ---------- Chart ---------- */}
        <div className="flex gap-6">
          <div className="flex-1 h-[650px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ left: 160 }}>
                <CartesianGrid stroke="#FF4854" strokeOpacity={0.25} />

                <XAxis
                  dataKey="time"
                  tick={false}
                  axisLine={false}
                  tickLine={false}
                />

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
                    background: "#1A0B15",
                    border: "1px solid #FF4854",
                    borderRadius: "12px",
                    color: "#FFF",
                    boxShadow: "0 0 12px rgba(255,72,84,0.5)",
                  }}
                />

                {/* ---------- 팀별 라인 ---------- */}
                {teamNames.map((team, i) => (
                  <Line
                    key={team}
                    dataKey={team}
                    stroke={colors[i % colors.length]}
                    strokeWidth={5}
                    dot={{ r: 4, fill: colors[i % colors.length] }}
                    activeDot={{ r: 7, stroke: "#FFF", strokeWidth: 2 }}
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
