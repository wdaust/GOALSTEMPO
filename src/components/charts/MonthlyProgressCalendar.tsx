import React from "react";

interface MonthlyProgressCalendarProps {
  month: number; // 0-11 for Jan-Dec
  year: number;
  completedDates: string[]; // Array of dates in format "YYYY-MM-DD"
  width?: number;
}

const MonthlyProgressCalendar = ({
  month,
  year,
  completedDates = [],
  width = 300,
}: MonthlyProgressCalendarProps) => {
  // Get days in month and first day of month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  // Adjust for Sunday as first day (0) to Monday as first day (0)
  const firstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  // Create array of day numbers with empty slots for padding
  const days = Array(firstDay).fill(null);
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  // Calculate rows needed (7 days per row)
  const rows = Math.ceil(days.length / 7);

  // Calculate cell size based on width
  const cellSize = width / 7;
  const height = rows * cellSize + 30; // Add space for header

  // Format date to match completedDates format
  const formatDate = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  // Check if a date is completed
  const isCompleted = (day: number | null) => {
    if (day === null) return false;
    return completedDates.includes(formatDate(day));
  };

  // Day names
  const dayNames = ["M", "T", "W", "T", "F", "S", "S"];

  // Month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="w-full overflow-hidden">
      <div className="text-center font-medium mb-2">
        {monthNames[month]} {year}
      </div>

      <svg width={width} height={height}>
        {/* Day name headers */}
        {dayNames.map((name, index) => (
          <text
            key={`header-${index}`}
            x={index * cellSize + cellSize / 2}
            y={20}
            textAnchor="middle"
            fontSize="12"
            fill="#64748b"
          >
            {name}
          </text>
        ))}

        {/* Calendar cells */}
        {days.map((day, index) => {
          const row = Math.floor(index / 7);
          const col = index % 7;
          const x = col * cellSize;
          const y = row * cellSize + 30; // Add header height

          const completed = isCompleted(day);

          return (
            <g key={`day-${index}`}>
              {day !== null && (
                <>
                  <rect
                    x={x + 2}
                    y={y + 2}
                    width={cellSize - 4}
                    height={cellSize - 4}
                    rx={4}
                    className={`${completed ? "fill-blue-500 stroke-blue-600" : "fill-slate-100 stroke-slate-200 dark:fill-slate-800 dark:stroke-slate-700"}`}
                    strokeWidth="1"
                  />
                  <text
                    x={x + cellSize / 2}
                    y={y + cellSize / 2 + 5}
                    textAnchor="middle"
                    fontSize="12"
                    className={`${completed ? "fill-white" : "fill-slate-500 dark:fill-slate-400"}`}
                  >
                    {day}
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default MonthlyProgressCalendar;
