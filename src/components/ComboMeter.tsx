import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

interface ComboMeterProps {
  streakCount: number;
  className?: string;
}

export function ComboMeter({ streakCount, className }: ComboMeterProps) {
  if (streakCount < 2) return null;

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Badge 
        variant="outline" 
        className={cn(
          "bg-gradient-to-r from-warning to-success text-foreground font-bold px-3 py-1",
          "animate-pulse border-2",
          streakCount >= 5 && "border-success shadow-success",
          streakCount >= 3 && "border-warning shadow-warning"
        )}
      >
        🔥 {streakCount}x COMBO
      </Badge>
    </div>
  );
}