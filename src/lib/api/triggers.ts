import { supabase } from "../supabase";
import { getCurrentUser } from "../auth";
import { Tables, TablesInsert } from "@/types/supabase";

export type Trigger = Tables<"habit_triggers">;
export type TriggerInsert = TablesInsert<"habit_triggers">;

// Get all triggers for a habit
export async function getHabitTriggers(habitId: string) {
  const { data, error } = await supabase
    .from("habit_triggers")
    .select("*")
    .eq("habit_id", habitId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

// Add a new trigger to a habit
export async function addHabitTrigger(habitId: string, triggerText: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("habit_triggers")
    .insert([
      {
        habit_id: habitId,
        trigger_text: triggerText,
        count: 1,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Increment the count for an existing trigger
export async function incrementTriggerCount(triggerId: string) {
  const { data: existingTrigger } = await supabase
    .from("habit_triggers")
    .select("count")
    .eq("id", triggerId)
    .single();

  if (!existingTrigger) throw new Error("Trigger not found");

  const { data, error } = await supabase
    .from("habit_triggers")
    .update({
      count: (existingTrigger.count || 0) + 1,
      updated_at: new Date().toISOString(),
    })
    .eq("id", triggerId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Remove a trigger from a habit
export async function removeHabitTrigger(triggerId: string) {
  const { error } = await supabase
    .from("habit_triggers")
    .delete()
    .eq("id", triggerId);

  if (error) throw error;
}

// Get all common triggers (for suggestions)
export async function getCommonTriggers() {
  const { data, error } = await supabase
    .from("habit_triggers")
    .select("trigger_text, count")
    .order("count", { ascending: false })
    .limit(20);

  if (error) throw error;
  return data.map((item) => item.trigger_text);
}

// Record triggers when resetting a habit
export async function recordHabitReset(habitId: string, triggers: string[]) {
  if (!triggers || triggers.length === 0) return;

  // First, get existing triggers for this habit
  const { data: existingTriggers } = await supabase
    .from("habit_triggers")
    .select("id, trigger_text, count")
    .eq("habit_id", habitId);

  const existingTriggerMap =
    existingTriggers?.reduce(
      (acc, trigger) => {
        acc[trigger.trigger_text.toLowerCase()] = trigger;
        return acc;
      },
      {} as Record<string, any>,
    ) || {};

  // Process each trigger
  for (const trigger of triggers) {
    const triggerLower = trigger.toLowerCase();

    if (existingTriggerMap[triggerLower]) {
      // Increment existing trigger
      await incrementTriggerCount(existingTriggerMap[triggerLower].id);
    } else {
      // Add new trigger
      await addHabitTrigger(habitId, trigger);
    }
  }
}
