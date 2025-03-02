import React from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CalendarClock, ChevronRight, Edit, Target } from "lucide-react";

interface SubGoal {
  id: string;
  title: string;
  completed: boolean;
}

interface GoalCardProps {
  id?: string;
  title?: string;
  progress?: number;
  dueDate?: string;
  subgoals?: SubGoal[];
  onClick?: () => void;
  onEdit?: () => void;
}

const GoalCard = ({
  id = "goal-1",
  title = "Scripture Memorization",
  progress = 65,
  dueDate = "2023-12-31",
  subgoals = [
    { id: "sg-1", title: "Memorize Matthew 5:3-12", completed: true },
    { id: "sg-2", title: "Memorize Psalm 23", completed: true },
    { id: "sg-3", title: "Memorize Romans 12:1-2", completed: false },
  ],
  onClick = () => {},
  onEdit = () => {},
}: GoalCardProps) => {
  // Calculate completed subgoals
  const completedSubgoals = subgoals.filter((sg) => sg.completed).length;
  const totalSubgoals = subgoals.length;

  // Format the due date
  const formattedDate = new Date(dueDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className="w-full rounded-lg bg-white p-4 shadow-sm cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-base font-medium">{title}</h3>
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <CalendarClock className="h-4 w-4 mr-1" />
            <span>{formattedDate}</span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{progress}% Complete</span>
          <span className="text-sm text-muted-foreground">
            {completedSubgoals}/{totalSubgoals} steps
          </span>
        </div>

        <Progress value={progress} className="h-2" />

        {subgoals.length > 0 && (
          <div className="mt-2">
            <div className="text-sm flex items-center">
              <Target className="h-4 w-4 mr-1 text-blue-500" />
              <span className="truncate">{subgoals[0].title}</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-end">
        <Button variant="ghost" size="sm" className="text-sm text-primary">
          View Details
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default GoalCard;
