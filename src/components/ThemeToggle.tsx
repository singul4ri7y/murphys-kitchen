import { Sun, Moon } from "lucide-react";
import { useAtom } from "jotai";
import { themeAtom, toggleThemeAtom } from "@/store/theme";
import { Button } from "./ui/button";

export const ThemeToggle = () => {
  const [theme] = useAtom(themeAtom);
  const [, toggleTheme] = useAtom(toggleThemeAtom);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="relative size-10 border-border/50 bg-card hover:bg-muted"
    >
      <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};