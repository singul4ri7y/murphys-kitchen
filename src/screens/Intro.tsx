import { AnimatedWrapper } from "@/components/DialogWrapper";
import React, { useEffect, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import { screenAtom } from "@/store/screens";
import { conversationAtom } from "@/store/conversation";
import { apiTokenAtom } from "@/store/tokens";
import { createConversation } from "@/api";
import { useDaily, useDevices } from "@daily-co/daily-react";
import { quantum } from 'ldrs';
import { Button } from "@/components/ui/button";

quantum.register();

export const Intro: React.FC = () => {
  const [, setScreenState] = useAtom(screenAtom);
  const [, setConversation] = useAtom(conversationAtom);
  const token = useAtomValue(apiTokenAtom);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [error, setError] = useState(false);
  
  const daily = useDaily();
  const { setMicrophone, setSpeaker } = useDevices();

  const createConversationAndStart = async () => {
    try {
      setIsCreatingConversation(true);
      setError(false);
      
      // Start camera and microphone
      const res = await daily?.startCamera({
        startVideoOff: false,
        startAudioOff: false,
        audioSource: "default",
      });
      
      // Set default devices
      // @ts-expect-error deviceId exists in the MediaDeviceInfo
      const isDefaultMic = res?.mic?.deviceId === "default";
      // @ts-expect-error deviceId exists in the MediaDeviceInfo
      const isDefaultSpeaker = res?.speaker?.deviceId === "default";
      
      if (!isDefaultMic) {
        setMicrophone("default");
      }
      if (!isDefaultSpeaker) {
        setSpeaker("default");
      }
      
      // Create conversation
      if (!token) {
        throw new Error("Token is required");
      }
      
      const conversation = await createConversation(token);
      setConversation(conversation);
      
      // Transition to conversation screen
      setScreenState({ currentScreen: "conversation" });
      
    } catch (error) {
      console.error("Failed to start conversation:", error);
      setError(true);
    } finally {
      setIsCreatingConversation(false);
    }
  };

  // Auto-start conversation when component is ready
  useEffect(() => {
    if (token && !isCreatingConversation && !error) {
      // Add a small delay to ensure smooth transition
      const timer = setTimeout(() => {
        createConversationAndStart();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [token]);

  // If no token is available, show setup message
  if (!token) {
    return (
      <AnimatedWrapper>
        <div className="flex size-full flex-col items-center justify-center p-8 relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-secondary/5 via-transparent to-primary/5"></div>
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-primary/5 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-accent/5 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-10 w-16 h-16 bg-secondary/10 rounded-full blur-lg animate-pulse delay-500"></div>
          
          <div className="relative z-10 text-center space-y-6">
            <div className="flex flex-col items-center gap-4 mb-6">
              <div className="p-6 bg-primary/10 rounded-3xl shadow-lg backdrop-blur-sm border border-primary/20">
                <img 
                  src="/images/7.png" 
                  alt="Murphy's Kitchen Logo" 
                  className="size-32 object-contain"
                />
              </div>
              <p className="text-xs text-muted-foreground italic font-medium">
                Anything can be cooked will be cooked
              </p>
            </div>

            <div className="glass-effect p-6 rounded-2xl border border-border/50 shadow-xl">
              <h2 className="text-xl font-semibold text-foreground mb-3">Setup Required</h2>
              <p className="text-muted-foreground mb-4">
                Please add your Tavus API key to the .env file to get started.
              </p>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>Add <code className="bg-muted px-2 py-1 rounded">VITE_TAVUS_API_KEY=your_key_here</code> to .env</p>
                <a
                  href="https://platform.tavus.io/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Get your API key here →
                </a>
              </div>
            </div>
          </div>
        </div>
      </AnimatedWrapper>
    );
  }

  // Show error state
  if (error) {
    return (
      <AnimatedWrapper>
        <div className="flex size-full flex-col items-center justify-center p-8 relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 via-transparent to-primary/5"></div>
          <div className="absolute top-20 left-20 w-32 h-32 bg-destructive/5 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-primary/5 rounded-full blur-xl animate-pulse delay-1000"></div>
          
          <div className="relative z-10 text-center space-y-6">
            <div className="flex flex-col items-center gap-4 mb-6">
              <div className="p-6 bg-destructive/10 rounded-3xl shadow-lg backdrop-blur-sm border border-destructive/20">
                <img 
                  src="/images/7.png" 
                  alt="Murphy's Kitchen Logo" 
                  className="size-32 object-contain"
                />
              </div>
              <p className="text-xs text-muted-foreground italic font-medium">
                Anything can be cooked will be cooked
              </p>
            </div>

            <div className="glass-effect p-6 rounded-2xl border border-destructive/30 shadow-xl">
              <h2 className="text-xl font-semibold text-destructive mb-3">Connection Error</h2>
              <p className="text-destructive/80 mb-4">
                Failed to start the conversation. Please check your API key and try again.
              </p>
              <Button
                onClick={() => {
                  setError(false);
                  createConversationAndStart();
                }}
                variant="outline"
                className="border-destructive/50 hover:bg-destructive hover:text-destructive-foreground"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </AnimatedWrapper>
    );
  }

  // Show loading state without text - auto-starting conversation
  return (
    <AnimatedWrapper>
      <div className="flex size-full flex-col items-center justify-center p-8 relative overflow-hidden">
        {/* Modern Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-background to-accent/15"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-secondary/10 via-transparent to-primary/10"></div>
        
        {/* Animated Cooking Elements */}
        <div className="absolute top-20 left-20 w-40 h-40 bg-primary/8 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-accent/8 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-10 w-20 h-20 bg-secondary/12 rounded-full blur-xl animate-pulse delay-500"></div>
        <div className="absolute bottom-1/3 left-1/3 w-16 h-16 bg-primary/6 rounded-full blur-lg animate-pulse delay-300"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-accent/6 rounded-full blur-xl animate-pulse delay-700"></div>
        
        <div className="relative z-10 text-center space-y-8">
          <div className="flex flex-col items-center gap-6 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-xl animate-pulse"></div>
              <div className="relative p-8 glass-effect rounded-3xl shadow-2xl border border-primary/30">
                <img 
                  src="/images/7.png" 
                  alt="Murphy's Kitchen Logo" 
                  className="size-40 object-contain"
                />
              </div>
            </div>
            <p className="text-base text-primary/80 italic font-medium">
              Anything can be cooked will be cooked
            </p>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-lg"></div>
              <div className="relative p-4 glass-effect rounded-2xl">
                <l-quantum
                  size="60"
                  speed="1.75"
                  color="hsl(var(--primary))"
                ></l-quantum>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedWrapper>
  );
};