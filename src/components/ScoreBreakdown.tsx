import { GameState } from '@/lib/types';
import { GAME_CONSTANTS } from '@/lib/constants';
import { allFourClearedAtLeastOnce } from '@/lib/blackjack';

interface ScoreBreakdownProps {
  gameState: GameState;
}

export const ScoreBreakdown = ({ gameState }: ScoreBreakdownProps) => {
  // Calculate breakdown components
  const timeBonus = gameState.timeLeft * GAME_CONSTANTS.TIME_BONUS_PER_SECOND;
  const perfectClearBonus = allFourClearedAtLeastOnce(gameState.stacksClearedHistory) 
    ? GAME_CONSTANTS.PERFECT_CLEAR_BONUS 
    : 0;
  const bustPenalty = gameState.busts * GAME_CONSTANTS.BUST_PENALTY;
  const wasteCount = gameState.waste ? 1 : 0;
  const wastePenalty = wasteCount * GAME_CONSTANTS.WASTE_PENALTY;
  
  // Calculate dead stack penalty (locked stacks with cards)
  const deadStacks = gameState.stacks.filter(stack => stack.locked && stack.cards.length > 0).length;
  const deadStackPenalty = deadStacks * GAME_CONSTANTS.DEAD_STACK_PENALTY;

  // Estimate clear points (this is an approximation since we don't track exact breakdown)
  const estimatedClearPoints = gameState.clears * GAME_CONSTANTS.THREE_CARD_21; // Average assumption

  const ScoreItem = ({ label, value, isBonus = false, isPenalty = false }: {
    label: string;
    value: number;
    isBonus?: boolean;
    isPenalty?: boolean;
  }) => {
    if (value === 0) return null;
    
    return (
      <div className="flex justify-between items-center text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className={`font-semibold ${
          isPenalty ? 'text-destructive' : 
          isBonus ? 'text-primary' : 
          'text-foreground'
        }`}>
          {isPenalty || value < 0 ? '' : '+'}{value}
        </span>
      </div>
    );
  };

  return (
    <div className="mt-3 p-3 bg-muted/50 rounded-md border">
      <h4 className="text-sm font-semibold mb-2 text-center">Score Breakdown</h4>
      <div className="space-y-1">
        <ScoreItem label={`21s Cleared (${gameState.clears})`} value={estimatedClearPoints} isBonus />
        <ScoreItem label={`Time Bonus (${gameState.timeLeft}s)`} value={timeBonus} isBonus />
        <ScoreItem label="Perfect Clear Bonus" value={perfectClearBonus} isBonus />
        <ScoreItem label={`Busts (${gameState.busts})`} value={bustPenalty} isPenalty />
        <ScoreItem label={`Dead Stacks (${deadStacks})`} value={deadStackPenalty} isPenalty />
        <ScoreItem label={`Waste Cards (${wasteCount})`} value={wastePenalty} isPenalty />
        
        <div className="border-t border-muted-foreground/20 mt-2 pt-2">
          <div className="flex justify-between items-center text-sm font-bold">
            <span>Final Score</span>
            <span className="text-primary">{gameState.score}</span>
          </div>
        </div>
      </div>
    </div>
  );
};