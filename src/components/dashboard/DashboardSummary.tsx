import React, { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Target, BookOpen, Calendar, Loader2 } from "lucide-react";
import { getHabits } from "@/lib/api/habits";
import { getGoals } from "@/lib/api/goals";

interface DashboardSummaryProps {
  habitCount?: number;
  habitCompletionRate?: number;
  activeGoals?: number;
  goalCompletionRate?: number;
  streakDays?: number;
  nextMeeting?: string;
}

const DashboardSummary = () => {
  const [habitCount, setHabitCount] = useState(0);
  const [habitCompletionRate, setHabitCompletionRate] = useState(0);
  const [activeGoals, setActiveGoals] = useState(0);
  const [goalCompletionRate, setGoalCompletionRate] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  const [nextMeeting, setNextMeeting] = useState("Sunday, 10:00 AM");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch habits data
        const habitsData = await getHabits();
        setHabitCount(habitsData.length);

        // Calculate habit completion rate and max streak
        let totalStreak = 0;
        habitsData.forEach((habit) => {
          if (habit.streak && habit.streak > totalStreak) {
            totalStreak = habit.streak;
          }
        });
        setStreakDays(totalStreak);

        // Calculate completion rate (simplified)
        const completionRate =
          habitsData.length > 0
            ? Math.floor(
                (habitsData.filter(
                  (h) =>
                    h.updated_at &&
                    new Date(h.updated_at).toDateString() ===
                      new Date().toDateString(),
                ).length /
                  habitsData.length) *
                  100,
              )
            : 0;
        setHabitCompletionRate(completionRate);

        // Fetch goals data
        const goalsData = await getGoals();
        setActiveGoals(goalsData.length);

        // Calculate goal progress average
        const avgProgress =
          goalsData.length > 0
            ? Math.floor(
                goalsData.reduce((sum, goal) => sum + (goal.progress || 0), 0) /
                  goalsData.length,
              )
            : 0;
        setGoalCompletionRate(avgProgress);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-white p-4 rounded-lg shadow-sm flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading dashboard data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white p-4 rounded-lg shadow-sm">
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
          {error}
        </div>
      </div>
    );
  }
  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Spiritual Progress</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Habits</h3>
            <CheckCircle className="h-5 w-5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold mb-1">{habitCount}</div>
          <p className="text-sm text-muted-foreground">Active habits</p>
          <div className="mt-3">
            <div className="flex justify-between text-sm mb-1">
              <span>Completion</span>
              <span>{habitCompletionRate}%</span>
            </div>
            <Progress value={habitCompletionRate} className="h-2" />
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Goals</h3>
            <Target className="h-5 w-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold mb-1">{activeGoals}</div>
          <p className="text-sm text-muted-foreground">Active goals</p>
          <div className="mt-3">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{goalCompletionRate}%</span>
            </div>
            <Progress value={goalCompletionRate} className="h-2" />
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Current Streak</h3>
            <BookOpen className="h-5 w-5 text-amber-500" />
          </div>
          <div className="text-2xl font-bold mb-1">{streakDays} days</div>
          <p className="text-sm text-muted-foreground">Bible reading</p>
          <div className="mt-3 flex">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-full mx-0.5 ${i < 5 ? "bg-amber-500" : "bg-gray-200"}`}
              />
            ))}
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Next Meeting</h3>
            <Calendar className="h-5 w-5 text-purple-500" />
          </div>
          <div className="text-xl font-bold mb-1">{nextMeeting}</div>
          <p className="text-sm text-muted-foreground">Public Meeting</p>
          <div className="mt-3 text-sm text-muted-foreground">
            <span>Prepare: Watchtower study</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;
