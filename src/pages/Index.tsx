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
            Create stacks of 21 without fumbling!
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


        {/* Action buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <Dialog open={showHowToPlay} onOpenChange={setShowHowToPlay}>
            <DialogTrigger asChild>
              <Button variant="outline" className="focus-ring">
                <HelpCircle className="w-4 h-4 mr-2" />
                How to Play
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-foreground">How to T-Swizzle 21 Blitz
              </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2 text-foreground">🎯 Objective</h4>
                  <p className="text-muted-foreground">Draw cards and place them on 4 stacks to make exactly 21. Avoid going over (fumbling)!</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2 text-foreground">🃏 Card Values</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Numbers 2-10: Face value</li>
                    <li>Jack, Queen, King: 10 points</li>
                    <li>Ace: 1 or 11 (automatically optimized)</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2 text-foreground">🎮 Gameplay</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Draw one card at a time from the deck</li>
                    <li>Place each card on one of 4 stacks (or waste if enabled)</li>
                    <li>Stack totaling exactly 21 clears and scores points</li>
                    <li>Stack over 21 fumbles (penalty) and clears</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2 text-foreground">🏆 Scoring</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>2-card 21 (Blackjack): +{GAME_CONSTANTS.TWO_CARD_21}</li>
                    <li>3-card 21: +{GAME_CONSTANTS.THREE_CARD_21}</li>
                    <li>4+ card 21: +{GAME_CONSTANTS.FOUR_PLUS_CARD_21}</li>
                    <li>Streak bonus: +{GAME_CONSTANTS.STREAK_BONUS} per consecutive clear</li>
                    <li>Time bonus: +{GAME_CONSTANTS.TIME_BONUS_PER_SECOND} per second remaining</li>
                    <li>Bust penalty: {GAME_CONSTANTS.BUST_PENALTY}</li>
                  </ul>
                </div>
                
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={() => navigate('/leaderboard')} className="focus-ring">
            <Trophy className="w-4 h-4 mr-2" />
            Leaderboard
          </Button>
          
        </div>
      </div>
    </div>;
};
export default Index;