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

    const { candidateId, resumeText } = await req.json();

    if (!candidateId || !resumeText) {
      throw new Error('Missing candidate ID or resume text');
    }

    // Simple skill extraction (in production, use AI for better extraction)
    const commonSkills = [
      'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java',
      'C++', 'SQL', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes',
      'Git', 'Agile', 'Scrum', 'REST API', 'GraphQL', 'HTML', 'CSS',
      'Tailwind', 'Vue', 'Angular', 'Express', 'Django', 'Flask'
    ];

    const extractedSkills = commonSkills.filter(skill => 
      resumeText.toLowerCase().includes(skill.toLowerCase())
    );

    // Calculate experience level based on resume length and content
    const experienceIndicators = ['years', 'senior', 'lead', 'principal', 'architect'];
    const hasExperienceIndicators = experienceIndicators.some(indicator =>
      resumeText.toLowerCase().includes(indicator)
    );

    const proficiencyLevel = hasExperienceIndicators ? 'advanced' : 'intermediate';

    // Store extracted skills
    const skillInserts = extractedSkills.map(skill => ({
      candidate_id: candidateId,
      skill_name: skill,
      proficiency_level: proficiencyLevel,
      years_experience: hasExperienceIndicators ? 3 : 1,
    }));

    if (skillInserts.length > 0) {
      const { error: skillsError } = await supabaseClient
        .from('candidate_skills')
        .insert(skillInserts);

      if (skillsError && !skillsError.message.includes('duplicate')) {
        throw skillsError;
      }
    }

    const insights = {
      extracted_skills: extractedSkills,
      total_skills: extractedSkills.length,
      experience_level: proficiencyLevel,
      recommendations: [
        'Add more quantifiable achievements',
        'Include relevant certifications',
        'Highlight leadership experience',
      ],
    };

    return new Response(
      JSON.stringify({ success: true, insights }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
