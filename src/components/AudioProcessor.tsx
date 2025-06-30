import { useEffect, useRef } from 'react';
import { useAudioTrack, useParticipantIds } from '@daily-co/daily-react';

interface AudioProcessorProps {
  onAudioData?: (audioData: Float32Array) => void;
  onVolumeChange?: (volume: number) => void;
}

export const AudioProcessor: React.FC<AudioProcessorProps> = ({
  onAudioData,
  onVolumeChange,
}) => {
  const remoteParticipantIds = useParticipantIds({ filter: "remote" });
  const remoteAudioTrack = useAudioTrack(remoteParticipantIds[0]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    if (!remoteAudioTrack.persistentTrack) return;

    // Create audio context and analyser for volume detection
    audioContextRef.current = new AudioContext();
    analyserRef.current = audioContextRef.current.createAnalyser();
    
    // Create media stream source
    const audioStream = new MediaStream([remoteAudioTrack.persistentTrack]);
    const source = audioContextRef.current.createMediaStreamSource(audioStream);
    
    source.connect(analyserRef.current);
    analyserRef.current.fftSize = 256;
    
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const floatArray = new Float32Array(bufferLength);

    const processAudio = () => {
      if (!analyserRef.current) return;
      
      // Get frequency data
      analyserRef.current.getByteFrequencyData(dataArray);
      analyserRef.current.getFloatFrequencyData(floatArray);
      
      // Calculate volume (RMS)
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i] * dataArray[i];
      }
      const volume = Math.sqrt(sum / dataArray.length) / 255;
      
      // Call callbacks
      onAudioData?.(floatArray);
      onVolumeChange?.(volume);
      
      requestAnimationFrame(processAudio);
    };

    processAudio();

    return () => {
      audioContextRef.current?.close();
    };
  }, [remoteAudioTrack.persistentTrack, onAudioData, onVolumeChange]);

  return null; // This component doesn't render anything
};