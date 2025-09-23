import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2';

const huggingFaceApiKey = Deno.env.get('HUGGINGFACE_API_KEY');
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

    if (!huggingFaceApiKey) {
      throw new Error('Hugging Face API key not configured');
    }

    const prompt = `Act as a creative design assistant for a 21‑Blitz card game.
You will receive a game title and a short description of the game's theme and mood.
Your task is to produce a complete theme specification for the game, covering images, labels, colors, and a tagline.

Respond **strictly in JSON** with the following keys:
{
  "cardBack": "…",      // description of the card back image
  "suitIcons": {             // four simple icons, one per suit
    "hearts": "…",
    "diamonds": "…",
    "clubs": "…",
    "spades": "…"
  },
  "heroImage": "…",      // description of the hero/banner image
  "stackCategories": ["…","…","…","…"],  // four stack names
  "scoringLabels": {         // playful names for score & fumbles
    "score": "…",
    "fumbles": "…"
  },
  "colors": ["…","…","…"], // up to six hex codes that match the theme
  "tagline": "…"        // a short, catchy tagline
}

Guidelines:
1. **Card back** – Describe the central emblem or motif for the backs of all cards. It should encapsulate the theme and work well as a repeating pattern. Mention style and palette.
2. **Suit icons** – Describe four emoji‑like symbols that replace hearts, diamonds, clubs and spades. Each icon should connect directly to the theme and be rendered in a consistent style.
3. **Hero image** – Describe an eye‑catching hero/banner image for the main screen. It should show the energy of Blitz 21 and include the game title integrated into the design.
4. **Stack categories** – Provide four playful stack names (1–2 words) relevant to the theme.
5. **Scoring labels** – Provide two short, energetic phrases for score and fumbles counters.
6. **Colors** – Suggest up to six hex color codes that reflect the theme and work well together for UI elements.
7. **Tagline** – Craft a short, motivational tagline (1–2 sentences) encouraging players to stack cards in the spirit of the theme.

Now generate the theme specification for the following:
Game Title: ${title}
Description: ${description}`;

    const hf = new HfInference(huggingFaceApiKey);

    console.log('Using Hugging Face API key:', huggingFaceApiKey ? 'Key present' : 'Key missing');

    let parsedTheme;
    
    try {
      const response = await hf.textGeneration({
        model: 'microsoft/DialoGPT-medium',
        inputs: prompt,
        parameters: {
          max_new_tokens: 1000,
          return_full_text: false,
        },
      });

      console.log('Hugging Face response:', response);

      if (!response || !response.generated_text) {
        throw new Error('No generated text received from Hugging Face');
      }

      const generatedContent = response.generated_text;
      console.log('Generated content:', generatedContent);

      // Parse the JSON response from Hugging Face
      try {
        parsedTheme = JSON.parse(generatedContent);
      } catch (e) {
        console.error('Failed to parse Hugging Face response as JSON:', generatedContent);
        // Fallback to a mock response for now
        parsedTheme = {
          cardBack: `A modern design with ${title} theme elements`,
          suitIcons: {
            hearts: "themed heart icon",
            diamonds: "themed diamond icon", 
            clubs: "themed club icon",
            spades: "themed spade icon"
          },
          heroImage: `Dynamic ${title} themed hero image`,
          stackCategories: ["Stack 1", "Stack 2", "Stack 3", "Stack 4"],
          scoringLabels: { score: "Points", fumbles: "Misses" },
          colors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"],
          tagline: `Experience the excitement of ${title}!`
        };
      }
    } catch (hfError) {
      console.error('Hugging Face API error:', hfError);
      // Fallback to a mock response
      parsedTheme = {
        cardBack: `A modern design with ${title} theme elements`,
        suitIcons: {
          hearts: "themed heart icon",
          diamonds: "themed diamond icon", 
          clubs: "themed club icon",
          spades: "themed spade icon"
        },
        heroImage: `Dynamic ${title} themed hero image`,
        stackCategories: ["Stack 1", "Stack 2", "Stack 3", "Stack 4"],
        scoringLabels: { score: "Points", fumbles: "Misses" },
        colors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"],
        tagline: `Experience the excitement of ${title}!`
      };
    }

    // Transform the AI response to match our theme structure
    const themeConfig = {
      name: title || 'Generated Theme',
      tagline: parsedTheme.tagline,
      stackLabels: parsedTheme.stackCategories || ['Stack A', 'Stack B', 'Stack C', 'Stack D'],
      scoringLabels: {
        score: parsedTheme.scoringLabels?.score || 'Score',
        fumble: parsedTheme.scoringLabels?.fumbles || 'Fumbles'
      },
      colors: {
        background: parsedTheme.colors?.[0] || '#FFF5F8',
        surface: parsedTheme.colors?.[1] || '#FFFFFF',
        primary: parsedTheme.colors?.[2] || '#D946EF',
        secondary: parsedTheme.colors?.[3] || '#F9A8D4',
        accent: parsedTheme.colors?.[4] || '#F472B6',
        textPrimary: parsedTheme.colors?.[5] || '#1F2937',
        textSecondary: '#6B7280',
      },
      // Store image descriptions for future use
      imageDescriptions: {
        heroImage: parsedTheme.heroImage,
        cardBack: parsedTheme.cardBack,
        suitIcons: parsedTheme.suitIcons
      }
    };

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