import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Video, User, Briefcase } from 'lucide-react';

interface InterviewCard3DProps {
  candidate?: string;
  employer?: string;
  position: string;
  date: string;
  time: string;
  status: 'upcoming' | 'live' | 'completed';
  onJoin?: () => void;
  onViewRecording?: () => void;
}

export const InterviewCard3D = ({
  candidate,
  employer,
  position,
  date,
  time,
  status,
  onJoin,
  onViewRecording,
}: InterviewCard3DProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'live':
        return 'bg-green-500/10 text-green-600 border-green-500/20 animate-pulse-glow';
      case 'completed':
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  return (
    <Card className="relative overflow-hidden border-2 shadow-[var(--card-3d-shadow)] hover:shadow-[var(--card-3d-hover-shadow)] hover:-translate-y-1 transition-all duration-300 group animate-fade-in">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Glowing Border Effect */}
      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ boxShadow: 'var(--card-border-glow)' }} />
      
      <CardHeader className="relative pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="h-4 w-4 text-primary" />
              <h3 className="font-bold text-lg">{position}</h3>
            </div>
            {candidate && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{candidate}</span>
              </div>
            )}
            {employer && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Briefcase className="h-4 w-4" />
                <span>{employer}</span>
              </div>
            )}
          </div>
          <Badge className={getStatusColor()}>
            {status === 'live' && (
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                Live
              </span>
            )}
            {status === 'upcoming' && 'Upcoming'}
            {status === 'completed' && 'Completed'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4">
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="font-medium">{date}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4 text-primary" />
            <span className="font-medium">{time}</span>
          </div>
        </div>

        <div className="flex gap-2">
          {status === 'upcoming' && onJoin && (
            <Button 
              className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
              onClick={onJoin}
            >
              <Video className="mr-2 h-4 w-4" />
              Join Interview
            </Button>
          )}
          
          {status === 'live' && onJoin && (
            <Button 
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg animate-pulse-glow"
              onClick={onJoin}
            >
              <Video className="mr-2 h-4 w-4" />
              Join Live Interview
            </Button>
          )}
          
          {status === 'completed' && onViewRecording && (
            <Button 
              variant="outline"
              className="flex-1"
              onClick={onViewRecording}
            >
              <Video className="mr-2 h-4 w-4" />
              View Recording
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
