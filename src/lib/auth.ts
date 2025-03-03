import { supabase } from "./supabase";

export type User = {
  id: string;
  email?: string;
  name?: string;
};

export async function getCurrentUser(): Promise<User | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) return null;

  return {
    id: data.user.id,
    email: data.user.email,
    name: data.user.user_metadata?.name as string,
  };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo:
        window.location.hostname === "localhost"
          ? "http://localhost:3000"
          : "https://truthgoals.io/",
    },
  });

  if (error) throw error;
  return data;
}

export async function signUp(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
      emailRedirectTo:
        window.location.hostname === "localhost"
          ? "http://localhost:3000/email-verified"
          : "https://truthgoals.io/",
    },
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
