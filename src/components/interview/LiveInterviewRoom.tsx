import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Video, Mic, MicOff, VideoOff, Send, Users, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  user_role: string;
  message: string;
  timestamp: string;
}

interface Participant {
  user_id: string;
  role: string;
  name: string;
  online_at: string;
}

interface LiveInterviewRoomProps {
  interviewId: string;
  userRole: 'candidate' | 'employer';
  userName: string;
}

export const LiveInterviewRoom = ({ interviewId, userRole, userName }: LiveInterviewRoomProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    joinInterview();
    return () => {
      leaveInterview();
    };
  }, []);

  const joinInterview = async () => {
    try {
      // Start local camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Join Supabase channel for this interview
      const channel = supabase.channel(`interview:${interviewId}`)
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          const allParticipants: Participant[] = [];
          
          Object.keys(state).forEach(key => {
            state[key].forEach((presence: any) => {
              allParticipants.push(presence);
            });
          });
          
          setParticipants(allParticipants);
        })
        .on('presence', { event: 'join' }, ({ newPresences }) => {
          console.log('User joined:', newPresences);
          toast({
            title: "Participant Joined",
            description: `${newPresences[0].name} has joined the interview`,
          });
        })
        .on('presence', { event: 'leave' }, ({ leftPresences }) => {
          console.log('User left:', leftPresences);
          toast({
            title: "Participant Left",
            description: `${leftPresences[0].name} has left the interview`,
          });
        })
        .on('broadcast', { event: 'message' }, ({ payload }) => {
          setMessages(prev => [...prev, payload as Message]);
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await channel.track({
              user_id: userRole,
              role: userRole,
              name: userName,
              online_at: new Date().toISOString(),
            });
            setIsConnected(true);
          }
        });

      channelRef.current = channel;

      toast({
        title: "Joined Interview",
        description: "You are now in the live interview room",
      });
    } catch (error) {
      console.error('Error joining interview:', error);
      toast({
        title: "Connection Error",
        description: "Unable to join interview room",
        variant: "destructive",
      });
    }
  };

  const leaveInterview = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
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

  const sendMessage = () => {
    if (!newMessage.trim() || !channelRef.current) return;

    const message: Message = {
      id: crypto.randomUUID(),
      user_role: userRole,
      message: newMessage,
      timestamp: new Date().toISOString(),
    };

    channelRef.current.send({
      type: 'broadcast',
      event: 'message',
      payload: message,
    });

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const otherParticipant = participants.find(p => p.role !== userRole);
  const isOtherParticipantPresent = !!otherParticipant;

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Video Section */}
      <div className="lg:col-span-2 space-y-4">
        <Card className="overflow-hidden border-2 shadow-[var(--card-3d-shadow)] hover:shadow-[var(--card-3d-hover-shadow)] transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                Live Interview Room
              </span>
              <Badge variant={isConnected ? "default" : "secondary"}>
                {isConnected ? "Connected" : "Connecting..."}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2 gap-2 p-2 bg-black">
              {/* Local Video */}
              <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black/70 px-3 py-1 rounded-full text-white text-sm font-semibold">
                  You ({userRole === 'candidate' ? 'Candidate' : 'Recruiter'})
                </div>
              </div>

              {/* Remote Video Placeholder */}
              <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                {isOtherParticipantPresent ? (
                  <>
                    <video
                      ref={remoteVideoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/70 px-3 py-1 rounded-full text-white text-sm font-semibold">
                      {otherParticipant?.name} ({otherParticipant?.role === 'candidate' ? 'Candidate' : 'Recruiter'})
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 font-semibold">
                      Waiting for {userRole === 'candidate' ? 'recruiter' : 'candidate'} to join...
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 p-6 bg-card border-t">
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full"
                onClick={toggleMic}
              >
                {isMicEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5 text-destructive" />}
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full"
                onClick={toggleVideo}
              >
                {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5 text-destructive" />}
              </Button>

              <Button
                variant="destructive"
                size="icon"
                className="h-12 w-12 rounded-full"
                onClick={leaveInterview}
              >
                <Phone className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Participants */}
        <Card className="border-2 shadow-[var(--card-3d-shadow)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-primary" />
              Participants ({participants.length}/2)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {participants.map((participant) => (
                <div
                  key={participant.user_id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <div>
                      <p className="font-semibold">{participant.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {participant.role}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">Online</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Section */}
      <div className="lg:col-span-1">
        <Card className="h-full border-2 shadow-[var(--card-3d-shadow)] flex flex-col">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b">
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              Chat
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.user_role === userRole ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.user_role === userRole
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-xs font-semibold mb-1 capitalize opacity-70">
                        {msg.user_role}
                      </p>
                      <p className="font-medium">{msg.message}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="font-medium"
                />
                <Button onClick={sendMessage} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
