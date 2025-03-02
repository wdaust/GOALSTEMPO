import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import NotificationItem from "./NotificationItem";

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "habit" | "goal" | "meeting" | "system";
}

interface NotificationCenterProps {
  notifications?: Notification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onClearAll?: () => void;
}

const NotificationCenter = ({
  notifications = [],
  onMarkAsRead = () => {},
  onMarkAllAsRead = () => {},
  onClearAll = () => {},
}: NotificationCenterProps) => {
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>
            Stay updated on your spiritual journey
          </SheetDescription>
        </SheetHeader>

        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-muted-foreground">
            {unreadCount} unread notifications
          </span>
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={onMarkAllAsRead}>
              Mark all as read
            </Button>
            <Button variant="outline" size="sm" onClick={onClearAll}>
              Clear all
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={onMarkAsRead}
              />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No notifications yet</p>
              <p className="text-sm mt-1">
                We'll notify you about important updates and reminders
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationCenter;
