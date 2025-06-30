import { memo } from "react";
import { Button } from "./ui/button";
import { LogOut, User } from "lucide-react";
import { useAtom } from "jotai";
import { authAtom, logoutAtom } from "@/store/auth";
import { ThemeToggle } from "./ThemeToggle";

export const Header = memo(() => {
  const [auth] = useAtom(authAtom);
  const [, logout] = useAtom(logoutAtom);

  return (
    <header className="flex w-full items-center justify-between p-4 bg-card/50 backdrop-blur-sm border-b border-border/50">
      <div className="flex items-center gap-3">
        <img 
          src="/images/7.png" 
          alt="Murphy's Kitchen Logo" 
          className="size-8 object-contain"
        />
        <div className="flex flex-col">
          <p className="text-xs text-muted-foreground italic">
            Anything can be cooked will be cooked
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <ThemeToggle />
        
        {auth.user && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
              <User className="size-4" />
              <span className="text-sm font-medium">{auth.user.name}</span>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={logout}
              className="size-10 border-border/50 bg-card hover:bg-destructive hover:text-destructive-foreground"
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
});