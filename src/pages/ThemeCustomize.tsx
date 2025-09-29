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
import { PlayingCard } from '@/components/PlayingCard';
import { cn } from '@/lib/utils';
import { uploadThemeAsset, createTheme, updateTheme, ThemeRow } from '@/lib/themeStorage';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ThemeCustomize = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [workingTheme, setWorkingTheme] = useState<ThemeConfig>(theme);
  const [activeThemeId, setActiveThemeId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // File upload refs
  const heroImageRef = useRef<HTMLInputElement>(null);
  const cardBackRef = useRef<HTMLInputElement>(null);
  const heartsIconRef = useRef<HTMLInputElement>(null);
  const diamondsIconRef = useRef<HTMLInputElement>(null);
  const clubsIconRef = useRef<HTMLInputElement>(null);
  const spadesIconRef = useRef<HTMLInputElement>(null);

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

  const previewTheme = () => {
    setTheme(workingTheme);
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
            <Button variant="ghost" size="sm" onClick={() => navigate('/theme')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Generate
            </Button>
            <h1 className="text-3xl font-bold">Customize Your Theme</h1>
          </div>
          <Button 
            onClick={() => navigate('/play')}
            className="bg-gradient-to-r from-primary to-secondary text-white font-semibold px-6 py-2 rounded-lg hover:shadow-lg transition-all"
          >
            Play Game →
          </Button>
        </div>

        {/* Live Preview Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
            <CardDescription>See how your theme looks in the game</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 p-6 rounded-lg border-2 border-dashed" style={{
              backgroundColor: workingTheme.colors?.surface,
              borderColor: workingTheme.colors?.primary
            }}>
              {/* Hero Section Preview */}
              <div className="text-center space-y-4">
                {workingTheme.heroTitleImageUrl ? (
                  <img 
                    src={workingTheme.heroTitleImageUrl} 
                    alt="Theme hero"
                    className="h-20 mx-auto object-contain"
                  />
                ) : (
                  <h2 
                    className="text-4xl font-bold"
                    style={{ color: workingTheme.colors?.textPrimary }}
                  >
                    {workingTheme.name || 'Your Theme'}
                  </h2>
                )}
                <p style={{ color: workingTheme.colors?.textSecondary }}>
                  {workingTheme.tagline || 'Create stacks of 21 without busting!'}
                </p>
              </div>

              {/* Sample Cards */}
              <div className="flex justify-center gap-4">
                <PlayingCard card={mockCard} onClick={() => {}} />
                <PlayingCard card={{...mockCard, rank: 'K', suit: '♥'}} onClick={() => {}} />
                <PlayingCard card={{...mockCard, rank: '10', suit: '♦'}} onClick={() => {}} />
              </div>

              {/* Stack Labels Preview */}
              <div className="grid grid-cols-4 gap-4">
                {(workingTheme.stackLabels || ['Stack 1', 'Stack 2', 'Stack 3', 'Stack 4']).map((label, index) => (
                  <div 
                    key={index}
                    className="text-center p-3 rounded-lg"
                    style={{ 
                      backgroundColor: workingTheme.colors?.primary,
                      color: workingTheme.colors?.surface
                    }}
                  >
                    {label}
                  </div>
                ))}
              </div>

              {/* Score Preview */}
              <div className="flex justify-center gap-8">
                <div className="text-center">
                  <div style={{ color: workingTheme.colors?.textSecondary }}>
                    {workingTheme.scoringLabels?.score || 'Score'}
                  </div>
                  <div 
                    className="text-2xl font-bold"
                    style={{ color: workingTheme.colors?.textPrimary }}
                  >
                    1500
                  </div>
                </div>
                <div className="text-center">
                  <div style={{ color: workingTheme.colors?.textSecondary }}>
                    {workingTheme.scoringLabels?.fumble || 'Fumbles'}
                  </div>
                  <div 
                    className="text-2xl font-bold"
                    style={{ color: workingTheme.colors?.textPrimary }}
                  >
                    2
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                <div className="space-y-2">
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
                <div className="space-y-2">
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
                    <Label className="text-sm text-muted-foreground mb-1 block">Theme Name</Label>
                    <Input
                      value={workingTheme.name}
                      onChange={(e) => setWorkingTheme(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="My Custom Theme"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm text-muted-foreground mb-1 block">Tagline</Label>
                    <Input
                      value={workingTheme.tagline}
                      onChange={(e) => setWorkingTheme(prev => ({ ...prev, tagline: e.target.value }))}
                      placeholder="Create stacks of 21 without busting!"
                    />
                  </div>

                  <div>
                    <Label className="text-sm text-muted-foreground mb-1 block">Font Family</Label>
                    <Select 
                      value={workingTheme.fontFamily} 
                      onValueChange={(value) => setWorkingTheme(prev => ({ ...prev, fontFamily: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select font" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Roboto">Roboto</SelectItem>
                        <SelectItem value="Open Sans">Open Sans</SelectItem>
                        <SelectItem value="Lato">Lato</SelectItem>
                        <SelectItem value="Montserrat">Montserrat</SelectItem>
                        <SelectItem value="Poppins">Poppins</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">
                      Border Radius: {workingTheme.borderRadius}px
                    </Label>
                    <Slider
                      value={[workingTheme.borderRadius || 12]}
                      onValueChange={([value]) => setWorkingTheme(prev => ({ ...prev, borderRadius: value }))}
                      max={32}
                      min={0}
                      step={2}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-center gap-4">
          <Button onClick={previewTheme} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Preview Changes
          </Button>
          <Button onClick={saveTheme} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Theme'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ThemeCustomize;