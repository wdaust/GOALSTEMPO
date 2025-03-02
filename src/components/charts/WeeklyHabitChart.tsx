import React from "react";

interface WeeklyHabitChartProps {
  data: {
    day: string;
    completed: boolean;
  }[];
  width?: number;
  height?: number;
}

const WeeklyHabitChart = ({
  data,
  width = 300,
  height = 100,
}: WeeklyHabitChartProps) => {
  // Ensure we have data for all days of the week
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const chartData = days.map((day) => {
    const dayData = data.find((d) => d.day === day);
    return {
      day,
      completed: dayData ? dayData.completed : false,
    };
  });

  // Calculate dimensions
  const cellWidth = width / 7;
  const cellHeight = height - 30; // Leave space for labels

  return (
    <div className="w-full overflow-hidden">
      <svg width={width} height={height}>
        {/* Day cells */}
        {chartData.map((day, index) => (
          <g key={index}>
            <rect
              x={index * cellWidth}
              y={0}
              width={cellWidth - 4}
              height={cellHeight}
              rx={4}
              className={`${day.completed ? "fill-green-400 stroke-green-500" : "fill-slate-100 stroke-slate-200 dark:fill-slate-800 dark:stroke-slate-700"}`}
              strokeWidth="1"
            />
            <text
              x={index * cellWidth + cellWidth / 2}
              y={cellHeight + 20}
              textAnchor="middle"
              fontSize="12"
              className="fill-slate-500 dark:fill-slate-400"
            >
              {day.day}
            </text>
            {day.completed && (
              <text
                x={index * cellWidth + cellWidth / 2}
                y={cellHeight / 2 + 5}
                textAnchor="middle"
                fontSize="16"
                className="fill-white"
              >
                ✓
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
};

export default WeeklyHabitChart;
