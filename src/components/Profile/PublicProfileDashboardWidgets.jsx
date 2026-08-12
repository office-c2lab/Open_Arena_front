import { useMemo, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { PathCard } from '@/pages/Kategorie/Kategorie';
import { getChallengeImage } from '@/utils/challengePresentation';

const activityLevels = [
  'bg-[#F3F4F6]',
  'bg-[#FFE8EA]',
  'bg-[#FFB8BE]',
  'bg-[#FF7D86]',
  'bg-[#FF4854]',
  'bg-[#CF1723]',
];

const timeBlocks = Array.from({ length: 8 }, (_, index) => {
  const startHour = index * 3;
  return { hours: [startHour, startHour + 1, startHour + 2] };
});

const toLocalDateKey = date => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatNumber = value => Number(value ?? 0).toLocaleString('ko-KR');

const formatSolvedAt = value => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

function buildActivityHeatmap(activity) {
  const parsedStartDate = activity?.start_date
    ? new Date(`${activity.start_date}T00:00:00`)
    : new Date();
  const startDate = Number.isNaN(parsedStartDate.getTime()) ? new Date() : parsedStartDate;
  startDate.setHours(0, 0, 0, 0);
  const cellCountByDateAndHour = new Map(
    (activity?.cells ?? []).map(cell => [`${cell.date}:${cell.hour}`, cell.count])
  );

  const days = Array.from({ length: 7 }, (_, dayIndex) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + dayIndex);
    const dateKey = toLocalDateKey(date);
    const cells = timeBlocks.flatMap(({ hours }) =>
      hours.map(hour => {
        const count = cellCountByDateAndHour.get(`${dateKey}:${hour}`) ?? 0;
        return { hour, count, level: Math.min(Math.max(Number(count) || 0, 0), 5) };
      })
    );

    return {
      date,
      dateKey,
      label: new Intl.DateTimeFormat('ko-KR', { weekday: 'short' })
        .format(date)
        .replace('요일', ''),
      cells,
    };
  });

  return { days, totalCount: activity?.total_attempts ?? 0 };
}

function SectionHeader({ title, description }) {
  return (
    <div>
      <h2 className="text-card-title font-bold text-[#202832]">{title}</h2>
      {description ? (
        <p className="mt-2 text-body font-strong text-[#6F7885]">{description}</p>
      ) : null}
    </div>
  );
}

function ActivityTooltip({ tooltip }) {
  if (!tooltip) return null;

  return (
    <div
      className="pointer-events-none fixed z-[9999] w-max max-w-[180px] rounded-[8px] border border-[#E9ECF1] bg-white px-3 py-2 text-left shadow-[0_14px_30px_rgba(15,23,42,0.12)]"
      style={{ left: tooltip.x, top: tooltip.y, transform: 'translate(-50%, -100%)' }}
    >
      <span className="block text-label font-bold text-[#202832]">{tooltip.dateText}</span>
      <span className="mt-1 block text-caption font-strong text-[#7B8491]">{tooltip.hourText}</span>
      <span className="mt-1 block text-label font-bold text-[#FF4854]">도전 {tooltip.count}회</span>
    </div>
  );
}

function ActivityCell({ day, cell, onShow, onHide }) {
  const dateText = day.date.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });
  const hourText = `${String(cell.hour).padStart(2, '0')}:00 - ${String(cell.hour + 1).padStart(2, '0')}:00`;

  const showTooltip = event => {
    const rect = event.currentTarget.getBoundingClientRect();
    const tooltipWidth = 180;
    const viewportPadding = 12;
    const x = Math.min(
      Math.max(rect.left + rect.width / 2, viewportPadding + tooltipWidth / 2),
      window.innerWidth - viewportPadding - tooltipWidth / 2
    );
    onShow({ x, y: rect.top - 8, dateText, hourText, count: cell.count });
  };

  return (
    <button
      type="button"
      aria-label={`${dateText} ${hourText} 도전 ${cell.count}회`}
      onMouseEnter={showTooltip}
      onMouseMove={showTooltip}
      onMouseLeave={onHide}
      onFocus={showTooltip}
      onBlur={onHide}
      className={`relative h-[22px] w-[22px] cursor-pointer rounded-[5px] outline-none transition hover:scale-110 focus-visible:scale-110 focus-visible:ring-2 focus-visible:ring-[#FF4854]/35 ${activityLevels[cell.level]}`}
    />
  );
}

