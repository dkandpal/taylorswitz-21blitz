import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '@/theme/ThemeContext';
import AIThemeGenerator from '@/components/AIThemeGenerator';
const Theme = () => {
  const navigate = useNavigate();
  const {
    setTheme
  } = useTheme();

  // Handler to merge the generated config and navigate to customize page
  const handleGeneratedTheme = (config: any) => {
    // Apply the generated theme immediately
    setTheme(config);
    // Navigate to the customize page
    navigate('/theme/customize');
  };
  return <div className="min-h-screen p-4" style={{
    background: `
        radial-gradient(circle at 25% 25%, rgba(255,255,255,0.02) 1px, transparent 1px),
        radial-gradient(circle at 75% 75%, rgba(255,255,255,0.02) 1px, transparent 1px),
        linear-gradient(135deg, hsl(330, 81%, 96%), hsl(0, 0%, 100%), hsl(330, 81%, 80%))
      `,
    backgroundSize: '24px 24px, 32px 32px, 100% 100%'
  }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-4xl font-bold">Build Your 21 Blitz Game</h1>
          </div>
          <Button onClick={() => navigate('/play')} className="bg-gradient-to-r from-primary to-secondary text-white font-semibold px-6 py-2 rounded-lg hover:shadow-lg transition-all">
            Play Game →
          </Button>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="mb-6">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Create with AI</CardTitle>
              <CardDescription className="text-lg">
                Describe your perfect theme and let AI generate it for you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AIThemeGenerator onGenerated={handleGeneratedTheme} />
            </CardContent>
          </Card>

          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              After generating your theme, you'll be able to customize images, labels, and styles.
            </p>
            <Button variant="outline" onClick={() => navigate('/theme/customize')} className="text-sm">
              Skip to Manual Customization →
            </Button>
          </div>
        </div>
      </div>
    </div>;
};
export default Theme;