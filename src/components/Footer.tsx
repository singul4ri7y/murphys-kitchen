import { Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="flex w-full items-center justify-center p-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Made with</span>
        <Heart className="size-4 text-primary fill-primary" />
        <span>for culinary innovation</span>
      </div>
    </footer>
  );
};