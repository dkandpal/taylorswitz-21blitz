import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, description } = await req.json();
    
    console.log('Generating theme for:', { title, description });

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const prompt = `You are a formatting-strict generator. Output ONLY valid minified JSON that matches the schema below. Do not include markdown, comments, explanations, or extra fields. Be deterministic and avoid placeholders.

Schema (all keys required):
{
"name": "<string>",
"tagline": "<string>",
"stackLabels": ["<string>","<string>","<string>","<string>"],
"scoringLabels": { "score": "<string>", "fumble": "<string>" },
"colors": {
"background": "<#RRGGBB>",
"surface": "<#RRGGBB>",
"primary": "<#RRGGBB>",
"secondary": "<#RRGGBB>",
"accent": "<#RRGGBB>",
"textPrimary": "<#RRGGBB>",
"textSecondary": "<#RRGGBB>"
},
"imageDescriptions": {
"heroImage": "<string>",
"cardBack": "<string>",
"suitIcons": {
"hearts": "<string>",
"diamonds": "<string>",
"clubs": "<string>",
"spades": "<string>"
}
}
}

Content constraints:

Theme: ${title}; mood: ${description}.

Choose colors that match the theme perfectly. For sports teams, use their official colors. For other themes, pick appropriate colors.

No generic labels like "Stack 1". Keep phrases short, punchy, theme-appropriate.

Card back: describe central emblem/motif that fits the theme and works as repeating pattern.

Suit icons: four emoji-like symbols tied to the theme, consistent style.

Hero image: dynamic scene that captures the energy of the theme; integrate the game title "${title}" visually.

Generate now for:
Title: ${title}
Mood: ${description}

Return exactly one JSON object (minified).`;

    console.log('Using OpenAI API key:', openAIApiKey ? 'Key present' : 'Key missing');

    let parsedTheme;
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a strict JSON generator. Output only valid minified JSON with no additional text, comments, or markdown.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 1000,
          temperature: 0.1,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('OpenAI response:', data);

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('No message received from OpenAI');
      }

      const generatedContent = data.choices[0].message.content.trim();
      console.log('Generated content:', generatedContent);

      // Parse the JSON response from OpenAI
      try {
        parsedTheme = JSON.parse(generatedContent);
        console.log('Successfully parsed AI response:', parsedTheme);
      } catch (e) {
        console.error('Failed to parse OpenAI response as JSON:', generatedContent);
        throw new Error(`Failed to parse AI response as JSON: ${e.message}`);
      }
    } catch (aiError) {
      console.error('AI API error:', aiError);
      // Return the exact schema format as fallback
      parsedTheme = {
        name: title || 'Default Theme',
        tagline: `Experience the thrill of ${title || 'card stacking'}!`,
        stackLabels: ['Stack A', 'Stack B', 'Stack C', 'Stack D'],
        scoringLabels: { score: 'Points', fumble: 'Misses' },
        colors: {
          background: '#F8F9FA',
          surface: '#FFFFFF',
          primary: '#3B82F6',
          secondary: '#6B7280',
          accent: '#10B981',
          textPrimary: '#1F2937',
          textSecondary: '#6B7280'
        },
        imageDescriptions: {
          heroImage: `Dynamic scene capturing the essence of ${title} with energetic atmosphere and the game title "${title} Blitz 21" prominently displayed`,
          cardBack: `Themed pattern featuring elements related to ${title}, designed as a repeating motif with appropriate colors`,
          suitIcons: {
            hearts: `Heart-themed icon related to ${title}`,
            diamonds: `Diamond-themed icon related to ${title}`,
            clubs: `Club-themed icon related to ${title}`,
            spades: `Spade-themed icon related to ${title}`
          }
        }
      };
    }

    // Return the theme exactly as generated (no transformation needed since schema matches)
    const themeConfig = parsedTheme;

    return new Response(JSON.stringify({ 
      success: true, 
      theme: themeConfig,
      rawAiResponse: parsedTheme 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-theme-free function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});