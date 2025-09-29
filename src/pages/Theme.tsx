import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Upload, Palette, Type, Settings, Save, RefreshCw } from 'lucide-react';
import { useTheme } from '@/theme/ThemeContext';
import { ThemeConfig } from '@/theme/types';
import { themePresets } from '@/theme/presets';
import { PlayingCard } from '@/components/PlayingCard';
import { cn } from '@/lib/utils';
import { uploadThemeAsset, createTheme, updateTheme, listThemes, getTheme, ThemeRow } from '@/lib/themeStorage';
import { supabase } from '@/integrations/supabase/client';
import AuthMini from '@/components/AuthMini';
import AIThemeGenerator from '@/components/AIThemeGenerator';
import { useToast } from '@/hooks/use-toast';

const Theme = () => {
  const navigate = useNavigate();
  const { theme, setTheme, resetTheme } = useTheme();
  const { toast } = useToast();
  const [workingTheme, setWorkingTheme] = useState<ThemeConfig>(theme);
  const [activeThemeId, setActiveThemeId] = useState<string | null>(null);
  const [savedThemes, setSavedThemes] = useState<ThemeRow[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // File upload refs
  const heroImageRef = useRef<HTMLInputElement>(null);
  const cardBackRef = useRef<HTMLInputElement>(null);
  const heartsIconRef = useRef<HTMLInputElement>(null);
  const diamondsIconRef = useRef<HTMLInputElement>(null);
  const clubsIconRef = useRef<HTMLInputElement>(null);
  const spadesIconRef = useRef<HTMLInputElement>(null);

  // Load saved themes on mount
  useEffect(() => {
    loadSavedThemes();
    const savedId = localStorage.getItem('activeThemeId');
    if (savedId) {
      setActiveThemeId(savedId);
    }
  }, []);

  const loadSavedThemes = async () => {
    try {
      const themes = await listThemes();
      setSavedThemes(themes);
    } catch (error) {
      console.error('Failed to load themes:', error);
    }
  };

  const handleColorChange = (colorKey: keyof NonNullable<ThemeConfig['colors']>, value: string) => {
    setWorkingTheme(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorKey]: value
      }
    }));
  };

  const handleLabelChange = (index: number, value: string) => {
    const newLabels = [...(workingTheme.stackLabels || ['Stack 1', 'Stack 2', 'Stack 3', 'Stack 4'])];
    newLabels[index] = value;
    setWorkingTheme(prev => ({
      ...prev,
      stackLabels: newLabels
    }));
  };

  const handleScoringLabelChange = (key: 'score' | 'fumble', value: string) => {
    setWorkingTheme(prev => ({
      ...prev,
      scoringLabels: {
        ...prev.scoringLabels,
        [key]: value
      }
    }));
  };

  const handleFileUpload = async (file: File, type: 'hero' | 'cardBack' | 'hearts' | 'diamonds' | 'clubs' | 'spades') => {
    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      let url: string;
      
      switch (type) {
        case 'hero':
          url = await uploadThemeAsset(file, 'hero', user?.id);
          setWorkingTheme(prev => ({ ...prev, heroTitleImageUrl: url }));
          break;
        case 'cardBack':
          url = await uploadThemeAsset(file, 'card-back', user?.id);
          setWorkingTheme(prev => ({ ...prev, cardBackUrl: url }));
          break;
        case 'hearts':
        case 'diamonds':
        case 'clubs':
        case 'spades':
          url = await uploadThemeAsset(file, `suits/${type}`, user?.id);
          setWorkingTheme(prev => ({
            ...prev,
            suitIcons: {
              ...prev.suitIcons,
              [type]: url
            }
          }));
          break;
      }
      
      toast({
        title: "Upload successful",
        description: "Image uploaded and applied to theme",
      });
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const applyPreset = (preset: typeof themePresets[0]) => {
    setWorkingTheme(prev => ({
      ...prev,
      ...preset.config
    }));
  };

  const saveTheme = async () => {
    setSaving(true);
    try {
      if (!activeThemeId) {
        const row = await createTheme(workingTheme.name || 'Custom Theme', workingTheme);
        if (row) {
          setActiveThemeId(row.id);
          localStorage.setItem('activeThemeId', row.id);
        }
      } else {
        const result = await updateTheme(activeThemeId, workingTheme);
        if (!result) {
          throw new Error('Theme not found or permission denied');
        }
      }
      
      setTheme(workingTheme);
      window.dispatchEvent(new CustomEvent('theme:updated'));
      await loadSavedThemes(); // Refresh the list
      
      toast({
        title: "Theme saved",
        description: "Your theme has been saved successfully",
      });
    } catch (error) {
      console.error('Save failed:', error);
      toast({
        title: "Save failed",
        description: "Failed to save theme. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const loadTheme = async (themeId: string) => {
    try {
      const themeData = await getTheme(themeId);
      if (themeData) {
        setWorkingTheme(themeData.config);
        setActiveThemeId(themeData.id);
        localStorage.setItem('activeThemeId', themeData.id);
        
        toast({
          title: "Theme loaded",
          description: `Loaded theme: ${themeData.name}`,
        });
      }
    } catch (error) {
      console.error('Load failed:', error);
      toast({
        title: "Load failed",
        description: "Failed to load theme. Please try again.",
        variant: "destructive",
      });
    }
  };

  const previewTheme = () => {
    setTheme(workingTheme);
  };

  // Add a handler to merge the generated config into the draft
  const handleGeneratedTheme = (config: any) => {
    // Merge the generated fields into your draft state.
    const newTheme = { ...workingTheme, ...config };
    setWorkingTheme(newTheme);
    // Automatically apply the theme to see changes immediately
    setTheme(newTheme);
  };

  // Mock card for preview
  const mockCard = {
    rank: 'A' as const,
    suit: '♠' as const,
    value10: 1,
    isAce: true
  };

  return (
    <div className="min-h-screen p-4" style={{
      background: `
        radial-gradient(circle at 25% 25%, rgba(255,255,255,0.02) 1px, transparent 1px),
        radial-gradient(circle at 75% 75%, rgba(255,255,255,0.02) 1px, transparent 1px),
        linear-gradient(135deg, ${workingTheme.colors?.background || 'hsl(330, 81%, 96%)'}, ${workingTheme.colors?.surface || 'hsl(0, 0%, 100%)'}, ${workingTheme.colors?.secondary || 'hsl(330, 81%, 80%)'})
      `,
      backgroundSize: '24px 24px, 32px 32px, 100% 100%'
    }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-3xl font-bold">Theme Customizer</h1>
          </div>
          <Button 
            onClick={() => navigate('/play')}
            className="bg-gradient-to-r from-primary to-secondary text-white font-semibold px-6 py-2 rounded-lg hover:shadow-lg transition-all"
          >
            Play Game →
          </Button>
        </div>


        {/* New AI generator section */}
        <AIThemeGenerator onGenerated={handleGeneratedTheme} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Controls */}
          <div className="space-y-6">
            {/* Color Presets */}
            <Card>
              <CardHeader>
                <CardTitle>Color Presets</CardTitle>
                <CardDescription>Quick apply popular color schemes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {themePresets.map((preset) => (
                    <Button 
                      key={preset.name}
                      variant="outline" 
                      size="sm"
                      onClick={() => applyPreset(preset)}
                      className="justify-start"
                    >
                      <div 
                        className="w-4 h-4 rounded-full mr-2"
                        style={{ backgroundColor: preset.config.colors?.primary }}
                      />
                      {preset.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
                <CardDescription>Upload custom images for your theme</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Hero Image */}
                <div>
                  <Label className="block mb-2 font-medium">Hero Image</Label>
                  <div className="space-y-3">
                    <input
                      ref={heroImageRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, 'hero');
                      }}
                      className="hidden"
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => heroImageRef.current?.click()}
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Hero Image
                    </Button>
                    {workingTheme.heroTitleImageUrl && (
                      <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                        <img 
                          src={workingTheme.heroTitleImageUrl} 
                          alt="Hero preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Back */}
                <div>
                  <Label className="block mb-2 font-medium">Card Back</Label>
                  <div className="space-y-3">
                    <input
                      ref={cardBackRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, 'cardBack');
                      }}
                      className="hidden"
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => cardBackRef.current?.click()}
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Card Back
                    </Button>
                    {workingTheme.cardBackUrl && (
                      <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden max-w-32">
                        <img 
                          src={workingTheme.cardBackUrl} 
                          alt="Card back preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Suit Icons */}
                <div>
                  <Label className="block mb-2 font-medium">Suit Icons</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: 'hearts', label: 'Hearts ❤️', ref: heartsIconRef },
                      { key: 'diamonds', label: 'Diamonds ✨', ref: diamondsIconRef },
                      { key: 'clubs', label: 'Clubs ✍️', ref: clubsIconRef },
                      { key: 'spades', label: 'Spades 🎤', ref: spadesIconRef },
                    ].map(({ key, label, ref }) => (
                      <div key={key} className="space-y-2">
                        <input
                          ref={ref}
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, key as any);
                          }}
                          className="hidden"
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => ref.current?.click()}
                          className="w-full"
                        >
                          {label}
                        </Button>
                        {workingTheme.suitIcons?.[key as keyof typeof workingTheme.suitIcons] && (
                          <div className="text-center text-2xl">
                            {workingTheme.suitIcons[key as keyof typeof workingTheme.suitIcons]}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Note: If you upload any suit icon, you should upload all four for consistency.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Labels */}
            <Card>
              <CardHeader>
                <CardTitle>Labels</CardTitle>
                <CardDescription>Customize stack and scoring labels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="block mb-2 font-medium">Stack Labels</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {(workingTheme.stackLabels || ['Stack 1', 'Stack 2', 'Stack 3', 'Stack 4']).map((label, index) => (
                      <Input
                        key={index}
                        value={label}
                        onChange={(e) => handleLabelChange(index, e.target.value)}
                        placeholder={`Stack ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label className="block mb-2 font-medium">Scoring Labels</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-sm text-muted-foreground">Score Label</Label>
                      <Input
                        value={workingTheme.scoringLabels?.score || 'Score'}
                        onChange={(e) => handleScoringLabelChange('score', e.target.value)}
                        placeholder="Score"
                      />
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Fumbles Label</Label>
                      <Input
                        value={workingTheme.scoringLabels?.fumble || 'Fumbles'}
                        onChange={(e) => handleScoringLabelChange('fumble', e.target.value)}
                        placeholder="Fumbles"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Style */}
            <Card>
              <CardHeader>
                <CardTitle>Style</CardTitle>
                <CardDescription>Typography and visual styling options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="block mb-2 font-medium">Theme Settings</Label>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm text-muted-foreground">Theme Name</Label>
                      <Input
                        value={workingTheme.name || ''}
                        onChange={(e) => setWorkingTheme(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="My Custom Theme"
                      />
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Tagline</Label>
                      <Input
                        value={workingTheme.tagline || ''}
                        onChange={(e) => setWorkingTheme(prev => ({ ...prev, tagline: e.target.value }))}
                        placeholder="A magical gaming experience"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="block mb-2 font-medium">Typography</Label>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm text-muted-foreground">Font Family</Label>
                      <Select 
                        value={workingTheme.fontFamily || 'Inter'} 
                        onValueChange={(value) => setWorkingTheme(prev => ({ ...prev, fontFamily: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select font" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Inter">Inter</SelectItem>
                          <SelectItem value="Roboto">Roboto</SelectItem>
                          <SelectItem value="Poppins">Poppins</SelectItem>
                          <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                          <SelectItem value="Georgia">Georgia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Emoji Prefix</Label>
                      <Input
                        value={workingTheme.emojiPrefix || ''}
                        onChange={(e) => setWorkingTheme(prev => ({ ...prev, emojiPrefix: e.target.value }))}
                        placeholder="✨"
                        maxLength={10}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="block mb-2 font-medium">Border Radius</Label>
                  <div className="space-y-2">
                    <Slider
                      value={[workingTheme.borderRadius || 12]}
                      onValueChange={([value]) => setWorkingTheme(prev => ({ ...prev, borderRadius: value }))}
                      max={24}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-sm text-muted-foreground text-center">
                      {workingTheme.borderRadius || 12}px
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={previewTheme} variant="outline">
                    Preview Theme
                  </Button>
                  <Button onClick={saveTheme} disabled={saving || uploading}>
                    {saving ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Theme
                      </>
                    )}
                  </Button>
                  <Button onClick={resetTheme} variant="outline">
                    Reset to Default
                  </Button>
                  <Button variant="outline">
                    Save as Preset
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  Only upload assets you have rights to use.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Live Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>See how your theme looks in the game</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Hero Preview */}
                <div className="space-y-2">
                  <Label>Hero Section</Label>
                  <div 
                    className="aspect-video rounded-lg overflow-hidden border"
                    style={{ backgroundColor: workingTheme.colors?.background }}
                  >
                    {workingTheme.heroTitleImageUrl && (
                      <img 
                        src={workingTheme.heroTitleImageUrl} 
                        alt="Hero preview"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="mt-2 text-center italic text-sm" style={{ color: workingTheme.colors?.textSecondary }}>
                    {workingTheme.tagline || theme.tagline || ''}
                  </div>
                </div>

                {/* Stack Preview */}
                <div className="space-y-2">
                  <Label>Stack Tiles</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[0, 1, 2, 3].map((index) => (
                      <div 
                        key={index}
                        className="p-3 rounded-lg border text-center"
                        style={{ backgroundColor: workingTheme.colors?.surface }}
                      >
                        <div 
                          className="text-sm font-medium"
                          style={{ color: workingTheme.colors?.textPrimary }}
                        >
                          {workingTheme.stackLabels?.[index] || `Stack ${index + 1}`}
                        </div>
                        <Badge 
                          variant="outline" 
                          className="mt-1"
                          style={{ 
                            borderColor: workingTheme.colors?.primary,
                            color: workingTheme.colors?.primary 
                          }}
                        >
                          0
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Preview */}
                <div className="space-y-2">
                  <Label>Playing Cards</Label>
                  <div className="flex gap-3 justify-center">
                    <PlayingCard card={mockCard} small />
                    <PlayingCard faceDown small />
                  </div>
                </div>

                {/* HUD Preview */}
                <div className="space-y-2">
                  <Label>Score Display</Label>
                  <div 
                    className="p-4 rounded-lg border"
                    style={{ backgroundColor: workingTheme.colors?.surface }}
                  >
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div 
                          className="text-sm"
                          style={{ color: workingTheme.colors?.textSecondary }}
                        >
                          {workingTheme.scoringLabels?.score || 'Score'}
                        </div>
                        <div 
                          className="text-2xl font-bold"
                          style={{ color: workingTheme.colors?.primary }}
                        >
                          1200
                        </div>
                      </div>
                      <div>
                        <div 
                          className="text-sm"
                          style={{ color: workingTheme.colors?.textSecondary }}
                        >
                          {workingTheme.scoringLabels?.fumble || 'Fumbles'}
                        </div>
                        <div 
                          className="text-2xl font-bold"
                          style={{ color: workingTheme.colors?.textPrimary }}
                        >
                          3
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Theme;