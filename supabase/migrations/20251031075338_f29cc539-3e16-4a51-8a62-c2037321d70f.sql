-- Add admin role to the existing app_role enum
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'admin';

-- Create admin_settings table for API keys and model configurations
CREATE TABLE IF NOT EXISTS public.admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on admin_settings
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can view and manage settings
CREATE POLICY "Admins can manage settings"
ON public.admin_settings
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create activity_logs table for tracking all activities
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on activity_logs
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view logs
CREATE POLICY "Admins can view all logs"
ON public.activity_logs
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- System can insert logs
CREATE POLICY "System can insert logs"
ON public.activity_logs
FOR INSERT
WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_resource ON public.activity_logs(resource_type, resource_id);

-- Insert default AI model configurations
INSERT INTO public.admin_settings (setting_key, setting_value) VALUES
('ai_models', '{
  "job_description": {
    "provider": "lovable",
    "model": "google/gemini-2.5-flash"
  },
  "job_matching": {
    "provider": "lovable",
    "model": "google/gemini-2.5-flash"
  },
  "video_transcription": {
    "provider": "lovable",
    "model": "google/gemini-2.5-flash"
  },
  "video_evaluation": {
    "provider": "lovable",
    "model": "google/gemini-2.5-flash"
  },
  "resume_insights": {
    "provider": "lovable",
    "model": "google/gemini-2.5-flash"
  }
}'::jsonb),
('api_keys', '{
  "openai_key": "",
  "deepseek_key": "",
  "custom_keys": {}
}'::jsonb)
ON CONFLICT (setting_key) DO NOTHING;

-- Grant admins access to view all tables (via RLS policies)
-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can view all jobs
CREATE POLICY "Admins can manage all jobs"
ON public.jobs
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can view all applications
CREATE POLICY "Admins can view all applications"
ON public.applications
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can view all evaluations
CREATE POLICY "Admins can view all evaluations"
ON public.ai_evaluations
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can view all video recordings
CREATE POLICY "Admins can view all videos"
ON public.video_recordings
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can manage user roles
CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));