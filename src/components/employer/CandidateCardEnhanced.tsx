import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  Briefcase, 
  MapPin, 
  Star, 
  Clock, 
  TrendingUp,
  Award,
  Target
} from "lucide-react";

interface CandidateCardEnhancedProps {
  candidate: {
    id: string;
    name: string;
    role: string;
    experience: string;
    location: string;
    skills: string[];
    matchScore: number;
    status: 'available' | 'interviewing' | 'hired';
    salary?: string;
    avatar?: string;
    email?: string;
    phone?: string;
    resume?: string;
    interviewStatus?: string;
  };
  onClick: () => void;
}

export const CandidateCardEnhanced = ({ candidate, onClick }: CandidateCardEnhancedProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'interviewing':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'hired':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 75) return 'text-blue-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-muted-foreground';
  };

  return (
    <Card
      className={`group relative overflow-hidden cursor-pointer transition-all duration-500 border-white/10
        ${isHovered ? 'shadow-2xl shadow-primary/20 scale-[1.02] -translate-y-1' : 'shadow-lg hover:shadow-xl'}
        bg-gradient-to-br from-card/80 via-card/60 to-card/80 backdrop-blur-xl
        before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:via-transparent before:to-accent/5 before:opacity-0 before:transition-opacity before:duration-500
        hover:before:opacity-100`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glassmorphism glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`} />
      
      <div className="relative p-6 space-y-4">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-2xl font-bold backdrop-blur-sm border-2 border-white/20 transition-transform duration-500 ${isHovered ? 'scale-110 rotate-6' : ''}`}>
                {candidate.avatar ? (
                  <img src={candidate.avatar} alt={candidate.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-primary">{candidate.name.charAt(0)}</span>
                )}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br ${getMatchScoreColor(candidate.matchScore)} border-2 border-card flex items-center justify-center transition-transform duration-500 ${isHovered ? 'scale-125' : ''}`}>
                <Star className="w-3 h-3 fill-current" />
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors duration-300">
                {candidate.name}
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Briefcase className="w-4 h-4" />
                <span className="font-semibold">{candidate.role}</span>
              </div>
            </div>
          </div>

          {/* Match Score Badge */}
          <div className="flex flex-col items-end gap-2">
            <div className={`px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-sm border border-white/20 transition-all duration-500 ${isHovered ? 'scale-110' : ''}`}>
              <div className="flex items-center gap-2">
                <Target className={`w-4 h-4 ${getMatchScoreColor(candidate.matchScore)}`} />
                <span className={`text-lg font-bold ${getMatchScoreColor(candidate.matchScore)}`}>
                  {candidate.matchScore}%
                </span>
              </div>
              <div className="text-xs text-muted-foreground text-center">Match</div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Award className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Experience</div>
              <div className="font-semibold">{candidate.experience}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-accent" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Location</div>
              <div className="font-semibold">{candidate.location}</div>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="w-4 h-4" />
            <span className="font-semibold">Top Skills</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {candidate.skills.slice(0, 5).map((skill, index) => (
              <Badge 
                key={index}
                variant="secondary"
                className={`backdrop-blur-sm bg-primary/10 border-primary/20 hover:bg-primary/20 transition-all duration-300 ${isHovered ? 'translate-y-[-2px]' : ''}`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                {skill}
              </Badge>
            ))}
            {candidate.skills.length > 5 && (
              <Badge variant="outline" className="backdrop-blur-sm">
                +{candidate.skills.length - 5} more
              </Badge>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <Badge 
            className={`${getStatusColor(candidate.status)} backdrop-blur-sm transition-transform duration-300 ${isHovered ? 'scale-105' : ''}`}
          >
            <Clock className="w-3 h-3 mr-1" />
            {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
          </Badge>
          
          <span className="text-sm text-muted-foreground font-semibold group-hover:text-primary transition-colors duration-300">
            View Profile →
          </span>
        </div>
      </div>

      {/* Animated border on hover */}
      <div className={`absolute inset-0 rounded-lg border-2 border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
    </Card>
  );
};
