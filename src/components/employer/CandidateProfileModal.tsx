import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap,
  Award,
  Calendar,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  Star,
  Target,
  TrendingUp,
  FileText
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CandidateProfileModalProps {
  candidate: {
    id: string;
    name: string;
    role: string;
    experience: string;
    location: string;
    skills: string[];
    matchScore: number;
    status: string;
    salary?: string;
    avatar?: string;
    email?: string;
    phone?: string;
    resume?: string;
    interviewStatus?: string;
    education?: string;
    summary?: string;
  } | null;
  open: boolean;
  onClose: () => void;
}

export const CandidateProfileModal = ({ candidate, open, onClose }: CandidateProfileModalProps) => {
  if (!candidate) return null;

  const handleShortlist = () => {
    toast({
      title: "Candidate Shortlisted",
      description: `${candidate.name} has been added to your shortlist.`,
    });
    onClose();
  };

  const handleReject = () => {
    toast({
      title: "Candidate Rejected",
      description: `${candidate.name}'s application has been rejected.`,
      variant: "destructive",
    });
    onClose();
  };

  const handleScheduleInterview = () => {
    toast({
      title: "Interview Scheduled",
      description: `Interview request sent to ${candidate.name}.`,
    });
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 75) return 'text-blue-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-muted-foreground';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-card/95 via-card/90 to-card/95 backdrop-blur-xl border-white/20">
        <DialogHeader>
          <DialogTitle className="text-2xl">Candidate Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <Card className="bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 backdrop-blur-sm border-white/20">
            <div className="p-6">
              <div className="flex items-start gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-4xl font-bold backdrop-blur-sm border-4 border-white/20">
                    {candidate.avatar ? (
                      <img src={candidate.avatar} alt={candidate.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-primary">{candidate.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-gradient-to-r ${getMatchScoreColor(candidate.matchScore)} border-2 border-card flex items-center gap-1`}>
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-bold">{candidate.matchScore}%</span>
                  </div>
                </div>

                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">{candidate.name}</h2>
                  <div className="flex items-center gap-2 text-lg text-muted-foreground mb-4">
                    <Briefcase className="w-5 h-5" />
                    <span className="font-semibold">{candidate.role}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-primary" />
                      <span className="font-semibold">{candidate.email || 'email@example.com'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-primary" />
                      <span className="font-semibold">{candidate.phone || '+1 (555) 123-4567'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-accent" />
                      <span className="font-semibold">{candidate.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Award className="w-4 h-4 text-accent" />
                      <span className="font-semibold">{candidate.experience} experience</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button 
                    variant="hero" 
                    size="sm"
                    onClick={handleShortlist}
                    className="gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Shortlist
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleReject}
                    className="gap-2 border-destructive/50 text-destructive hover:bg-destructive/10"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Match Analysis */}
          <Card className="bg-gradient-to-br from-card/80 via-card/60 to-card/80 backdrop-blur-xl border-white/10">
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-lg font-bold">
                <Target className="w-5 h-5 text-primary" />
                AI Match Analysis
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  <div className="text-2xl font-bold text-emerald-400">{candidate.matchScore}%</div>
                  <div className="text-xs text-muted-foreground mt-1">Overall Match</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                  <div className="text-2xl font-bold text-blue-400">95%</div>
                  <div className="text-xs text-muted-foreground mt-1">Skills Match</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                  <div className="text-2xl font-bold text-amber-400">88%</div>
                  <div className="text-xs text-muted-foreground mt-1">Culture Fit</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Summary */}
          {candidate.summary && (
            <Card className="bg-card/80 backdrop-blur-sm border-white/10">
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2 font-bold">
                  <FileText className="w-5 h-5 text-primary" />
                  Professional Summary
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {candidate.summary}
                </p>
              </div>
            </Card>
          )}

          {/* Skills Section */}
          <Card className="bg-card/80 backdrop-blur-sm border-white/10">
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 font-bold">
                <TrendingUp className="w-5 h-5 text-primary" />
                Skills & Expertise
              </div>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill, index) => (
                  <Badge 
                    key={index}
                    variant="secondary"
                    className="bg-primary/10 border-primary/20 hover:bg-primary/20 px-4 py-2"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>

          {/* Education */}
          <Card className="bg-card/80 backdrop-blur-sm border-white/10">
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-2 font-bold">
                <GraduationCap className="w-5 h-5 text-primary" />
                Education
              </div>
              <p className="text-muted-foreground">
                {candidate.education || 'Bachelor of Computer Science - University of Technology'}
              </p>
            </div>
          </Card>

          {/* Interview Status */}
          <Card className="bg-gradient-to-br from-accent/10 via-primary/5 to-accent/10 backdrop-blur-sm border-white/20">
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 font-bold">
                <Calendar className="w-5 h-5 text-primary" />
                Interview Status
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center border-2 border-amber-500/50">
                    <Clock className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <div className="font-semibold">
                      {candidate.interviewStatus || 'Not Scheduled'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {candidate.interviewStatus ? 'Interview pending' : 'No interview scheduled yet'}
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleScheduleInterview}
                  className="gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Schedule Interview
                </Button>
              </div>
            </div>
          </Card>

          {/* Resume Download */}
          <Card className="bg-card/80 backdrop-blur-sm border-white/10">
            <div className="p-6">
              <Button 
                variant="outline" 
                className="w-full gap-2 hover:bg-primary/10"
                onClick={() => toast({ title: "Downloading Resume", description: "Resume download started..." })}
              >
                <Download className="w-4 h-4" />
                Download Resume (PDF)
              </Button>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
