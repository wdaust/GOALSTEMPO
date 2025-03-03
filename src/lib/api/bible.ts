import { supabase } from "../supabase";
import { getCurrentUser } from "../auth";

export interface BibleReadingProgress {
  id: string;
  user_id: string;
  book_name: string;
  chapter_number: number;
  completed_at: string;
  date_read?: string;
}

// Get all reading progress for the current user
export async function getReadingProgress() {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("bible_reading_progress")
    .select("*")
    .eq("user_id", user.id);

  if (error) throw error;
  return data as BibleReadingProgress[];
}

// Get all unique dates when reading occurred
export async function getReadingDates() {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("bible_reading_progress")
    .select("date_read")
    .eq("user_id", user.id)
    .order("date_read", { ascending: false });

  if (error) throw error;

  // Extract unique dates
  const uniqueDates = [...new Set(data.map((item) => item.date_read))].filter(
    Boolean,
  );
  return uniqueDates;
}

// Mark a chapter as read
export async function markChapterAsRead(
  bookName: string,
  chapterNumber: number,
) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("User not authenticated");

    // Check if the chapter is already marked as read
    const { data: existingProgress, error: fetchError } = await supabase
      .from("bible_reading_progress")
      .select("id")
      .eq("user_id", user.id)
      .eq("book_name", bookName)
      .eq("chapter_number", chapterNumber)
      .maybeSingle();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error checking existing progress:", fetchError);
      throw fetchError;
    }

    if (existingProgress) {
      // If already marked as read, remove the mark (toggle functionality)
      const { error } = await supabase
        .from("bible_reading_progress")
        .delete()
        .eq("id", existingProgress.id);

      if (error) throw error;
      return null;
    } else {
      // Mark as read
      const today = new Date().toISOString().split("T")[0]; // Format as YYYY-MM-DD
      const { data, error } = await supabase
        .from("bible_reading_progress")
        .insert([
          {
            user_id: user.id,
            book_name: bookName,
            chapter_number: chapterNumber,
            completed_at: new Date().toISOString(),
            date_read: today,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data as BibleReadingProgress;
    }
  } catch (error) {
    console.error("Error in markChapterAsRead:", error);
    throw error;
  }
}

// Mark all chapters in a book as read
export async function markBookAsRead(bookName: string, totalChapters: number) {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");

  // Create an array of chapters to mark as read
  const today = new Date().toISOString().split("T")[0]; // Format as YYYY-MM-DD
  const chaptersToMark = Array.from({ length: totalChapters }, (_, i) => ({
    user_id: user.id,
    book_name: bookName,
    chapter_number: i + 1,
    completed_at: new Date().toISOString(),
    date_read: today,
  }));

  // First, delete any existing progress for this book
  await supabase
    .from("bible_reading_progress")
    .delete()
    .eq("user_id", user.id)
    .eq("book_name", bookName);

  // Then insert all chapters as read
  const { data, error } = await supabase
    .from("bible_reading_progress")
    .insert(chaptersToMark)
    .select();

  if (error) throw error;
  return data as BibleReadingProgress[];
}

// Reset reading progress for a book
export async function resetBookProgress(bookName: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");

  const { error } = await supabase
    .from("bible_reading_progress")
    .delete()
    .eq("user_id", user.id)
    .eq("book_name", bookName);

  if (error) throw error;
  return true;
}

// Reset all reading progress
export async function resetAllProgress() {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");

  const { error } = await supabase
    .from("bible_reading_progress")
    .delete()
    .eq("user_id", user.id);

  if (error) throw error;
  return true;
}

// Get reading streak information
export async function getReadingStreak() {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("bible_reading_progress")
    .select("completed_at")
    .eq("user_id", user.id)
    .order("completed_at", { ascending: false });

  if (error) throw error;

  // Process the data to calculate streaks
  // This is a simplified implementation
  const dates = data.map((item) => {
    const date = new Date(item.completed_at);
    return date.toISOString().split("T")[0]; // Get just the date part
  });

  // Remove duplicates (only count one chapter per day for streak purposes)
  const uniqueDates = [...new Set(dates)].sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  // Calculate current streak
  let currentStreak = 0;
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  // Check if read today or yesterday to start the streak
  if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
    currentStreak = 1;

    // Check consecutive days
    for (let i = 1; i < uniqueDates.length; i++) {
      const currentDate = new Date(uniqueDates[i - 1]);
      const prevDate = new Date(uniqueDates[i]);

      // Check if dates are consecutive
      const diffTime = currentDate.getTime() - prevDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // Calculate longest streak (simplified)
  // In a real app, you would need a more sophisticated algorithm
  let longestStreak = currentStreak;

  return {
    currentStreak,
    longestStreak,
    lastReadDate: uniqueDates[0] || null,
  };
}
