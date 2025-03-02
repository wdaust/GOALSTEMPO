import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Flame,
  Calendar,
  Edit,
  Trash2,
  Save,
  BarChart,
  PieChart,
  AlertCircle,
  Ban,
  ArrowRight,
} from "lucide-react";
import HabitCompletionChart from "@/components/charts/HabitCompletionChart";
import WeeklyHabitChart from "@/components/charts/WeeklyHabitChart";
import MonthlyProgressCalendar from "@/components/charts/MonthlyProgressCalendar";
import { resetBreakHabit, getHabit } from "@/lib/api/habits";
import {
  getHabitTriggers,
  recordHabitReset,
  getCommonTriggers,
} from "@/lib/api/triggers";
import BadgeInput from "@/components/ui/badge-input";

interface HabitDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habit: {
    id: string;
    name: string;
    description: string;
    progress: number;
    streak: number;
    lastCompleted: string;
    type: string;
    reasons?: string;
    alternatives?: string;
  };
  onSave: (
    id: string,
    updatedHabit: {
      name: string;
      description: string;
      reasons?: string;
      alternatives?: string;
    },
  ) => void;
  onDelete: (id: string) => void;
}

const HabitDetailsDialog = ({
  open,
  onOpenChange,
  habit,
  onSave,
  onDelete,
}: HabitDetailsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(habit.name);
  const [editedDescription, setEditedDescription] = useState(habit.description);
  const [editedReasons, setEditedReasons] = useState(habit.reasons || "");
  const [editedAlternatives, setEditedAlternatives] = useState(
    habit.alternatives || "",
  );
  const [showBreakDialog, setShowBreakDialog] = useState(false);
  const [breakReason, setBreakReason] = useState("");
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [commonTriggers, setCommonTriggers] = useState<string[]>([]);
  const [daysSince, setDaysSince] = useState(habit?.streak || 0);
  const [habitTriggers, setHabitTriggers] = useState<
    { trigger_text: string; count: number; id: string }[]
  >([]);

  // Fetch habit triggers and common triggers when component mounts
  useEffect(() => {
    if (habit.id && habit.type === "break-habit" && open) {
      const fetchTriggers = async () => {
        try {
          // Get triggers for this specific habit
          const triggers = await getHabitTriggers(habit.id);
          setHabitTriggers(triggers);

          // Get common triggers for suggestions
          const common = await getCommonTriggers();
          setCommonTriggers(common);
        } catch (error) {
          console.error("Error fetching triggers:", error);
        }
      };

      fetchTriggers();
    }
  }, [habit.id, habit.type, open]);

  const handleSave = () => {
    onSave(habit.id, {
      name: editedName,
      description: editedDescription,
      reasons: editedReasons,
      alternatives: editedAlternatives,
    });
    setIsEditing(false);
  };

  const handleBreakStreak = async () => {
    try {
      // Reset the streak in the database
      await resetBreakHabit(habit.id, breakReason);

      // Record the selected triggers
      if (selectedTriggers.length > 0) {
        await recordHabitReset(habit.id, selectedTriggers);

        // Update local state with new triggers
        const updatedTriggers = [...habitTriggers];
        selectedTriggers.forEach((trigger) => {
          const existingTrigger = updatedTriggers.find(
            (t) => t.trigger_text.toLowerCase() === trigger.toLowerCase(),
          );

          if (existingTrigger) {
            existingTrigger.count += 1;
          } else {
            updatedTriggers.push({
              trigger_text: trigger,
              count: 1,
              id: `temp-${Date.now()}`,
            });
          }
        });

        setHabitTriggers(updatedTriggers);
      }

      // Update local state
      setDaysSince(0);
      setShowBreakDialog(false);
      setSelectedTriggers([]);
      setBreakReason("");

      // Show notification
      import("@/lib/notifications").then(({ addNotification }) => {
        addNotification({
          title: "Streak Reset",
          message:
            "Don't give up! Every day is a new opportunity to start again.",
          time: "Just now",
          read: false,
          type: "habit",
        });
      });
    } catch (error) {
      console.error("Error resetting break habit:", error);
    }
  };

  // Generate sample data for visualizations
  const generateWeeklyData = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((day) => ({
      day,
      completed: Math.random() > 0.3, // 70% chance of completion
    }));
  };

  const generateMonthlyData = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Generate random completed dates
    const completedDates = [];
    for (let i = 1; i <= daysInMonth; i++) {
      if (Math.random() > 0.4) {
        // 60% chance of completion
        const day = String(i).padStart(2, "0");
        const month = String(currentMonth + 1).padStart(2, "0");
        completedDates.push(`${currentYear}-${month}-${day}`);
      }
    }

    return completedDates;
  };

  // Sample data for pie chart
  const completionData = [
    { label: "Completed", value: 70, color: "#4ade80" },
    { label: "Missed", value: 30, color: "#f87171" },
  ];

  // Default trigger suggestions if none are available from the database
  const defaultTriggerSuggestions = [
    "Stress",
    "Boredom",
    "Social pressure",
    "Emotional distress",
    "Fatigue",
    "Hunger",
    "Loneliness",
    "Celebration",
    "Peer influence",
    "Frustration",
  ];

  const triggerSuggestions =
    commonTriggers.length > 0 ? commonTriggers : defaultTriggerSuggestions;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>
            {isEditing ? (
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="text-xl font-bold"
              />
            ) : (
              habit.name
            )}
          </SheetTitle>
          <SheetDescription>
            {isEditing ? (
              <Input
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="text-sm text-muted-foreground"
              />
            ) : (
              habit.description
            )}
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            {habit.type === "break-habit" && (
              <TabsTrigger value="breakhabit">Break Habit</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="stats" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">
                    {habit.type === "break-habit"
                      ? "Days Since"
                      : "Current Streak"}
                  </h3>
                  <Flame className="h-5 w-5 text-orange-500" />
                </div>
                <div className="text-2xl font-bold">
                  {habit.type === "break-habit" ? daysSince : habit.streak} days
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {habit.type === "break-habit"
                    ? "Great progress! Keep going strong."
                    : "Keep it going! Your best streak was 14 days."}
                </p>
                {habit.type === "break-habit" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full text-red-500 border-red-200 hover:bg-red-50"
                    onClick={() => setShowBreakDialog(true)}
                  >
                    <AlertCircle className="h-4 w-4 mr-2" />I broke my streak
                  </Button>
                )}
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Completion Rate</h3>
                  <Calendar className="h-5 w-5 text-green-500" />
                </div>
                <div className="text-2xl font-bold">{habit.progress}%</div>
                <div className="mt-2">
                  <Progress value={habit.progress} className="h-2" />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Last completed: {habit.lastCompleted}
                </p>
              </div>

              <div className="p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Completion Breakdown</h3>
                  <PieChart className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex justify-center">
                  <HabitCompletionChart data={completionData} />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="weekly" className="mt-4">
            <div className="bg-white rounded-lg p-4 border">
              <h3 className="text-base font-medium mb-4">Weekly Overview</h3>
              <div className="flex justify-center">
                <WeeklyHabitChart
                  data={generateWeeklyData()}
                  width={300}
                  height={100}
                />
              </div>
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-2">Weekly Stats</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="text-xs text-muted-foreground">
                      Completion Rate
                    </div>
                    <div className="text-lg font-bold">71%</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="text-xs text-muted-foreground">
                      Days Completed
                    </div>
                    <div className="text-lg font-bold">5/7</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="monthly" className="mt-4">
            <div className="bg-white rounded-lg p-4 border">
              <h3 className="text-base font-medium mb-4">Monthly Overview</h3>
              <div className="flex justify-center">
                <MonthlyProgressCalendar
                  month={new Date().getMonth()}
                  year={new Date().getFullYear()}
                  completedDates={generateMonthlyData()}
                  width={300}
                />
              </div>
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-2">Monthly Stats</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="text-xs text-muted-foreground">
                      Completion Rate
                    </div>
                    <div className="text-lg font-bold">60%</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="text-xs text-muted-foreground">
                      Current Streak
                    </div>
                    <div className="text-lg font-bold">{habit.streak} days</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="text-xs text-muted-foreground">
                      Best Day
                    </div>
                    <div className="text-lg font-bold">Monday</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="text-xs text-muted-foreground">
                      Worst Day
                    </div>
                    <div className="text-lg font-bold">Saturday</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {habit.type === "break-habit" && (
            <TabsContent value="breakhabit" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium">
                      Reasons to Break This Habit
                    </h3>
                    <Ban className="h-5 w-5 text-red-500" />
                  </div>
                  {isEditing ? (
                    <Textarea
                      value={editedReasons}
                      onChange={(e) => setEditedReasons(e.target.value)}
                      placeholder="List your reasons for wanting to break this habit..."
                      className="min-h-[100px] mt-2"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">
                      {habit.reasons ||
                        "No reasons specified. Edit to add your motivations."}
                    </p>
                  )}
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium">
                      Positive Alternatives
                    </h3>
                    <ArrowRight className="h-5 w-5 text-green-500" />
                  </div>
                  {isEditing ? (
                    <Textarea
                      value={editedAlternatives}
                      onChange={(e) => setEditedAlternatives(e.target.value)}
                      placeholder="What positive habits can replace this negative one?"
                      className="min-h-[100px] mt-2"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">
                      {habit.alternatives ||
                        "No alternatives specified. Edit to add positive replacements."}
                    </p>
                  )}
                </div>

                <div className="p-4 rounded-lg border">
                  <h3 className="text-sm font-medium mb-2">Your Triggers</h3>
                  <p className="text-sm text-muted-foreground">
                    Identifying your triggers can help you avoid situations that
                    lead to this habit.
                  </p>
                  {habitTriggers.length > 0 ? (
                    <div className="mt-3 space-y-2">
                      {habitTriggers
                        .sort((a, b) => b.count - a.count)
                        .map((trigger, index) => {
                          // Assign different colors based on count
                          const colors = [
                            "bg-red-400",
                            "bg-yellow-400",
                            "bg-blue-400",
                            "bg-purple-400",
                            "bg-green-400",
                            "bg-indigo-400",
                            "bg-pink-400",
                          ];
                          const colorIndex = Math.min(index, colors.length - 1);

                          return (
                            <div
                              key={index}
                              className="flex items-center justify-between text-sm"
                            >
                              <div className="flex items-center space-x-2">
                                <div
                                  className={`h-2 w-2 rounded-full ${colors[colorIndex]}`}
                                ></div>
                                <span>{trigger.trigger_text}</span>
                              </div>
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                                {trigger.count}{" "}
                                {trigger.count === 1 ? "time" : "times"}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <div className="mt-3 text-sm text-muted-foreground italic">
                      No triggers recorded yet. When you reset your streak,
                      you'll be able to tag what triggered you.
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>

        {/* Break Streak Dialog */}
        {showBreakDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full space-y-4">
              <h3 className="text-lg font-medium">What happened?</h3>
              <p className="text-sm text-muted-foreground">
                Reflecting on why you broke your streak can help you avoid
                triggers in the future.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    What triggered you?
                  </label>
                  <BadgeInput
                    value={selectedTriggers}
                    onChange={setSelectedTriggers}
                    placeholder="Type a trigger and press Enter..."
                    suggestions={triggerSuggestions}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Add tags like "stress", "boredom", "social pressure", etc.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Additional notes (optional)
                  </label>
                  <Textarea
                    value={breakReason}
                    onChange={(e) => setBreakReason(e.target.value)}
                    placeholder="Any additional details about what happened..."
                    className="min-h-[80px]"
                  />
                </div>
              </div>
              <div className="flex space-x-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowBreakDialog(false)}
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleBreakStreak}>
                  Reset Counter
                </Button>
              </div>
            </div>
          </div>
        )}

        <SheetFooter className="mt-6 flex-col space-y-2">
          {isEditing ? (
            <div className="flex space-x-2 w-full">
              <Button onClick={handleSave} className="flex-1">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex space-x-2 w-full">
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="flex-1"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Habit
              </Button>
              <Button
                variant="destructive"
                onClick={() => onDelete(habit.id)}
                className="flex-1"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default HabitDetailsDialog;
