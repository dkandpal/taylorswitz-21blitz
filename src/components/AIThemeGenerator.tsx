import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

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
        background: '#FFF5F8',
        surface: '#FFFFFF',
        primary: '#D946EF',
        secondary: '#F9A8D4',
        accent: '#F472B6',
        textPrimary: '#1F2937',
        textSecondary: '#6B7280',
      },
      // Note: Images and suit icons remain undefined in this stub. Users can tweak them manually.
    };
  }

  async function handleGenerate() {
    if (!title) return;
    setIsGenerating(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      const config = await simulateAIResponse(title.trim(), description.trim());
      onGenerated(config);
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
        <Button
          onClick={handleGenerate}
          disabled={!title || isGenerating}
          className="w-full"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {isGenerating ? 'Generating…' : 'Generate Theme'}
        </Button>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </CardContent>
    </Card>
  );
}