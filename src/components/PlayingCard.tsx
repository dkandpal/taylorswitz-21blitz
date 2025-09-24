import { Card } from '@/lib/types';
import { getCardName } from '@/lib/blackjack';
import { cn } from '@/lib/utils';
import { useTheme } from '@/theme/ThemeContext';
import { useSuitIcon } from '@/theme/useSuitIcon';

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
  const { theme } = useTheme();
  const { iconFor } = useSuitIcon();
  
  // Get suit-specific color class - hearts and diamonds are red by default
  const getSuitColor = (suit: string) => {
    switch (suit) {
      case '♥': return 'text-red-500'; // Red hearts
      case '♦': return 'text-red-500'; // Red diamonds
      case '♠': return 'text-gray-900'; // Black spades
      case '♣': return 'text-gray-900'; // Black clubs
      // Legacy emoji suits for backward compatibility
      case '🎤': return 'text-yellow-600'; // Golden microphone
      case '❤️': return 'text-red-500'; // Red heart
      case '✍️': return 'text-amber-700'; // Sepia quill
      case '✨': return 'text-pink-400'; // Pastel pink sparkle
      default: return 'text-card-foreground';
    }
  };
  
  const suitColor = card ? getSuitColor(card.suit) : 'text-card-foreground';
  const cardBackImage = theme.cardBackUrl || '/generic-card-back.png';
  
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
          alt="Generic Card Back"
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
        "flex flex-col justify-between bg-white",
        "border border-gray-300 rounded-lg shadow-sm",
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
        suitColor
      )}>
        <div className="font-bold truncate">{card.rank}</div>
        <div className={small ? "text-xs" : "text-sm"}>{iconFor(card.suit)}</div>
      </div>
      
      {/* Center suit (larger cards only) */}
      {!small && (
        <div className={cn(
          "text-center self-center",
          small ? "text-lg" : "text-xl",
          suitColor
        )}>
          {iconFor(card.suit)}
        </div>
      )}
      
      {/* Bottom rank and suit (rotated) */}
      <div className={cn(
        "flex flex-col items-center leading-none rotate-180",
        suitColor
      )}>
        <div className="font-bold truncate">{card.rank}</div>
        <div className={small ? "text-xs" : "text-sm"}>{iconFor(card.suit)}</div>
      </div>
    </div>
  );
}