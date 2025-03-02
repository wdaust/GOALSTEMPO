import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

// Use environment variables if available, otherwise fallback to hardcoded values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create and export the Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Add a simple function to check connection
export const checkSupabaseConnection = async () => {
  try {
    // First check if we can connect to Supabase at all
    const { data, error } = await supabase
      .from("goals")
      .select("count", { count: "exact", head: true });

    if (error) {
      // Check if the error is because the table doesn't exist
      if (error.code === "42P01") {
        // PostgreSQL code for undefined_table
        return {
          connected: false,
          message:
            "Connected to Supabase but tables do not exist. Please run the SQL setup script.",
          error,
        };
      }

      // Check if it's a permissions error
      if (error.code === "42501" || error.message.includes("permission")) {
        // PostgreSQL code for insufficient_privilege
        return {
          connected: false,
          message:
            "Connected to Supabase but you do not have permission to access the tables. Please check RLS policies.",
          error,
        };
      }

      return {
        connected: false,
        message: `Database error: ${error.message}`,
        error,
      };
    }

    // Try to directly access tables to verify they exist
    const tables = ["goals", "habits", "journal_entries"];
    const results = await Promise.all(
      tables.map((table) =>
        supabase.from(table).select("count", { count: "exact", head: true }),
      ),
    );

    // Check if any table access failed
    const failedTables = results
      .map((result, index) => (result.error ? tables[index] : null))
      .filter(Boolean);

    if (failedTables.length > 0) {
      return {
        connected: false,
        message: `Connected to Supabase but cannot access tables: ${failedTables.join(", ")}`,
        error: results.find((r) => r.error)?.error,
      };
    }

    return { connected: true, message: "Successfully connected to Supabase" };
  } catch (error) {
    console.error("Supabase connection error:", error);
    return {
      connected: false,
      message:
        "Failed to connect to Supabase. Please check your API keys and URL.",
      error,
    };
  }
};
