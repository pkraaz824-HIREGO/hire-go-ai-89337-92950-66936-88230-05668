-- Create video_recordings table for storing candidate video submissions
CREATE TABLE IF NOT EXISTS public.video_recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_type TEXT NOT NULL CHECK (video_type IN ('introduction', 'question_response')),
  question_id UUID,
  video_url TEXT NOT NULL,
  duration INTEGER,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create ai_evaluations table for storing AI analysis results
CREATE TABLE IF NOT EXISTS public.ai_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_recording_id UUID NOT NULL REFERENCES public.video_recordings(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  communication_score INTEGER CHECK (communication_score >= 0 AND communication_score <= 10),
  confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 10),
  skill_score INTEGER CHECK (skill_score >= 0 AND skill_score <= 10),
  clarity_score INTEGER CHECK (clarity_score >= 0 AND clarity_score <= 10),
  emotion_analysis JSONB,
  transcript TEXT,
  overall_rating INTEGER CHECK (overall_rating >= 0 AND overall_rating <= 100),
  evaluation_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create interview_questions table for role-based questions
CREATE TABLE IF NOT EXISTS public.interview_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_category TEXT NOT NULL,
  question_text TEXT NOT NULL,
  question_type TEXT CHECK (question_type IN ('technical', 'behavioral', 'situational')),
  difficulty_level TEXT CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create candidate_question_assignments table
CREATE TABLE IF NOT EXISTS public.candidate_question_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.interview_questions(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'skipped'))
);

-- Update profiles table with additional candidate fields
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS date_of_birth DATE,
  ADD COLUMN IF NOT EXISTS education_background TEXT,
  ADD COLUMN IF NOT EXISTS previous_experience TEXT,
  ADD COLUMN IF NOT EXISTS profile_completion_status TEXT DEFAULT 'incomplete' CHECK (profile_completion_status IN ('incomplete', 'profile_complete', 'intro_complete', 'questions_complete', 'evaluation_complete')),
  ADD COLUMN IF NOT EXISTS overall_candidate_score INTEGER CHECK (overall_candidate_score >= 0 AND overall_candidate_score <= 100);

-- Update applications table to include AI recommendation
ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS ai_recommendation_score INTEGER CHECK (ai_recommendation_score >= 0 AND ai_recommendation_score <= 100),
  ADD COLUMN IF NOT EXISTS ai_recommendation_notes TEXT;

-- Create storage bucket for video recordings
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('candidate-videos', 'candidate-videos', false, 524288000)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on new tables
ALTER TABLE public.video_recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_question_assignments ENABLE ROW LEVEL SECURITY;

-- RLS policies for video_recordings
CREATE POLICY "Candidates can view their own videos"
  ON public.video_recordings FOR SELECT
  USING (candidate_id = auth.uid());

CREATE POLICY "Candidates can insert their own videos"
  ON public.video_recordings FOR INSERT
  WITH CHECK (candidate_id = auth.uid());

CREATE POLICY "Employers can view candidate videos"
  ON public.video_recordings FOR SELECT
  USING (
    has_role(auth.uid(), 'employer'::app_role) AND
    EXISTS (
      SELECT 1 FROM public.applications
      WHERE applications.candidate_id = video_recordings.candidate_id
    )
  );

-- RLS policies for ai_evaluations
CREATE POLICY "Candidates can view their own evaluations"
  ON public.ai_evaluations FOR SELECT
  USING (candidate_id = auth.uid());

CREATE POLICY "System can insert evaluations"
  ON public.ai_evaluations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Employers can view candidate evaluations"
  ON public.ai_evaluations FOR SELECT
  USING (
    has_role(auth.uid(), 'employer'::app_role) AND
    EXISTS (
      SELECT 1 FROM public.applications
      WHERE applications.candidate_id = ai_evaluations.candidate_id
    )
  );

-- RLS policies for interview_questions
CREATE POLICY "Everyone can view questions"
  ON public.interview_questions FOR SELECT
  USING (true);

CREATE POLICY "Employers can manage questions"
  ON public.interview_questions FOR ALL
  USING (has_role(auth.uid(), 'employer'::app_role));

-- RLS policies for candidate_question_assignments
CREATE POLICY "Candidates can view their assignments"
  ON public.candidate_question_assignments FOR SELECT
  USING (candidate_id = auth.uid());

CREATE POLICY "Candidates can update their assignments"
  ON public.candidate_question_assignments FOR UPDATE
  USING (candidate_id = auth.uid());

CREATE POLICY "System can create assignments"
  ON public.candidate_question_assignments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Employers can view candidate assignments"
  ON public.candidate_question_assignments FOR SELECT
  USING (
    has_role(auth.uid(), 'employer'::app_role) AND
    EXISTS (
      SELECT 1 FROM public.applications
      WHERE applications.candidate_id = candidate_question_assignments.candidate_id
    )
  );

-- Storage policies for candidate videos
CREATE POLICY "Candidates can upload their videos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'candidate-videos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Candidates can view their videos"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'candidate-videos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Employers can view candidate videos"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'candidate-videos' AND
    has_role(auth.uid(), 'employer'::app_role)
  );

-- Insert default interview questions for different roles
INSERT INTO public.interview_questions (role_category, question_text, question_type, difficulty_level)
VALUES
  ('Developer', 'Describe your experience with modern web development frameworks and your approach to building scalable applications.', 'technical', 'medium'),
  ('Developer', 'How do you handle debugging complex issues in production environments?', 'technical', 'hard'),
  ('Customer Support', 'How would you handle an angry customer who is dissatisfied with our product?', 'behavioral', 'medium'),
  ('Customer Support', 'Describe a time when you went above and beyond to help a customer.', 'behavioral', 'medium'),
  ('HR', 'What strategies do you use to identify and attract top talent?', 'behavioral', 'medium'),
  ('HR', 'How do you handle conflicts between team members?', 'situational', 'medium'),
  ('Sales', 'How do you approach building relationships with potential clients?', 'behavioral', 'medium'),
  ('Sales', 'Describe your most successful sales pitch and why it worked.', 'behavioral', 'hard')
ON CONFLICT DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_video_recordings_candidate ON public.video_recordings(candidate_id);
CREATE INDEX IF NOT EXISTS idx_ai_evaluations_candidate ON public.ai_evaluations(candidate_id);
CREATE INDEX IF NOT EXISTS idx_ai_evaluations_video ON public.ai_evaluations(video_recording_id);
CREATE INDEX IF NOT EXISTS idx_question_assignments_candidate ON public.candidate_question_assignments(candidate_id);
CREATE INDEX IF NOT EXISTS idx_question_assignments_status ON public.candidate_question_assignments(status);