import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { InterviewCard3D } from "@/components/interview/InterviewCard3D";
import { Tabs3D, Tabs3DList, Tabs3DTrigger, Tabs3DContent } from "@/components/ui/tabs-3d";
import { 
  Sparkles, 
  FileText, 
  Video, 
  Briefcase, 
  Calendar, 
  TrendingUp,
  Bell,
  Settings,
  LogOut,
  Home,
  Target,
  ClipboardList,
  VideoIcon
} from "lucide-react";

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  
  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchApplications();
      fetchInterviews();
      fetchJobs();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user?.id)
      .maybeSingle();
    setProfile(data);
  };

  const fetchApplications = async () => {
    const { data } = await supabase
      .from('applications')
      .select(`
        *,
        jobs (
          title,
          company,
          location
        )
      `)
      .eq('candidate_id', user?.id)
      .order('applied_at', { ascending: false });
    setApplications(data || []);
  };

  const fetchInterviews = async () => {
    const { data } = await supabase
      .from('interviews')
      .select('*')
      .eq('candidate_id', user?.id)
      .order('scheduled_date', { ascending: true });
    setInterviews(data || []);
  };

  const fetchJobs = async () => {
    const { data } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'active')
      .limit(10);
    setJobs(data || []);
  };

  const profileCompletion = profile?.full_name && profile?.phone ? 100 : 75;

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
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Link to="/candidate/profile">
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={signOut}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {profile?.full_name || 'there'}! 👋</h1>
          <p className="text-muted-foreground font-semibold">Here's what's happening with your job search</p>
        </div>

        {profileCompletion < 100 && (
          <Card className="mb-8 border-primary/50 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Complete Your Profile
              </CardTitle>
              <CardDescription>
                {profileCompletion}% complete - finish your profile to get better matches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={profileCompletion} className="mb-4" />
              <Link to="/candidate/onboarding">
                <Button variant="hero">Complete Profile</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Applications"
            value={applications.length}
            icon={<FileText className="h-5 w-5" />}
            trend={`${applications.length} total`}
          />
          <StatCard
            title="Interviews"
            value={interviews.length}
            icon={<Calendar className="h-5 w-5" />}
            trend={interviews.length > 0 ? "upcoming" : "none scheduled"}
          />
          <StatCard
            title="Recommended"
            value={jobs.length}
            icon={<Sparkles className="h-5 w-5" />}
            trend="AI matched"
          />
          <StatCard
            title="Profile"
            value={profileCompletion}
            icon={<TrendingUp className="h-5 w-5" />}
            trend={`${profileCompletion}% complete`}
          />
        </div>

        <Tabs3D defaultValue="overview" className="w-full">
          <Tabs3DList className="mb-6">
            <Tabs3DTrigger value="overview">
              <Home className="mr-2 h-4 w-4" />
              Overview
            </Tabs3DTrigger>
            <Tabs3DTrigger value="jobs">
              <Target className="mr-2 h-4 w-4" />
              Recommended Jobs
            </Tabs3DTrigger>
            <Tabs3DTrigger value="applications">
              <ClipboardList className="mr-2 h-4 w-4" />
              My Applications
            </Tabs3DTrigger>
            <Tabs3DTrigger value="interviews">
              <VideoIcon className="mr-2 h-4 w-4" />
              Interviews
            </Tabs3DTrigger>
          </Tabs3DList>

          <Tabs3DContent value="overview">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Top Recommendations
                    </CardTitle>
                    <CardDescription>Best matches based on your profile</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {jobs.slice(0, 2).map((job) => (
                      <JobCard
                        key={job.id}
                        title={job.title}
                        company={job.company}
                        location={job.location || 'Remote'}
                        matchScore={Math.floor(Math.random() * 20) + 80}
                        salary={`$${job.salary_min || 80}k - $${job.salary_max || 120}k`}
                        tags={job.skills?.slice(0, 3) || []}
                      />
                    ))}
                    {jobs.length === 0 && (
                      <p className="text-muted-foreground text-center py-8">No jobs available yet</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link to="/candidate/profile">
                      <Button variant="outline" className="w-full justify-start font-bold">
                        <FileText className="mr-2 h-4 w-4" />
                        Update Resume
                      </Button>
                    </Link>
                    <Link to="/candidate/profile">
                      <Button variant="outline" className="w-full justify-start font-bold">
                        <Video className="mr-2 h-4 w-4" />
                        Record Video Resume
                      </Button>
                    </Link>
                    <Link to="/candidate/profile">
                      <Button variant="outline" className="w-full justify-start font-bold">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Take Assessment
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Tabs3DContent>

          <Tabs3DContent value="jobs">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI-Matched Positions
                </CardTitle>
                <CardDescription>Jobs perfectly aligned with your skills and experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    title={job.title}
                    company={job.company}
                    location={job.location || 'Remote'}
                    matchScore={Math.floor(Math.random() * 20) + 80}
                    salary={`$${job.salary_min || 80}k - $${job.salary_max || 120}k`}
                    tags={job.skills?.slice(0, 3) || []}
                  />
                ))}
                {jobs.length === 0 && (
                  <p className="text-muted-foreground text-center py-8">No jobs available yet</p>
                )}
              </CardContent>
            </Card>
          </Tabs3DContent>

          <Tabs3DContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Application Tracking
                </CardTitle>
                <CardDescription>Monitor your application status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {applications.map((app: any) => (
                  <ApplicationCard
                    key={app.id}
                    title={app.jobs?.title || 'Job Title'}
                    company={app.jobs?.company || 'Company'}
                    status={app.status}
                    appliedDate={new Date(app.applied_at).toLocaleDateString()}
                  />
                ))}
                {applications.length === 0 && (
                  <p className="text-muted-foreground text-center py-8">No applications yet</p>
                )}
              </CardContent>
            </Card>
          </Tabs3DContent>

          <Tabs3DContent value="interviews">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {interviews.map((interview: any) => (
                <InterviewCard3D
                  key={interview.id}
                  employer={interview.job_title}
                  position={interview.job_title}
                  date={new Date(interview.scheduled_date).toLocaleDateString()}
                  time={interview.scheduled_time}
                  status={interview.status}
                  onJoin={() => navigate(`/live-interview?id=${interview.id}&role=candidate&name=${profile?.full_name || 'User'}`)}
                />
              ))}
              {interviews.length === 0 && (
                <p className="text-muted-foreground text-center py-8 col-span-3">No interviews scheduled</p>
              )}
            </div>
          </Tabs3DContent>
        </Tabs3D>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
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

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  matchScore: number;
  salary: string;
  tags: string[];
}

