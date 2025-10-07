import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, Mic, MicOff, VideoOff, Square, Play, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InterviewRecorderProps {
  interviewTitle: string;
  onRecordingComplete?: (blob: Blob) => void;
}

export const InterviewRecorder = ({ interviewTitle, onRecordingComplete }: InterviewRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideoEnabled,
        audio: isMicEnabled
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera/microphone",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const toggleMic = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicEnabled(audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const startRecording = () => {
    if (!streamRef.current) return;

    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(streamRef.current, {
      mimeType: 'video/webm;codecs=vp9'
    });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      setRecordedBlob(blob);
      if (onRecordingComplete) {
        onRecordingComplete(blob);
      }
    };

    mediaRecorder.start();
    mediaRecorderRef.current = mediaRecorder;
    setIsRecording(true);
    setRecordingTime(0);

    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);

    toast({
      title: "Recording Started",
      description: "Your interview is being recorded",
    });
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      toast({
        title: "Recording Stopped",
        description: "Your interview has been saved",
      });
    }
  };

  const downloadRecording = () => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `interview-${Date.now()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="overflow-hidden border-2 shadow-[var(--card-3d-shadow)] hover:shadow-[var(--card-3d-hover-shadow)] transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b">
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5 text-primary" />
          {interviewTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative bg-black aspect-video">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          
          {isRecording && (
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full animate-pulse-glow">
              <div className="w-3 h-3 bg-white rounded-full" />
              <span className="font-mono font-bold">{formatTime(recordingTime)}</span>
            </div>
          )}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full bg-white/90 hover:bg-white backdrop-blur-sm"
              onClick={toggleMic}
            >
              {isMicEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5 text-destructive" />}
            </Button>

            {!isRecording && !recordedBlob && (
              <Button
                size="icon"
                className="h-16 w-16 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
                onClick={startRecording}
              >
                <Play className="h-8 w-8" />
              </Button>
            )}

            {isRecording && (
              <Button
                size="icon"
                className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600 shadow-lg"
                onClick={stopRecording}
              >
                <Square className="h-8 w-8" />
              </Button>
            )}

            {recordedBlob && (
              <Button
                size="icon"
                className="h-16 w-16 rounded-full bg-green-500 hover:bg-green-600 shadow-lg"
                onClick={downloadRecording}
              >
                <Download className="h-8 w-8" />
              </Button>
            )}

            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full bg-white/90 hover:bg-white backdrop-blur-sm"
              onClick={toggleVideo}
            >
              {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5 text-destructive" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
