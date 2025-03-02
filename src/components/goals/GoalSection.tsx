import React, { useState, useEffect } from "react";
import { Plus, Loader2 } from "lucide-react";
import ConnectionStatus from "@/components/ConnectionStatus";
import { Button } from "@/components/ui/button";
import GoalCard from "./GoalCard";
import AddGoalDialog from "./AddGoalDialog";
import GoalDetailsDialog from "./GoalDetailsDialog";
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  updateSubgoal,
} from "@/lib/api/goals";
import { checkSupabaseConnection } from "@/lib/supabase";

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
}

const GoalSection = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [goals, setGoals] = useState<GoalType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setLoading(true);

        const goalsData = await getGoals();
        setGoals(goalsData);
      } catch (err) {
        console.error("Error fetching goals:", err);
        setError(
          "Failed to load goals. Please check your database connection and try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  const handleAddGoal = async (goalData: GoalType) => {
    try {
      setLoading(true);

      // Prepare data for API
      const goalToCreate = {
        title: goalData.title,
        description: goalData.description,
        type: goalData.type,
        deadline: goalData.deadline,
        progress: 0,
      };

      // Map subgoals to the format expected by the API
      const subgoalsToCreate = goalData.subgoals.map((subgoal) => ({
        title: subgoal.title,
        completed: subgoal.completed,
      }));

      // Create the goal in the database
      const createdGoal = await createGoal(goalToCreate, subgoalsToCreate);

      // Add the new goal to the state
      setGoals((prevGoals) => [...prevGoals, createdGoal]);
      setShowAddDialog(false);

      // Create a notification for the new goal
      import("@/lib/notifications").then(
        ({ createGoalProgressNotification }) => {
          createGoalProgressNotification(goalData.title, 0);
        },
      );
    } catch (err) {
      console.error("Error creating goal:", err);
      setError("Failed to create goal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateGoal = async (
    id: string,
    updatedData: Partial<GoalType>,
  ) => {
    try {
      setLoading(true);
      await updateGoal(id, updatedData);

      // Update the goal in the state
      setGoals((prevGoals) =>
        prevGoals.map((goal) =>
          goal.id === id ? { ...goal, ...updatedData } : goal,
        ),
      );
    } catch (err) {
      console.error("Error updating goal:", err);
      setError("Failed to update goal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    try {
      setLoading(true);
      await deleteGoal(id);

      // Remove the goal from the state
      setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== id));
    } catch (err) {
      console.error("Error deleting goal:", err);
      setError("Failed to delete goal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Spiritual Goals</h2>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="rounded-full bg-slate-900 hover:bg-slate-800"
          size="sm"
          disabled={loading}
        >
          <Plus className="h-4 w-4 mr-1" /> Add Goal
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {loading && goals.length === 0 ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading goals...</span>
        </div>
      ) : goals.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>You don't have any goals yet.</p>
          <p className="text-sm mt-1">
            Click "Add Goal" to create your first spiritual goal.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              id={goal.id}
              title={goal.title}
              progress={goal.progress || 0}
              dueDate={goal.deadline}
              subgoals={goal.subgoals || []}
              onClick={() => setSelectedGoalId(goal.id)}
              onEdit={() => setSelectedGoalId(goal.id)}
            />
          ))}
        </div>
      )}

      <AddGoalDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddGoal={handleAddGoal}
      />

      {selectedGoalId && (
        <GoalDetailsDialog
          goalId={selectedGoalId}
          open={!!selectedGoalId}
          onOpenChange={(open) => !open && setSelectedGoalId(null)}
          onUpdate={handleUpdateGoal}
          onDelete={(id) => {
            handleDeleteGoal(id);
            setSelectedGoalId(null);
          }}
          onUpdateSubgoal={async (goalId, subgoalId, completed) => {
            try {
              await updateSubgoal(subgoalId, { completed });
              // Refresh the goals list to get updated progress
              const goalsData = await getGoals();
              setGoals(goalsData);
            } catch (err) {
              console.error("Error updating subgoal:", err);
              setError("Failed to update step. Please try again.");
            }
          }}
        />
      )}
    </div>
  );
};

export default GoalSection;
