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
        <div className="flex items-center gap-4">
          <img 
            src="/images/7.png" 
            alt="Murphy's Kitchen Logo" 
            className="header-logo-large"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">Murphy's Kitchen</h1>
              <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                <svg width="20" height="20" viewBox="0 0 24 24" className="text-primary">
                  <path fill="currentColor" d="M13.5 2c-5.629 0-10.212 4.436-10.475 10h-1.025l1.636 2.636L5.281 17H8.5c0 1.657 1.343 3 3 3s3-1.343 3-3V9.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5c0 .829-.672 1.5-1.5 1.5-.271 0-.525-.07-.747-.193L14.5 11.5c0 2.485-2.015 4.5-4.5 4.5s-4.5-2.015-4.5-4.5c0-2.485 2.015-4.5 4.5-4.5 1.302 0 2.474.56 3.296 1.453C14.244 7.474 15.08 7 16 7c1.657 0 3 1.343 3 3 0 1.657-1.343 3-3 3-1.105 0-2.073-.596-2.596-1.487L12.5 13c0 1.381-1.119 2.5-2.5 2.5s-2.5-1.119-2.5-2.5 1.119-2.5 2.5-2.5c.448 0 .869.119 1.234.327L12.5 9.5c0-2.485 2.015-4.5 4.5-4.5s4.5 2.015 4.5 4.5c0 .695-.158 1.353-.439 1.941.277.534.439 1.141.439 1.785 0 2.071-1.567 3.765-3.576 3.959C17.83 17.47 18 18.204 18 19c0 1.657-1.343 3-3 3s-3-1.343-3-3c0-.796.313-1.559.879-2.121C11.343 16.441 10 14.85 10 13c0-2.761 2.239-5 5-5 .695 0 1.353.143 1.95.402C17.562 6.016 19.072 4 21 4v1c-1.104 0-2 .896-2 2s.896 2 2 2v1c-2.761 0-5-2.239-5-5 0-.695.143-1.353.402-1.95C14.984 2.438 13 2 13.5 2z"/>
                </svg>
                <span className="text-xs font-semibold text-primary">Built with Bolt</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground italic">
              Anything can be cooked will be cooked
            </p>
          </div>
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