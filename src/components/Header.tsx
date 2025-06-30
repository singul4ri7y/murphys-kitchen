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
    <header className="glass-effect border-b border-border/30 p-3 sm:p-4">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4">
          <img 
            src="/images/7.png" 
            alt="Murphy's Kitchen Logo" 
            className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-contain transition-all duration-300 hover:scale-105 filter drop-shadow-sm"
          />
          <div className="flex flex-col">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">Murphy's Kitchen</h1>
            <p className="text-xs sm:text-sm text-muted-foreground italic">
              Anything can be cooked will be cooked
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Bolt logo moved to the right */}
          <a 
            href="https://bolt.new" 
            target="_blank" 
            rel="noopener noreferrer"
            className="transition-transform hover:scale-105 hidden sm:block"
          >
            <img 
              src="/images/bolt.png" 
              alt="Built with Bolt" 
              className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 object-contain"
            />
          </a>
          
          <ThemeToggle />
          
          {auth.user && (
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/50 border border-border/30">
                <User className="size-3 sm:size-4 text-primary" />
                <span className="text-xs sm:text-sm font-medium truncate max-w-24 sm:max-w-none">{auth.user.name}</span>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={logout}
                className="w-8 h-8 sm:w-10 sm:h-10 border-border/30 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
              >
                <LogOut className="size-3 sm:size-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
});