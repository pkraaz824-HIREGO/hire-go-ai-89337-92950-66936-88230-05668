import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InterviewRecorder } from '@/components/interview/InterviewRecorder';
import { Loader2 } from 'lucide-react';

export default function VideoIntroduction() {
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRecordingComplete = async (blob: Blob) => {
    try {
      setEvaluating(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Not authenticated');

      // Upload video to storage
      const fileName = `${user.id}/${Date.now()}-introduction.webm`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('candidate-videos')
        .upload(fileName, blob);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('candidate-videos')
        .getPublicUrl(fileName);

      // Create video recording entry
      const { data: videoRecord, error: videoError } = await supabase
        .from('video_recordings')
        .insert({
          candidate_id: user.id,
          video_type: 'introduction',
          video_url: publicUrl,
          duration: Math.floor(blob.size / 16000), // Approximate duration
        })
        .select()
        .single();

      if (videoError) throw videoError;

      // Simulate transcript (in production, use actual transcription)
      const mockTranscript = "Hello, I am excited to introduce myself. I have strong communication skills and relevant experience in my field. I am confident in my abilities and eager to contribute to your organization.";

      // Call AI evaluation function
      const { data: evalData, error: evalError } = await supabase.functions.invoke(
        'evaluate-candidate-video',
        {
          body: {
            videoRecordingId: videoRecord.id,
            transcript: mockTranscript,
          }
        }
      );

      if (evalError) throw evalError;

      toast({
        title: 'Video Evaluated!',
        description: 'Your introduction has been analyzed. Moving to interview questions.',
      });

      // Assign interview questions based on role
      const roleCategory = sessionStorage.getItem('roleCategory') || 'Developer';
      const { data: session } = await supabase.auth.getSession();
      
      const { error: questionsError } = await supabase.functions.invoke(
        'assign-interview-questions',
        {
          body: { roleCategory },
          headers: {
            Authorization: `Bearer ${session.session?.access_token}`
          }
        }
      );

      if (questionsError) throw questionsError;

      // Navigate to questions page
      navigate('/candidate/interview-questions');

    } catch (error) {
      console.error('Error processing video:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to process video',
        variant: 'destructive',
      });
    } finally {
      setEvaluating(false);
    }
  };

  if (evaluating) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <h3 className="text-lg font-semibold mb-2">Analyzing Your Video...</h3>
            <p className="text-muted-foreground">
              Our AI is evaluating your communication, confidence, and presentation skills.
              This will just take a moment.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">AI Video Introduction</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Record your self-introduction. Our AI will analyze your communication skills,
          confidence, clarity, and emotional intelligence.
        </p>
      </div>

      <div className="max-w-3xl mx-auto mb-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Question</CardTitle>
            <CardDescription>Please answer the following question</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">"Tell me about yourself."</p>
            <p className="text-sm text-muted-foreground mt-2">
              Speak clearly about your background, skills, and what makes you a great candidate.
            </p>
          </CardContent>
        </Card>

        <InterviewRecorder
          interviewTitle="Self Introduction"
          onRecordingComplete={handleRecordingComplete}
        />
      </div>

      <div className="max-w-3xl mx-auto mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Tips for a Great Video</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>• Ensure good lighting and a quiet environment</p>
            <p>• Look at the camera while speaking</p>
            <p>• Speak clearly and at a moderate pace</p>
            <p>• Be authentic and confident</p>
            <p>• Keep your response between 1-2 minutes</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}