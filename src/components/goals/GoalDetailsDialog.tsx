import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarClock,
  Target,
  ListChecks,
  Save,
  Trash2,
  Plus,
  Calendar,
  BarChart,
  LineChart,
} from "lucide-react";
import { getGoalWithSubgoals, updateSubgoal } from "@/lib/api/goals";
import GoalProgressChart from "@/components/charts/GoalProgressChart";
import MonthlyProgressCalendar from "@/components/charts/MonthlyProgressCalendar";

interface SubGoalType {
  id: string;
  title: string;
  completed: boolean;
  notes?: string;
}

interface GoalType {
  id: string;
  title: string;
  description: string;
  type: string;
  deadline: string;
  progress: number;
  subgoals: SubGoalType[];
  created_at?: string;
  updated_at?: string;
}

interface GoalDetailsDialogProps {
  goalId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: string, updatedData: Partial<GoalType>) => void;
  onDelete: (id: string) => void;
  onUpdateSubgoal: (
    goalId: string,
    subgoalId: string,
    completed: boolean,
  ) => void;
}

const GoalDetailsDialog = ({
  goalId,
  open,
  onOpenChange,
  onUpdate,
  onDelete,
  onUpdateSubgoal,
}: GoalDetailsDialogProps) => {
  const [goal, setGoal] = useState<GoalType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedDeadline, setEditedDeadline] = useState("");
  const [newSubgoalTitle, setNewSubgoalTitle] = useState("");
  const [editedSubgoals, setEditedSubgoals] = useState<SubGoalType[]>([]);

  useEffect(() => {
    const fetchGoalDetails = async () => {
      if (!open) return;

      try {
        setLoading(true);
        const goalData = await getGoalWithSubgoals(goalId);
        setGoal(goalData);

        // Initialize form state
        setEditedTitle(goalData.title);
        setEditedDescription(goalData.description || "");
        setEditedDeadline(goalData.deadline || "");
        setEditedSubgoals(goalData.subgoals || []);
      } catch (err) {
        console.error("Error fetching goal details:", err);
        setError("Failed to load goal details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchGoalDetails();
  }, [goalId, open]);

  const handleSave = () => {
    if (!goal) return;

    const updatedGoal = {
      title: editedTitle,
      description: editedDescription,
      deadline: editedDeadline,
    };

    onUpdate(goal.id, updatedGoal);
    setIsEditing(false);
  };

  const handleToggleSubgoal = (subgoalId: string, completed: boolean) => {
    if (!goal) return;

    // Update locally first for immediate feedback
    setEditedSubgoals((prevSubgoals) =>
      prevSubgoals.map((sg) =>
        sg.id === subgoalId ? { ...sg, completed } : sg,
      ),
    );

    // Then update in the database
    onUpdateSubgoal(goal.id, subgoalId, completed);
  };

  const handleAddSubgoal = () => {
    if (!newSubgoalTitle.trim() || !goal) return;

    // Create a temporary ID for the new subgoal
    const tempSubgoal = {
      id: `temp-${Date.now()}`,
      title: newSubgoalTitle,
      completed: false,
      notes: "",
    };

    setEditedSubgoals([...editedSubgoals, tempSubgoal]);
    setNewSubgoalTitle("");

    // In a real implementation, you would add this to the database
    // and then update the local state with the returned subgoal
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            <span className="ml-2">Loading goal details...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-md">{error}</div>
        ) : goal ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center">
                {isEditing ? (
                  <Input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="text-xl font-bold"
                    placeholder="Goal Title"
                  />
                ) : (
                  <div className="text-xl font-bold flex items-center">
                    <Target className="h-5 w-5 mr-2 text-blue-500" />
                    {goal.title}
                  </div>
                )}
              </DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="details" className="mt-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="steps">Steps</TabsTrigger>
                <TabsTrigger value="progress">Progress</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 mt-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        placeholder="Describe your goal"
                        className="min-h-[100px]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="deadline">Target Date</Label>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <Input
                          id="deadline"
                          type="date"
                          value={editedDeadline}
                          onChange={(e) => setEditedDeadline(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium mb-2">Description</h3>
                      <p className="text-sm text-muted-foreground">
                        {goal.description || "No description provided."}
                      </p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium mb-2">Target Date</h3>
                      <div className="flex items-center">
                        <CalendarClock className="h-4 w-4 mr-2 text-green-500" />
                        <span>
                          {goal.deadline
                            ? formatDate(goal.deadline)
                            : "No deadline set"}
                        </span>
                      </div>
                    </div>

                    {goal.created_at && (
                      <div className="p-4 rounded-lg border">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Created
                            </p>
                            <p className="text-sm">
                              {formatDate(goal.created_at)}
                            </p>
                          </div>
                          {goal.updated_at && (
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Last Updated
                              </p>
                              <p className="text-sm">
                                {formatDate(goal.updated_at)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="steps" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Steps to Complete</h3>
                  <div className="space-y-2">
                    {editedSubgoals.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No steps defined yet.
                      </p>
                    ) : (
                      editedSubgoals.map((subgoal) => (
                        <div
                          key={subgoal.id}
                          className="bg-gray-50 p-3 rounded-md space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`subgoal-${subgoal.id}`}
                              checked={subgoal.completed}
                              onCheckedChange={(checked) =>
                                handleToggleSubgoal(
                                  subgoal.id,
                                  checked === true,
                                )
                              }
                            />
                            <Label
                              htmlFor={`subgoal-${subgoal.id}`}
                              className={`flex-1 ${subgoal.completed ? "line-through text-muted-foreground" : ""}`}
                            >
                              {subgoal.title}
                            </Label>
                          </div>
                          {isEditing ? (
                            <Textarea
                              placeholder="Add notes or details about this step..."
                              className="text-sm min-h-[60px] mt-2"
                              value={subgoal.notes || ""}
                              onChange={(e) => {
                                setEditedSubgoals((prevSubgoals) =>
                                  prevSubgoals.map((sg) =>
                                    sg.id === subgoal.id
                                      ? { ...sg, notes: e.target.value }
                                      : sg,
                                  ),
                                );
                              }}
                            />
                          ) : subgoal.notes ? (
                            <div className="text-sm text-muted-foreground pl-7 border-l-2 border-gray-200 ml-1">
                              {subgoal.notes}
                            </div>
                          ) : null}
                        </div>
                      ))
                    )}
                  </div>

                  {isEditing && (
                    <div className="flex space-x-2 mt-4">
                      <Input
                        placeholder="Add a new step"
                        value={newSubgoalTitle}
                        onChange={(e) => setNewSubgoalTitle(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleAddSubgoal()
                        }
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddSubgoal}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="progress" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">
                      Overall Progress
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          {goal.progress}% Complete
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {editedSubgoals.filter((sg) => sg.completed).length}/
                          {editedSubgoals.length} steps
                        </span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <h3 className="text-sm font-medium mb-2">
                      Steps Breakdown
                    </h3>
                    <div className="space-y-2">
                      {editedSubgoals.map((subgoal) => (
                        <div
                          key={subgoal.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            <div
                              className={`h-3 w-3 rounded-full mr-2 ${subgoal.completed ? "bg-green-500" : "bg-gray-300"}`}
                            />
                            <span className="text-sm truncate max-w-[300px]">
                              {subgoal.title}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {subgoal.completed ? "Completed" : "Pending"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4 mt-4">
                <div className="space-y-6">
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium flex items-center">
                        <LineChart className="h-4 w-4 mr-2 text-blue-500" />
                        Progress Over Time
                      </h3>
                    </div>
                    <div className="flex justify-center">
                      <GoalProgressChart
                        progress={goal.progress}
                        width={500}
                        height={200}
                      />
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                        Monthly Activity
                      </h3>
                    </div>
                    <div className="flex justify-center">
                      <MonthlyProgressCalendar
                        month={new Date().getMonth()}
                        year={new Date().getFullYear()}
                        completedDates={[
                          // Generate some sample dates for the current month
                          ...Array.from({ length: 10 }, (_, i) => {
                            const day = Math.floor(Math.random() * 28) + 1;
                            const month = new Date().getMonth() + 1;
                            const year = new Date().getFullYear();
                            return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                          }),
                        ]}
                        width={300}
                      />
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium flex items-center">
                        <BarChart className="h-4 w-4 mr-2 text-blue-500" />
                        Completion Rate by Step
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {editedSubgoals.map((subgoal) => (
                        <div key={subgoal.id} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="truncate max-w-[250px]">
                              {subgoal.title}
                            </span>
                            <span>{subgoal.completed ? "100%" : "0%"}</span>
                          </div>
                          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{
                                width: subgoal.completed ? "100%" : "0%",
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-6">
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
                    Edit Goal
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => onDelete(goal.id)}
                    className="flex-1"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Goal
                  </Button>
                </div>
              )}
            </DialogFooter>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Goal not found.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GoalDetailsDialog;
