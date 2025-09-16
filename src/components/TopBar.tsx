import { Button } from '@/components/ui/button';
import { formatTime } from '@/lib/blackjack';
import { GameState } from '@/lib/types';
import { TimerRing } from './TimerRing';
import { ComboMeter } from './ComboMeter';
import { SeedPill } from './SeedPill';
import { 
  Pause, 
  Play, 
  RotateCcw, 
  Volume2, 
  VolumeX,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopBarProps {
  gameState: GameState;
  onPause?: () => void;
  onReset?: () => void;
  onToggleSound?: () => void;
  onSettings?: () => void;
  onQuit?: () => void;
  showControls?: boolean;
}

export function TopBar({ 
  gameState, 
  onPause, 
  onReset, 
  onToggleSound,
  onSettings,
  onQuit,
  showControls = true
}: TopBarProps) {
  const timeDisplay = formatTime(gameState.timeLeft);
    
  const isLowTime = gameState.timeLeft <= 30;
  
  return (
    <div className="flex items-center justify-between p-4 bg-game-surface border-b border-game-border">
      {/* Left: Score and timer */}
      <div className="flex items-start space-x-6">
        <div className="text-center">
          <div className="text-xs text-gray-600 mb-2">Score</div>
          <div className="text-2xl font-bold text-primary">{gameState.score}</div>
        </div>
        
        <div className="text-center">
          <div className="text-xs text-gray-600 mb-2">Timer</div>
          <div className="relative flex items-center justify-center">
            <TimerRing 
              timeLeft={gameState.timeLeft} 
              totalTime={gameState.timerSecs} 
              className="absolute"
            />
            <div className={cn(
              "text-xl font-bold z-10",
              isLowTime ? "text-danger" : "text-gray-800"
            )}>
              {timeDisplay}
            </div>
          </div>
        </div>

        {/* Combo Meter */}
        <ComboMeter streakCount={gameState.streakCount} />
        
        {gameState.seed && (
          <SeedPill seed={gameState.seed} />
        )}
      </div>
      
      {/* Right: Quit Button */}
      <div className="flex items-center">
        <Button
          variant="destructive"
          size="sm"
          onClick={onQuit}
          aria-label="Quit game"
        >
          QUIT
        </Button>
      </div>
    </div>
  );
}