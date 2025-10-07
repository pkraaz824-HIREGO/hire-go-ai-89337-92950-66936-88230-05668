import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, Play, Star, Mail, Phone, MapPin, GraduationCap, Briefcase } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface Candidate {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  location: string;
  education_background: string;
  previous_experience: string;
  overall_candidate_score: number;
  avatar_url: string;
}

interface Application {
  id: string;
  job_id: string;
  candidate_id: string;
  status: string;
  match_score: number;
  ai_recommendation_score: number;
  applied_at: string;
  jobs: {
    title: string;
  };
  profiles: Candidate;
}

interface VideoRecording {
  id: string;
  video_url: string;
  video_type: string;
  recorded_at: string;
}

interface AIEvaluation {
  communication_score: number;
  confidence_score: number;
  skill_score: number;
  clarity_score: number;
  overall_rating: number;
  evaluation_notes: string;
}

export const CandidateReviewPanel = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Application | null>(null);
  const [videos, setVideos] = useState<VideoRecording[]>([]);
  const [evaluation, setEvaluation] = useState<AIEvaluation | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          jobs!inner(title, employer_id)
        `)
        .eq('jobs.employer_id', user.id)
        .order('applied_at', { ascending: false });

      if (error) throw error;

      // Fetch profiles separately
      const applicationsWithProfiles = await Promise.all(
        (data || []).map(async (app) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', app.candidate_id)
            .single();
          
          return { ...app, profiles: profile };
        })
      );

      setApplications(applicationsWithProfiles as Application[]);
    } catch (error) {
      console.error('Error loading applications:', error);
      toast({
        title: 'Error',
        description: 'Failed to load applications',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCandidateDetails = async (candidateId: string) => {
    try {
      // Load videos
      const { data: videoData } = await supabase
        .from('video_recordings')
        .select('*')
        .eq('candidate_id', candidateId)
        .order('recorded_at', { ascending: false });

      setVideos(videoData || []);

      // Load latest evaluation
      const { data: evalData } = await supabase
        .from('ai_evaluations')
        .select('*')
        .eq('candidate_id', candidateId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      setEvaluation(evalData);
    } catch (error) {
      console.error('Error loading candidate details:', error);
    }
  };

  const handleViewCandidate = async (application: Application) => {
    setSelectedCandidate(application);
    await loadCandidateDetails(application.candidate_id);
  };

  const handleUpdateStatus = async (applicationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: 'Status Updated',
        description: `Application status changed to ${newStatus}`,
      });

      await loadApplications();
      setSelectedCandidate(null);
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      applied: { variant: 'outline', label: 'New Application' },
      under_review: { variant: 'secondary', label: 'Under Review' },
      shortlisted: { variant: 'default', label: 'Shortlisted' },
      interview_scheduled: { variant: 'default', label: 'Interview Scheduled' },
      offered: { variant: 'default', label: 'Offered' },
      rejected: { variant: 'destructive', label: 'Rejected' },
    };
    return variants[status] || variants.applied;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {applications.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No applications received yet.</p>
            </CardContent>
          </Card>
        ) : (
          applications.map((app) => {
            const candidate = app.profiles;
            const statusInfo = getStatusBadge(app.status);

            return (
              <Card key={app.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={candidate.avatar_url} />
                      <AvatarFallback>{candidate.full_name?.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold">{candidate.full_name}</h3>
                          <p className="text-sm text-muted-foreground">Applied for: {app.jobs.title}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary mb-1">
                            {candidate.overall_candidate_score || 0}/100
                          </div>
                          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {candidate.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {candidate.phone}
                        </div>
                        {candidate.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {candidate.location}
                          </div>
                        )}
                      </div>

                      {app.ai_recommendation_score && app.ai_recommendation_score >= 70 && (
                        <Badge variant="default" className="mb-3">
                          <Star className="h-3 w-3 mr-1" />
                          AI Recommended
                        </Badge>
                      )}

                      <div className="flex gap-2">
                        <Button onClick={() => handleViewCandidate(app)} size="sm">
                          View Details
                        </Button>
                        <Button
                          onClick={() => handleUpdateStatus(app.id, 'shortlisted')}
                          variant="outline"
                          size="sm"
                          disabled={app.status === 'shortlisted'}
                        >
                          Shortlist
                        </Button>
                        <Button
                          onClick={() => handleUpdateStatus(app.id, 'rejected')}
                          variant="destructive"
                          size="sm"
                          disabled={app.status === 'rejected'}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Candidate Details Dialog */}
      <Dialog open={!!selectedCandidate} onOpenChange={() => setSelectedCandidate(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {selectedCandidate?.profiles.full_name}
            </DialogTitle>
            <DialogDescription>
              Complete profile and AI evaluation results
            </DialogDescription>
          </DialogHeader>

          {selectedCandidate && (
            <Tabs defaultValue="profile" className="mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="videos">Videos</TabsTrigger>
                <TabsTrigger value="evaluation">AI Evaluation</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      Education Background
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{selectedCandidate.profiles.education_background}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Previous Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{selectedCandidate.profiles.previous_experience}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="videos" className="space-y-4">
                {videos.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No video recordings available
                  </p>
                ) : (
                  videos.map((video) => (
                    <Card key={video.id}>
                      <CardHeader>
                        <CardTitle className="text-base">
                          {video.video_type === 'introduction' ? 'Self Introduction' : 'Interview Question Response'}
                        </CardTitle>
                        <CardDescription>
                          {new Date(video.recorded_at).toLocaleString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="aspect-video bg-black rounded-lg overflow-hidden">
                          <video controls className="w-full h-full" src={video.video_url}>
                            Your browser does not support video playback.
                          </video>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="evaluation">
                {evaluation ? (
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Overall Performance Score</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-end gap-4 mb-4">
                          <div className="text-5xl font-bold text-primary">
                            {evaluation.overall_rating}
                          </div>
                          <div className="text-xl text-muted-foreground pb-1">/100</div>
                        </div>
                        <Progress value={evaluation.overall_rating} className="h-2" />
                      </CardContent>
                    </Card>

                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Communication</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-primary">{evaluation.communication_score}/10</div>
                          <Progress value={evaluation.communication_score * 10} className="mt-2" />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Confidence</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-primary">{evaluation.confidence_score}/10</div>
                          <Progress value={evaluation.confidence_score * 10} className="mt-2" />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Skills</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-primary">{evaluation.skill_score}/10</div>
                          <Progress value={evaluation.skill_score * 10} className="mt-2" />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Clarity</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-primary">{evaluation.clarity_score}/10</div>
                          <Progress value={evaluation.clarity_score * 10} className="mt-2" />
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle>AI Feedback</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm leading-relaxed">{evaluation.evaluation_notes}</p>
                      </CardContent>
                    </Card>

                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={() => handleUpdateStatus(selectedCandidate.id, 'shortlisted')}
                        className="flex-1"
                      >
                        Shortlist Candidate
                      </Button>
                      <Button
                        onClick={() => handleUpdateStatus(selectedCandidate.id, 'interview_scheduled')}
                        variant="outline"
                        className="flex-1"
                      >
                        Schedule Interview
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No evaluation data available
                  </p>
                )}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};