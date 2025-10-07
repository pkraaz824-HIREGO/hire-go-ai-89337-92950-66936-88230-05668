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

    const { videoRecordingId, transcript, questionText } = await req.json();

    console.log('Evaluating video:', videoRecordingId);

    if (!videoRecordingId || !transcript) {
      throw new Error('Missing required fields');
    }

    // Call Lovable AI for evaluation
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const systemPrompt = `You are an expert HR interviewer and communication analyst. Evaluate the candidate's response based on:
1. Communication Score (0-10): Clarity, articulation, and expression
2. Confidence Score (0-10): Self-assurance and conviction in responses
3. Skill Score (0-10): Technical knowledge and competence demonstrated
4. Clarity Score (0-10): Coherence and logical structure of response
5. Emotion Analysis: Overall tone and emotional intelligence

Provide scores and detailed feedback.`;

    const userPrompt = questionText 
      ? `Question asked: "${questionText}"\n\nCandidate's response: "${transcript}"\n\nProvide detailed evaluation with scores.`
      : `Candidate's self-introduction: "${transcript}"\n\nProvide detailed evaluation with scores.`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'evaluate_candidate',
            description: 'Evaluate candidate video response with scores',
            parameters: {
              type: 'object',
              properties: {
                communication_score: { type: 'integer', minimum: 0, maximum: 10 },
                confidence_score: { type: 'integer', minimum: 0, maximum: 10 },
                skill_score: { type: 'integer', minimum: 0, maximum: 10 },
                clarity_score: { type: 'integer', minimum: 0, maximum: 10 },
                emotion_analysis: { 
                  type: 'object',
                  properties: {
                    overall_tone: { type: 'string' },
                    emotional_intelligence: { type: 'string' }
                  }
                },
                evaluation_notes: { type: 'string' }
              },
              required: ['communication_score', 'confidence_score', 'skill_score', 'clarity_score', 'evaluation_notes']
            }
          }
        }],
        tool_choice: { type: 'function', function: { name: 'evaluate_candidate' } }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error(`AI evaluation failed: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    console.log('AI response:', JSON.stringify(aiData));

    const toolCall = aiData.choices[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error('No evaluation data received from AI');
    }

    const evaluation = JSON.parse(toolCall.function.arguments);
    
    // Calculate overall rating (0-100)
    const overallRating = Math.round(
      (evaluation.communication_score + evaluation.confidence_score + 
       evaluation.skill_score + evaluation.clarity_score) * 2.5
    );

    // Get video recording to find candidate_id
    const { data: videoData, error: videoError } = await supabaseClient
      .from('video_recordings')
      .select('candidate_id')
      .eq('id', videoRecordingId)
      .single();

    if (videoError) throw videoError;

    // Store evaluation in database
    const { data: evalData, error: evalError } = await supabaseClient
      .from('ai_evaluations')
      .insert({
        video_recording_id: videoRecordingId,
        candidate_id: videoData.candidate_id,
        communication_score: evaluation.communication_score,
        confidence_score: evaluation.confidence_score,
        skill_score: evaluation.skill_score,
        clarity_score: evaluation.clarity_score,
        emotion_analysis: evaluation.emotion_analysis,
        transcript: transcript,
        overall_rating: overallRating,
        evaluation_notes: evaluation.evaluation_notes
      })
      .select()
      .single();

    if (evalError) throw evalError;

    // Update candidate's overall score
    const { data: allEvals } = await supabaseClient
      .from('ai_evaluations')
      .select('overall_rating')
      .eq('candidate_id', videoData.candidate_id);

    if (allEvals && allEvals.length > 0) {
      const avgScore = Math.round(
        allEvals.reduce((sum, e) => sum + (e.overall_rating || 0), 0) / allEvals.length
      );

      await supabaseClient
        .from('profiles')
        .update({ overall_candidate_score: avgScore })
        .eq('user_id', videoData.candidate_id);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        evaluation: evalData,
        overall_rating: overallRating
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error evaluating video:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});