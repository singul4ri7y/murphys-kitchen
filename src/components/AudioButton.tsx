import React from "react";
import { Button } from "@/components/ui/button";
import { ButtonProps } from "@/components/ui/button";

// Simplified button component without audio
const AudioButton: React.FC<ButtonProps> = ({ children, ...props }) => {
  return <Button {...props}>{children}</Button>;
};

export default AudioButton;