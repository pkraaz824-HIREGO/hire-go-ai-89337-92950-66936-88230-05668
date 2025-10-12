import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface JobMatch {
  job_id: string;
  job_title: string;
  company: string;
  location: string;
  match_score: number;
  hard_skills_score: number;
  soft_skills_score: number;
  experience_score: number;
  communication_score: number;
  role_alignment_score: number;
  score_breakdown: {
    matched_hard_skills: string[];
    missing_mandatory_hard_skills: string[];
    matched_soft_skills: string[];
    missing_mandatory_soft_skills: string[];
    matched_preferred_skills: string[];
    experience_gap: number;
    penalties_applied: string[];
    bonuses_applied: string[];
  };
}

export interface MatchFilters {
  experience_level?: string;
  location?: string;
  job_category?: string;
}

export const useJobMatches = () => {
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const calculateMatches = async (
    candidateId: string,
    options?: {
      jobId?: string;
      limit?: number;
      filters?: MatchFilters;
    }
  ) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('calculate-job-matches', {
        body: {
          candidateId,
          jobId: options?.jobId,
          limit: options?.limit || 10,
          filters: options?.filters
        }
      });

      if (error) throw error;

      setMatches(data.matches || []);
      return data.matches;
    } catch (error: any) {
      console.error('Error calculating job matches:', error);
      toast({
        title: 'Failed to Calculate Matches',
        description: error.message || 'An error occurred while calculating job matches',
        variant: 'destructive'
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getMatchFromCache = async (candidateId: string, limit = 10) => {
    try {
      const { data, error } = await supabase
        .from('job_matches')
        .select(`
          *,
          jobs:job_id (
            id,
            title,
            company,
            location,
            description,
            employment_type,
            salary_min,
            salary_max,
            skills
          )
        `)
        .eq('candidate_id', candidateId)
        .order('match_score', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data;
    } catch (error: any) {
      console.error('Error fetching cached matches:', error);
      return [];
    }
  };

  return {
    matches,
    loading,
    calculateMatches,
    getMatchFromCache
  };
};
