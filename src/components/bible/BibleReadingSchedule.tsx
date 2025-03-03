import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Search,
  BookOpen,
  RefreshCw,
  Save,
  Calendar,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import BibleBookSection from "./BibleBookSection";
import ReadingStreakCard from "./ReadingStreakCard";
import YearlyReadingChart from "./YearlyReadingChart";
import MonthlyReadingChart from "./MonthlyReadingChart";
import {
  getReadingProgress,
  markChapterAsRead,
  markBookAsRead,
  resetBookProgress,
  resetAllProgress,
  getReadingStreak,
  getReadingDates,
} from "@/lib/api/bible";

// Bible book data with chapter counts
const bibleBooks = [
  // Old Testament
  { name: "Genesis", chapters: 50, testament: "old" },
  { name: "Exodus", chapters: 40, testament: "old" },
  { name: "Leviticus", chapters: 27, testament: "old" },
  { name: "Numbers", chapters: 36, testament: "old" },
  { name: "Deuteronomy", chapters: 34, testament: "old" },
  { name: "Joshua", chapters: 24, testament: "old" },
  { name: "Judges", chapters: 21, testament: "old" },
  { name: "Ruth", chapters: 4, testament: "old" },
  { name: "1 Samuel", chapters: 31, testament: "old" },
  { name: "2 Samuel", chapters: 24, testament: "old" },
  { name: "1 Kings", chapters: 22, testament: "old" },
  { name: "2 Kings", chapters: 25, testament: "old" },
  { name: "1 Chronicles", chapters: 29, testament: "old" },
  { name: "2 Chronicles", chapters: 36, testament: "old" },
  { name: "Ezra", chapters: 10, testament: "old" },
  { name: "Nehemiah", chapters: 13, testament: "old" },
  { name: "Esther", chapters: 10, testament: "old" },
  { name: "Job", chapters: 42, testament: "old" },
  { name: "Psalms", chapters: 150, testament: "old" },
  { name: "Proverbs", chapters: 31, testament: "old" },
  { name: "Ecclesiastes", chapters: 12, testament: "old" },
  { name: "Song of Solomon", chapters: 8, testament: "old" },
  { name: "Isaiah", chapters: 66, testament: "old" },
  { name: "Jeremiah", chapters: 52, testament: "old" },
  { name: "Lamentations", chapters: 5, testament: "old" },
  { name: "Ezekiel", chapters: 48, testament: "old" },
  { name: "Daniel", chapters: 12, testament: "old" },
  { name: "Hosea", chapters: 14, testament: "old" },
  { name: "Joel", chapters: 3, testament: "old" },
  { name: "Amos", chapters: 9, testament: "old" },
  { name: "Obadiah", chapters: 1, testament: "old" },
  { name: "Jonah", chapters: 4, testament: "old" },
  { name: "Micah", chapters: 7, testament: "old" },
  { name: "Nahum", chapters: 3, testament: "old" },
  { name: "Habakkuk", chapters: 3, testament: "old" },
  { name: "Zephaniah", chapters: 3, testament: "old" },
  { name: "Haggai", chapters: 2, testament: "old" },
  { name: "Zechariah", chapters: 14, testament: "old" },
  { name: "Malachi", chapters: 4, testament: "old" },
  // New Testament
  { name: "Matthew", chapters: 28, testament: "new" },
  { name: "Mark", chapters: 16, testament: "new" },
  { name: "Luke", chapters: 24, testament: "new" },
  { name: "John", chapters: 21, testament: "new" },
  { name: "Acts", chapters: 28, testament: "new" },
  { name: "Romans", chapters: 16, testament: "new" },
  { name: "1 Corinthians", chapters: 16, testament: "new" },
  { name: "2 Corinthians", chapters: 13, testament: "new" },
  { name: "Galatians", chapters: 6, testament: "new" },
  { name: "Ephesians", chapters: 6, testament: "new" },
  { name: "Philippians", chapters: 4, testament: "new" },
  { name: "Colossians", chapters: 4, testament: "new" },
  { name: "1 Thessalonians", chapters: 5, testament: "new" },
  { name: "2 Thessalonians", chapters: 3, testament: "new" },
  { name: "1 Timothy", chapters: 6, testament: "new" },
  { name: "2 Timothy", chapters: 4, testament: "new" },
  { name: "Titus", chapters: 3, testament: "new" },
  { name: "Philemon", chapters: 1, testament: "new" },
  { name: "Hebrews", chapters: 13, testament: "new" },
  { name: "James", chapters: 5, testament: "new" },
  { name: "1 Peter", chapters: 5, testament: "new" },
  { name: "2 Peter", chapters: 3, testament: "new" },
  { name: "1 John", chapters: 5, testament: "new" },
  { name: "2 John", chapters: 1, testament: "new" },
  { name: "3 John", chapters: 1, testament: "new" },
  { name: "Jude", chapters: 1, testament: "new" },
  { name: "Revelation", chapters: 22, testament: "new" },
];

