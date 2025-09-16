import { Card } from '@/lib/types';
import { getCardName } from '@/lib/blackjack';
import { cn } from '@/lib/utils';
const cardBackImage = '/card-back-taylor-swift.jpg';

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
    console.log('Rendering face down card with image:', cardBackImage);
    console.log('Full image URL:', window.location.origin + cardBackImage);
    return (
      <div 
        className={cn(
          "rounded-lg shadow-sm flex items-center justify-center overflow-hidden",
          "border border-game-border",
          small ? "w-16 h-24" : "w-24 h-32",
          onClick && "cursor-pointer hover:scale-105 transition-transform",
          className
        )}
        onClick={onClick}
        aria-label="Face down card"
        style={{
          backgroundImage: `url(${cardBackImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <img 
          src={cardBackImage} 
          alt="Card back - Ghibli style Taylor Swift"
          className="w-full h-full object-cover rounded-lg opacity-0"
          onError={(e) => {
            console.error('Failed to load card back image:', e);
            console.log('Image src:', cardBackImage);
            console.log('Current URL:', window.location.href);
            // Fallback to background image if img fails
            (e.target as HTMLElement).style.display = 'none';
          }}
          onLoad={(e) => {
            console.log('Card back image loaded successfully');
            (e.target as HTMLElement).style.opacity = '1';
          }}
        />
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