import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { InterviewCard3D } from "@/components/interview/InterviewCard3D";
import { Tabs3D, Tabs3DList, Tabs3DTrigger, Tabs3DContent } from "@/components/ui/tabs-3d";
import { JobPipelineEnhanced } from "@/components/employer/JobPipelineEnhanced";
import { CandidateCardEnhanced } from "@/components/employer/CandidateCardEnhanced";
import { CandidateProfileModal } from "@/components/employer/CandidateProfileModal";
import { mockCandidates, MockCandidate } from "@/data/mockCandidates";
import { toast } from "@/hooks/use-toast";
import {
  Sparkles,
  Plus,
  Search,
  Users,
  Briefcase,
  Clock,
  TrendingUp,
  Bell,
  Settings,
  LogOut,
  Calendar,
  DollarSign,
  Home,
  Target,
  VideoIcon,
  BarChart3
} from "lucide-react";

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<MockCandidate | null>(null);
  
  const activeJobs = 12;
  const totalCandidates = 248;
  const interviewsThisWeek = 15;
  const avgTimeToHire = "18 days";

  useEffect(() => {
    checkEmployerProfile();
  }, []);

  const checkEmployerProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to access the dashboard",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      // @ts-ignore - Supabase types will auto-regenerate
      const { data: profileData, error } = await supabase
        // @ts-ignore
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Profile fetch error:", error);
      }

      // Check if employer has completed onboarding
      // @ts-ignore - Supabase types will auto-regenerate
      if (!profileData || !profileData.company_name || !profileData.phone) {
        toast({
          title: "Complete Your Profile",
          description: "Please complete your employer registration first",
        });
        navigate("/employer/onboarding");
        return;
      }

      setProfile(profileData);
    } catch (error) {
      console.error("Error checking profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">HireGoai</span>
            </Link>
            <div className="flex items-center gap-4">
              <Button variant="hero" onClick={() => navigate("/employer/post-job")}>
                <Plus className="mr-2 h-4 w-4" />
                Post New Job
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => toast({ title: "Notifications", description: "No new notifications" })}
              >
                <Bell className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => toast({ title: "Settings", description: "Settings panel coming soon" })}
              >
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Employer Dashboard 🏢</h1>
          <p className="text-muted-foreground font-semibold">Manage your hiring pipeline and find top talent</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Active Jobs"
            value={activeJobs}
            icon={<Briefcase className="h-5 w-5" />}
            trend="+3 this month"
          />
          <StatCard
            title="Total Candidates"
            value={totalCandidates}
            icon={<Users className="h-5 w-5" />}
            trend="+45 this week"
          />
          <StatCard
            title="Interviews"
            value={interviewsThisWeek}
            icon={<Calendar className="h-5 w-5" />}
            trend="This week"
          />
          <StatCard
            title="Avg. Time to Hire"
            value={avgTimeToHire}
            icon={<Clock className="h-5 w-5" />}
            trend="-3 days"
          />
        </div>

        <Tabs3D defaultValue="overview" className="w-full">
          <Tabs3DList className="mb-6">
            <Tabs3DTrigger value="overview">
              <Home className="mr-2 h-4 w-4" />
              Overview
            </Tabs3DTrigger>
            <Tabs3DTrigger value="candidates">
              <Users className="mr-2 h-4 w-4" />
              Candidates
            </Tabs3DTrigger>
            <Tabs3DTrigger value="jobs">
              <Target className="mr-2 h-4 w-4" />
              Active Jobs
            </Tabs3DTrigger>
            <Tabs3DTrigger value="interviews">
              <VideoIcon className="mr-2 h-4 w-4" />
              Interviews
            </Tabs3DTrigger>
            <Tabs3DTrigger value="analytics">
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </Tabs3DTrigger>
          </Tabs3DList>

          <Tabs3DContent value="overview">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="h-5 w-5" />
                      Search Candidates
                    </CardTitle>
                    <CardDescription>Find the perfect match with AI-powered search</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      <Input placeholder="Search by skills, role, or keywords..." className="flex-1 font-semibold" />
                      <Button 
                        variant="hero"
                        onClick={() => toast({ title: "AI Search", description: "Searching candidates with AI..." })}
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        AI Search
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Top Recommended Candidates
                    </CardTitle>
                    <CardDescription>Best matches for your open positions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {mockCandidates.slice(0, 3).map((candidate) => (
                        <CandidateCardEnhanced
                          key={candidate.id}
                          candidate={candidate}
                          onClick={() => setSelectedCandidate(candidate)}
                        />
                      ))}
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full mt-4 font-bold"
                      onClick={() => {
                        // This will switch to the candidates tab
                        const candidatesTab = document.querySelector('[value="candidates"]') as HTMLElement;
                        if (candidatesTab) candidatesTab.click();
                      }}
                    >
                      View All Candidates →
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start font-bold"
                      onClick={() => navigate("/employer/post-job")}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Post Job
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start font-bold"
                      onClick={() => toast({ title: "Browse Candidates", description: "Candidate browsing feature coming soon" })}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Browse Candidates
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start font-bold"
                      onClick={() => toast({ title: "Schedule Interview", description: "Interview scheduling feature coming soon" })}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule Interview
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Tabs3DContent>

          <Tabs3DContent value="candidates">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-primary" />
                    Top Recommended Candidates
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    AI-powered matches based on your job requirements and hiring preferences
                  </p>
                </div>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {mockCandidates.length} Available
                </Badge>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockCandidates.map((candidate) => (
                  <CandidateCardEnhanced
                    key={candidate.id}
                    candidate={candidate}
                    onClick={() => setSelectedCandidate(candidate)}
                  />
                ))}
              </div>
            </div>
          </Tabs3DContent>

          <Tabs3DContent value="jobs">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Briefcase className="h-6 w-6 text-primary" />
                    Active Jobs Pipeline
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Track applications, progress, and final outcomes for each position
                  </p>
                </div>
              </div>
              
              <JobPipelineEnhanced
                title="Senior React Developer"
                applicants={45}
                shortlisted={12}
                interviewed={5}
                offered={1}
                candidates={[
                  { id: '1', name: 'Sarah Johnson', status: 'selected', feedback: 'Excellent technical skills and culture fit' },
                  { id: '2', name: 'John Smith', status: 'rejected', feedback: 'Lacks required experience' },
                  { id: '3', name: 'Alice Brown', status: 'on_hold', feedback: 'Strong candidate, waiting for final interview' },
                  { id: '4', name: 'Bob Wilson', status: 'pending_decision', feedback: '' },
                  { id: '5', name: 'Emma Davis', status: 'rejected', feedback: 'Not aligned with team requirements' },
                ]}
              />
              
              <JobPipelineEnhanced
                title="Backend Engineer"
                applicants={38}
                shortlisted={10}
                interviewed={3}
                offered={0}
                candidates={[
                  { id: '6', name: 'Michael Chen', status: 'selected', feedback: 'Strong backend architecture skills' },
                  { id: '7', name: 'Lisa Martinez', status: 'on_hold', feedback: 'Good candidate, reviewing compensation' },
                  { id: '8', name: 'David Lee', status: 'pending_decision', feedback: '' },
                ]}
              />
              
              <JobPipelineEnhanced
                title="Full Stack Developer"
                applicants={52}
                shortlisted={15}
                interviewed={7}
                offered={2}
                candidates={[
                  { id: '9', name: 'Emily Rodriguez', status: 'selected', feedback: 'Outstanding full-stack capabilities' },
                  { id: '10', name: 'James Taylor', status: 'selected', feedback: 'Great fit for the team' },
                  { id: '11', name: 'Sophia Anderson', status: 'rejected', feedback: 'Limited experience with our tech stack' },
                  { id: '12', name: 'Oliver Thomas', status: 'on_hold', feedback: 'Awaiting reference checks' },
                  { id: '13', name: 'Ava White', status: 'pending_decision', feedback: '' },
                  { id: '14', name: 'Noah Harris', status: 'rejected', feedback: 'Looking for different role scope' },
                ]}
              />
            </div>
          </Tabs3DContent>

          <Tabs3DContent value="interviews">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InterviewCard3D
                candidate="Sarah Johnson"
                position="Frontend Developer"
                date="Today"
                time="2:00 PM"
                status="live"
                onJoin={() => navigate('/live-interview?id=interview-1&role=employer&name=Recruiter')}
              />
              <InterviewCard3D
                candidate="Michael Chen"
                position="Full Stack Engineer"
                date="Tomorrow"
                time="10:00 AM"
                status="upcoming"
                onJoin={() => navigate('/live-interview?id=interview-2&role=employer&name=Recruiter')}
              />
              <InterviewCard3D
                candidate="Emily Rodriguez"
                position="UI/UX Developer"
                date="Dec 22"
                time="3:00 PM"
                status="upcoming"
                onJoin={() => navigate('/live-interview?id=interview-3&role=employer&name=Recruiter')}
              />
            </div>
          </Tabs3DContent>

          <Tabs3DContent value="analytics">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Hiring Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-bold text-muted-foreground">Application Rate</span>
                      <span className="font-bold">+25%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div className="bg-primary h-3 rounded-full shadow-md" style={{ width: "75%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-bold text-muted-foreground">Shortlist Rate</span>
                      <span className="font-bold">32%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div className="bg-accent h-3 rounded-full shadow-md" style={{ width: "32%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-bold text-muted-foreground">Interview Conversion</span>
                      <span className="font-bold">18%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div className="bg-primary h-3 rounded-full shadow-md" style={{ width: "18%" }} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="font-bold">Total Positions Filled</span>
                    <span className="text-2xl font-bold text-primary">23</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="font-bold">Avg. Days to Hire</span>
                    <span className="text-2xl font-bold text-accent">18</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="font-bold">Success Rate</span>
                    <span className="text-2xl font-bold text-primary">87%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Tabs3DContent>
        </Tabs3D>
      </div>

      {/* Candidate Profile Modal */}
      <CandidateProfileModal
        candidate={selectedCandidate}
        open={selectedCandidate !== null}
        onClose={() => setSelectedCandidate(null)}
      />
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend: string;
}

const StatCard = ({ title, value, icon, trend }: StatCardProps) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-bold text-muted-foreground">{title}</span>
        <div className="text-primary">{icon}</div>
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <p className="text-xs font-bold text-muted-foreground">{trend}</p>
    </CardContent>
  </Card>
);

interface CandidateCardProps {
  name: string;
  role: string;
  matchScore: number;
  skills: string[];
  experience: string;
  availability: string;
}

const CandidateCard = ({ name, role, matchScore, skills, experience, availability }: CandidateCardProps) => (
  <div className="p-4 border border-border rounded-lg hover:border-primary/50 transition-all cursor-pointer bg-card shadow-md hover:shadow-[var(--card-3d-shadow)]">
    <div className="flex items-start justify-between mb-3">
      <div>
        <h3 className="font-bold mb-1">{name}</h3>
        <p className="text-sm font-semibold text-muted-foreground mb-2">{role}</p>
        <div className="flex gap-3 text-xs font-semibold text-muted-foreground">
          <span>📊 {experience}</span>
          <span>🕒 {availability}</span>
        </div>
      </div>
      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-bold">
        {matchScore}% Match
      </Badge>
    </div>
    <div className="flex flex-wrap gap-2 mb-3">
      {skills.map((skill) => (
        <Badge key={skill} variant="outline" className="text-xs font-semibold">
          {skill}
        </Badge>
      ))}
    </div>
    <div className="flex gap-2">
      <Button size="sm" variant="hero" className="flex-1">
        View Profile
      </Button>
      <Button size="sm" variant="outline" className="font-bold">
        Shortlist
      </Button>
    </div>
  </div>
);

interface JobPipelineCardProps {
  title: string;
  applicants: number;
  shortlisted: number;
  interviewed: number;
  offered: number;
}

const JobPipelineCard = ({ title, applicants, shortlisted, interviewed, offered }: JobPipelineCardProps) => (
  <div className="p-4 border border-border rounded-lg bg-card shadow-md hover:shadow-lg transition-all">
    <h4 className="font-bold mb-4">{title}</h4>
    <div className="grid grid-cols-4 gap-4 text-center">
      <div>
        <div className="text-2xl font-bold text-primary mb-1">{applicants}</div>
        <div className="text-xs font-bold text-muted-foreground">Applied</div>
      </div>
      <div>
        <div className="text-2xl font-bold text-accent mb-1">{shortlisted}</div>
        <div className="text-xs font-bold text-muted-foreground">Shortlisted</div>
      </div>
      <div>
        <div className="text-2xl font-bold text-primary mb-1">{interviewed}</div>
        <div className="text-xs font-bold text-muted-foreground">Interviewed</div>
      </div>
      <div>
        <div className="text-2xl font-bold text-accent mb-1">{offered}</div>
        <div className="text-xs font-bold text-muted-foreground">Offered</div>
      </div>
    </div>
  </div>
);

export default EmployerDashboard;
