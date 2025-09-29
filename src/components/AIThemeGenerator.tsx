import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Copy, Eye } from 'lucide-react';
import { defaultTheme } from '@/theme/defaultTheme';
import { buildAiPrompt } from '@/lib/aiPrompt';
import { supabase } from '@/integrations/supabase/client';

// Define the type of the generated config. You can reuse ThemeConfig or accept 'any'.
type GeneratedConfig = any;

type Props = {
  onGenerated: (config: GeneratedConfig) => void;
};

export default function AIThemeGenerator({ onGenerated }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jsonResponse, setJsonResponse] = useState<any | null>(null);
  const [showResponse, setShowResponse] = useState(false);

  async function simulateAIResponse(t: string, d: string): Promise<GeneratedConfig> {
    // This is a stub. Phase 2/3 will replace this with a real API call.
    return {
      name: t || 'Generated Theme',
      tagline: d
        ? `Inspired by ${t}: ${d.slice(0, 50)}…`
        : `A magical theme generated for ${t}`,
      stackLabels: ['Stack A', 'Stack B', 'Stack C', 'Stack D'],
      scoringLabels: { score: 'Score', fumble: 'Fumbles' },
      colors: {
        background: 'hsl(var(--brand-bg))',
        surface: 'hsl(var(--brand-surface))',
        primary: 'hsl(var(--brand-accent))',
        secondary: 'hsl(var(--brand-accent-2))',
        accent: 'hsl(var(--brand-accent))',
        textPrimary: 'hsl(var(--brand-text))',
        textSecondary: 'hsl(var(--brand-muted))',
      },
      // Derive images from the default theme
      heroTitleImageUrl: defaultTheme.heroTitleImageUrl,
      cardBackUrl: defaultTheme.cardBackUrl,
      suitIcons: defaultTheme.suitIcons,
    };
  }

  const handleCopyPrompt = () => {
    const prompt = buildAiPrompt(title, description);
    // Copy to clipboard
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(prompt).then(() => {
        alert('AI prompt copied to clipboard! Paste it into ChatGPT and copy the JSON back.');
      });
    } else {
      console.log('AI Prompt:', prompt);
      alert('Prompt logged to console. Copy it from there.');
    }
  };

  async function handleGenerate() {
    if (!title) return;
    const prompt = buildAiPrompt(title, description);
    console.log('AI Prompt:', prompt);
    setIsGenerating(true);
    setError(null);
    setJsonResponse(null);
    
    try {
      const { data, error: functionError } = await supabase.functions.invoke('generate-theme-free', {
        body: {
          title: title.trim(),
          description: description.trim()
        }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      setJsonResponse(data);
      
      if (data.success && data.theme) {
        onGenerated(data.theme);
      } else {
        throw new Error(data.error || 'Failed to generate theme');
      }
    } catch (e) {
      setError((e as Error).message ?? 'Failed to generate theme');
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Generate Theme with AI
        </CardTitle>
        <CardDescription>
          Describe your game; we'll generate cards, colors, labels and a tagline. You can edit everything below.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Game Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Textarea
          placeholder="Describe your game's theme and mood"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
        <div className="flex gap-2">
          <Button
            onClick={handleGenerate}
            disabled={!title || isGenerating}
            className="flex-1"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {isGenerating ? 'Generating…' : 'Generate Theme'}
          </Button>
          <Button
            variant="secondary"
            onClick={handleCopyPrompt}
            disabled={!title}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy AI Prompt
          </Button>
          {jsonResponse && (
            <Button
              variant="outline"
              onClick={() => setShowResponse(!showResponse)}
            >
              <Eye className="w-4 h-4 mr-2" />
              {showResponse ? 'Hide' : 'Show'} JSON
            </Button>
          )}
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {jsonResponse && showResponse && (
          <div className="mt-4 p-3 bg-muted rounded-md">
            <h4 className="text-sm font-semibold mb-2">API Response:</h4>
            <pre className="text-xs overflow-auto max-h-48 whitespace-pre-wrap">
              {JSON.stringify(jsonResponse, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}