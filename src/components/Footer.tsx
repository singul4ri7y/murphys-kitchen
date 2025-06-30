import { Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="flex w-full items-center justify-center p-3 sm:p-4">
      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
        <span>Made with</span>
        <Heart className="size-3 sm:size-4 text-primary fill-primary" />
        <span>by Murphy's Kitchen</span>
      </div>
    </footer>
  );
};