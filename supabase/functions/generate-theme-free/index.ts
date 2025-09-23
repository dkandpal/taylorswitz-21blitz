import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to generate image with OpenAI
async function generateImage(prompt: string): Promise<string> {
  console.log('Generating image for prompt:', prompt);
  
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
      quality: 'hd',
      response_format: 'b64_json'
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('OpenAI API error response:', errorBody);
    throw new Error(`OpenAI Image API error: ${response.status} ${response.statusText} - ${errorBody}`);
  }

  const data = await response.json();
  console.log('Image generation response received');
  
  if (data.data && data.data[0] && data.data[0].b64_json) {
    return data.data[0].b64_json;
  }
  
  throw new Error('No image data received from OpenAI');
}

// Helper function to upload base64 image to Supabase storage
async function uploadImageToStorage(base64Data: string, fileName: string, folder: string): Promise<string> {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  // Convert base64 to blob
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'image/png' });
  
  const path = `anon/${folder}/${Date.now()}-${fileName}.png`;
  
  const { data, error } = await supabase.storage
    .from('themes')
    .upload(path, blob, {
      cacheControl: '3600',
      upsert: false,
    });
    
  if (error) {
    console.error('Storage upload error:', error);
    throw error;
  }
  
  const { data: publicUrl } = supabase.storage
    .from('themes')
    .getPublicUrl(data.path);
    
  console.log('Image uploaded to:', publicUrl.publicUrl);
  return publicUrl.publicUrl;
}

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

    // Step 1: Generate theme JSON with descriptions
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
      console.log('OpenAI response received');

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

    // Step 2: Generate actual images based on descriptions
    console.log('Starting image generation phase...');
    
    try {
      // Generate hero image
      console.log('Generating hero image...');
      const heroImageBase64 = await generateImage(parsedTheme.imageDescriptions.heroImage);
      const heroImageUrl = await uploadImageToStorage(heroImageBase64, 'hero', 'hero');
      
      // Generate card back image
      console.log('Generating card back image...');
      const cardBackBase64 = await generateImage(parsedTheme.imageDescriptions.cardBack);
      const cardBackUrl = await uploadImageToStorage(cardBackBase64, 'card-back', 'card-back');
      
      // Generate suit icons (we'll create a single image with all 4 icons)
      console.log('Generating suit icons...');
      const suitIconsPrompt = `Create 4 distinct icons in a 2x2 grid layout on transparent background: ${parsedTheme.imageDescriptions.suitIcons.hearts}, ${parsedTheme.imageDescriptions.suitIcons.diamonds}, ${parsedTheme.imageDescriptions.suitIcons.clubs}, ${parsedTheme.imageDescriptions.suitIcons.spades}. Each icon should be clearly separated and themed to ${title}.`;
      const suitIconsBase64 = await generateImage(suitIconsPrompt);
      const suitIconsUrl = await uploadImageToStorage(suitIconsBase64, 'suit-icons', 'suit-icons');
      
      // Step 3: Build final theme config with actual image URLs
      const finalThemeConfig = {
        name: parsedTheme.name,
        tagline: parsedTheme.tagline,
        heroTitleImageUrl: heroImageUrl,
        cardBackUrl: cardBackUrl,
        stackLabels: parsedTheme.stackLabels,
        scoringLabels: {
          score: parsedTheme.scoringLabels.score,
          fumble: parsedTheme.scoringLabels.fumble
        },
        colors: {
          background: parsedTheme.colors.background,
          surface: parsedTheme.colors.surface,
          primary: parsedTheme.colors.primary,
          secondary: parsedTheme.colors.secondary,
          accent: parsedTheme.colors.accent,
          textPrimary: parsedTheme.colors.textPrimary,
          textSecondary: parsedTheme.colors.textSecondary,
          gradientFrom: parsedTheme.colors.primary,
          gradientTo: parsedTheme.colors.secondary
        },
        // For now, we'll use emoji fallbacks for suit icons since they're complex to extract from the generated image
        suitIcons: {
          hearts: '❤️',
          diamonds: '💎', 
          clubs: '♣️',
          spades: '♠️'
        },
        emojiPrefix: '✨',
        fontFamily: 'Inter',
        borderRadius: 12
      };

      console.log('Theme generation completed successfully');

      return new Response(JSON.stringify({ 
        success: true, 
        theme: finalThemeConfig,
        rawAiResponse: parsedTheme,
        generatedImages: {
          heroImage: heroImageUrl,
          cardBack: cardBackUrl,
          suitIcons: suitIconsUrl
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
      
    } catch (imageError) {
      console.error('Image generation error:', imageError);
      
      // Fallback: return theme without generated images
      const fallbackThemeConfig = {
        name: parsedTheme.name,
        tagline: parsedTheme.tagline,
        stackLabels: parsedTheme.stackLabels,
        scoringLabels: {
          score: parsedTheme.scoringLabels.score,
          fumble: parsedTheme.scoringLabels.fumble
        },
        colors: {
          background: parsedTheme.colors.background,
          surface: parsedTheme.colors.surface,
          primary: parsedTheme.colors.primary,
          secondary: parsedTheme.colors.secondary,
          accent: parsedTheme.colors.accent,
          textPrimary: parsedTheme.colors.textPrimary,
          textSecondary: parsedTheme.colors.textSecondary,
          gradientFrom: parsedTheme.colors.primary,
          gradientTo: parsedTheme.colors.secondary
        },
        suitIcons: {
          hearts: '❤️',
          diamonds: '💎', 
          clubs: '♣️',
          spades: '♠️'
        },
        emojiPrefix: '✨',
        fontFamily: 'Inter',
        borderRadius: 12
      };

      return new Response(JSON.stringify({ 
        success: true, 
        theme: fallbackThemeConfig,
        rawAiResponse: parsedTheme,
        imageGenerationError: imageError.message
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

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