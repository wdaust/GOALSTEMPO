import React, { useState } from "react";
import { Card as UICard, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "../ui/button";

interface YearlyReadingChartProps {
  year?: number;
  completedDates?: string[];
  width?: number;
}

const YearlyReadingChart = ({
  year = new Date().getFullYear(),
  completedDates = [],
  width = 300,
}: YearlyReadingChartProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Calculate dimensions
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const daysInWeek = 7;
  const cellSize = Math.floor(width / 53); // 52 weeks + buffer
  const cellGap = 1;
  const monthLabelHeight = 20;
  const height = cellSize * daysInWeek + monthLabelHeight + 10;

  // Generate dates for the year
  const getDaysArray = () => {
    const firstDay = new Date(year, 0, 1);
    const lastDay = new Date(year, 11, 31);
    const days = [];

    let currentDate = new Date(firstDay);
    while (currentDate <= lastDay) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  const days = getDaysArray();

  // Format date to match completedDates format (YYYY-MM-DD)
  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  // Check if a date is completed
  const isCompleted = (date: Date) => {
    return completedDates.includes(formatDate(date));
  };

  // Get week number (0-52) for positioning
  const getWeekNumber = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear =
      (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.floor((pastDaysOfYear + firstDayOfYear.getDay()) / 7);
  };

  // Get month boundaries for labels
  const monthBoundaries = months.map((_, index) => {
    const firstDayOfMonth = new Date(year, index, 1);
    return getWeekNumber(firstDayOfMonth);
  });

  // Calculate completion percentage
  const completionPercentage = Math.round((completedDates.length / 365) * 100);

  return (
    <UICard className="w-full mb-6 bg-white">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Reading Activity {year} ({completionPercentage}%)
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 p-0"
          >
            {isCollapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      {!isCollapsed && (
        <CardContent>
          <div className="overflow-x-auto">
            <svg width={width} height={height}>
              {/* Month labels */}
              {monthBoundaries.map((weekNum, i) => (
                <text
                  key={`month-${i}`}
                  x={weekNum * (cellSize + cellGap) + cellSize / 2}
                  y={10}
                  fontSize="10"
                  textAnchor="middle"
                  fill="#64748b"
                >
                  {months[i]}
                </text>
              ))}

              {/* Day cells */}
              {days.map((date, index) => {
                const weekNum = getWeekNumber(date);
                const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
                const adjustedDayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Make Monday=0, Sunday=6

                const x = weekNum * (cellSize + cellGap);
                const y =
                  adjustedDayOfWeek * (cellSize + cellGap) + monthLabelHeight;

                const completed = isCompleted(date);

                return (
                  <rect
                    key={`day-${index}`}
                    x={x}
                    y={y}
                    width={cellSize}
                    height={cellSize}
                    rx={2}
                    className={`${completed ? "fill-blue-500" : "fill-slate-100"} ${completed ? "stroke-blue-600" : "stroke-slate-200"}`}
                    strokeWidth="0.5"
                  />
                );
              })}
            </svg>
          </div>

          <div className="flex items-center justify-between mt-4 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
              <span>Read chapters ({completedDates.length} days)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-slate-100 border border-slate-200 rounded-sm"></div>
              <span>No reading</span>
            </div>
          </div>
        </CardContent>
      )}
    </UICard>
  );
};

export default YearlyReadingChart;
