import React from "react";
import { Card, CardContent } from "../ui/card";
import { BarChart } from "lucide-react";

interface ReadingStreakCardProps {
  currentStreak?: number;
  longestStreak?: number;
}

const ReadingStreakCard = ({
  currentStreak = 0,
  longestStreak = 0,
}: ReadingStreakCardProps) => {
  return (
    <Card className="w-full mb-6 bg-white">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <BarChart className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Reading Streaks</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded-lg text-center">
            <div className="text-slate-500 mb-1">Current Streak</div>
            <div className="text-3xl font-bold">{currentStreak} days</div>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg text-center">
            <div className="text-slate-500 mb-1">Longest Streak</div>
            <div className="text-3xl font-bold">{longestStreak} days</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReadingStreakCard;
