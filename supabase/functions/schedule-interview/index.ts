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

    const { 
      applicationId, 
      candidateId, 
      employerId,
      jobTitle,
      scheduledDate, 
      scheduledTime 
    } = await req.json();

    // Validate required fields
    if (!applicationId || !candidateId || !employerId || !jobTitle || !scheduledDate || !scheduledTime) {
      throw new Error('Missing required fields');
    }

    // Create interview record
    const { data: interview, error: interviewError } = await supabaseClient
      .from('interviews')
      .insert({
        application_id: applicationId,
        candidate_id: candidateId,
        employer_id: employerId,
        job_title: jobTitle,
        scheduled_date: scheduledDate,
        scheduled_time: scheduledTime,
        status: 'upcoming',
      })
      .select()
      .single();

    if (interviewError) throw interviewError;

    // Update application status
    const { error: updateError } = await supabaseClient
      .from('applications')
      .update({ status: 'interview_scheduled' })
      .eq('id', applicationId);

    if (updateError) throw updateError;

    // In a real app, you would send email notifications here
    // For now, we just return the interview data

    return new Response(
      JSON.stringify({ 
        success: true, 
        interview,
        message: 'Interview scheduled successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
