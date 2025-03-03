import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Settings, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCurrentUser, signOut } from "@/lib/auth";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  clearAllNotifications,
} from "@/lib/notifications";

const Header = () => {
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(
    null,
  );
  const [notifications, setNotifications] = useState(getNotifications());

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = "/auth";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleMarkAsRead = (id: string) => {
    const updatedNotifications = markAsRead(id);
    setNotifications(updatedNotifications);
  };

  const handleMarkAllAsRead = () => {
    const updatedNotifications = markAllAsRead();
    setNotifications(updatedNotifications);
  };

  const handleClearAll = () => {
    const updatedNotifications = clearAllNotifications();
    setNotifications(updatedNotifications);
  };

  return (
    <header className="w-full h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center">
        <div className="flex items-center md:hidden">
          <img
            src="https://www.dropbox.com/scl/fi/f0zm1lf8nj2oyu4d18uck/truthgoals-logo-light2-2x.png?rlkey=1674dqzppcx47327lip5kcoe4&dl=1"
            alt="Truthgoals"
            className="h-8 w-auto"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <NotificationCenter
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          onClearAll={handleClearAll}
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user?.name || "My Account"}</DropdownMenuLabel>
            {user?.email && (
              <div className="px-2 py-1 text-xs text-muted-foreground">
                {user.email}
              </div>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile" className="flex items-center cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings" className="flex items-center cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
