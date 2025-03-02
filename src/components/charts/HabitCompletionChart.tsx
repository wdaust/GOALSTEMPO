import React from "react";

interface HabitCompletionChartProps {
  data: {
    label: string;
    value: number;
    color: string;
  }[];
  width?: number;
  height?: number;
}

const HabitCompletionChart = ({
  data,
  width = 300,
  height = 200,
}: HabitCompletionChartProps) => {
  const radius = Math.min(width, height) / 2 - 10;
  const centerX = width / 2;
  const centerY = height / 2;

  // Calculate total for percentages
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Generate pie segments
  let startAngle = 0;
  const segments = data.map((item, index) => {
    const percentage = total > 0 ? (item.value / total) * 100 : 0;
    const angle = (percentage / 100) * 360;
    const endAngle = startAngle + angle;

    // Calculate path for arc
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);

    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);

    const largeArcFlag = angle > 180 ? 1 : 0;

    // Path for the pie segment
    const path = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      "Z",
    ].join(" ");

    // Calculate position for the label
    const labelRad = (startAngle + angle / 2 - 90) * (Math.PI / 180);
    const labelDistance = radius * 0.7; // Position labels inside the pie
    const labelX = centerX + labelDistance * Math.cos(labelRad);
    const labelY = centerY + labelDistance * Math.sin(labelRad);

    // Calculate if we should show the label (only for segments that are large enough)
    const showLabel = percentage > 5;

    // Store the current end angle as the start angle for the next segment
    startAngle = endAngle;

    return {
      path,
      color: item.color,
      label: item.label,
      percentage,
      labelX,
      labelY,
      showLabel,
    };
  });

  return (
    <div className="w-full overflow-hidden">
      <svg width={width} height={height}>
        {/* Pie segments */}
        {segments.map((segment, index) => (
          <path
            key={index}
            d={segment.path}
            fill={segment.color}
            stroke="white"
            strokeWidth="1"
          />
        ))}

        {/* Labels */}
        {segments.map(
          (segment, index) =>
            segment.showLabel && (
              <text
                key={`label-${index}`}
                x={segment.labelX}
                y={segment.labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize="12"
                fontWeight="bold"
              >
                {Math.round(segment.percentage)}%
              </text>
            ),
        )}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap justify-center mt-4 gap-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div
              className="w-3 h-3 mr-1"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HabitCompletionChart;
