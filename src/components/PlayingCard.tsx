import { Card } from '@/lib/types';
import { getCardName } from '@/lib/blackjack';
import { cn } from '@/lib/utils';

interface PlayingCardProps {
  card?: Card;
  faceDown?: boolean;
  small?: boolean;
  className?: string;
  onClick?: () => void;
}

export function PlayingCard({ 
  card, 
  faceDown = false, 
  small = false, 
  className,
  onClick 
}: PlayingCardProps) {
  const isRed = card && (card.suit === '♥' || card.suit === '♦');
  
  if (faceDown) {
    return (
      <div 
        className={cn(
          "game-card flex items-center justify-center",
          "bg-gradient-to-br from-blue-900 to-blue-700",
          "border border-blue-600",
          small ? "w-16 h-24 text-sm" : "w-24 h-32 text-base",
          onClick && "cursor-pointer hover:scale-105",
          className
        )}
        onClick={onClick}
        aria-label="Face down card"
      >
        <div className="text-blue-300 font-bold">🂠</div>
      </div>
    );
  }
  
  if (!card) {
    return (
      <div 
        className={cn(
          "border-2 border-dashed border-muted",
          "rounded-lg flex items-center justify-center",
          "bg-muted/10",
          small ? "w-16 h-24" : "w-24 h-32",
          className
        )}
        aria-label="Empty card slot"
      >
        <div className="text-muted-foreground text-xs">+</div>
      </div>
    );
  }
  
  return (
    <div 
      className={cn(
        "game-card flex flex-col justify-between",
        "border border-gray-300",
        "relative overflow-hidden",
        small ? "w-16 h-24 p-1 text-sm" : "w-24 h-32 p-2 text-base",
        onClick && "cursor-pointer hover:scale-105 focus-ring",
        className
      )}
      onClick={onClick}
      aria-label={getCardName(card)}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      {/* Top rank and suit */}
      <div className={cn(
        "flex flex-col items-center leading-none",
        isRed ? "text-danger" : "text-card-foreground"
      )}>
        <div className="font-bold truncate">{card.rank}</div>
        <div className={small ? "text-xs" : "text-sm"}>{card.suit}</div>
      </div>
      
      {/* Center suit (larger cards only) */}
      {!small && (
        <div className={cn(
          "text-center self-center",
          small ? "text-lg" : "text-xl",
          isRed ? "text-danger" : "text-card-foreground"
        )}>
          {card.suit}
        </div>
      )}
      
      {/* Bottom rank and suit (rotated) */}
      <div className={cn(
        "flex flex-col items-center leading-none rotate-180",
        isRed ? "text-danger" : "text-card-foreground"
      )}>
        <div className="font-bold truncate">{card.rank}</div>
        <div className={small ? "text-xs" : "text-sm"}>{card.suit}</div>
      </div>
    </div>
  );
}