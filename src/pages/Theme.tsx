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
  return <div className="min-h-screen p-4 bg-brand-gradient">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="text-brand-text hover:bg-brand-surface2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-4xl font-bold text-brand-text">21 Blitz Builder</h1>
          </div>
          <Button onClick={() => navigate('/play')} className="bg-btn-primary text-btn-primaryText hover:brightness-95 font-semibold px-6 py-2 rounded-lg transition-all">
            Play Game →
          </Button>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="mb-6 bg-brand-surface border-brand-border shadow-brand-card">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-brand-text"></CardTitle>
              <CardDescription className="text-lg text-brand-muted"></CardDescription>
            </CardHeader>
            <CardContent>
              <AIThemeGenerator onGenerated={handleGeneratedTheme} />
            </CardContent>
          </Card>

        </div>
      </div>
    </div>;
};
export default Theme;