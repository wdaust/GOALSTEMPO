import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { BookOpen, Check, RefreshCw } from "lucide-react";

interface Chapter {
  number: number;
  isRead: boolean;
  dateRead?: string;
}

interface BibleBookSectionProps {
  bookName?: string;
  chapters?: Chapter[];
  onMarkRead?: (chapterNumber: number) => void;
  onMarkAllRead?: () => void;
  onResetProgress?: () => void;
}

const BibleBookSection = ({
  bookName = "Genesis",
  chapters = Array.from({ length: 50 }, (_, i) => ({
    number: i + 1,
    isRead: false,
  })),
  onMarkRead = () => {},
  onMarkAllRead = () => {},
  onResetProgress = () => {},
}) => {
  // No need for local state as it's controlled by parent

  const completedChapters = chapters.filter((chapter) => chapter.isRead).length;
  const totalChapters = chapters.length;
  const progressPercentage =
    totalChapters > 0
      ? Math.round((completedChapters / totalChapters) * 100)
      : 0;

  return (
    <div className="w-full bg-card rounded-lg shadow-sm border border-border mb-4 hover:border-primary/50 transition-colors duration-200">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value={bookName} className="border-none">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-accent/50 rounded-t-lg transition-colors duration-200">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <span className="font-medium text-lg">{bookName}</span>
              </div>
              <div className="flex items-center gap-4 mr-4">
                <div className="text-sm font-medium">
                  {completedChapters}/{totalChapters} chapters read
                  <span className="ml-1 font-bold text-primary">
                    ({progressPercentage}%)
                  </span>
                </div>
                <div className="w-24 h-3 bg-muted rounded-full overflow-hidden shadow-inner">
                  <div
                    className={`h-full ${progressPercentage === 100 ? "bg-green-500" : "bg-primary"} transition-all duration-500 ease-in-out`}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 bg-white pt-4">
            <div className="flex flex-col sm:flex-row justify-between gap-2 mb-4">
              <Button
                variant="default"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAllRead();
                }}
                className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
              >
                <Check className="h-4 w-4" />
                Mark All Read
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onResetProgress();
                }}
                className="flex items-center gap-1"
              >
                <RefreshCw className="h-4 w-4" />
                Reset Progress
              </Button>
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-15 gap-2 mt-4">
              {chapters.map((chapter) => (
                <div
                  key={chapter.number}
                  className={`flex flex-col items-center justify-center p-2 border rounded-md cursor-pointer transition-all duration-200 ${chapter.isRead ? "bg-green-50 border-green-300" : "hover:bg-accent hover:border-primary"} relative group`}
                  onClick={() => onMarkRead(chapter.number)}
                  aria-label={`Mark chapter ${chapter.number} as ${chapter.isRead ? "unread" : "read"}`}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-medium group-hover:text-primary transition-colors">
                      {chapter.number}
                    </span>
                    {chapter.isRead && chapter.dateRead && (
                      <span className="text-xs text-green-600 mt-0.5">
                        {new Date(chapter.dateRead).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" },
                        )}
                      </span>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 rounded-md transition-opacity duration-200"></div>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${chapter.isRead ? "bg-green-500 text-white" : "border border-gray-300 hover:border-primary"}`}
                  >
                    {chapter.isRead ? <Check className="h-4 w-4" /> : null}
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default BibleBookSection;
