import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Loader2, Award, MessageSquare, Target, Sparkles, TrendingUp } from 'lucide-react';

interface Evaluation {
  communication_score: number;
  confidence_score: number;
  skill_score: number;
  clarity_score: number;
  overall_rating: number;
  evaluation_notes: string;
  created_at: string;
}

interface ProfileScore {
  overall_candidate_score: number;
}

export const AIEvaluationDashboard = () => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [profileScore, setProfileScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvaluations();
  }, []);

  const loadEvaluations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load evaluations
      const { data: evalData, error: evalError } = await supabase
        .from('ai_evaluations')
        .select('*')
        .eq('candidate_id', user.id)
        .order('created_at', { ascending: false });

      if (evalError) throw evalError;
      setEvaluations(evalData || []);

      // Load profile score
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('overall_candidate_score')
        .eq('user_id', user.id)
        .single();

      if (profileError) throw profileError;
      setProfileScore(profileData.overall_candidate_score);

    } catch (error) {
      console.error('Error loading evaluations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (evaluations.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">
            Complete your video interviews to see your AI evaluation results.
          </p>
        </CardContent>
      </Card>
    );
  }

  const latestEval = evaluations[0];
  const avgCommunication = Math.round(
    evaluations.reduce((sum, e) => sum + e.communication_score, 0) / evaluations.length
  );
  const avgConfidence = Math.round(
    evaluations.reduce((sum, e) => sum + e.confidence_score, 0) / evaluations.length
  );
  const avgSkill = Math.round(
    evaluations.reduce((sum, e) => sum + e.skill_score, 0) / evaluations.length
  );
  const avgClarity = Math.round(
    evaluations.reduce((sum, e) => sum + e.clarity_score, 0) / evaluations.length
  );

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-500';
    if (score >= 6) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getRatingBadge = (score: number) => {
    if (score >= 80) return { label: 'Excellent', variant: 'default' as const };
    if (score >= 60) return { label: 'Good', variant: 'secondary' as const };
    if (score >= 40) return { label: 'Fair', variant: 'outline' as const };
    return { label: 'Needs Improvement', variant: 'destructive' as const };
  };

  const rating = profileScore ? getRatingBadge(profileScore) : getRatingBadge(latestEval.overall_rating);

  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Your AI Performance Score</CardTitle>
              <CardDescription>Based on {evaluations.length} video evaluation{evaluations.length > 1 ? 's' : ''}</CardDescription>
            </div>
            <Award className="h-12 w-12 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4 mb-4">
            <div className="text-6xl font-bold text-primary">
              {profileScore || latestEval.overall_rating}
            </div>
            <div className="text-2xl text-muted-foreground pb-2">/100</div>
            <Badge variant={rating.variant} className="mb-2 text-sm px-3 py-1">
              {rating.label}
            </Badge>
          </div>
          <Progress value={profileScore || latestEval.overall_rating} className="h-3" />
        </CardContent>
      </Card>

      {/* Score Breakdown */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Communication</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getScoreColor(avgCommunication)}`}>
              {avgCommunication}/10
            </div>
            <Progress value={avgCommunication * 10} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confidence</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getScoreColor(avgConfidence)}`}>
              {avgConfidence}/10
            </div>
            <Progress value={avgConfidence * 10} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skills</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getScoreColor(avgSkill)}`}>
              {avgSkill}/10
            </div>
            <Progress value={avgSkill * 10} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clarity</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getScoreColor(avgClarity)}`}>
              {avgClarity}/10
            </div>
            <Progress value={avgClarity * 10} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Latest Evaluation Details */}
      <Card>
        <CardHeader>
          <CardTitle>Latest Evaluation Feedback</CardTitle>
          <CardDescription>
            AI-generated insights from your most recent interview
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">{latestEval.evaluation_notes}</p>
        </CardContent>
      </Card>

      {/* Evaluation History */}
      {evaluations.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Evaluation History</CardTitle>
            <CardDescription>Your performance over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {evaluations.map((evaluation, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      Evaluation {evaluations.length - index}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(evaluation.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {evaluation.overall_rating}
                    </div>
                    <Badge variant={getRatingBadge(evaluation.overall_rating).variant} className="text-xs">
                      {getRatingBadge(evaluation.overall_rating).label}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};