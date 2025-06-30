import React, { useState, useCallback } from 'react';
import { useAtom } from 'jotai';
import { AudioProcessor } from './AudioProcessor';
import { addChatMessageAtom } from '@/store/chat';

export const VoiceVisualizer: React.FC = () => {
  const [volume, setVolume] = useState(0);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [, addMessage] = useAtom(addChatMessageAtom);

  const handleVolumeChange = useCallback((vol: number) => {
    setVolume(vol);
    setIsAISpeaking(vol > 0.01); // Threshold for detecting speech
  }, []);

  const handleAudioData = useCallback((audioData: Float32Array) => {
    // You can use this for more complex audio analysis
    // e.g., speech recognition, sentiment analysis, etc.
  }, []);

  const handleTranscription = useCallback((text: string) => {
    // Add AI's spoken words to chat
    addMessage({
      role: 'assistant',
      content: text,
    });
  }, [addMessage]);

  return (
    <>
      <AudioProcessor 
        onVolumeChange={handleVolumeChange}
        onAudioData={handleAudioData}
        onTranscription={handleTranscription}
      />
      
      {/* Visual indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`w-1 bg-primary transition-all duration-150 ${
                volume * 5 > i ? 'h-6' : 'h-2'
              }`}
            />
          ))}
        </div>
        {isAISpeaking && (
          <div className="text-xs bg-primary/20 px-2 py-1 rounded">
            AI Speaking
          </div>
        )}
      </div>
    </>
  );
};