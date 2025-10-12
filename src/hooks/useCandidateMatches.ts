import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CandidateMatch {
  candidate_id: string;
  full_name: string;
  email: string;
  location: string;
  designation: string;
  years_of_experience: number;
  avatar_url: string;
  overall_candidate_score: number;
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

export const useCandidateMatches = () => {
  const [candidates, setCandidates] = useState<CandidateMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getTopCandidates = async (
    jobId: string,
    options?: {
      limit?: number;
      minScore?: number;
    }
  ) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-top-candidates', {
        body: {
          jobId,
          limit: options?.limit || 20,
          minScore: options?.minScore || 50
        }
      });

      if (error) throw error;

      setCandidates(data.candidates || []);
      
      toast({
        title: 'Candidates Ranked Successfully',
        description: `Found ${data.total_qualified} qualified candidates from ${data.total_analyzed} analyzed`
      });

      return data.candidates;
    } catch (error: any) {
      console.error('Error fetching top candidates:', error);
      toast({
        title: 'Failed to Fetch Candidates',
        description: error.message || 'An error occurred while ranking candidates',
        variant: 'destructive'
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    candidates,
    loading,
    getTopCandidates
  };
};
