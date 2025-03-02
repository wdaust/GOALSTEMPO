import React from "react";

interface GoalProgressChartProps {
  progress: number;
  history?: { date: string; progress: number }[];
  width?: number;
  height?: number;
}

const GoalProgressChart = ({
  progress,
  history = [],
  width = 500,
  height = 200,
}: GoalProgressChartProps) => {
  // Generate mock history data if none provided
  const chartData =
    history.length > 0
      ? history
      : [
          { date: "1 week ago", progress: Math.max(0, progress - 25) },
          { date: "3 days ago", progress: Math.max(0, progress - 15) },
          { date: "Yesterday", progress: Math.max(0, progress - 5) },
          { date: "Today", progress },
        ];

  // Chart dimensions
  const padding = 30;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Calculate positions for the line
  const points = chartData
    .map((point, index) => {
      const x = padding + (index / (chartData.length - 1)) * chartWidth;
      const y = height - padding - (point.progress / 100) * chartHeight;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="w-full overflow-hidden">
      <svg width={width} height={height} className="font-sans">
        {/* Y-axis */}
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          className="stroke-slate-200 dark:stroke-slate-700"
          strokeWidth="1"
        />

        {/* X-axis */}
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          className="stroke-slate-200 dark:stroke-slate-700"
          strokeWidth="1"
        />

        {/* Y-axis labels */}
        {[0, 25, 50, 75, 100].map((value) => {
          const y = height - padding - (value / 100) * chartHeight;
          return (
            <React.Fragment key={value}>
              <text
                x={padding - 10}
                y={y + 4}
                fontSize="10"
                textAnchor="end"
                className="fill-slate-500 dark:fill-slate-400"
              >
                {value}%
              </text>
              <line
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                className="stroke-slate-200 dark:stroke-slate-700"
                strokeWidth="1"
                strokeDasharray="4"
              />
            </React.Fragment>
          );
        })}

        {/* X-axis labels */}
        {chartData.map((point, index) => {
          const x = padding + (index / (chartData.length - 1)) * chartWidth;
          return (
            <text
              key={index}
              x={x}
              y={height - padding + 15}
              fontSize="10"
              textAnchor="middle"
              className="fill-slate-500 dark:fill-slate-400"
            >
              {point.date}
            </text>
          );
        })}

        {/* Progress line */}
        <polyline
          points={points}
          fill="none"
          className="stroke-blue-500"
          strokeWidth="2"
        />

        {/* Data points */}
        {chartData.map((point, index) => {
          const x = padding + (index / (chartData.length - 1)) * chartWidth;
          const y = height - padding - (point.progress / 100) * chartHeight;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="4"
              className="fill-blue-500 stroke-white"
              strokeWidth="2"
            />
          );
        })}

        {/* Current progress indicator */}
        <circle
          cx={width - padding}
          cy={height - padding - (progress / 100) * chartHeight}
          r="6"
          className="fill-blue-500 stroke-white"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
};

export default GoalProgressChart;
