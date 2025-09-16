import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PlayingCard } from '@/components/PlayingCard';
import { GAME_CONSTANTS } from '@/lib/constants';
import { 
  Play, 
  ArrowLeft,
  Target,
  Spade,
  Gamepad2,
  Trophy
} from 'lucide-react';

const HowToPlay = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const seed = searchParams.get('seed');
  
  // Sample cards for demonstration
  const sampleCards = [
    { rank: 'A', suit: '🎤', value10: 1, isAce: true },
    { rank: 'K', suit: '❤️', value10: 10, isAce: false },
    { rank: '10', suit: '✨', value10: 10, isAce: false },
  ] as const;

  const handleStartGame = () => {
    if (seed) {
      navigate(`/play?seed=${seed}`);
    } else {
      navigate('/play');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center space-x-4 mb-4">
            {sampleCards.map((card, index) => (
              <div 
                key={index}
                className="animate-float"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <PlayingCard card={card} />
              </div>
            ))}
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900">
            How to Play Blitz 21
          </h1>
          <p className="text-lg text-muted-foreground">
            Channel your inner mastermind—stack your cards like Taylor stacks her eras.
          </p>
        </div>

        {/* Instructions Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-hotPink/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-hotPink" />
              </div>
              <h3 className="text-xl font-semibold text-black">Objective</h3>
            </div>
            <p className="text-muted-foreground">
              Draw cards and place them on 4 stacks to make exactly 21. Avoid going over (fumbling)!
            </p>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-hotPink/10 flex items-center justify-center">
                <Spade className="w-5 h-5 text-hotPink" />
              </div>
              <h3 className="text-xl font-semibold text-black">Card Values</h3>
            </div>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Numbers 2-10: Face value</li>
              <li>• Jack, Queen, King: 10 points</li>
              <li>• Ace: 1 or 11 (automatically optimized)</li>
            </ul>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-hotPink/10 flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-hotPink" />
              </div>
              <h3 className="text-xl font-semibold text-black">Gameplay</h3>
            </div>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Draw one card at a time from the deck</li>
              <li>• Place each card on one of 4 stacks</li>
              <li>• Stack totaling exactly 21 clears and scores points</li>
              <li>• Stack over 21 fumbles (penalty) and clears</li>
            </ul>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-hotPink/10 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-hotPink" />
              </div>
              <h3 className="text-xl font-semibold text-black">Scoring</h3>
            </div>
            <ul className="space-y-2 text-muted-foreground">
              <li>• 2-card 21 (Blackjack): +{GAME_CONSTANTS.TWO_CARD_21}</li>
              <li>• 3-card 21: +{GAME_CONSTANTS.THREE_CARD_21}</li>
              <li>• 4+ card 21: +{GAME_CONSTANTS.FOUR_PLUS_CARD_21}</li>
              <li>• Streak bonus: +{GAME_CONSTANTS.STREAK_BONUS} per consecutive clear</li>
              <li>• Time bonus: +{GAME_CONSTANTS.TIME_BONUS_PER_SECOND} per second remaining</li>
              <li>• Bust penalty: {GAME_CONSTANTS.BUST_PENALTY}</li>
            </ul>
          </Card>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            onClick={handleStartGame}
            size="lg"
            className="text-xl px-8 py-6 bg-hotPink text-hotPink-foreground hover:scale-105 transition-transform hover:bg-hotPink/90"
          >
            <Play className="w-6 h-6 mr-2" />
            Start Playing
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => navigate('/')}
            className="focus-ring"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HowToPlay;