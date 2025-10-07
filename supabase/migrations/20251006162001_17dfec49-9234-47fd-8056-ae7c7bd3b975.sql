-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  role TEXT CHECK (role IN ('candidate', 'employer')),
  avatar_url TEXT,
  company_name TEXT,
  location TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create jobs table
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID NOT NULL,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  salary_min INTEGER,
  salary_max INTEGER,
  description TEXT,
  requirements TEXT[],
  skills TEXT[],
  status TEXT CHECK (status IN ('draft', 'active', 'closed')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create applications table
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL,
  status TEXT CHECK (status IN ('applied', 'under_review', 'shortlisted', 'interview_scheduled', 'offered', 'rejected')) DEFAULT 'applied',
  resume_url TEXT,
  cover_letter TEXT,
  match_score INTEGER,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create interviews table
CREATE TABLE public.interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL,
  employer_id UUID NOT NULL,
  job_title TEXT NOT NULL,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  status TEXT CHECK (status IN ('upcoming', 'live', 'completed', 'cancelled')) DEFAULT 'upcoming',
  recording_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create candidate_skills table
CREATE TABLE public.candidate_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL,
  skill_name TEXT NOT NULL,
  proficiency_level TEXT CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  years_experience INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_skills ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Jobs policies
CREATE POLICY "Anyone can view active jobs" ON public.jobs FOR SELECT USING (status = 'active' OR employer_id = auth.uid());
CREATE POLICY "Employers can create jobs" ON public.jobs FOR INSERT WITH CHECK (employer_id = auth.uid());
CREATE POLICY "Employers can update own jobs" ON public.jobs FOR UPDATE USING (employer_id = auth.uid());
CREATE POLICY "Employers can delete own jobs" ON public.jobs FOR DELETE USING (employer_id = auth.uid());

-- Applications policies
CREATE POLICY "Candidates can view own applications" ON public.applications FOR SELECT USING (candidate_id = auth.uid());
CREATE POLICY "Employers can view applications for their jobs" ON public.applications FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.jobs WHERE jobs.id = applications.job_id AND jobs.employer_id = auth.uid())
);
CREATE POLICY "Candidates can create applications" ON public.applications FOR INSERT WITH CHECK (candidate_id = auth.uid());
CREATE POLICY "Candidates can update own applications" ON public.applications FOR UPDATE USING (candidate_id = auth.uid());
CREATE POLICY "Employers can update applications for their jobs" ON public.applications FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.jobs WHERE jobs.id = applications.job_id AND jobs.employer_id = auth.uid())
);

-- Interviews policies
CREATE POLICY "Users can view own interviews" ON public.interviews FOR SELECT USING (
  candidate_id = auth.uid() OR employer_id = auth.uid()
);
CREATE POLICY "Employers can create interviews" ON public.interviews FOR INSERT WITH CHECK (employer_id = auth.uid());
CREATE POLICY "Users can update own interviews" ON public.interviews FOR UPDATE USING (
  candidate_id = auth.uid() OR employer_id = auth.uid()
);

-- Candidate skills policies
CREATE POLICY "Anyone can view candidate skills" ON public.candidate_skills FOR SELECT USING (true);
CREATE POLICY "Candidates can manage own skills" ON public.candidate_skills FOR ALL USING (candidate_id = auth.uid());

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_interviews_updated_at BEFORE UPDATE ON public.interviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();