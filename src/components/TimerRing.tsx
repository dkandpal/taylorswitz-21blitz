import { cn } from '@/lib/utils';

interface TimerRingProps {
  timeLeft: number;
  totalTime: number;
  className?: string;
}

export function TimerRing({ timeLeft, totalTime, className }: TimerRingProps) {
  const percentage = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0;
  const circumference = 2 * Math.PI * 16; // radius = 16
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const isLowTime = timeLeft <= 15;

  return (
    <div className={cn("relative", className)}>
      <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
        {/* Background circle */}
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="2"
        />
        {/* Progress circle */}
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          stroke={isLowTime ? "hsl(var(--danger))" : "hsl(var(--primary))"}
          strokeWidth="2"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className={cn(
            "transition-all duration-300 timer-ring",
            isLowTime && "timer-pulse"
          )}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}