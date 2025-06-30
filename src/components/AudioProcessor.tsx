import { useEffect, useRef } from 'react';
import { useAudioTrack, useParticipantIds } from '@daily-co/daily-react';
import { transcribeAudio } from '@/api/elevenlabs';

interface AudioProcessorProps {
  onAudioData?: (audioData: Float32Array) => void;
  onVolumeChange?: (volume: number) => void;
  onTranscription?: (text: string) => void;
}

export const AudioProcessor: React.FC<AudioProcessorProps> = ({
  onAudioData,
  onVolumeChange,
  onTranscription,
}) => {
  const remoteParticipantIds = useParticipantIds({ filter: "remote" });
  const remoteAudioTrack = useAudioTrack(remoteParticipantIds[0]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

    // Set up MediaRecorder for speech-to-text
    try {
      mediaRecorderRef.current = new MediaRecorder(audioStream, {
        mimeType: 'audio/webm;codecs=opus',
      });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          audioChunksRef.current = [];
          
          // Transcribe audio directly (ElevenLabs supports WebM)
          const transcription = await transcribeAudio(audioBlob);
          if (transcription && transcription.trim()) {
            onTranscription?.(transcription);
          }
        }
      };
    } catch (error) {
      console.error('MediaRecorder not supported:', error);
    }

    let isSpeaking = false;
    let silenceCount = 0;
    const SILENCE_THRESHOLD = 0.01;
    const SILENCE_DURATION = 30; // frames of silence before stopping recording

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
      
      // Detect speech start/stop
      const currentlySpeaking = volume > SILENCE_THRESHOLD;
      
      if (currentlySpeaking && !isSpeaking) {
        // Start recording
        isSpeaking = true;
        silenceCount = 0;
        if (mediaRecorderRef.current?.state === 'inactive') {
          audioChunksRef.current = [];
          mediaRecorderRef.current.start();
        }
      } else if (!currentlySpeaking && isSpeaking) {
        silenceCount++;
        if (silenceCount >= SILENCE_DURATION) {
          // Stop recording after silence
          isSpeaking = false;
          silenceCount = 0;
          if (mediaRecorderRef.current?.state === 'recording') {
            mediaRecorderRef.current.stop();
          }
        }
      } else if (currentlySpeaking && isSpeaking) {
        // Reset silence counter if still speaking
        silenceCount = 0;
      }
      
      // Call callbacks
      onAudioData?.(floatArray);
      onVolumeChange?.(volume);
      
      requestAnimationFrame(processAudio);
    };

    processAudio();

    return () => {
      if (recordingTimeoutRef.current) {
        clearTimeout(recordingTimeoutRef.current);
      }
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      audioContextRef.current?.close();
    };
  }, [remoteAudioTrack.persistentTrack, onAudioData, onVolumeChange, onTranscription]);

  return null; // This component doesn't render anything
};