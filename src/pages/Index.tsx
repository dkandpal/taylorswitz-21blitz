import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PlayingCard } from '@/components/PlayingCard';
import { GAME_CONSTANTS } from '@/lib/constants';
import { Play, HelpCircle, Settings as SettingsIcon, Trophy, Timer, Infinity, Palette } from 'lucide-react';
const Index = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const seed = searchParams.get('seed');
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  // Sample cards for visual appeal with traditional suits
  const sampleCards = [{
    rank: 'A',
    suit: '♠',
    value10: 1,
    isAce: true
  }, {
    rank: 'K',
    suit: '♥',
    value10: 10,
    isAce: false
  }, {
    rank: '10',
    suit: '♦',
    value10: 10,
    isAce: false
  }] as const;
  const handlePlay = () => {
    if (seed) {
      navigate(`/how-to-play?seed=${seed}`);
    } else {
      navigate('/how-to-play');
    }
  };
  const handleQuickPlay = () => {
    navigate('/play');
  };
  return <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{
    background: `
      radial-gradient(circle at 25% 25%, rgba(255,255,255,0.02) 1px, transparent 1px),
      radial-gradient(circle at 75% 75%, rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(135deg, #1a472a, #22543d, #2d5a41, #1e3a2e)
    `,
    backgroundSize: '24px 24px, 32px 32px, 100% 100%'
  }}>
      <div className="max-w-4xl w-full space-y-8">
        {/* Header with side-by-side layout */}
        <div className="text-center space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-stretch lg:justify-center mb-6">
            {/* Headline Box - stacks on top on mobile, left side on desktop */}
            <div className="flex-1 lg:max-w-md">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-gray-200 h-full flex flex-col justify-center text-right">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">21 Blitz Builder</h1>
                <p className="text-lg lg:text-xl text-gray-700">
                  Create stacks of 21 without busting!
                </p>
              </div>
            </div>
            
            {/* Hero Image - bottom on mobile, right side on desktop */}
            <div className="flex justify-start mt-6 lg:mt-0">
              <img src="/lovable-uploads/5fe48950-002d-4922-acd1-a62494376a34.png" alt="21 Blitz Game Diagram" className="max-w-full h-auto max-h-48 sm:max-h-64 lg:max-h-80 xl:max-h-96 object-contain rounded-lg shadow-lg" />
            </div>
          </div>
          
          {/* Sample Cards */}
          <div className="flex justify-center items-center space-x-4 mb-6">
            {sampleCards.map((card, index) => <div key={index} className="animate-float" style={{
            animationDelay: `${index * 0.2}s`
          }}>
                <PlayingCard card={card} />
              </div>)}
            {/* Card back as fourth card */}
            <div className="animate-float" style={{
            animationDelay: `${sampleCards.length * 0.2}s`
          }}>
              <div className="w-24 h-32 rounded-lg overflow-hidden shadow-lg">
                <img src="/generic-card-back.png" alt="Generic Card Back" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
          
          {seed && <Badge variant="outline" className="text-lg px-4 py-2">
              Replaying Seed: {seed}
            </Badge>}
        </div>

        {/* Main CTA */}
        <div className="text-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {/* Top row: Quick Play and Customize Theme */}
            <Button onClick={handleQuickPlay} size="lg" className="bg-hotPink text-hotPink-foreground hover:bg-hotPink/90 w-full">
              <Play className="mr-2 h-5 w-5" />
              Quick Play
            </Button>
            
            <Button onClick={() => navigate('/theme')} variant="destructive" size="lg" className="w-full">
              <Palette className="mr-2 h-4 w-4" />
              Build Game
            </Button>
            
            {/* Bottom row: How to Play and Leaderboard */}
            <Button onClick={() => navigate('/how-to-play')} variant="outline" size="lg" className="w-full">
              <HelpCircle className="mr-2 h-4 w-4" />
              How to Play
            </Button>
            
            <Button onClick={() => navigate('/leaderboard')} variant="outline" size="lg" className="w-full">
              <Trophy className="mr-2 h-4 w-4" />
              Leaderboard
            </Button>
          </div>
        </div>


      </div>
    </div>;
};
export default Index;