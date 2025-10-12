import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * ADVANCED JOB-CANDIDATE MATCHING ALGORITHM
 * 
 * This algorithm calculates match scores between candidates and jobs using a weighted scoring system:
 * - Hard Skills Match: 40% weight
 * - Soft Skills Match: 20% weight
 * - Experience Match: 20% weight
 * - Communication & Behavioral: 15% weight
 * - Role/Preference Alignment: 5% weight
 * 
 * Scores are normalized to 0-100 for each candidate-job pair
 */

interface CandidateProfile {
  user_id: string;
  full_name: string;
  email: string;
  years_of_experience: number;
  number_of_companies: number;
  projects_handled: number;
  desired_role: string;
  preferred_domain: string;
  knowledge_score: number;
  communication_score: number;
  behavioral_score: number;
  hard_skills: Array<{ skill_name: string; proficiency_level: string; years_experience: number }>;
  soft_skills: Array<{ skill_name: string; proficiency_level: string }>;
}

interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  employment_type: string;
  experience_level: string;
  salary_min: number;
  salary_max: number;
  minimum_years_experience: number;
  skills: string[]; // Legacy field
  required_hard_skills: Array<{ skill: string; weight: number; mandatory: boolean }>;
  required_soft_skills: Array<{ skill: string; weight: number; mandatory: boolean }>;
  preferred_skills: string[];
}

