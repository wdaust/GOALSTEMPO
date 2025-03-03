import React from "react";
import { format } from "date-fns";
import { Calendar, BookOpen, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JournalEntryCardProps {
  id?: string;
  title?: string;
  date?: Date;
  content?: string;
  onClick?: () => void;
}

const JournalEntryCard = ({
  id = "1",
  title = "Weekly Reflection",
  date = new Date(),
  content = "I was encouraged by the talk on Sunday about maintaining spiritual focus despite worldly distractions. It reminded me to prioritize my Bible reading...",
  onClick = () => {},
}: JournalEntryCardProps) => {
  // Truncate content for preview
  const truncatedContent =
    content.length > 120 ? `${content.substring(0, 120)}...` : content;
  const formattedDate = format(date, "MMM d, yyyy");

  return (
    <div
      className="w-full bg-gray-100 rounded-lg p-4 shadow-sm cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-base font-medium">{title}</h3>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{formattedDate}</span>
        </div>
      </div>

      <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
        {truncatedContent}
      </p>

      <div className="flex justify-between items-center">
        <div className="flex items-center text-sm text-muted-foreground">
          <BookOpen className="h-4 w-4 mr-1" />
          <span>Journal Entry</span>
        </div>
        <Button variant="ghost" size="sm" className="text-sm text-primary">
          View <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default JournalEntryCard;
