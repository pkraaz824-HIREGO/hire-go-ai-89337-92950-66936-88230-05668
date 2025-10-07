import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InterviewRecorder } from '@/components/interview/InterviewRecorder';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  difficulty_level: string;
}

interface Assignment {
  id: string;
  question_id: string;
  status: string;
  interview_questions: Question;
}

export default function InterviewQuestions() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('candidate_question_assignments')
        .select(`
          id,
          question_id,
          status,
          interview_questions (
            id,
            question_text,
            question_type,
            difficulty_level
          )
        `)
        .eq('candidate_id', user.id)
        .order('assigned_at');

      if (error) throw error;
      setAssignments(data as Assignment[]);

      // Find first pending question
      const firstPending = (data as Assignment[]).findIndex(a => a.status === 'pending');
      if (firstPending >= 0) {
        setCurrentIndex(firstPending);
      }
    } catch (error) {
      console.error('Error loading questions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load interview questions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRecordingComplete = async (blob: Blob) => {
    try {
      setProcessing(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const currentAssignment = assignments[currentIndex];
      const currentQuestion = currentAssignment.interview_questions;

      // Upload video
      const fileName = `${user.id}/${Date.now()}-question-${currentQuestion.id}.webm`;
      const { error: uploadError } = await supabase.storage
        .from('candidate-videos')
        .upload(fileName, blob);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('candidate-videos')
        .getPublicUrl(fileName);

      // Create video recording
      const { data: videoRecord, error: videoError } = await supabase
        .from('video_recordings')
        .insert({
          candidate_id: user.id,
          video_type: 'question_response',
          question_id: currentQuestion.id,
          video_url: publicUrl,
        })
        .select()
        .single();

      if (videoError) throw videoError;

      // Simulate transcript
      const mockTranscript = `This is my answer to the question about ${currentQuestion.question_type}. I have relevant experience and skills in this area.`;

      // Evaluate video
      await supabase.functions.invoke('evaluate-candidate-video', {
        body: {
          videoRecordingId: videoRecord.id,
          transcript: mockTranscript,
          questionText: currentQuestion.question_text,
        }
      });

      // Mark as completed
      await supabase
        .from('candidate_question_assignments')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', currentAssignment.id);

      toast({
        title: 'Response Recorded!',
        description: 'Your answer has been evaluated.',
      });

      // Move to next question or complete
      if (currentIndex < assignments.length - 1) {
        setCurrentIndex(currentIndex + 1);
        await loadQuestions();
      } else {
        // All questions completed
        await supabase
          .from('profiles')
          .update({ profile_completion_status: 'evaluation_complete' })
          .eq('user_id', user.id);

        toast({
          title: 'Interview Complete!',
          description: 'All questions answered. Check your dashboard for results.',
        });

        navigate('/candidate/dashboard');
      }
    } catch (error) {
      console.error('Error processing response:', error);
      toast({
        title: 'Error',
        description: 'Failed to process your response',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No questions assigned yet.</p>
            <Button onClick={() => navigate('/candidate/dashboard')} className="mt-4">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentAssignment = assignments[currentIndex];
  const currentQuestion = currentAssignment.interview_questions;
  const progress = ((assignments.filter(a => a.status === 'completed').length) / assignments.length) * 100;

  if (processing) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <h3 className="text-lg font-semibold mb-2">Analyzing Your Response...</h3>
            <p className="text-muted-foreground">
              Our AI is evaluating your answer. Please wait.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Interview Questions</h1>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Question {currentIndex + 1} of {assignments.length}
            </span>
            <span className="font-medium">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} />
        </div>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Question {currentIndex + 1}</CardTitle>
                <CardDescription>
                  {currentQuestion.question_type} • {currentQuestion.difficulty_level}
                </CardDescription>
              </div>
              {currentAssignment.status === 'completed' && (
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium mb-4">{currentQuestion.question_text}</p>
            <p className="text-sm text-muted-foreground">
              Take your time to think about your answer, then record your response.
            </p>
          </CardContent>
        </Card>

        {currentAssignment.status === 'pending' && (
          <InterviewRecorder
            interviewTitle={`Question ${currentIndex + 1}`}
            onRecordingComplete={handleRecordingComplete}
          />
        )}

        <Card>
          <CardHeader>
            <CardTitle>Recording Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>• Structure your answer with a clear beginning, middle, and end</p>
            <p>• Use specific examples from your experience</p>
            <p>• Speak confidently and maintain eye contact with the camera</p>
            <p>• Keep your answer concise and relevant (2-3 minutes)</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}