interface MatchScore {
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

// Proficiency level mapping for scoring
const PROFICIENCY_WEIGHTS = {
  'beginner': 0.4,
  'intermediate': 0.7,
  'advanced': 0.9,
  'expert': 1.0
};

// Weight configuration for the matching algorithm
const WEIGHTS = {
  HARD_SKILLS: 0.40,
  SOFT_SKILLS: 0.20,
  EXPERIENCE: 0.20,
  COMMUNICATION_BEHAVIORAL: 0.15,
  ROLE_ALIGNMENT: 0.05
};

/**
 * Calculate hard skills match score
 * Considers skill match, proficiency level, and mandatory requirements
 */
function calculateHardSkillsScore(
  candidateSkills: CandidateProfile['hard_skills'],
  requiredSkills: JobPosting['required_hard_skills'],
  legacySkills: string[]
): { score: number; breakdown: any } {
  if (!requiredSkills || requiredSkills.length === 0) {
    // Fallback to legacy skills format
    if (!legacySkills || legacySkills.length === 0) return { score: 100, breakdown: {} };
    
    const candidateSkillNames = candidateSkills.map(s => s.skill_name.toLowerCase());
    const matchedCount = legacySkills.filter(skill => 
      candidateSkillNames.some(cs => cs.includes(skill.toLowerCase()) || skill.toLowerCase().includes(cs))
    ).length;
    
    return {
      score: Math.min(100, (matchedCount / legacySkills.length) * 100),
      breakdown: { matched_skills: matchedCount, total_required: legacySkills.length }
    };
  }

  let totalWeight = 0;
  let achievedWeight = 0;
  const matchedSkills: string[] = [];
  const missingMandatory: string[] = [];
  let penalty = 0;

  for (const required of requiredSkills) {
    const weight = required.weight || 1;
    totalWeight += weight;

    // Find matching candidate skill (fuzzy match)
    const candidateSkill = candidateSkills.find(cs => 
      cs.skill_name.toLowerCase().includes(required.skill.toLowerCase()) ||
      required.skill.toLowerCase().includes(cs.skill_name.toLowerCase())
    );

    if (candidateSkill) {
      // Calculate score based on proficiency
      const proficiencyMultiplier = PROFICIENCY_WEIGHTS[candidateSkill.proficiency_level as keyof typeof PROFICIENCY_WEIGHTS] || 0.5;
      
      // Years of experience bonus (up to 20% boost)
      const experienceBonus = Math.min(0.2, (candidateSkill.years_experience || 0) / 10 * 0.2);
      
      achievedWeight += weight * (proficiencyMultiplier + experienceBonus);
      matchedSkills.push(required.skill);
    } else if (required.mandatory) {
      // Heavy penalty for missing mandatory skills
      penalty += 15;
      missingMandatory.push(required.skill);
    }
  }

  const baseScore = totalWeight > 0 ? (achievedWeight / totalWeight) * 100 : 0;
  const finalScore = Math.max(0, baseScore - penalty);

  return {
    score: finalScore,
    breakdown: {
      matched_hard_skills: matchedSkills,
      missing_mandatory_hard_skills: missingMandatory,
      penalty_applied: penalty
    }
  };
}

/**
 * Calculate soft skills match score
 */
function calculateSoftSkillsScore(
  candidateSkills: CandidateProfile['soft_skills'],
  requiredSkills: JobPosting['required_soft_skills']
): { score: number; breakdown: any } {
  if (!requiredSkills || requiredSkills.length === 0) {
    return { score: 100, breakdown: {} };
  }

  let totalWeight = 0;
  let achievedWeight = 0;
  const matchedSkills: string[] = [];
  const missingMandatory: string[] = [];
  let penalty = 0;

  for (const required of requiredSkills) {
    const weight = required.weight || 1;
    totalWeight += weight;

    const candidateSkill = candidateSkills.find(cs => 
      cs.skill_name.toLowerCase().includes(required.skill.toLowerCase()) ||
      required.skill.toLowerCase().includes(cs.skill_name.toLowerCase())
    );

    if (candidateSkill) {
      const proficiencyMultiplier = PROFICIENCY_WEIGHTS[candidateSkill.proficiency_level as keyof typeof PROFICIENCY_WEIGHTS] || 0.7;
      achievedWeight += weight * proficiencyMultiplier;
      matchedSkills.push(required.skill);
    } else if (required.mandatory) {
      penalty += 10;
      missingMandatory.push(required.skill);
    }
  }

  const baseScore = totalWeight > 0 ? (achievedWeight / totalWeight) * 100 : 0;
  const finalScore = Math.max(0, baseScore - penalty);

  return {
    score: finalScore,
    breakdown: {
      matched_soft_skills: matchedSkills,
      missing_mandatory_soft_skills: missingMandatory,
      penalty_applied: penalty
    }
  };
}

/**
 * Calculate experience match score
 * Considers years of experience, number of companies, and projects
 */
function calculateExperienceScore(
  candidate: CandidateProfile,
  job: JobPosting
): { score: number; breakdown: any } {
  const minYears = job.minimum_years_experience || 0;
  const candidateYears = candidate.years_of_experience || 0;

  let score = 0;
  let experienceGap = 0;

  if (candidateYears >= minYears) {
    // Candidate meets or exceeds requirement
    score = 100;
    
    // Slight bonus for overqualification (up to 10 points)
    const overqualificationBonus = Math.min(10, ((candidateYears - minYears) / minYears) * 10);
    score = Math.min(110, score + overqualificationBonus);
  } else {
    // Candidate is under-qualified
    experienceGap = minYears - candidateYears;
    const gapRatio = candidateYears / minYears;
    score = gapRatio * 80; // Max 80 points if under-qualified
  }

  // Bonus for diverse company experience (up to 10 points)
  const companyBonus = Math.min(10, (candidate.number_of_companies || 0) * 2);
  
  // Bonus for project portfolio (up to 10 points)
  const projectBonus = Math.min(10, (candidate.projects_handled || 0) * 1);

  const finalScore = Math.min(100, score + companyBonus + projectBonus);

  return {
    score: finalScore,
    breakdown: {
      experience_gap: experienceGap,
      company_bonus: companyBonus,
      project_bonus: projectBonus
    }
  };
}

/**
 * Calculate communication and behavioral scores
 */
function calculateCommunicationBehavioralScore(
  candidate: CandidateProfile
): { score: number; breakdown: any } {
  const commScore = candidate.communication_score || 0;
  const behavioralScore = candidate.behavioral_score || 0;
  const knowledgeScore = candidate.knowledge_score || 0;

  // Weighted average: communication (40%), behavioral (30%), knowledge (30%)
  const score = (commScore * 0.4) + (behavioralScore * 0.3) + (knowledgeScore * 0.3);

  return {
    score,
    breakdown: {
      communication_score: commScore,
      behavioral_score: behavioralScore,
      knowledge_score: knowledgeScore
    }
  };
}

/**
 * Calculate role alignment and preference bonus
 */
function calculateRoleAlignmentScore(
  candidate: CandidateProfile,
  job: JobPosting
): { score: number; breakdown: any } {
  let score = 50; // Base score
  const bonuses: string[] = [];

  // Check if desired role matches job title
  if (candidate.desired_role) {
    const desiredRoleLower = candidate.desired_role.toLowerCase();
    const jobTitleLower = job.title.toLowerCase();
    
    if (desiredRoleLower.includes(jobTitleLower) || jobTitleLower.includes(desiredRoleLower)) {
      score += 30;
      bonuses.push('Desired role matches job title');
    }
  }

  // Check if preferred domain matches (if available in job description)
  if (candidate.preferred_domain && job.description) {
    const preferredDomainLower = candidate.preferred_domain.toLowerCase();
    const jobDescLower = job.description.toLowerCase();
    
    if (jobDescLower.includes(preferredDomainLower)) {
      score += 20;
      bonuses.push('Preferred domain matches job domain');
    }
  }

  return {
    score: Math.min(100, score),
    breakdown: { bonuses_applied: bonuses }
  };
}

/**
 * Calculate preferred skills bonus
 */
function calculatePreferredSkillsBonus(
  candidateHardSkills: CandidateProfile['hard_skills'],
  preferredSkills: string[]
): { bonus: number; matched: string[] } {
  if (!preferredSkills || preferredSkills.length === 0) {
    return { bonus: 0, matched: [] };
  }

  const candidateSkillNames = candidateHardSkills.map(s => s.skill_name.toLowerCase());
  const matchedPreferred = preferredSkills.filter(skill => 
    candidateSkillNames.some(cs => cs.includes(skill.toLowerCase()) || skill.toLowerCase().includes(cs))
  );

  // Each preferred skill match adds 2 points, up to 10 points max
  const bonus = Math.min(10, matchedPreferred.length * 2);

  return { bonus, matched: matchedPreferred };
}

/**
 * Main matching algorithm - calculates overall match score
 */
function calculateMatchScore(
  candidate: CandidateProfile,
  job: JobPosting
): MatchScore {
  // Calculate individual component scores
  const hardSkills = calculateHardSkillsScore(
    candidate.hard_skills,
    job.required_hard_skills,
    job.skills || []
  );

  const softSkills = calculateSoftSkillsScore(
    candidate.soft_skills,
    job.required_soft_skills
  );

  const experience = calculateExperienceScore(candidate, job);

  const communicationBehavioral = calculateCommunicationBehavioralScore(candidate);

  const roleAlignment = calculateRoleAlignmentScore(candidate, job);

  // Calculate preferred skills bonus
  const preferredBonus = calculatePreferredSkillsBonus(
    candidate.hard_skills,
    job.preferred_skills || []
  );

  // Calculate weighted total score
  let totalScore = (
    (hardSkills.score * WEIGHTS.HARD_SKILLS) +
    (softSkills.score * WEIGHTS.SOFT_SKILLS) +
    (experience.score * WEIGHTS.EXPERIENCE) +
    (communicationBehavioral.score * WEIGHTS.COMMUNICATION_BEHAVIORAL) +
    (roleAlignment.score * WEIGHTS.ROLE_ALIGNMENT)
  );

  // Add preferred skills bonus (can push score above 100)
  totalScore += preferredBonus.bonus;

  // Normalize to 0-100 range
  const finalScore = Math.max(0, Math.min(100, totalScore));

  // Compile penalties and bonuses
  const penalties: string[] = [];
  const bonuses: string[] = [];

  if (hardSkills.breakdown.missing_mandatory_hard_skills?.length > 0) {
    penalties.push(`Missing ${hardSkills.breakdown.missing_mandatory_hard_skills.length} mandatory hard skills`);
  }
  if (softSkills.breakdown.missing_mandatory_soft_skills?.length > 0) {
    penalties.push(`Missing ${softSkills.breakdown.missing_mandatory_soft_skills.length} mandatory soft skills`);
  }
  if (experience.breakdown.experience_gap > 0) {
    penalties.push(`${experience.breakdown.experience_gap} years experience gap`);
  }
  if (preferredBonus.matched.length > 0) {
    bonuses.push(`${preferredBonus.matched.length} preferred skills matched`);
  }
  if (roleAlignment.breakdown.bonuses_applied?.length > 0) {
    bonuses.push(...roleAlignment.breakdown.bonuses_applied);
  }

  return {
    job_id: job.id,
    job_title: job.title,
    company: job.company,
    location: job.location,
    match_score: Math.round(finalScore * 100) / 100,
    hard_skills_score: Math.round(hardSkills.score * 100) / 100,
    soft_skills_score: Math.round(softSkills.score * 100) / 100,
    experience_score: Math.round(experience.score * 100) / 100,
    communication_score: Math.round(communicationBehavioral.score * 100) / 100,
    role_alignment_score: Math.round(roleAlignment.score * 100) / 100,
    score_breakdown: {
      matched_hard_skills: hardSkills.breakdown.matched_hard_skills || [],
      missing_mandatory_hard_skills: hardSkills.breakdown.missing_mandatory_hard_skills || [],
      matched_soft_skills: softSkills.breakdown.matched_soft_skills || [],
      missing_mandatory_soft_skills: softSkills.breakdown.missing_mandatory_soft_skills || [],
      matched_preferred_skills: preferredBonus.matched,
      experience_gap: experience.breakdown.experience_gap,
      penalties_applied: penalties,
      bonuses_applied: bonuses
    }
  };
}

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

