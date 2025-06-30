import React, { useState } from "react";
import { useAtom } from "jotai";
import { loginAtom } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Login: React.FC = () => {
  const [, login] = useAtom(loginAtom);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await login({ email, password });
    
    if (!result.success) {
      setError(result.error || "Login failed");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-primary/5 rounded-full blur-xl animate-pulse hidden sm:block"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-accent/5 rounded-full blur-xl animate-pulse delay-1000 hidden sm:block"></div>
      <div className="absolute top-1/2 right-10 w-16 h-16 bg-secondary/10 rounded-full blur-lg animate-pulse delay-500 hidden sm:block"></div>
      
      <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-10">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="glass-effect rounded-2xl p-6 sm:p-8 shadow-2xl border border-border/50">
          <div className="space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="flex flex-col items-center gap-4">
                <img 
                  src="/images/7.png" 
                  alt="Murphy's Kitchen Logo" 
                  className="w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 object-contain"
                />
                <p className="text-xs sm:text-sm text-muted-foreground italic font-medium">
                  Anything can be cooked will be cooked
                </p>
              </div>
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">Welcome Back</h2>
                <p className="text-sm sm:text-base text-muted-foreground">Sign in to start cooking with AI</p>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 sm:pl-12 h-11 sm:h-12 bg-background/50 border-border/50 focus:bg-background text-sm sm:text-base"
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 sm:pl-12 h-11 sm:h-12 bg-background/50 border-border/50 focus:bg-background text-sm sm:text-base"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 sm:p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive font-medium">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 sm:h-12 text-sm sm:text-base font-semibold"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-xs sm:text-sm text-muted-foreground">
                Demo credentials: Any email and password
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};