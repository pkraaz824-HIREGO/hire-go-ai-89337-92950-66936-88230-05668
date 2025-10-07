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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Get user from token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { roleCategory } = await req.json();

    if (!roleCategory) {
      throw new Error('Role category is required');
    }

    console.log('Assigning questions for role:', roleCategory, 'to user:', user.id);

    // Get questions for the role category
    const { data: questions, error: questionsError } = await supabaseClient
      .from('interview_questions')
      .select('*')
      .eq('role_category', roleCategory)
      .limit(5);

    if (questionsError) throw questionsError;

    if (!questions || questions.length === 0) {
      throw new Error(`No questions found for role: ${roleCategory}`);
    }

    // Check if already assigned
    const { data: existingAssignments } = await supabaseClient
      .from('candidate_question_assignments')
      .select('question_id')
      .eq('candidate_id', user.id);

    const existingQuestionIds = existingAssignments?.map(a => a.question_id) || [];
    const newQuestions = questions.filter(q => !existingQuestionIds.includes(q.id));

    if (newQuestions.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Questions already assigned',
          questions: questions
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Assign questions to candidate
    const assignments = newQuestions.map(q => ({
      candidate_id: user.id,
      question_id: q.id,
      status: 'pending'
    }));

    const { error: assignError } = await supabaseClient
      .from('candidate_question_assignments')
      .insert(assignments);

    if (assignError) throw assignError;

    // Update profile completion status
    await supabaseClient
      .from('profiles')
      .update({ profile_completion_status: 'intro_complete' })
      .eq('user_id', user.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        questions: newQuestions,
        message: `${newQuestions.length} questions assigned successfully`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error assigning questions:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});