    const { candidateId, jobId, limit = 10, filters } = await req.json();

    console.log('Calculating matches for:', { candidateId, jobId, limit, filters });

    // Fetch candidate profile with skills
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('user_id', candidateId)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      throw new Error('Candidate not found');
    }

    // Fetch candidate hard skills
    const { data: hardSkills, error: hardSkillsError } = await supabaseClient
      .from('candidate_skills')
      .select('*')
      .eq('candidate_id', candidateId);

    if (hardSkillsError) {
      console.error('Hard skills fetch error:', hardSkillsError);
    }

    // Fetch candidate soft skills
    const { data: softSkills, error: softSkillsError } = await supabaseClient
      .from('candidate_soft_skills')
      .select('*')
      .eq('candidate_id', candidateId);

    if (softSkillsError) {
      console.error('Soft skills fetch error:', softSkillsError);
    }

    const candidate: CandidateProfile = {
      user_id: profile.user_id,
      full_name: profile.full_name || '',
      email: profile.email || '',
      years_of_experience: profile.years_of_experience || 0,
      number_of_companies: profile.number_of_companies || 0,
      projects_handled: profile.projects_handled || 0,
      desired_role: profile.desired_role || '',
      preferred_domain: profile.preferred_domain || '',
      knowledge_score: profile.knowledge_score || 0,
      communication_score: profile.communication_score || 0,
      behavioral_score: profile.behavioral_score || 0,
      hard_skills: hardSkills || [],
      soft_skills: softSkills || []
    };

    // Fetch jobs (specific job or all active jobs)
    let jobsQuery = supabaseClient
      .from('jobs')
      .select('*')
      .eq('status', 'active');

    if (jobId) {
      jobsQuery = jobsQuery.eq('id', jobId);
    }

    // Apply filters if provided
    if (filters) {
      if (filters.experience_level) {
        jobsQuery = jobsQuery.eq('experience_level', filters.experience_level);
      }
      if (filters.location) {
        jobsQuery = jobsQuery.ilike('location', `%${filters.location}%`);
      }
      if (filters.job_category) {
        jobsQuery = jobsQuery.eq('job_category', filters.job_category);
      }
    }

    const { data: jobs, error: jobsError } = await jobsQuery;

    if (jobsError) {
      console.error('Jobs fetch error:', jobsError);
      throw new Error('Failed to fetch jobs');
    }

    if (!jobs || jobs.length === 0) {
      return new Response(
        JSON.stringify({ matches: [], message: 'No active jobs found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Calculating matches for ${jobs.length} jobs`);

    // Calculate match scores for all jobs
    const matches: MatchScore[] = jobs.map(job => calculateMatchScore(candidate, job));

    // Sort by match score descending
    matches.sort((a, b) => b.match_score - a.match_score);

    // Limit results
    const topMatches = matches.slice(0, limit);

    // Cache results in database for performance
    for (const match of topMatches) {
      await supabaseClient
        .from('job_matches')
        .upsert({
          candidate_id: candidateId,
          job_id: match.job_id,
          match_score: match.match_score,
          hard_skills_score: match.hard_skills_score,
          soft_skills_score: match.soft_skills_score,
          experience_score: match.experience_score,
          communication_score: match.communication_score,
          score_breakdown: match.score_breakdown
        }, {
          onConflict: 'candidate_id,job_id'
        });
    }

    console.log(`Returning top ${topMatches.length} matches`);

    return new Response(
      JSON.stringify({ 
        matches: topMatches,
        total_jobs_analyzed: jobs.length,
        candidate_name: candidate.full_name
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Match calculation error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        matches: []
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
