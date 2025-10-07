-- Create enum for user roles (CRITICAL SECURITY: Separate table for roles)
CREATE TYPE public.app_role AS ENUM ('candidate', 'employer', 'admin');

-- Create user_roles table for secure role management
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users cannot modify roles"
  ON public.user_roles
  FOR ALL
  USING (false);

-- Function to automatically create profile and assign role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role app_role;
BEGIN
  -- Get role from metadata, default to 'candidate'
  user_role := COALESCE(
    (NEW.raw_user_meta_data->>'role')::app_role,
    'candidate'::app_role
  );

  -- Insert into user_roles table
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role);

  -- Insert into profiles table
  INSERT INTO public.profiles (
    user_id,
    email,
    full_name,
    role
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    user_role::text
  );

  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Update profiles table policies to check roles properly
DROP POLICY IF EXISTS "Candidates can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Employers can view profiles" ON public.profiles;

CREATE POLICY "Anyone authenticated can view profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Update jobs table policies
DROP POLICY IF EXISTS "Employers can create jobs" ON public.jobs;
CREATE POLICY "Employers can create jobs"
  ON public.jobs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    employer_id = auth.uid() AND
    public.has_role(auth.uid(), 'employer'::app_role)
  );

-- Update applications table policies
DROP POLICY IF EXISTS "Candidates can create applications" ON public.applications;
CREATE POLICY "Candidates can create applications"
  ON public.applications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    candidate_id = auth.uid() AND
    public.has_role(auth.uid(), 'candidate'::app_role)
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_jobs_employer_id ON public.jobs(employer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_applications_candidate_id ON public.applications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON public.applications(job_id);
CREATE INDEX IF NOT EXISTS idx_interviews_candidate_id ON public.interviews(candidate_id);
CREATE INDEX IF NOT EXISTS idx_interviews_employer_id ON public.interviews(employer_id);