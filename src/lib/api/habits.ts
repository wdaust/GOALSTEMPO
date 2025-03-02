import { supabase } from "../supabase";
import { getCurrentUser } from "../auth";
import { Tables, TablesInsert } from "@/types/supabase";

export type Habit = Tables<"habits">;
export type HabitInsert = TablesInsert<"habits">;
export type HabitCompletion = Tables<"habit_completions">;

export async function getHabits() {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getHabit(id: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) throw error;
  return data;
}

export async function createHabit(habit: Omit<HabitInsert, "user_id">) {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("habits")
    .insert([{ ...habit, user_id: user.id }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateHabit(id: string, habit: Partial<HabitInsert>) {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("habits")
    .update({ ...habit, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteHabit(id: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");

  const { error } = await supabase
    .from("habits")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;
}

export async function completeHabit(habitId: string, date = new Date()) {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");

  // Get the habit to check its type
  const habit = await getHabit(habitId);
  const isBreakHabit = habit.type === "break-habit";

  // For break habits, we don't mark them as completed in the traditional sense
  // Instead, we increment the days since counter automatically
  if (isBreakHabit) {
    // For break habits, we just update the streak (days since) without creating a completion record
    // This would typically be done by a scheduled job that runs daily
    // For now, we'll just increment the streak manually
    await updateHabit(habitId, { streak: (habit.streak || 0) + 1 });
    return {
      id: habitId,
      habit_id: habitId,
      completed_date: date.toISOString(),
    };
  }

  // For regular habits, proceed with normal completion logic
  // Format date as YYYY-MM-DD
  const formattedDate = date.toISOString().split("T")[0];

  // Check if already completed for this date
  const { data: existing } = await supabase
    .from("habit_completions")
    .select("*")
    .eq("habit_id", habitId)
    .eq("completed_date", formattedDate);

  if (existing && existing.length > 0) {
    // Already completed for this date
    return existing[0];
  }

  // Add completion record
  const { data, error } = await supabase
    .from("habit_completions")
    .insert([
      {
        habit_id: habitId,
        completed_date: formattedDate,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  // Update streak count for regular habits
  await updateHabit(habitId, { streak: (habit.streak || 0) + 1 });

  return data;
}

export async function getHabitCompletions(
  habitId: string,
  startDate?: Date,
  endDate?: Date,
) {
  const { data, error } = await supabase
    .from("habit_completions")
    .select("*")
    .eq("habit_id", habitId)
    .order("completed_date", { ascending: false });

  if (error) throw error;
  return data;
}

export async function resetBreakHabit(habitId: string, reason?: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");

  // Reset the streak to 0
  const { data, error } = await supabase
    .from("habits")
    .update({
      streak: 0,
      updated_at: new Date().toISOString(),
      last_reset_reason: reason || "No reason provided",
    })
    .eq("id", habitId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