export function PublicActivityHeatmapCard({ activity }) {
  const { days, totalCount } = useMemo(() => buildActivityHeatmap(activity), [activity]);
  const [activeTooltip, setActiveTooltip] = useState(null);

  return (
    <section className="surface max-w-full px-5 py-4 sm:px-6">
      <ActivityTooltip tooltip={activeTooltip} />
      <SectionHeader title="도전 활동 히트맵" description="일별 도전 참여 현황" />
      <div className="mt-5 flex max-w-full justify-center">
        <div className="overflow-x-auto pb-1">
          <div className="w-max">
            <div className="grid grid-cols-[32px_repeat(24,22px)] gap-x-[6px] gap-y-[6px]">
              {days.map(day => (
                <div key={day.dateKey} className="contents">
                  <span className="flex h-[22px] items-center text-body font-bold text-[#596575]">
                    {day.label}
                  </span>
                  {day.cells.map(cell => (
                    <ActivityCell
                      key={`${day.dateKey}-${cell.hour}`}
                      day={day}
                      cell={cell}
                      onShow={setActiveTooltip}
                      onHide={() => setActiveTooltip(null)}
                    />
                  ))}
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between gap-4 text-body font-strong text-[#596575]">
              <div className="flex items-center gap-2">
                <span>낮음</span>
                <div className="flex gap-[4px]">
                  {activityLevels.map(levelClass => (
                    <span key={levelClass} className={`h-3 w-3 rounded-[2px] ${levelClass}`} />
                  ))}
                </div>
                <span>높음</span>
              </div>
              <p>
                총 도전{' '}
                <strong className="font-bold text-[#202832]">{formatNumber(totalCount)}회</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChartTooltipDot({ color }) {
  return <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />;
}

function SuccessRateTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const segment = payload[0].payload;

  return (
    <div className="rounded-xl border border-[#E9ECF1] bg-white px-3 py-2 text-label font-strong shadow-[0_14px_30px_rgba(15,23,42,0.12)]">
      <div className="flex items-center gap-2 text-[#202832]">
        <ChartTooltipDot color={segment.color} />
        <span>{segment.label}</span>
      </div>
      <div className="mt-1 text-[#7B8491]">
        {segment.percentage}% · {segment.count}
      </div>
    </div>
  );
}

export function PublicSuccessRateCard({ summary }) {
  const [selectedSegmentLabel, setSelectedSegmentLabel] = useState(null);
  const successCount = Number(summary?.success_count ?? 0);
  const failureCount = Number(summary?.failure_count ?? 0);
  const completedCount = successCount + failureCount;
  const hasCompletedSubmission = completedCount > 0;
  const calculatedSuccessRate = completedCount ? (successCount / completedCount) * 100 : 0;
  const successRate = Math.min(
    100,
    Math.max(0, Number(summary?.success_rate ?? calculatedSuccessRate))
  );
  const displayedSuccessRate = Number(successRate.toFixed(1));
  const failureRate = Number((100 - displayedSuccessRate).toFixed(1));
  const chartData = [
    {
      label: '성공',
      value: hasCompletedSubmission ? displayedSuccessRate : 0,
      percentage: hasCompletedSubmission ? displayedSuccessRate : 0,
      count: `${formatNumber(successCount)}회`,
      color: '#FF4854',
    },
    {
      label: '실패',
      value: hasCompletedSubmission ? failureRate : 1,
      percentage: hasCompletedSubmission ? failureRate : 0,
      count: `${formatNumber(failureCount)}회`,
      color: '#F1F3F6',
    },
  ];
  const selectedSegment = chartData.find(segment => segment.label === selectedSegmentLabel);

  return (
    <section className="surface w-full px-5 py-4">
      <SectionHeader
        title="성공률"
        description={`전체 제출 ${formatNumber(summary?.total_count)}회 · 판정 중 ${formatNumber(summary?.in_progress_count)}회`}
      />
      <div className="mt-5 flex flex-col items-center">
        <div className="relative h-[210px] w-[210px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<SuccessRateTooltip />} wrapperStyle={{ zIndex: 20 }} />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={92}
                startAngle={90}
                endAngle={-270}
                paddingAngle={3}
                cornerRadius={8}
                stroke="none"
                onClick={segment =>
                  setSelectedSegmentLabel(current =>
                    current === segment.label ? null : segment.label
                  )
                }
                isAnimationActive={false}
              >
                {chartData.map(segment => (
                  <Cell
                    key={segment.label}
                    fill={segment.color}
                    opacity={selectedSegment && selectedSegment.label !== segment.label ? 0.42 : 1}
                    style={{ cursor: 'pointer' }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-label font-strong text-[#8A93A5]">
              {selectedSegment ? selectedSegment.label : '성공률'}
            </span>
            <strong className="mt-1 text-page-title font-bold text-[#202832]">
              {selectedSegment
                ? selectedSegment.count
                : hasCompletedSubmission
                  ? `${displayedSuccessRate}%`
                  : '-'}
            </strong>
            {selectedSegment ? (
              <span className="mt-1 text-label font-strong text-[#7B8491]">
                {selectedSegment.percentage}%
              </span>
            ) : null}
          </div>
        </div>

        <div className="mt-5 flex w-full items-center justify-center gap-5">
          {chartData.map(segment => {
            const isSelected = selectedSegmentLabel === segment.label;
            const isDimmed = selectedSegment && !isSelected;
            return (
              <button
                key={segment.label}
                type="button"
                onClick={() =>
                  setSelectedSegmentLabel(current =>
                    current === segment.label ? null : segment.label
                  )
                }
                className={`flex cursor-pointer items-center gap-2 text-left transition ${isDimmed ? 'opacity-50' : 'opacity-100'}`}
              >
                <ChartTooltipDot color={segment.color} />
                <span className="text-label font-bold text-[#202832]">{segment.label}</span>
                <span className="text-label font-strong text-[#7B8491]">
                  {segment.percentage}% · {segment.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const presentSolvedChallenge = (record, problem) => ({
  ...problem,
  ...record,
  id: record.problem_id,
  image: getChallengeImage(record.problem_id),
  category: problem?.category?.name ?? record.category_name ?? '챌린지',
  difficulty: record.difficulty,
  maximumPoints: record.max_score,
  successfulUsers: problem?.successful_user_count ?? 0,
  totalSuccesses: problem?.total_success_count ?? 0,
  best_score: record.best_score ?? record.score ?? 0,
  status: 'success',
});

const getSolvedSupportingText = challenge =>
  `${formatSolvedAt(challenge.succeeded_at)} 해결 · ${formatNumber(challenge.prompt_tokens)} 토큰`;

export function PublicRecentSolvedChallengeCard({ challenge, problem, onSelect }) {
  if (!challenge) {
    return (
      <section className="surface flex min-h-[286px] flex-col items-center justify-center px-6 py-8 text-center">
        <p className="text-body-lg font-bold text-[#202832]">아직 해결한 챌린지가 없습니다.</p>
        <p className="mt-2 text-body font-strong text-[#8A93A5]">
          첫 성공 기록이 생기면 이곳에 표시됩니다.
        </p>
      </section>
    );
  }

  const path = presentSolvedChallenge(challenge, problem);
  return (
    <PathCard
      path={path}
      status="success"
      badgeLabel="최근 해결"
      supportingText={getSolvedSupportingText(challenge)}
      onClick={() => onSelect(challenge.problem_id)}
    />
  );
}

export function PublicTopSolvedChallenges({ challenges, problemById, onSelect }) {
  return (
    <section className="surface px-5 py-6 sm:px-6">
      <SectionHeader
        title="주요 해결 챌린지"
        description="가장 높은 포인트를 기록한 챌린지입니다."
      />
      {challenges.length ? (
        <div className="mt-6 grid grid-cols-1 gap-x-7 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
          {challenges.map(challenge => {
            const path = presentSolvedChallenge(challenge, problemById.get(challenge.problem_id));
            return (
              <PathCard
                key={challenge.problem_id}
                path={path}
                status="success"
                badgeLabel="주요 해결"
                supportingText={getSolvedSupportingText(challenge)}
                onClick={() => onSelect(challenge.problem_id)}
              />
            );
          })}
        </div>
      ) : (
        <div className="mt-6 rounded-[8px] bg-[#F7F8FA] px-5 py-10 text-center text-body font-strong text-[#8A93A5]">
          아직 표시할 해결 챌린지가 없습니다.
        </div>
      )}
    </section>
  );
}
