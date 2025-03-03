import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Award, Eye, EyeOff } from "lucide-react";

interface PartnerCardProps {
  name?: string;
  avatar?: string;
  progress?: number;
  achievements?: string[];
  lastActive?: string;
  isSharing?: boolean;
  onSendEncouragement?: () => void;
  onToggleSharing?: () => void;
  onViewDetails?: () => void;
}

const PartnerCard = ({
  name = "Sarah Johnson",
  avatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
  progress = 68,
  achievements = ["Bible Reading", "Meeting Attendance"],
  lastActive = "2 days ago",
  isSharing = true,
  onSendEncouragement = () => {},
  onToggleSharing = () => {},
  onViewDetails = () => {},
}: PartnerCardProps) => {
  return (
    <div className="w-full rounded-lg bg-gray-100 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>{name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-base font-medium">{name}</h3>
            <p className="text-sm text-muted-foreground">Active {lastActive}</p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onToggleSharing}
          title={
            isSharing
              ? "Stop sharing with partner"
              : "Start sharing with partner"
          }
        >
          {isSharing ? (
            <Eye className="h-4 w-4" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />

        <div className="flex flex-wrap gap-1 mt-2">
          {achievements.map((achievement, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="text-xs px-2 py-1"
            >
              {achievement}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={onSendEncouragement}
          title="Send encouragement"
        >
          <MessageSquare className="h-4 w-4 mr-1" />
          Encourage
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={onViewDetails}
          title="View achievements"
        >
          <Award className="h-4 w-4 mr-1" />
          Details
        </Button>
      </div>
    </div>
  );
};

export default PartnerCard;
