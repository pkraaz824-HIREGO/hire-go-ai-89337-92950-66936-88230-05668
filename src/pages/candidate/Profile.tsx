import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Sparkles, 
  MapPin, 
  Share2, 
  Video,
  FileText,
  Award,
  Github,
  Linkedin,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  BookOpen,
  TrendingUp
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

const CandidateProfile = () => {
  const profileCompletion = 85;
  
  const skillData = [
    { subject: 'Technical', A: 90, fullMark: 100 },
    { subject: 'Communication', A: 85, fullMark: 100 },
    { subject: 'Soft Skills', A: 88, fullMark: 100 },
    { subject: 'Interview', A: 82, fullMark: 100 },
    { subject: 'Knowledge', A: 92, fullMark: 100 },
  ];

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
              <Button variant="ghost">Settings</Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Profile Card */}
        <Card className="glass-card border-primary/20 shadow-xl mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="h-32 w-32 border-4 border-primary/20">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-3">
                <div>
                  <h1 className="text-3xl font-bold mb-1">John Doe</h1>
                  <p className="text-lg text-primary font-semibold">Senior Frontend Developer</p>
                  <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>San Francisco, CA</span>
                  </div>
                </div>
                
                <p className="text-muted-foreground leading-relaxed">
                  Passionate frontend developer with 5+ years of experience building responsive web applications. 
                  Specialized in React, TypeScript, and modern UI frameworks. Love creating intuitive user experiences.
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Profile Completion</span>
                    <span className="text-sm font-bold text-primary">{profileCompletion}%</span>
                  </div>
                  <Progress value={profileCompletion} className="h-2" />
                </div>
              </div>
              
              <Button className="bg-primary hover:bg-primary/90">
                <Share2 className="mr-2 h-4 w-4" />
                Share Profile Link
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Video Resume */}
            <Card className="glass-card border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-primary" />
                  Video Resume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center border border-primary/20 hover:border-primary/40 transition-all cursor-pointer group">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Video className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-sm font-medium">Click to play video introduction</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Smart Ranking */}
            <Card className="glass-card border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Smart Ranking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={skillData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis 
                      dataKey="subject" 
                      tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                    />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar 
                      name="Skills" 
                      dataKey="A" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary))" 
                      fillOpacity={0.6} 
                    />
                  </RadarChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {skillData.map((skill) => (
                    <div key={skill.subject} className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">{skill.subject}</p>
                      <p className="text-lg font-bold text-primary">{skill.A}%</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Resume & Documents */}
            <Card className="glass-card border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Resume & Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <DocumentItem
                  icon={<Sparkles className="h-4 w-4" />}
                  title="AI-Generated SmartResume"
                  subtitle="Optimized for ATS"
                  badge="New"
                />
                <DocumentItem
                  icon={<FileText className="h-4 w-4" />}
                  title="Resume.pdf"
                  subtitle="Updated 2 days ago"
                />
                <DocumentItem
                  icon={<Award className="h-4 w-4" />}
                  title="Certificates"
                  subtitle="5 certificates"
                />
                <div className="pt-2 space-y-2">
                  <p className="text-sm font-semibold">Portfolio Links</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="gap-1 hover:bg-primary/10 cursor-pointer">
                      <Github className="h-3 w-3" />
                      GitHub
                      <ExternalLink className="h-3 w-3" />
                    </Badge>
                    <Badge variant="outline" className="gap-1 hover:bg-primary/10 cursor-pointer">
                      <Linkedin className="h-3 w-3" />
                      LinkedIn
                      <ExternalLink className="h-3 w-3" />
                    </Badge>
                    <Badge variant="outline" className="gap-1 hover:bg-primary/10 cursor-pointer">
                      <ExternalLink className="h-3 w-3" />
                      Portfolio
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Job Application Tracking */}
            <Card className="glass-card border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Application Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <ApplicationStage
                    icon={<CheckCircle2 className="h-5 w-5" />}
                    title="Applied"
                    status="Completed"
                    date="Dec 10"
                    isActive
                  />
                  <ApplicationStage
                    icon={<CheckCircle2 className="h-5 w-5" />}
                    title="Shortlisted"
                    status="Completed"
                    date="Dec 12"
                    isActive
                  />
                  <ApplicationStage
                    icon={<Clock className="h-5 w-5" />}
                    title="Interview"
                    status="Upcoming"
                    date="Dec 15"
                    isActive
                  />
                  <ApplicationStage
                    icon={<AlertCircle className="h-5 w-5" />}
                    title="Final Round"
                    status="Pending"
                    isActive={false}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Assignments & Tests */}
            <Card className="glass-card border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Screening Tests
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <TestItem
                  title="React Assessment"
                  status="Completed"
                  score="92%"
                />
                <TestItem
                  title="System Design"
                  status="In Progress"
                  score="45%"
                />
                <TestItem
                  title="Coding Challenge"
                  status="Pending"
                />
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="glass-card border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <RecommendationItem
                  icon={<TrendingUp className="h-4 w-4" />}
                  title="Data Scientist"
                  subtitle="95% Match"
                  type="job"
                />
                <RecommendationItem
                  icon={<BookOpen className="h-4 w-4" />}
                  title="Machine Learning Course"
                  subtitle="Upskill recommendation"
                  type="course"
                />
                <RecommendationItem
                  icon={<TrendingUp className="h-4 w-4" />}
                  title="Senior Frontend Engineer"
                  subtitle="88% Match"
                  type="job"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const DocumentItem = ({ icon, title, subtitle, badge }: { icon: React.ReactNode; title: string; subtitle: string; badge?: string }) => (
  <div className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/50 transition-all cursor-pointer glass-card">
    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
      {icon}
    </div>
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <p className="text-sm font-semibold">{title}</p>
        {badge && <Badge variant="secondary" className="text-xs">{badge}</Badge>}
      </div>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </div>
    <ExternalLink className="h-4 w-4 text-muted-foreground" />
  </div>
);

const ApplicationStage = ({ icon, title, status, date, isActive }: { icon: React.ReactNode; title: string; status: string; date?: string; isActive: boolean }) => (
  <div className="flex items-start gap-3">
    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
      {icon}
    </div>
    <div className="flex-1">
      <p className="font-semibold">{title}</p>
      <p className="text-xs text-muted-foreground">{status}</p>
      {date && <p className="text-xs text-muted-foreground mt-1">{date}</p>}
    </div>
  </div>
);

const TestItem = ({ title, status, score }: { title: string; status: string; score?: string }) => (
  <div className="flex items-center justify-between p-3 rounded-lg border border-border glass-card">
    <div>
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-xs text-muted-foreground">{status}</p>
    </div>
    {score && <Badge variant="secondary" className="bg-primary/10 text-primary">{score}</Badge>}
  </div>
);

const RecommendationItem = ({ icon, title, subtitle, type }: { icon: React.ReactNode; title: string; subtitle: string; type: 'job' | 'course' }) => (
  <div className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/50 transition-all cursor-pointer glass-card">
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${type === 'job' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'}`}>
      {icon}
    </div>
    <div className="flex-1">
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </div>
    <ExternalLink className="h-4 w-4 text-muted-foreground" />
  </div>
);

export default CandidateProfile;
