import { Card } from '@/lib/types';
import { PlayingCard } from './PlayingCard';
import { cn } from '@/lib/utils';

interface DeckPanelProps {
  cardsLeft: number;
  deckSize: number;
  nextCard?: Card;
  onDraw?: () => void;
  focused?: boolean;
  dimmed?: boolean;
  onHover?: (element: string | null) => void;
}

export function DeckPanel({ 
  cardsLeft, 
  deckSize, 
  nextCard, 
  onDraw, 
  focused = false, 
  dimmed = false, 
  onHover 
}: DeckPanelProps) {
  const isEmpty = cardsLeft === 0;
  const progressWidth = deckSize > 0 ? (cardsLeft / deckSize) * 100 : 0;
  
  // Get suit-specific color class for card display
  const getSuitColorForCard = (suit: string) => {
    switch (suit) {
      case '🎤': return 'text-yellow-600'; // Golden microphone
      case '❤️': return 'text-red-500'; // Red heart
      case '✍️': return 'text-amber-700'; // Sepia quill
      case '✨': return 'text-pink-400'; // Pastel pink sparkle
      default: return 'text-slate-900';
    }
  };
  
  return (
    <div className={cn(
      "transition-all duration-300",
      focused && "scale-105 z-10",
      dimmed && "opacity-60 filter brightness-75"
    )}>
      <div className="grid grid-cols-2 gap-4 items-start max-w-sm mx-auto">
        {/* Draw Pile */}
        <div className="text-center">
          <h3 className="text-xs font-semibold tracking-wider uppercase text-slate-300/90 mb-4">
            Draw Pile
          </h3>
          
          <div className="relative">
            {/* Card Shell */}
            <div className={cn(
              "relative rounded-2xl ring-1 ring-slate-700/60 bg-slate-800/60",
              "shadow-[0_8px_24px_rgba(0,0,0,0.35)] p-3",
              "w-28 h-40 md:w-32 md:h-44",
              "after:absolute after:inset-0 after:rounded-2xl after:pointer-events-none",
              "after:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
              "transition-transform duration-150 hover:-translate-y-0.5"
            )}>
              {isEmpty ? (
                <div className="w-full h-full rounded-xl border-2 border-dashed border-slate-600 flex items-center justify-center">
                  <div className="text-slate-400 text-xs">Empty</div>
                </div>
              ) : (
                <PlayingCard faceDown={true} className="w-full h-full" />
              )}
            </div>
            
            {/* Cards Left Pill */}
            {!isEmpty && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 text-[11px] font-semibold tabular-nums rounded-full bg-slate-900/80 ring-1 ring-slate-700/70 text-slate-200 whitespace-nowrap">
                {cardsLeft} cards left
              </div>
            )}
            
            {/* Progress Bar */}
            <div className="mt-3 w-full h-0.5 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-400 transition-all duration-300 rounded-full"
                style={{ width: `${progressWidth}%` }}
              />
            </div>
          </div>
        </div>

        {/* Next Card */}
        <div className="text-center">
          <h3 className="text-xs font-semibold tracking-wider uppercase text-slate-300/90 mb-4">
            Next Card
          </h3>
          
          <div 
            className={cn(
              "relative rounded-2xl ring-1 ring-slate-700/60 bg-slate-800/60",
              "shadow-[0_8px_24px_rgba(0,0,0,0.35)] p-3",
              "w-32 h-44 md:w-36 md:h-48",
              "after:absolute after:inset-0 after:rounded-2xl after:pointer-events-none",
              "after:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
              "transition-transform duration-150 hover:-translate-y-0.5",
              "cursor-pointer",
              "focus-visible:ring-2 focus-visible:ring-cyan-400",
              !isEmpty && "outline outline-2 outline-cyan-400/30"
            )}
            onClick={onDraw}
            onMouseEnter={() => onHover?.('nextCard')}
            onMouseLeave={() => onHover?.(null)}
            tabIndex={!isEmpty ? 0 : -1}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && !isEmpty && onDraw) {
                e.preventDefault();
                onDraw();
              }
            }}
            aria-label={nextCard ? `Draw ${nextCard.rank} of ${nextCard.suit}` : isEmpty ? "No more cards" : "Click to draw next card"}
          >
            {nextCard ? (
              <div className="w-full h-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex flex-col justify-between p-2">
                {/* Top rank and suit */}
                <div className={cn(
                  "flex flex-col items-center leading-none",
                  getSuitColorForCard(nextCard.suit)
                )}>
                  <div className="font-semibold tabular-nums">{nextCard.rank}</div>
                  <div className="text-sm">{nextCard.suit}</div>
                </div>
                
                {/* Center suit */}
                <div className={cn(
                  "text-center text-xl",
                  getSuitColorForCard(nextCard.suit)
                )}>
                  {nextCard.suit}
                </div>
                
                {/* Bottom rank and suit (rotated) */}
                <div className={cn(
                  "flex flex-col items-center leading-none rotate-180",
                  getSuitColorForCard(nextCard.suit)
                )}>
                  <div className="font-semibold tabular-nums">{nextCard.rank}</div>
                  <div className="text-sm">{nextCard.suit}</div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full rounded-xl border-2 border-dashed border-slate-600 flex items-center justify-center">
                <div className="text-slate-400 text-xs text-center">
                  {isEmpty ? "No more cards" : "Click to draw"}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}