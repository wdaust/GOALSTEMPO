import React, { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Flame,
  Calendar,
  Circle,
  AlertCircle,
} from "lucide-react";

interface HabitCardProps {
  name?: string;
  description?: string;
  progress?: number;
  streak?: number;
  lastCompleted?: string;
  type?:
    | "bible-reading"
    | "meeting-attendance"
    | "field-service"
    | "custom"
    | "break-habit";
  onComplete?: () => void;
  onViewDetails?: () => void;
}

// Success animation component
const SuccessAnimation = ({ active }: { active: boolean }) => {
  if (!active) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 bg-green-100 rounded-full opacity-0 scale-0 animate-success-pulse"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-success-scale">
            <svg
              className="w-5 h-5 text-white animate-success-check"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes success-pulse {
          0% {
            transform: scale(0);
            opacity: 0.7;
          }
          70% {
            transform: scale(2);
            opacity: 0;
          }
          100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }
        @keyframes success-scale {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }
        @keyframes success-check {
          0% {
            opacity: 0;
            transform: scale(0);
          }
          70% {
            opacity: 1;
            transform: scale(1.2);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-success-pulse {
          animation: success-pulse 1s ease-out forwards;
        }
        .animate-success-scale {
          animation: success-scale 0.5s ease-out forwards;
        }
        .animate-success-check {
          animation: success-check 0.5s ease-out 0.2s forwards;
        }
      `}</style>
    </div>
  );
};

const HabitCard = ({
  name = "Bible Reading",
  description = "Read 5 chapters per week",
  progress = 65,
  streak = 7,
  lastCompleted = "1 day ago",
  type = "bible-reading",
  onComplete = () => {},
  onViewDetails = () => {},
}: HabitCardProps) => {
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [isCompleted, setIsCompleted] = useState(lastCompleted === "Today");
  const isBreakHabit = type === "break-habit";

  // Use light gray background for all habit types
  const getBgColor = () => {
    return "bg-gray-100";
  };

  const handleComplete = () => {
    // For break habits, we don't mark them as "completed" in the traditional sense
    if (isBreakHabit) {
      onViewDetails(); // Just open the details dialog
      return;
    }

    if (!isCompleted) {
      setShowSuccessAnimation(true);
      setIsCompleted(true);
      onComplete();

      // Hide animation after 1.5 seconds
      setTimeout(() => {
        setShowSuccessAnimation(false);
      }, 1500);
    }
  };

  return (
    <div
      className={`w-full rounded-lg ${getBgColor()} p-4 shadow-sm relative overflow-hidden cursor-pointer`}
      onClick={onViewDetails}
    >
      {/* Success animation */}
      <SuccessAnimation active={showSuccessAnimation} />

      <div className="mb-3">
        <h3 className="text-base font-medium">{name}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />

        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-1" />
          <span>Last completed: {lastCompleted}</span>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center">
          {isBreakHabit ? (
            <>
              <Calendar className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-sm font-medium">{streak} days since</span>
            </>
          ) : (
            <>
              <Flame className="h-4 w-4 text-orange-500 mr-1" />
              <span className="text-sm font-medium">{streak} day streak</span>
            </>
          )}
        </div>

        <Button
          size="sm"
          className={`rounded-full relative ${isCompleted && !isBreakHabit ? "bg-green-500 hover:bg-green-600" : ""} ${isBreakHabit ? "bg-red-500 hover:bg-red-600 text-white" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            handleComplete();
          }}
        >
          {isBreakHabit ? (
            <>
              <AlertCircle className="h-4 w-4 mr-1" />I slipped
            </>
          ) : isCompleted ? (
            <>
              <CheckCircle className="h-4 w-4 mr-1" />
              Completed
            </>
          ) : (
            <>
              <Circle className="h-4 w-4 mr-1" />
              Complete
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default HabitCard;
