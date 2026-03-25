import { Moon, SunMedium } from "lucide-react";
import { Button } from "../ui/button";
import { useUIStore } from "../../store/ui-store";

export function ThemeToggle() {
  const { theme, toggleTheme } = useUIStore();

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === "dark" ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}