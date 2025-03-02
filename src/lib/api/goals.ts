import { supabase } from "../supabase";
import { getCurrentUser } from "../auth";
import { Tables, TablesInsert } from "@/types/supabase";

export type Goal = Tables<"goals">;
export type GoalInsert = TablesInsert<"goals">;
export type Subgoal = Tables<"subgoals">;
export type SubgoalInsert = TablesInsert<"subgoals">;

export async function getGoals() {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getGoalWithSubgoals(id: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");

  const { data: goal, error: goalError } = await supabase
    .from("goals")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (goalError) throw goalError;

  const { data: subgoals, error: subgoalsError } = await supabase
    .from("subgoals")
    .select("*")
    .eq("goal_id", id)
    .order("created_at", { ascending: true });

  if (subgoalsError) throw subgoalsError;

  return { ...goal, subgoals: subgoals || [] };
}

export async function createGoal(
  goal: Omit<GoalInsert, "user_id">,
  subgoals: Omit<SubgoalInsert, "goal_id">[],
) {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");

  // Start a transaction
  const { data: goalData, error: goalError } = await supabase
    .from("goals")
    .insert([{ ...goal, user_id: user.id }])
    .select()
    .single();

  if (goalError) throw goalError;

  if (subgoals && subgoals.length > 0) {
    const subgoalsWithGoalId = subgoals.map((subgoal) => ({
      ...subgoal,
      goal_id: goalData.id,
    }));

    const { error: subgoalsError } = await supabase
      .from("subgoals")
      .insert(subgoalsWithGoalId);

    if (subgoalsError) throw subgoalsError;
  }

  return getGoalWithSubgoals(goalData.id);
}

export async function updateGoal(id: string, goal: Partial<GoalInsert>) {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("goals")
    .update({ ...goal, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteGoal(id: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");

  // Subgoals will be deleted automatically due to ON DELETE CASCADE
  const { error } = await supabase
    .from("goals")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;
}

export async function updateSubgoal(
  id: string,
  subgoal: Partial<SubgoalInsert>,
) {
  const { data, error } = await supabase
    .from("subgoals")
    .update({ ...subgoal, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  // Update goal progress
  if (data && subgoal.completed !== undefined) {
    const { data: subgoalData } = await supabase
      .from("subgoals")
      .select("goal_id")
      .eq("id", id)
      .single();

    if (subgoalData) {
      await updateGoalProgress(subgoalData.goal_id);
    }
  }

  return data;
}

export async function updateGoalProgress(goalId: string) {
  // Get all subgoals for this goal
  const { data: subgoals } = await supabase
    .from("subgoals")
    .select("*")
    .eq("goal_id", goalId);

  if (!subgoals || subgoals.length === 0) return;

  // Calculate progress percentage
  const completedCount = subgoals.filter((sg) => sg.completed).length;
  const progress = Math.round((completedCount / subgoals.length) * 100);

  // Update goal progress
  await supabase
    .from("goals")
    .update({
      progress,
      updated_at: new Date().toISOString(),
    })
    .eq("id", goalId);
}
