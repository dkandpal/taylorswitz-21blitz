import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Upload, Palette, Type, Settings } from 'lucide-react';
import { useTheme } from '@/theme/ThemeContext';
import { ThemeConfig } from '@/theme/types';
import { themePresets } from '@/theme/presets';
import { PlayingCard } from '@/components/PlayingCard';
import { cn } from '@/lib/utils';

const Theme = () => {
  const navigate = useNavigate();
  const { theme, setTheme, resetTheme } = useTheme();
  const [workingTheme, setWorkingTheme] = useState<ThemeConfig>(theme);
  
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

  const handleFileUpload = (file: File, type: 'hero' | 'cardBack' | 'hearts' | 'diamonds' | 'clubs' | 'spades') => {
    const url = URL.createObjectURL(file);
    
    switch (type) {
      case 'hero':
        setWorkingTheme(prev => ({ ...prev, heroTitleImageUrl: url }));
        break;
      case 'cardBack':
        setWorkingTheme(prev => ({ ...prev, cardBackUrl: url }));
        break;
      case 'hearts':
      case 'diamonds':
      case 'clubs':
      case 'spades':
        setWorkingTheme(prev => ({
          ...prev,
          suitIcons: {
            ...prev.suitIcons,
            [type]: url
          }
        }));
        break;
    }
  };

  const applyPreset = (preset: typeof themePresets[0]) => {
    setWorkingTheme(prev => ({
      ...prev,
      ...preset.config
    }));
  };

  const saveTheme = () => {
    setTheme(workingTheme);
    // TODO: Save to Supabase when integrated
    console.log('Theme saved:', workingTheme);
  };

  const previewTheme = () => {
    setTheme(workingTheme);
  };

  // Mock card for preview
  const mockCard = {
    rank: 'A' as const,
    suit: '❤️' as const,
    value10: 1,
    isAce: true
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold">Theme Customizer</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Controls */}
          <div className="space-y-6">
            <Tabs defaultValue="colors" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="colors">
                  <Palette className="w-4 h-4 mr-2" />
                  Colors
                </TabsTrigger>
                <TabsTrigger value="images">
                  <Upload className="w-4 h-4 mr-2" />
                  Images
                </TabsTrigger>
                <TabsTrigger value="labels">
                  <Type className="w-4 h-4 mr-2" />
                  Labels
                </TabsTrigger>
                <TabsTrigger value="style">
                  <Settings className="w-4 h-4 mr-2" />
                  Style
                </TabsTrigger>
              </TabsList>

              <TabsContent value="colors" className="space-y-4">
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

                <Card>
                  <CardHeader>
                    <CardTitle>Custom Colors</CardTitle>
                    <CardDescription>Fine-tune your color palette</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { key: 'background' as const, label: 'Background' },
                      { key: 'surface' as const, label: 'Surface' },
                      { key: 'primary' as const, label: 'Primary' },
                      { key: 'secondary' as const, label: 'Secondary' },
                      { key: 'accent' as const, label: 'Accent' },
                      { key: 'textPrimary' as const, label: 'Text Primary' },
                      { key: 'textSecondary' as const, label: 'Text Secondary' },
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center gap-3">
                        <Label className="w-24">{label}</Label>
                        <Input
                          type="color"
                          value={workingTheme.colors?.[key] || '#000000'}
                          onChange={(e) => handleColorChange(key, e.target.value)}
                          className="w-16 h-8"
                        />
                        <Input
                          value={workingTheme.colors?.[key] || ''}
                          onChange={(e) => handleColorChange(key, e.target.value)}
                          placeholder="hsl(330, 81%, 60%)"
                          className="flex-1"
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="images" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Hero Image</CardTitle>
                    <CardDescription>16:9 aspect ratio recommended</CardDescription>
                  </CardHeader>
                  <CardContent>
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
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Card Back</CardTitle>
                    <CardDescription>3:4 aspect ratio recommended</CardDescription>
                  </CardHeader>
                  <CardContent>
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
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Suit Icons</CardTitle>
                    <CardDescription>SVG or PNG recommended, 128-256px</CardDescription>
                  </CardHeader>
                  <CardContent>
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
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Note: If you upload any suit icon, you should upload all four for consistency.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="labels" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Stack Labels</CardTitle>
                    <CardDescription>Customize the four stack category names</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[0, 1, 2, 3].map((index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Label className="w-16">Stack {index + 1}</Label>
                        <Input
                          value={workingTheme.stackLabels?.[index] || `Stack ${index + 1}`}
                          onChange={(e) => handleLabelChange(index, e.target.value)}
                          placeholder={`Stack ${index + 1}`}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Scoring Labels</CardTitle>
                    <CardDescription>Customize score and fumble labels</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Label className="w-16">Score</Label>
                      <Input
                        value={workingTheme.scoringLabels?.score || 'Score'}
                        onChange={(e) => handleScoringLabelChange('score', e.target.value)}
                        placeholder="Score"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <Label className="w-16">Fumbles</Label>
                      <Input
                        value={workingTheme.scoringLabels?.fumble || 'Fumbles'}
                        onChange={(e) => handleScoringLabelChange('fumble', e.target.value)}
                        placeholder="Fumbles"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="style" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Typography</CardTitle>
                    <CardDescription>Font family and styling options</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Font Family</Label>
                      <Select 
                        value={workingTheme.fontFamily || 'Inter'}
                        onValueChange={(value) => setWorkingTheme(prev => ({ ...prev, fontFamily: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Inter">Inter</SelectItem>
                          <SelectItem value="Poppins">Poppins</SelectItem>
                          <SelectItem value="Fredoka">Fredoka</SelectItem>
                          <SelectItem value="Baloo 2">Baloo 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Emoji Prefix</Label>
                      <Input
                        value={workingTheme.emojiPrefix || ''}
                        onChange={(e) => setWorkingTheme(prev => ({ ...prev, emojiPrefix: e.target.value }))}
                        placeholder="✨"
                        maxLength={2}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Border Radius</CardTitle>
                    <CardDescription>Adjust the roundness of UI elements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Slider
                        value={[workingTheme.borderRadius || 12]}
                        onValueChange={([value]) => setWorkingTheme(prev => ({ ...prev, borderRadius: value }))}
                        min={8}
                        max={24}
                        step={1}
                        className="w-full"
                      />
                      <div className="text-center text-sm text-muted-foreground">
                        {workingTheme.borderRadius || 12}px
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={previewTheme} variant="outline">
                    Preview Theme
                  </Button>
                  <Button onClick={saveTheme}>
                    Save Theme
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