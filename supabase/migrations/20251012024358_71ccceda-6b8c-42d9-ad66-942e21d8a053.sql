-- Add candidate assessment and preference fields to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS years_of_experience INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS number_of_companies INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS projects_handled INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS desired_role TEXT,
ADD COLUMN IF NOT EXISTS preferred_domain TEXT,
ADD COLUMN IF NOT EXISTS knowledge_score INTEGER CHECK (knowledge_score >= 0 AND knowledge_score <= 100),
ADD COLUMN IF NOT EXISTS communication_score INTEGER CHECK (communication_score >= 0 AND communication_score <= 100),
ADD COLUMN IF NOT EXISTS behavioral_score INTEGER CHECK (behavioral_score >= 0 AND behavioral_score <= 100);

-- Create candidate soft skills table
CREATE TABLE IF NOT EXISTS public.candidate_soft_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  proficiency_level TEXT CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(candidate_id, skill_name)
);

ALTER TABLE public.candidate_soft_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own soft skills"
ON public.candidate_soft_skills FOR SELECT
USING (candidate_id = auth.uid());

CREATE POLICY "Users can manage own soft skills"
ON public.candidate_soft_skills FOR ALL
USING (candidate_id = auth.uid());

-- Extend jobs table with detailed skill requirements
ALTER TABLE public.jobs
ADD COLUMN IF NOT EXISTS required_hard_skills JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS required_soft_skills JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS preferred_skills JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS minimum_years_experience INTEGER DEFAULT 0;

-- Create job matches cache table
CREATE TABLE IF NOT EXISTS public.job_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  match_score DECIMAL(5,2) NOT NULL,
  hard_skills_score DECIMAL(5,2),
  soft_skills_score DECIMAL(5,2),
  experience_score DECIMAL(5,2),
  communication_score DECIMAL(5,2),
  score_breakdown JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(candidate_id, job_id)
);

ALTER TABLE public.job_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Candidates can view own matches"
ON public.job_matches FOR SELECT
USING (candidate_id = auth.uid());

CREATE POLICY "Employers can view matches for their jobs"
ON public.job_matches FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.jobs 
  WHERE jobs.id = job_matches.job_id 
  AND jobs.employer_id = auth.uid()
));

CREATE POLICY "System can manage matches"
ON public.job_matches FOR ALL
USING (true);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_job_matches_candidate ON public.job_matches(candidate_id, match_score DESC);
CREATE INDEX IF NOT EXISTS idx_job_matches_job ON public.job_matches(job_id, match_score DESC);
CREATE INDEX IF NOT EXISTS idx_candidate_soft_skills_candidate ON public.candidate_soft_skills(candidate_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_job_matches_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_job_matches_updated_at_trigger
BEFORE UPDATE ON public.job_matches
FOR EACH ROW
EXECUTE FUNCTION update_job_matches_updated_at();