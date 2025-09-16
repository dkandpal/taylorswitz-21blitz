import { Card } from '@/lib/types';
import { PlayingCard } from './PlayingCard';

interface WasteSlotProps {
  card: Card | null;
  onPlace: () => void;
  disabled?: boolean;
}

export function WasteSlot({ card, onPlace, disabled = false }: WasteSlotProps) {
  return (
    <div className="text-center">
      <div className="text-sm text-muted-foreground mb-2">Waste</div>
      <div 
        className="cursor-pointer hover:scale-105 transition-transform"
        onClick={!disabled ? onPlace : undefined}
        aria-label="Waste slot - press W to place card here"
        tabIndex={!disabled ? 0 : undefined}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
            e.preventDefault();
            onPlace();
          }
        }}
      >
        <PlayingCard card={card} />
      </div>
      <div className="text-xs text-muted-foreground mt-1">
        Press W
      </div>
    </div>
  );
}