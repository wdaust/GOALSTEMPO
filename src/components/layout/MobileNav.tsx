import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  CheckCircle,
  Target,
  Users,
  BookOpen,
  Calendar,
  BarChart3,
  Book,
} from "lucide-react";

const MobileNav = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const navItems = [
    { icon: <Home className="h-5 w-5" />, label: "Home", href: "/" },
    {
      icon: <CheckCircle className="h-5 w-5" />,
      label: "Habits",
      href: "/habits",
    },
    { icon: <Target className="h-5 w-5" />, label: "Goals", href: "/goals" },
    {
      icon: <Users className="h-5 w-5" />,
      label: "Partners",
      href: "/accountability",
    },
    {
      icon: <BookOpen className="h-5 w-5" />,
      label: "Journal",
      href: "/journal",
    },
    {
      icon: <Book className="h-5 w-5" />,
      label: "Bible",
      href: "/bible-reading",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full px-2",
              pathname === item.href ? "text-primary" : "text-muted-foreground",
            )}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileNav;
