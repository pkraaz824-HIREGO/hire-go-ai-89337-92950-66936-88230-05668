import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * GET TOP CANDIDATES FOR A JOB
 * 
 * This endpoint allows employers to get a ranked list of candidates for a specific job
 * Uses the same sophisticated matching algorithm as the candidate-side matching
 */

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { jobId, limit = 20, minScore = 50 } = await req.json();

    console.log('Fetching top candidates for job:', { jobId, limit, minScore });

    if (!jobId) {
      throw new Error('Job ID is required');
    }

    // Verify the job exists and belongs to the requesting employer
    const { data: { user } } = await supabaseClient.auth.getUser();
    
    const { data: job, error: jobError } = await supabaseClient
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .eq('employer_id', user?.id)
      .single();

    if (jobError || !job) {
      throw new Error('Job not found or access denied');
    }

    // Get all candidates
    const { data: profiles, error: profilesError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('role', 'candidate');

    if (profilesError) {
      console.error('Profiles fetch error:', profilesError);
      throw new Error('Failed to fetch candidates');
    }

    if (!profiles || profiles.length === 0) {
      return new Response(
        JSON.stringify({ 
          candidates: [], 
          message: 'No candidates found',
          total_analyzed: 0
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Calculating matches for ${profiles.length} candidates`);

    // Calculate matches for each candidate
    const candidateMatches = [];

    for (const profile of profiles) {
      try {
        // Call the matching algorithm for this candidate
        const { data: matchData, error: matchError } = await supabaseClient.functions.invoke(
          'calculate-job-matches',
          {
            body: {
              candidateId: profile.user_id,
              jobId: jobId,
              limit: 1
            }
          }
        );

        if (matchError) {
          console.error(`Match error for candidate ${profile.user_id}:`, matchError);
          continue;
        }

        if (matchData?.matches && matchData.matches.length > 0) {
          const match = matchData.matches[0];
          
          // Only include candidates above minimum score threshold
          if (match.match_score >= minScore) {
            candidateMatches.push({
              candidate_id: profile.user_id,
              full_name: profile.full_name,
              email: profile.email,
              location: profile.location,
              designation: profile.designation,
              years_of_experience: profile.years_of_experience,
              avatar_url: profile.avatar_url,
              overall_candidate_score: profile.overall_candidate_score,
              match_score: match.match_score,
              hard_skills_score: match.hard_skills_score,
              soft_skills_score: match.soft_skills_score,
              experience_score: match.experience_score,
              communication_score: match.communication_score,
              role_alignment_score: match.role_alignment_score,
              score_breakdown: match.score_breakdown
            });
          }
        }
      } catch (error) {
        console.error(`Error processing candidate ${profile.user_id}:`, error);
      }
    }

    // Sort by match score descending
    candidateMatches.sort((a, b) => b.match_score - a.match_score);

    // Limit results
    const topCandidates = candidateMatches.slice(0, limit);

    console.log(`Returning top ${topCandidates.length} candidates from ${profiles.length} analyzed`);

    return new Response(
      JSON.stringify({ 
        candidates: topCandidates,
        total_analyzed: profiles.length,
        total_qualified: candidateMatches.length,
        job_title: job.title,
        min_score_threshold: minScore
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Top candidates fetch error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        candidates: []
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
