import { Stack, Card } from '@/lib/types';
import { bestTotal } from '@/lib/blackjack';
import { GAME_CONSTANTS } from '@/lib/constants';
import { PlayingCard } from './PlayingCard';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';
import { useTheme } from '@/theme/ThemeContext';

interface StackColumnProps {
  stack: Stack;
  stackIndex: number;
  clearCount: number;
  bustCount: number;
  onPlace: (stackIndex: number) => void;
  disabled?: boolean;
  className?: string;
  nextCard?: Card | null;
  focused?: boolean;
  dimmed?: boolean;
  onHover?: (stackIndex: number | null) => void;
  shouldHighlight?: boolean;
}

export function StackColumn({ 
  stack, 
  stackIndex, 
  clearCount,
  bustCount,
  onPlace, 
  disabled = false,
  className,
  nextCard,
  focused = false,
  dimmed = false,
  onHover,
  shouldHighlight = false
}: StackColumnProps) {
  const { theme } = useTheme();
  const { total, soft } = bestTotal(stack.cards);
  const isBusted = total > GAME_CONSTANTS.BLACKJACK_TARGET;
  const is21 = total === GAME_CONSTANTS.BLACKJACK_TARGET;
  const isEmpty = stack.cards.length === 0;
  
  // Get stack label from theme or fallback to default
  const stackLabel = theme.stackLabels?.[stackIndex] || `Stack ${stackIndex + 1}`;
  
  // Calculate predicted total if next card is placed
  const predictedTotal = nextCard && !isEmpty ? 
    bestTotal([...stack.cards, nextCard]).total : null;
  
  // Determine badge variant
  const getBadgeVariant = () => {
    if (isBusted) return 'red';
    if (is21) return 'green';
    if (total >= 17 && total <= 20) return 'amber';
    return 'neutral';
  };
  
  const handleClick = () => {
    if (!disabled && !stack.locked) {
      onPlace(stackIndex);
    }
  };

  const handleMouseEnter = () => {
    onHover?.(stackIndex);
  };

  const handleMouseLeave = () => {
    onHover?.(null);
  };

  return (
    <div className="relative">
      {/* Prediction tooltip */}
      {predictedTotal && nextCard && focused && !isEmpty && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
            {total} → {predictedTotal}
          </div>
        </div>
      )}
      
      <div 
        className={cn(
          "tsw-card arcade-container relative bg-white border border-gray-200",
          "neon-outline inner-shadow h-64 transition-all duration-300",
          focused && "focused",
          dimmed && "dimmed",
          shouldHighlight && "ring-2 ring-primary ring-opacity-50",
          stack.locked 
            ? "cursor-not-allowed opacity-60" 
            : !disabled
            ? "cursor-pointer hover:transform hover:scale-105"
            : "cursor-not-allowed opacity-60",
          className
        )}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label={`Stack ${stackIndex + 1}${stack.locked ? ' (locked)' : ''}`}
        tabIndex={!disabled && !stack.locked ? 0 : undefined}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled && !stack.locked) {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        {/* Sum badge */}
        {!isEmpty && (
          <Badge 
            className={cn(
              "absolute -top-2 -left-2 text-xs font-bold z-10",
              getBadgeVariant() === 'neutral' && "badge-neutral",
              getBadgeVariant() === 'amber' && "badge-amber",
              getBadgeVariant() === 'green' && "badge-green",
              getBadgeVariant() === 'red' && "badge-red"
            )}
          >
            {total}
            {soft && total !== GAME_CONSTANTS.BLACKJACK_TARGET && (
              <span className="ml-1">S</span>
            )}
          </Badge>
        )}
        {/* Title block - fixed 3 lines */}
        <div className="tsw-card__title">
          {stackLabel}
          {stack.locked && ' 🔒'}
        </div>
        
        {/* Stats row - centered as a unit */}
        <div className="tsw-card__stats">
          <div className="stat">
            <span className="label">Scores:</span>
            <span className="num">{clearCount}</span>
          </div>
          <div className="stat">
            <span className="label">Fumbles:</span>
            <span className="num">{bustCount}</span>
          </div>
        </div>
      
        {/* Cards fan */}
        <div className="tsw-card__body relative flex flex-col items-center">
          {stack.cards.length === 0 ? (
            <PlayingCard />
          ) : (
            <div className="relative">
              {stack.cards.map((card, index) => (
                <div
                  key={`${card.rank}-${card.suit}-${index}`}
                  className="transition-transform duration-200"
                  style={{
                    position: index === 0 ? 'relative' : 'absolute',
                    top: index * 16, // Increased vertical offset
                    left: index * 8, // Add horizontal offset
                    zIndex: index,
                  }}
                >
                  <PlayingCard card={card} small />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}