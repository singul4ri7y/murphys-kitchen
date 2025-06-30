import { DialogWrapper } from "@/components/DialogWrapper";
import {
  DailyAudio,
  useDaily,
  useLocalSessionId,
  useParticipantIds,
  useVideoTrack,
  useAudioTrack,
} from "@daily-co/daily-react";
import React, { useCallback, useEffect, useState } from "react";
import Video from "@/components/Video";
import { conversationAtom } from "@/store/conversation";
import { useAtom, useAtomValue } from "jotai";
import { screenAtom } from "@/store/screens";
import { Button } from "@/components/ui/button";
import { endConversation } from "@/api/endConversation";
import {
  MicIcon,
  MicOffIcon,
  VideoIcon,
  VideoOffIcon,
  PhoneIcon,
  MessageSquare,
  X,
} from "lucide-react";
import { niceScoreAtom } from "@/store/game";
import { naughtyScoreAtom } from "@/store/game";
import { apiTokenAtom } from "@/store/tokens";
import { quantum } from 'ldrs';
import { cn } from "@/lib/utils";
import { ChatInterface } from "@/components/ChatInterface";
import { VoiceVisualizer } from "@/components/VoiceVisualizer";

quantum.register();

export const Conversation: React.FC = () => {
  const [conversation, setConversation] = useAtom(conversationAtom);
  const [, setScreenState] = useAtom(screenAtom);
  const [naughtyScore] = useAtom(naughtyScoreAtom);
  const [niceScore] = useAtom(niceScoreAtom);
  const token = useAtomValue(apiTokenAtom);

  const daily = useDaily();
  const localSessionId = useLocalSessionId();
  const localVideo = useVideoTrack(localSessionId);
  const localAudio = useAudioTrack(localSessionId);
  const isCameraEnabled = !localVideo.isOff;
  const isMicEnabled = !localAudio.isOff;
  const remoteParticipantIds = useParticipantIds({ filter: "remote" });
  const [start, setStart] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);

  useEffect(() => {
    if (remoteParticipantIds.length && !start) {
      setStart(true);
      setTimeout(() => daily?.setLocalAudio(true), 4000);
    }
  }, [remoteParticipantIds, start]);

  useEffect(() => {
    if (conversation?.conversation_url) {
      daily
        ?.join({
          url: conversation.conversation_url,
          startVideoOff: false,
          startAudioOff: true,
        })
        .then(() => {
          daily?.setLocalVideo(true);
          daily?.setLocalAudio(false);
        });
    }
  }, [conversation?.conversation_url]);

  const toggleVideo = useCallback(() => {
    daily?.setLocalVideo(!isCameraEnabled);
  }, [daily, isCameraEnabled]);

  const toggleAudio = useCallback(() => {
    daily?.setLocalAudio(!isMicEnabled);
  }, [daily, isMicEnabled]);

  const toggleChat = useCallback(() => {
    setIsChatVisible(!isChatVisible);
  }, [isChatVisible]);

  const leaveConversation = useCallback(() => {
    daily?.leave();
    daily?.destroy();
    if (conversation?.conversation_id && token) {
      endConversation(token, conversation.conversation_id);
    }
    setConversation(null);

    const naughtyScorePositive = Math.abs(naughtyScore);
    if (naughtyScorePositive > niceScore) {
      setScreenState({ currentScreen: "finalScreen" });
    } else {
      setScreenState({ currentScreen: "finalScreen" });
    }
  }, [daily, token]);

  const handleToggleChatMinimize = () => {
    setIsChatMinimized(!isChatMinimized);
  };

  return (
    <div className="flex flex-col lg:flex-row w-full h-full items-center justify-center gap-4 lg:gap-6 p-4">
      {/* Video Container */}
      <div className="w-full lg:flex-1 h-[50vh] sm:h-[60vh] lg:h-[600px]">
        <DialogWrapper>
          <div className="absolute inset-0 size-full">
            {remoteParticipantIds?.length > 0 ? (
              <>
                <Video
                  id={remoteParticipantIds[0]}
                  className="size-full"
                  tileClassName="!object-cover"
                />
                {/* Voice Visualizer */}
                <VoiceVisualizer />
              </>
            ) : (
              <div className="flex h-full items-center justify-center">
                <l-quantum
                  size="45"
                  speed="1.75"
                  color="white"
                ></l-quantum>
              </div>
            )}
            {localSessionId && (
              <Video
                id={localSessionId}
                tileClassName="!object-cover"
                className={cn(
                  "absolute bottom-16 sm:bottom-20 lg:bottom-20 left-2 sm:left-4 aspect-video h-20 w-16 sm:h-32 sm:w-20 lg:h-40 lg:w-24 overflow-hidden rounded-lg border-2 border-primary"
                )}
              />
            )}
            
            {/* Mobile Chat Toggle Button */}
            <div className="absolute top-4 right-4 lg:hidden">
              <Button
                onClick={toggleChat}
                size="icon"
                variant="secondary"
                className="bg-card/80 border border-border hover:bg-card"
              >
                {isChatVisible ? <X className="size-5" /> : <MessageSquare className="size-5" />}
              </Button>
            </div>

            {/* Control Buttons */}
            <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 z-10 flex -translate-x-1/2 justify-center gap-2 sm:gap-4">
              <Button
                size="icon"
                variant="secondary"
                onClick={toggleAudio}
                className="bg-card/80 border border-border hover:bg-card w-10 h-10 sm:w-12 sm:h-12"
              >
                {!isMicEnabled ? (
                  <MicOffIcon className="size-4 sm:size-5" />
                ) : (
                  <MicIcon className="size-4 sm:size-5" />
                )}
              </Button>
              <Button
                size="icon"
                variant="secondary"
                onClick={toggleVideo}
                className="bg-card/80 border border-border hover:bg-card w-10 h-10 sm:w-12 sm:h-12"
              >
                {!isCameraEnabled ? (
                  <VideoOffIcon className="size-4 sm:size-5" />
                ) : (
                  <VideoIcon className="size-4 sm:size-5" />
                )}
              </Button>
              <Button
                size="icon"
                variant="destructive"
                onClick={leaveConversation}
                className="bg-destructive/80 hover:bg-destructive w-10 h-10 sm:w-12 sm:h-12"
              >
                <PhoneIcon className="size-4 sm:size-5 rotate-[135deg]" />
              </Button>
            </div>
            <DailyAudio />
          </div>
        </DialogWrapper>
      </div>

      {/* Chat Interface - Desktop */}
      <div className="hidden lg:block w-96 h-[600px]">
        <ChatInterface
          isMinimized={isChatMinimized}
          onToggleMinimize={handleToggleChatMinimize}
        />
      </div>

      {/* Chat Interface - Mobile Overlay */}
      {isChatVisible && (
        <div className="lg:hidden fixed inset-4 top-20 z-50 bg-background/95 backdrop-blur-sm rounded-2xl border border-border/50 shadow-2xl">
          <ChatInterface
            isMinimized={false}
            onToggleMinimize={toggleChat}
          />
        </div>
      )}
    </div>
  );
};