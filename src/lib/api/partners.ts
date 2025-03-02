import { supabase } from "../supabase";
import { getCurrentUser } from "../auth";
import { Tables, TablesInsert } from "@/types/supabase";

export type Partner = Tables<"accountability_partners">;
export type PartnerInsert = TablesInsert<"accountability_partners">;

export async function getPartners() {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("accountability_partners")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function invitePartner(
  partnerEmail: string,
  shareSettings: {
    shareHabits: boolean;
    shareGoals: boolean;
    shareJournal: boolean;
  },
) {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");

  // In a real app, you would send an email invitation here
  // For now, we'll just create a pending partner record

  // First, check if the partner exists in the system
  // This is a simplified example - in a real app, you'd have a users table
  // Since we can't use admin.listUsers in client-side code, we'll just create a placeholder
  // partner_id for demonstration purposes
  const partnerId = "placeholder-partner-id";

  const { data, error } = await supabase
    .from("accountability_partners")
    .insert([
      {
        user_id: user.id,
        partner_id: partnerId,
        status: "pending",
        share_habits: shareSettings.shareHabits,
        share_goals: shareSettings.shareGoals,
        share_journal: shareSettings.shareJournal,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updatePartnerSettings(
  partnerId: string,
  settings: {
    shareHabits?: boolean;
    shareGoals?: boolean;
    shareJournal?: boolean;
  },
) {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("accountability_partners")
    .update({
      share_habits: settings.shareHabits,
      share_goals: settings.shareGoals,
      share_journal: settings.shareJournal,
      updated_at: new Date().toISOString(),
    })
    .eq("id", partnerId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removePartner(partnerId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");

  const { error } = await supabase
    .from("accountability_partners")
    .delete()
    .eq("id", partnerId)
    .eq("user_id", user.id);

  if (error) throw error;
}
