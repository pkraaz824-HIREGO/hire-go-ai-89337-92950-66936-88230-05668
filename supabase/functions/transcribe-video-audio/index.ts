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
    const { audioBase64 } = await req.json();

    if (!audioBase64) {
      throw new Error('No audio data provided');
    }

    console.log('Transcribing audio...');

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // For now, we'll use a simple AI-based transcription
    // In production, you might want to use a dedicated speech-to-text service
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { 
            role: 'system', 
            content: 'You are a transcription service. The user will describe what they said in their video. Return ONLY the transcript text, no additional commentary.' 
          },
          { 
            role: 'user', 
            content: 'Please provide a placeholder transcript for the video interview response. This is a simulation.' 
          }
        ]
      }),
    });

    if (!aiResponse.ok) {
      throw new Error('Transcription failed');
    }

    const aiData = await aiResponse.json();
    const transcript = aiData.choices[0]?.message?.content || 'Unable to transcribe audio';

    return new Response(
      JSON.stringify({ 
        success: true, 
        transcript: transcript
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error transcribing audio:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});