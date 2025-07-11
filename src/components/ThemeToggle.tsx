import { Sun, Moon } from "lucide-react";
import { useAtom } from "jotai";
import { toggleThemeAtom } from "@/store/theme";
import { Button } from "./ui/button";

export const ThemeToggle = () => {
  const [, toggleTheme] = useAtom(toggleThemeAtom);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="relative border-border/30 bg-background/50 hover:bg-primary/10 hover:border-primary/50"
    >
      <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};