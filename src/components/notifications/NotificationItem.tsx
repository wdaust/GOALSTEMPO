import React from "react";
import { Button } from "@/components/ui/button";
import { Check, BookOpen, Target, Calendar, Bell } from "lucide-react";
import { Notification } from "./NotificationCenter";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

const NotificationItem = ({
  notification,
  onMarkAsRead,
}: NotificationItemProps) => {
  const getIcon = () => {
    switch (notification.type) {
      case "habit":
        return <BookOpen className="h-4 w-4 text-blue-500" />;
      case "goal":
        return <Target className="h-4 w-4 text-green-500" />;
      case "meeting":
        return <Calendar className="h-4 w-4 text-purple-500" />;
      case "system":
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div
      className={`p-3 rounded-lg border ${notification.read ? "bg-white" : "bg-blue-50"}`}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-full bg-white border">{getIcon()}</div>
        <div className="flex-1">
          <h4 className="text-sm font-medium">{notification.title}</h4>
          <p className="text-sm text-muted-foreground mt-1">
            {notification.message}
          </p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-muted-foreground">
              {notification.time}
            </span>
            {!notification.read && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => onMarkAsRead(notification.id)}
              >
                <Check className="h-3 w-3 mr-1" /> Mark as read
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
