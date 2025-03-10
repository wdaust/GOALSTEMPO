import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Calendar,
  CheckCircle,
  Target,
  Users,
  BookOpen,
  Home,
  User,
  Settings,
  Book,
} from "lucide-react";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

const SidebarItem = ({ icon, label, href, active }: SidebarItemProps) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
        active ? "bg-accent text-accent-foreground" : "text-muted-foreground",
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div
      className={cn(
        "h-full w-[250px] border-r bg-white p-4 flex flex-col",
        className,
      )}
    >
      <div className="space-y-4 flex-1">
        <div className="py-2">
          <div className="flex items-center mb-4 px-4">
            <img
              src="https://www.dropbox.com/scl/fi/f0zm1lf8nj2oyu4d18uck/truthgoals-logo-light2-2x.png?rlkey=1674dqzppcx47327lip5kcoe4&dl=1"
              alt="Truthgoals"
              className="h-8 w-auto"
            />
          </div>
          <div className="space-y-1">
            <SidebarItem
              icon={<Home className="h-4 w-4" />}
              label="Dashboard"
              href="/"
              active={pathname === "/"}
            />
            <SidebarItem
              icon={<CheckCircle className="h-4 w-4" />}
              label="Habits"
              href="/habits"
              active={pathname === "/habits"}
            />
            <SidebarItem
              icon={<Target className="h-4 w-4" />}
              label="Goals"
              href="/goals"
              active={pathname === "/goals"}
            />
            <SidebarItem
              icon={<Users className="h-4 w-4" />}
              label="Accountability"
              href="/accountability"
              active={pathname === "/accountability"}
            />
            <SidebarItem
              icon={<BookOpen className="h-4 w-4" />}
              label="Journal"
              href="/journal"
              active={pathname === "/journal"}
            />
            <SidebarItem
              icon={<Book className="h-4 w-4" />}
              label="Bible Reading"
              href="/bible-reading"
              active={pathname === "/bible-reading"}
            />
          </div>
        </div>

        <div className="py-2">
          <p className="px-4 text-xs uppercase text-muted-foreground font-medium mb-2">
            Account
          </p>
          <div className="space-y-1">
            <SidebarItem
              icon={<User className="h-4 w-4" />}
              label="Profile"
              href="/profile"
              active={pathname === "/profile"}
            />
            <SidebarItem
              icon={<Settings className="h-4 w-4" />}
              label="Settings"
              href="/settings"
              active={pathname === "/settings"}
            />
          </div>
        </div>
      </div>
      <div className="mt-auto">
        <div className="rounded-lg bg-[#5BC194]/10 p-3">
          <h3 className="text-sm font-medium">Daily Scripture</h3>
          <p className="text-xs mt-1 text-muted-foreground">
            "For God is not unrighteous so as to forget your work and the love
            you showed for his name." — Hebrews 6:10
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