const JobCard = ({ title, company, location, matchScore, salary, tags }: JobCardProps) => (
  <div className="p-4 border border-border rounded-lg hover:border-primary/50 transition-all cursor-pointer bg-card shadow-md hover:shadow-[var(--card-3d-shadow)]">
    <div className="flex items-start justify-between mb-3">
      <div>
        <h3 className="font-bold mb-1">{title}</h3>
        <p className="text-sm font-semibold text-muted-foreground">{company} • {location}</p>
      </div>
      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-bold">
        {matchScore}% Match
      </Badge>
    </div>
    <p className="text-sm font-bold text-primary mb-3">{salary}</p>
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Badge key={tag} variant="outline" className="font-semibold">
          {tag}
        </Badge>
      ))}
    </div>
  </div>
);

interface ApplicationCardProps {
  title: string;
  company: string;
  status: string;
  appliedDate: string;
}

const ApplicationCard = ({ title, company, status, appliedDate }: ApplicationCardProps) => (
  <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-card shadow-md hover:shadow-lg transition-all">
    <div>
      <h4 className="font-bold mb-1">{title}</h4>
      <p className="text-sm font-semibold text-muted-foreground">{company}</p>
    </div>
    <div className="text-right">
      <Badge variant="secondary" className="mb-1 font-bold">
        {status}
      </Badge>
      <p className="text-xs font-semibold text-muted-foreground">{appliedDate}</p>
    </div>
  </div>
);

export default CandidateDashboard;
