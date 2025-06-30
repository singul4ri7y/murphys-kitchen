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
import gloriaVideo from "@/assets/video/gloria.mp4";

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
        <div className="flex size-full flex-col items-center justify-center p-8">
          <div className="text-center space-y-6">
            <div className="flex flex-col items-center gap-4 mb-6">
              <img 
                src="/images/7.png" 
                alt="Murphy's Kitchen Logo" 
                className="size-32 object-contain"
              />
              <p className="text-xs text-muted-foreground italic">
                Anything can be cooked will be cooked
              </p>
            </div>

            <div className="bg-card/50 p-6 rounded-lg border border-border">
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
        <div className="flex size-full flex-col items-center justify-center p-8">
          <div className="text-center space-y-6">
            <div className="flex flex-col items-center gap-4 mb-6">
              <img 
                src="/images/7.png" 
                alt="Murphy's Kitchen Logo" 
                className="size-32 object-contain"
              />
              <p className="text-xs text-muted-foreground italic">
                Anything can be cooked will be cooked
              </p>
            </div>

            <div className="bg-destructive/10 p-6 rounded-lg border border-destructive/20">
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

  // Show loading state - auto-starting conversation
  return (
    <AnimatedWrapper>
      <div className="flex size-full flex-col items-center justify-center p-8">
        <video
          src={gloriaVideo}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover rounded-2.5xl"
        />
        <div className="absolute inset-0 bg-primary-overlay backdrop-blur-sm rounded-2.5xl" />
        
        <div className="relative z-10 text-center space-y-8">
          <div className="flex flex-col items-center gap-4 mb-6">
            <img 
              src="/images/7.png" 
              alt="Murphy's Kitchen Logo" 
              className="size-40 object-contain"
            />
            <p className="text-sm text-primary/80 italic font-medium">
              Anything can be cooked will be cooked
            </p>
          </div>

          <div className="space-y-4">
            <l-quantum
              size="60"
              speed="1.75"
              color="white"
            ></l-quantum>
            <p className="text-lg text-white font-medium">
              Starting your AI cooking session...
            </p>
          </div>
        </div>
      </div>
    </AnimatedWrapper>
  );
};