interface Chapter {
  number: number;
  isRead: boolean;
  dateRead?: string;
}

interface BookData {
  name: string;
  chapters: Chapter[];
  testament: string;
}

const BibleReadingSchedule: React.FC = () => {
  const [readingData, setReadingData] = useState<Record<string, Chapter[]>>({});
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedBooks, setExpandedBooks] = useState<Record<string, boolean>>(
    {},
  );
  const [streakData, setStreakData] = useState({
    currentStreak: 0,
    longestStreak: 0,
    lastReadDate: null,
  });
  const [readingDates, setReadingDates] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"year" | "month">("year");

  // Fetch reading progress on component mount
  useEffect(() => {
    fetchReadingProgress();
  }, []);

  const fetchReadingProgress = async () => {
    try {
      setLoading(true);
      console.log("Fetching reading progress...");
      const progressData = await getReadingProgress();
      console.log("Progress data:", progressData);
      const streakInfo = await getReadingStreak();
      console.log("Streak info:", streakInfo);
      const dates = await getReadingDates();
      console.log("Reading dates:", dates);

      // Initialize reading data with all books and chapters
      const initialData: Record<string, Chapter[]> = {};

      bibleBooks.forEach((book) => {
        initialData[book.name] = Array.from(
          { length: book.chapters },
          (_, i) => ({
            number: i + 1,
            isRead: false,
          }),
        );
      });

      // Update with completed chapters
      progressData.forEach((item) => {
        if (initialData[item.book_name]) {
          const chapterIndex = item.chapter_number - 1;
          if (
            chapterIndex >= 0 &&
            chapterIndex < initialData[item.book_name].length
          ) {
            initialData[item.book_name][chapterIndex].isRead = true;
            initialData[item.book_name][chapterIndex].dateRead = item.date_read;
          }
        }
      });

      setReadingData(initialData);
      setStreakData(streakInfo);
      setReadingDates(dates);
    } catch (err) {
      console.error("Error fetching reading progress:", err);
      setError("Failed to load reading progress. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate reading progress statistics
  const calculateProgress = () => {
    let totalChapters = 0;
    let chaptersRead = 0;
    let oldTestamentTotal = 0;
    let oldTestamentRead = 0;
    let newTestamentTotal = 0;
    let newTestamentRead = 0;

    bibleBooks.forEach((book) => {
      const bookChapters = readingData[book.name] || [];
      const readInBook = bookChapters.filter((ch) => ch.isRead).length;

      totalChapters += book.chapters;
      chaptersRead += readInBook;

      if (book.testament === "old") {
        oldTestamentTotal += book.chapters;
        oldTestamentRead += readInBook;
      } else {
        newTestamentTotal += book.chapters;
        newTestamentRead += readInBook;
      }
    });

    return {
      totalChapters,
      chaptersRead,
      oldTestamentProgress:
        Math.round((oldTestamentRead / oldTestamentTotal) * 100) || 0,
      newTestamentProgress:
        Math.round((newTestamentRead / newTestamentTotal) * 100) || 0,
      currentStreak: streakData.currentStreak,
      longestStreak: streakData.longestStreak,
    };
  };

  // Handle marking a chapter as read/unread
  const handleMarkRead = async (bookName: string, chapterNumber: number) => {
    console.log(
      `Marking chapter ${chapterNumber} of ${bookName} as read/unread`,
    );
    try {
      await markChapterAsRead(bookName, chapterNumber);

      // Update local state
      setReadingData((prev) => {
        const updatedChapters = [...(prev[bookName] || [])];
        const chapterIndex = updatedChapters.findIndex(
          (ch) => ch.number === chapterNumber,
        );

        if (chapterIndex !== -1) {
          updatedChapters[chapterIndex] = {
            ...updatedChapters[chapterIndex],
            isRead: !updatedChapters[chapterIndex].isRead,
          };
        }

        return {
          ...prev,
          [bookName]: updatedChapters,
        };
      });

      // Refresh streak data and reading dates
      const streakInfo = await getReadingStreak();
      const dates = await getReadingDates();
      setStreakData(streakInfo);
      setReadingDates(dates);
    } catch (err) {
      console.error("Error marking chapter:", err);
      setError("Failed to update reading progress. Please try again.");
    }
  };

  // Handle marking all chapters in a book as read
  const handleMarkAllRead = async (bookName: string) => {
    try {
      const book = bibleBooks.find((b) => b.name === bookName);
      if (!book) return;

      await markBookAsRead(bookName, book.chapters);

      // Update local state
      setReadingData((prev) => {
        const updatedChapters = Array.from(
          { length: book.chapters },
          (_, i) => ({
            number: i + 1,
            isRead: true,
          }),
        );

        return {
          ...prev,
          [bookName]: updatedChapters,
        };
      });

      // Refresh streak data
      const streakInfo = await getReadingStreak();
      setStreakData(streakInfo);
    } catch (err) {
      console.error("Error marking book as read:", err);
      setError("Failed to update reading progress. Please try again.");
    }
  };

  // Handle resetting progress for a book
  const handleResetProgress = async (bookName: string) => {
    try {
      await resetBookProgress(bookName);

      // Update local state
      setReadingData((prev) => {
        const book = bibleBooks.find((b) => b.name === bookName);
        if (!book) return prev;

        const updatedChapters = Array.from(
          { length: book.chapters },
          (_, i) => ({
            number: i + 1,
            isRead: false,
          }),
        );

        return {
          ...prev,
          [bookName]: updatedChapters,
        };
      });
    } catch (err) {
      console.error("Error resetting book progress:", err);
      setError("Failed to reset reading progress. Please try again.");
    }
  };

  // Reset all reading progress
  const handleResetAllProgress = async () => {
    try {
      await resetAllProgress();

      // Update local state
      const resetData: Record<string, Chapter[]> = {};
      bibleBooks.forEach((book) => {
        resetData[book.name] = Array.from(
          { length: book.chapters },
          (_, i) => ({
            number: i + 1,
            isRead: false,
          }),
        );
      });
      setReadingData(resetData);

      // Reset streak data
      setStreakData({
        currentStreak: 0,
        longestStreak: 0,
        lastReadDate: null,
      });
    } catch (err) {
      console.error("Error resetting all progress:", err);
      setError("Failed to reset reading progress. Please try again.");
    }
  };

  // Filter books based on active tab and search term
  const filteredBooks = bibleBooks.filter((book) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "old" && book.testament === "old") ||
      (activeTab === "new" && book.testament === "new");

    const matchesSearch = book.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const progressStats = calculateProgress();

  if (loading) {
    return (
      <div className="w-full bg-background rounded-lg shadow-md border border-border p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-3">Loading reading progress...</span>
      </div>
    );
  }

  return (
    <div className="w-full bg-background rounded-lg shadow-md border border-border p-6 relative">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={fetchReadingProgress}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button
            variant="destructive"
            onClick={handleResetAllProgress}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            Reset All
          </Button>
        </div>
      </div>

      <ReadingStreakCard
        currentStreak={streakData.currentStreak}
        longestStreak={streakData.longestStreak}
      />

      <div className="w-full mb-6 bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <span className="font-medium">
              Reading Activity {new Date().getFullYear()} (
              {Math.round((readingDates.length / 365) * 100) || 0}%)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("month")}
              className="h-8 px-3"
            >
              <Calendar className="h-4 w-4 mr-1" />
              Month
            </Button>
            <Button
              variant={viewMode === "year" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("year")}
              className="h-8 px-3"
            >
              <Calendar className="h-4 w-4 mr-1" />
              Year
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => {
                if (viewMode === "year") {
                  const yearlyChart = document.getElementById(
                    "yearly-chart-container",
                  );
                  if (yearlyChart)
                    yearlyChart.style.display =
                      yearlyChart.style.display === "none" ? "block" : "none";
                } else {
                  const monthlyChart = document.getElementById(
                    "monthly-chart-container",
                  );
                  if (monthlyChart)
                    monthlyChart.style.display =
                      monthlyChart.style.display === "none" ? "block" : "none";
                }
              }}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {viewMode === "year" ? (
          <div
            id="yearly-chart-container"
            className="overflow-x-auto"
            style={{ display: "none" }}
          >
            <div className="min-w-full">
              <div className="flex justify-between mb-2">
                {[
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ].map((month) => (
                  <div key={month} className="text-sm text-gray-500">
                    {month}
                  </div>
                ))}
              </div>
              <div className="bg-gray-100 h-32 rounded-md relative">
                {readingDates.length > 0 && (
                  <div
                    className="absolute top-1/2 left-[20%] transform -translate-y-1/2 w-6 h-6 bg-blue-500 rounded-sm"
                    title={`Read chapters (${readingDates.length} days)`}
                  />
                )}
              </div>
            </div>
          </div>
        ) : (
          <div
            id="monthly-chart-container"
            className="overflow-x-auto"
            style={{ display: "none" }}
          >
            <div className="grid grid-cols-7 gap-1">
              {/* Day names header */}
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                (name, index) => (
                  <div
                    key={`header-${index}`}
                    className="text-center text-xs text-muted-foreground py-1"
                  >
                    {name}
                  </div>
                ),
              )}

              {/* Calendar cells - simplified version */}
              {Array.from({ length: 31 }, (_, i) => {
                const day = i + 1;
                const date = new Date();
                const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const isCompleted = readingDates.includes(formattedDate);

                return (
                  <div
                    key={`day-${i}`}
                    className={`aspect-square flex items-center justify-center rounded-full text-sm
                    ${day <= new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() ? "cursor-pointer hover:bg-muted/50" : "opacity-0"}
                    ${isCompleted ? "bg-blue-500 text-white" : ""}`}
                  >
                    {day <=
                    new Date(
                      date.getFullYear(),
                      date.getMonth() + 1,
                      0,
                    ).getDate()
                      ? day
                      : ""}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
            <span className="text-sm text-gray-500">
              Read chapters ({readingDates.length} days)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-200 rounded-sm"></div>
            <span className="text-sm text-gray-500">No reading</span>
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="w-full">
          <div className="mb-6">
            <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <TabsList className="w-full sm:w-auto">
                  <TabsTrigger value="all" className="flex-1 sm:flex-initial">
                    All Books
                  </TabsTrigger>
                  <TabsTrigger value="old" className="flex-1 sm:flex-initial">
                    Old Testament
                  </TabsTrigger>
                  <TabsTrigger value="new" className="flex-1 sm:flex-initial">
                    New Testament
                  </TabsTrigger>
                </TabsList>

                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search books..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <TabsContent value="all" className="mt-0">
                <div className="space-y-4" data-testid="bible-books-list">
                  {filteredBooks.map((book) => (
                    <BibleBookSection
                      key={book.name}
                      bookName={book.name}
                      chapters={
                        readingData[book.name] ||
                        Array.from({ length: book.chapters }, (_, i) => ({
                          number: i + 1,
                          isRead: false,
                        }))
                      }
                      onMarkRead={(chapterNumber) =>
                        handleMarkRead(book.name, chapterNumber)
                      }
                      onMarkAllRead={() => handleMarkAllRead(book.name)}
                      onResetProgress={() => handleResetProgress(book.name)}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="old" className="mt-0">
                <div className="space-y-4" data-testid="bible-books-list">
                  {filteredBooks.map((book) => (
                    <BibleBookSection
                      key={book.name}
                      bookName={book.name}
                      chapters={
                        readingData[book.name] ||
                        Array.from({ length: book.chapters }, (_, i) => ({
                          number: i + 1,
                          isRead: false,
                        }))
                      }
                      onMarkRead={(chapterNumber) =>
                        handleMarkRead(book.name, chapterNumber)
                      }
                      onMarkAllRead={() => handleMarkAllRead(book.name)}
                      onResetProgress={() => handleResetProgress(book.name)}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="new" className="mt-0">
                <div className="space-y-4" data-testid="bible-books-list">
                  {filteredBooks.map((book) => (
                    <BibleBookSection
                      key={book.name}
                      bookName={book.name}
                      chapters={
                        readingData[book.name] ||
                        Array.from({ length: book.chapters }, (_, i) => ({
                          number: i + 1,
                          isRead: false,
                        }))
                      }
                      onMarkRead={(chapterNumber) =>
                        handleMarkRead(book.name, chapterNumber)
                      }
                      onMarkAllRead={() => handleMarkAllRead(book.name)}
                      onResetProgress={() => handleResetProgress(book.name)}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BibleReadingSchedule;
