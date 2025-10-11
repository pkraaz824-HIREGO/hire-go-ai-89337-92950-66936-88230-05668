import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Sparkles, 
  Share2, 
  Play,
  Calendar,
  GraduationCap,
  Briefcase,
  Building2,
  Video,
  MessageSquare,
  Brain,
  Award,
  Target,
  Code2,
  Server,
  Workflow,
  Lightbulb
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const CandidateProfile = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  
  const candidateData = {
    name: "Rahul Kumar",
    role: "Full Stack Developer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
    dateOfBirth: "Mar 15, 1995",
    education: "Bachelor of Science",
    totalExperience: "5 years",
    companies: "3 companies",
    summary: "Rahul shows structured thinking, excellent confidence, and clear communication. Fit for client-facing or leadership roles.",
  };

  const aiSkills = [
    { name: "Communication", score: 8.6, color: "bg-teal-500" },
    { name: "Knowledge", score: 8.2, color: "bg-teal-500" },
    { name: "Confidence", score: 9.1, color: "bg-teal-500" },
    { name: "Behaviour", score: 8.4, color: "bg-teal-500" },
  ];

  const keyHighlights = ["ReactJS", "CRM", "Empathy", "UI"];

  const roleSpecificSkills = [
    { name: "React.JS", icon: <Code2 className="h-5 w-5 text-cyan-400" />, score: 8.2 },
    { name: "Node.js", icon: <Server className="h-5 w-5 text-green-500" />, score: 8.9 },
    { name: "API Integration", icon: <Workflow className="h-5 w-5 text-blue-400" />, score: 8.3 },
    { name: "Problem Solving", icon: <Lightbulb className="h-5 w-5 text-amber-400" />, score: 8.5 },
  ];

  const workHistory = [
    {
      company: "Tech Solutions",
      role: "Full Stack Developer",
      duration: "2021 - 2023",
      icon: <Building2 className="h-5 w-5 text-muted-foreground" />,
    },
    {
      company: "Innovatech",
      role: "Software Engineer",
      duration: "2018 - 2021",
      icon: <Award className="h-5 w-5 text-muted-foreground" />,
    },
    {
      company: "DevWorks",
      role: "Junior Developer",
      duration: "2016 - 2018",
      note: "Left for higher opportunity",
      icon: <Target className="h-5 w-5 text-muted-foreground" />,
    },
  ];

  const handleShareProfile = () => {
    const profileUrl = window.location.href;
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Link Copied!",
      description: "Profile link has been copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="glass-card border-b border-border/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">HireGo AI</span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link to="/candidate/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Button variant="outline" onClick={handleShareProfile} className="gap-2">
                <Share2 className="h-4 w-4" />
                Share Profile
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Profile Header Card */}
            <Card className="glass-card border-border/50 p-8">
              <div className="flex items-start gap-6">
                <div className="relative">
                  <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                    <AvatarImage src={candidateData.avatar} />
                    <AvatarFallback className="text-3xl">{candidateData.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <button 
                    className="absolute bottom-0 right-0 w-12 h-12 bg-teal-500 hover:bg-teal-600 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
                    onClick={() => setIsVideoPlaying(true)}
                  >
                    <Play className="h-6 w-6 text-white fill-white ml-0.5" />
                  </button>
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-4xl font-bold mb-1">{candidateData.name}</h1>
                    <p className="text-xl text-muted-foreground">{candidateData.role}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">Date of Birth</p>
                      <p className="font-semibold">{candidateData.dateOfBirth}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Education</p>
                      <p className="font-semibold">{candidateData.education}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Total Experience</p>
                      <p className="font-semibold">{candidateData.totalExperience}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Join</p>
                      <p className="font-semibold">{candidateData.companies}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Video Resume Section */}
            <Card className="glass-card border-border/50 p-6">
              <div className="aspect-video bg-gradient-to-br from-muted/50 to-muted/30 rounded-lg flex items-center justify-center border border-border/50 hover:border-primary/50 transition-all cursor-pointer group mb-6">
                <button 
                  className="w-20 h-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
                  onClick={() => setIsVideoPlaying(true)}
                >
                  <Play className="h-10 w-10 text-foreground fill-foreground ml-1" />
                </button>
              </div>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                In my previous role, I led the development of a major e-commerce application.
                I have extensive experience working with user interfaces.
              </p>

              <div>
                <h3 className="text-lg font-bold mb-4">Key Highlights</h3>
                <div className="flex flex-wrap gap-2">
                  {keyHighlights.map((highlight) => (
                    <Badge 
                      key={highlight} 
                      variant="outline" 
                      className="px-4 py-2 text-sm border-border hover:border-primary/50 transition-colors"
                    >
                      {highlight}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>

            {/* Role-Specific Skills */}
            <Card className="glass-card border-border/50 p-6">
              <h3 className="text-lg font-bold mb-6">Role-Specific Skills</h3>
              <div className="space-y-5">
                {roleSpecificSkills.map((skill) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {skill.icon}
                        <span className="font-semibold">{skill.name}</span>
                      </div>
                      <span className="font-bold text-lg">{skill.score}</span>
                    </div>
                    <Progress value={skill.score * 10} className="h-2" />
                  </div>
                ))}
              </div>
            </Card>

            {/* AI Summary */}
            <Card className="glass-card border-border/50 p-6">
              <h3 className="text-lg font-bold mb-4">AI Summary</h3>
              <p className="text-muted-foreground leading-relaxed">
                {candidateData.summary}
              </p>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                className="w-full h-12 bg-teal-500 hover:bg-teal-600 text-white text-base"
                onClick={() => toast({ title: "Opening full video resume..." })}
              >
                <Video className="mr-2 h-5 w-5" />
                View Full Video Resume
              </Button>
              <Button 
                variant="outline" 
                className="w-full h-12 text-base"
                onClick={() => toast({ title: "Opening interview scheduler..." })}
              >
                <Calendar className="mr-2 h-5 w-5" />
                Schedule Interview
              </Button>
            </div>

            {/* AI-Evaluated Skills */}
            <Card className="glass-card border-border/50 p-6">
              <h3 className="text-lg font-bold mb-6">AI-Evaluated Skills</h3>
              <div className="space-y-5">
                {aiSkills.map((skill) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{skill.name}</span>
                      <span className="font-bold text-lg">{skill.score}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${skill.color} rounded-full transition-all`}
                        style={{ width: `${skill.score * 10}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Work History Timeline */}
            <Card className="glass-card border-border/50 p-6">
              <h3 className="text-lg font-bold mb-6">AI Summary</h3>
              <div className="space-y-6">
                {workHistory.map((job, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        {job.icon}
                      </div>
                      {index < workHistory.length - 1 && (
                        <div className="w-0.5 h-full bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <h4 className="font-bold mb-1">{job.company}</h4>
                      <p className="text-sm text-muted-foreground mb-1">{job.role}</p>
                      <p className="text-sm text-muted-foreground">{job.duration}</p>
                      {job.note && (
                        <p className="text-sm text-muted-foreground mt-1 italic">{job.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Final CTA */}
            <Button 
              className="w-full h-12 bg-teal-500 hover:bg-teal-600 text-white text-base"
              onClick={() => toast({ 
                title: "Invitation Sent!", 
                description: "Candidate has been invited for the second round" 
              })}
            >
              Invite for Second Round
            </Button>
          </div>
        </div>
      </div>

      {/* Video Modal Placeholder */}
      {isVideoPlaying && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsVideoPlaying(false)}
        >
          <div className="relative w-full max-w-4xl aspect-video bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Video player will be integrated here</p>
            <button 
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center"
              onClick={() => setIsVideoPlaying(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateProfile;
