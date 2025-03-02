import { supabase } from "../supabase";
import { getCurrentUser } from "../auth";
import { Tables, TablesInsert } from "@/types/supabase";

export type JournalEntry = Tables<"journal_entries">;
export type JournalEntryInsert = TablesInsert<"journal_entries">;

export async function getJournalEntries() {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getJournalEntry(id: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) throw error;
  return data;
}

export async function createJournalEntry(
  entry: Omit<JournalEntryInsert, "user_id">,
) {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("journal_entries")
    .insert([{ ...entry, user_id: user.id }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateJournalEntry(
  id: string,
  entry: Partial<JournalEntryInsert>,
) {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("journal_entries")
    .update({ ...entry, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteJournalEntry(id: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");

  const { error } = await supabase
    .from("journal_entries")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;
}
