import React, { useState, useEffect } from "react";
import { Plus, Loader2 } from "lucide-react";
import ConnectionStatus from "@/components/ConnectionStatus";
import { Button } from "@/components/ui/button";
import HabitCard from "./HabitCard";
import AddHabitDialog from "./AddHabitDialog";
import HabitDetailsDialog from "@/components/habits/HabitDetailsDialog";
import { createHabitReminder } from "@/lib/notifications";
import {
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  completeHabit,
} from "@/lib/api/habits";
import { checkSupabaseConnection } from "@/lib/supabase";

interface HabitType {
  id: string;
  name: string;
  description: string;
  progress: number;
  streak: number;
  lastCompleted: string;
  type:
    | "bible-reading"
    | "meeting-attendance"
    | "field-service"
    | "custom"
    | "break-habit";
  reasons?: string;
  alternatives?: string;
}

const HabitSection = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<HabitType | null>(null);
  const [habits, setHabits] = useState<HabitType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        setLoading(true);

        const habitsData = await getHabits();

        // Transform the data to match our component's expected format
        const formattedHabits = habitsData.map((habit) => ({
          id: habit.id,
          name: habit.name,
          description: habit.description,
          progress: 0, // We'll calculate this from completions in a real app
          streak: habit.streak || 0,
          lastCompleted: habit.updated_at
            ? new Date(habit.updated_at).toLocaleDateString()
            : "Not started",
          type: habit.type,
          reasons: habit.reasons,
          alternatives: habit.alternatives,
        }));

        setHabits(formattedHabits);
      } catch (err) {
        console.error("Error fetching habits:", err);
        setError(
          "Failed to load habits. Please check your database connection and try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHabits();
  }, []);

  const handleAddHabit = async (habitData: any) => {
    try {
      setLoading(true);

      // Prepare data for API
      // For break habits, set initial streak to 0 (days since)
      // For other habits, also set initial streak to 0
      const habitToCreate = {
        name: habitData.name,
        description: habitData.goal,
        type: habitData.type,
        streak: 0,
        reasons: habitData.reasons || "",
        alternatives: habitData.alternatives || "",
      };

      // Create the habit in the database
      const createdHabit = await createHabit(habitToCreate);

      // Format the habit for our component
      const newHabit: HabitType = {
        id: createdHabit.id,
        name: createdHabit.name,
        description: createdHabit.description,
        progress: 0,
        streak: 0,
        lastCompleted: "Not started",
        type: createdHabit.type as any,
        reasons: createdHabit.reasons,
        alternatives: createdHabit.alternatives,
      };

      // Add the new habit to the state
      setHabits((prevHabits) => [...prevHabits, newHabit]);
      setShowAddDialog(false);

      // Create a notification for the new habit
      createHabitReminder(habitData.name);
    } catch (err) {
      console.error("Error creating habit:", err);
      setError("Failed to create habit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteHabit = async (id: string) => {
    try {
      const habit = habits.find((h) => h.id === id);
      if (!habit) return;

      // For break habits, we don't mark them as completed in the traditional sense
      if (habit.type === "break-habit") {
        // Just open the details dialog to show the "I slipped" functionality
        handleViewDetails(id);
        return;
      }

      if (habit.lastCompleted !== "Today") {
        setLoading(true);

        // Complete the habit in the database
        await completeHabit(id);

        // Update the habit in the state
        setHabits(
          habits.map((h) =>
            h.id === id
              ? {
                  ...h,
                  progress: Math.min(h.progress + 10, 100),
                  streak: h.streak + 1,
                  lastCompleted: "Today",
                }
              : h,
          ),
        );

        // Create a notification for streak milestone if applicable
        const updatedStreak = habit.streak + 1;
        if (updatedStreak % 7 === 0) {
          // Weekly milestone
          createHabitReminder(
            `Congratulations! You've maintained a ${updatedStreak}-day streak for ${habit.name}!`,
          );
        }
      }
    } catch (err) {
      console.error("Error completing habit:", err);
      setError("Failed to complete habit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (id: string) => {
    const habit = habits.find((h) => h.id === id);
    if (habit) {
      setSelectedHabit(habit);
    }
  };

  const handleUpdateHabit = async (
    id: string,
    updatedData: {
      name: string;
      description: string;
      reasons?: string;
      alternatives?: string;
    },
  ) => {
    try {
      setLoading(true);

      // Update the habit in the database
      await updateHabit(id, updatedData);

      // Update the habit in the state
      setHabits(
        habits.map((habit) =>
          habit.id === id
            ? {
                ...habit,
                name: updatedData.name,
                description: updatedData.description,
                reasons: updatedData.reasons,
                alternatives: updatedData.alternatives,
              }
            : habit,
        ),
      );
    } catch (err) {
      console.error("Error updating habit:", err);
      setError("Failed to update habit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHabit = async (id: string) => {
    try {
      setLoading(true);

      // Delete the habit from the database
      await deleteHabit(id);

      // Remove the habit from the state
      setHabits(habits.filter((habit) => habit.id !== id));
      setSelectedHabit(null);
    } catch (err) {
      console.error("Error deleting habit:", err);
      setError("Failed to delete habit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Spiritual Habits</h2>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="rounded-full"
          size="sm"
          disabled={loading}
        >
          <Plus className="h-4 w-4 mr-1" /> Add Habit
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {loading && habits.length === 0 ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading habits...</span>
        </div>
      ) : habits.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>You don't have any habits yet.</p>
          <p className="text-sm mt-1">
            Click "Add Habit" to create your first spiritual habit.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              name={habit.name}
              description={habit.description}
              progress={habit.progress}
              streak={habit.streak}
              lastCompleted={habit.lastCompleted}
              type={habit.type}
              onComplete={() => handleCompleteHabit(habit.id)}
              onViewDetails={() => handleViewDetails(habit.id)}
            />
          ))}
        </div>
      )}

      <AddHabitDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddHabit={handleAddHabit}
      />

      {selectedHabit && (
        <HabitDetailsDialog
          open={!!selectedHabit}
          onOpenChange={(open) => !open && setSelectedHabit(null)}
          habit={selectedHabit}
          onSave={handleUpdateHabit}
          onDelete={handleDeleteHabit}
        />
      )}
    </div>
  );
};

export default HabitSection;
