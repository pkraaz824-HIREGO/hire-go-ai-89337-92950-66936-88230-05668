import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    const { jobId } = await req.json();

    // Get job details
    const { data: job, error: jobError } = await supabaseClient
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (jobError) throw jobError;

    // Get all candidates
    const { data: profiles, error: profilesError } = await supabaseClient
      .from('profiles')
      .select('*, candidate_skills(*)')
      .eq('role', 'candidate');

    if (profilesError) throw profilesError;

    // Simple matching algorithm based on skills
    const matches = profiles.map((profile: any) => {
      const candidateSkills = profile.candidate_skills.map((s: any) => s.skill_name.toLowerCase());
      const jobSkills = job.skills?.map((s: string) => s.toLowerCase()) || [];
      
      // Calculate match score
      const matchingSkills = candidateSkills.filter((skill: string) => 
        jobSkills.some((jobSkill: string) => jobSkill.includes(skill) || skill.includes(jobSkill))
      );
      
      const matchScore = Math.round((matchingSkills.length / Math.max(jobSkills.length, 1)) * 100);

      return {
        candidate_id: profile.user_id,
        full_name: profile.full_name,
        location: profile.location,
        match_score: matchScore,
        matching_skills: matchingSkills,
      };
    });

    // Sort by match score
    matches.sort((a, b) => b.match_score - a.match_score);

    return new Response(
      JSON.stringify({ matches: matches.slice(0, 10) }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
