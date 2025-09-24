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

  // Sample cards for visual appeal
  const sampleCards = [{
    rank: 'A',
    suit: '🎤',
    value10: 1,
    isAce: true
  }, {
    rank: 'K',
    suit: '❤️',
    value10: 10,
    isAce: false
  }, {
    rank: '10',
    suit: '✨',
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
  return <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header with banner image */}
        <div className="text-center space-y-6">
          <div className="flex justify-center mb-6">
            <img src="/TSWIZBANNER.png" alt="Taylor's Wiz Banner" className="max-w-full h-auto max-h-48 sm:max-h-64 lg:max-h-80 xl:max-h-96 object-contain rounded-lg" />
          </div>
          
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
                <img src="/card-back-taylor-swift.jpg" alt="Card Back" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
          <p className="text-xl text-gray-900 max-w-2xl mx-auto">
            Create stacks of 21 without busting!
          </p>
          
          {seed && <Badge variant="outline" className="text-lg px-4 py-2">
              Replaying Seed: {seed}
            </Badge>}
        </div>

        {/* Main CTA */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleQuickPlay} 
              size="lg" 
              className="bg-hotPink text-hotPink-foreground hover:bg-hotPink/90"
            >
              <Play className="mr-2 h-5 w-5" />
              Quick Play
            </Button>
            
            <div className="flex gap-2 justify-center">
              <Button onClick={() => navigate('/how-to-play')} variant="outline" size="lg">
                <HelpCircle className="mr-2 h-4 w-4" />
                How to Play
              </Button>
              <Button onClick={() => navigate('/leaderboard')} variant="outline" size="lg">
                <Trophy className="mr-2 h-4 w-4" />
                Leaderboard
              </Button>
              <Button onClick={() => navigate('/theme')} variant="outline" size="lg">
                <Palette className="mr-2 h-4 w-4" />
                Customize Theme
              </Button>
            </div>
          </div>
        </div>


      </div>
    </div>;
};
export default Index;