-- Add employer-specific fields to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS industry TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS employee_count TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_description TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS designation TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS linkedin_profile TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS pincode TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;

-- Add job-specific fields to jobs table
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS employment_type TEXT;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS job_category TEXT;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS experience_level TEXT;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS num_openings INTEGER DEFAULT 1;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS application_deadline DATE;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS job_responsibilities TEXT;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS key_qualifications TEXT;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS is_draft BOOLEAN DEFAULT false;