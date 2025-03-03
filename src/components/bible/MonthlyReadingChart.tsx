import React, { useState } from "react";
import { Card as UICard, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "../ui/button";

interface MonthlyReadingChartProps {
  completedDates?: string[];
  width?: number;
}

const MonthlyReadingChart = ({
  completedDates = [],
  width = 300,
}: MonthlyReadingChartProps) => {
  console.log("MonthlyReadingChart rendered with dates:", completedDates);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isCollapsed, setIsCollapsed] = useState(true);

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

  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Get days in month and first day of month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  // Adjust for Monday as first day (0) instead of Sunday
  const firstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  // Create array of day numbers with empty slots for padding
  const days = Array(firstDay).fill(null);
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  // Format date to match completedDates format (YYYY-MM-DD)
  const formatDate = (day: number) => {
    return `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  // Check if a date is completed
  const isCompleted = (day: number | null) => {
    if (day === null) return false;
    return completedDates.includes(formatDate(day));
  };

  // Calculate completion percentage for this month
  const daysCompleted = days.filter(
    (day) => day !== null && isCompleted(day),
  ).length;
  const completionPercentage = Math.round((daysCompleted / daysInMonth) * 100);

  return (
    <UICard className="w-full mb-6 bg-white">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Reading Activity ({completionPercentage}%)
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevMonth}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              {monthNames[currentMonth]} {currentYear}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextMonth}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-8 w-8 p-0 ml-1"
            >
              {isCollapsed ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      {!isCollapsed && (
        <CardContent>
          <div className="grid grid-cols-7 gap-1">
            {/* Day names header */}
            {dayNames.map((name, index) => (
              <div
                key={`header-${index}`}
                className="text-center text-xs text-muted-foreground py-1"
              >
                {name}
              </div>
            ))}

            {/* Calendar cells */}
            {days.map((day, index) => (
              <div
                key={`day-${index}`}
                className={`aspect-square flex items-center justify-center rounded-full text-sm
                ${day === null ? "" : "cursor-pointer hover:bg-muted/50"}
                ${day !== null && isCompleted(day) ? "bg-blue-500 text-white" : ""}`}
              >
                {day !== null ? day : ""}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Read chapters ({daysCompleted} days)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-slate-100 border border-slate-200 rounded-full"></div>
              <span>No reading</span>
            </div>
          </div>
        </CardContent>
      )}
    </UICard>
  );
};

export default MonthlyReadingChart;
