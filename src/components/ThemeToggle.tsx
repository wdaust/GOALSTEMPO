import { Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex space-x-2 w-full">
      <Button
        variant={theme === "light" ? "default" : "outline"}
        className="flex-1 justify-start"
        onClick={() => setTheme("light")}
      >
        <Sun className="h-4 w-4 mr-2" />
        Light
      </Button>
      <Button
        variant={theme === "dark" ? "default" : "outline"}
        className="flex-1 justify-start"
        onClick={() => setTheme("dark")}
      >
        <Moon className="h-4 w-4 mr-2" />
        Dark
      </Button>
      <Button
        variant={theme === "system" ? "default" : "outline"}
        className="flex-1 justify-start"
        onClick={() => setTheme("system")}
      >
        <Laptop className="h-4 w-4 mr-2" />
        System
      </Button>
    </div>
  );
}
