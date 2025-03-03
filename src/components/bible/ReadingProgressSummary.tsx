import React from "react";
import { Progress } from "../ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { BookOpen, CheckCircle, BarChart } from "lucide-react";

interface ReadingProgressSummaryProps {
  totalChapters?: number;
  chaptersRead?: number;
  oldTestamentProgress?: number;
  newTestamentProgress?: number;
  currentStreak?: number;
  longestStreak?: number;
}

const ReadingProgressSummary = ({
  totalChapters = 1189,
  chaptersRead = 247,
  oldTestamentProgress = 21,
  newTestamentProgress = 32,
  currentStreak = 12,
  longestStreak = 30,
}: ReadingProgressSummaryProps) => {
  const overallProgress = Math.round((chaptersRead / totalChapters) * 100);

  return (
    <div className="w-full bg-background p-4 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-4">Reading Progress</h2>

      {/* Overall Progress */}
      <Card className="mb-6 hover:border-primary/50 transition-colors duration-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Overall Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {chaptersRead} of {totalChapters} chapters
              </span>
              <span className="font-medium">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Testament Progress */}
      <Card className="mb-6 hover:border-primary/50 transition-colors duration-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            Testament Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">Old Testament</span>
                <span className="text-sm font-medium">
                  {oldTestamentProgress}%
                </span>
              </div>
              <Progress value={oldTestamentProgress} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">New Testament</span>
                <span className="text-sm font-medium">
                  {newTestamentProgress}%
                </span>
              </div>
              <Progress value={newTestamentProgress} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reading Streaks */}
      <Card className="hover:border-primary/50 transition-colors duration-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart className="h-5 w-5 text-primary" />
            Reading Streaks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-md">
              <p className="text-sm text-muted-foreground mb-1">
                Current Streak
              </p>
              <p className="text-2xl font-bold">{currentStreak} days</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-md">
              <p className="text-sm text-muted-foreground mb-1">
                Longest Streak
              </p>
              <p className="text-2xl font-bold">{longestStreak} days</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reading Tips */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          Reading Tips
        </h3>
        <Separator className="mb-3" />
        <ul className="space-y-2">
          <li className="flex justify-between items-center text-sm p-2 bg-muted/30 rounded">
            <span>Read consistently each day to build a streak</span>
          </li>
          <li className="flex justify-between items-center text-sm p-2 bg-muted/30 rounded">
            <span>Try reading one chapter from each testament daily</span>
          </li>
          <li className="flex justify-between items-center text-sm p-2 bg-muted/30 rounded">
            <span>Click on a chapter number to mark it as read</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ReadingProgressSummary;
