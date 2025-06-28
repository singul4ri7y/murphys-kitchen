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
} from "lucide-react";
import { niceScoreAtom } from "@/store/game";
import { naughtyScoreAtom } from "@/store/game";
import { apiTokenAtom } from "@/store/tokens";
import { quantum } from 'ldrs';
import { cn } from "@/lib/utils";

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

  return (
    <DialogWrapper>
      <div className="absolute inset-0 size-full">
        {remoteParticipantIds?.length > 0 ? (
          <>
            <Video
              id={remoteParticipantIds[0]}
              className="size-full"
              tileClassName="!object-cover"
            />
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
              "absolute bottom-20 right-4 aspect-video h-40 w-24 overflow-hidden rounded-lg border-2 border-primary sm:bottom-12 lg:h-auto lg:w-52"
            )}
          />
        )}
        <div className="absolute bottom-8 right-1/2 z-10 flex translate-x-1/2 justify-center gap-4">
          <Button
            size="icon"
            variant="secondary"
            onClick={toggleAudio}
            className="bg-card/80 border border-border hover:bg-card"
          >
            {!isMicEnabled ? (
              <MicOffIcon className="size-5" />
            ) : (
              <MicIcon className="size-5" />
            )}
          </Button>
          <Button
            size="icon"
            variant="secondary"
            onClick={toggleVideo}
            className="bg-card/80 border border-border hover:bg-card"
          >
            {!isCameraEnabled ? (
              <VideoOffIcon className="size-5" />
            ) : (
              <VideoIcon className="size-5" />
            )}
          </Button>
          <Button
            size="icon"
            variant="destructive"
            onClick={leaveConversation}
            className="bg-destructive/80 hover:bg-destructive"
          >
            <PhoneIcon className="size-5 rotate-[135deg]" />
          </Button>
        </div>
        <DailyAudio />
      </div>
    </DialogWrapper>
  );
};