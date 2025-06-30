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
    <header className="glass-effect border-b border-border/30 p-4">
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-xl">
            <img 
              src="/images/7.png" 
              alt="Murphy's Kitchen Logo" 
              className="size-8 object-contain"
            />
          </div>
          <p className="text-xs text-muted-foreground italic font-medium">
            Anything can be cooked will be cooked
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          {auth.user && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/50 border border-border/30">
                <User className="size-4 text-primary" />
                <span className="text-sm font-medium">{auth.user.name}</span>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={logout}
                className="border-border/30 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
              >
                <LogOut className="size-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
});