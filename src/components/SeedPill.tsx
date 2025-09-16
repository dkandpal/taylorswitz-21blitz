import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { cn } from '@/lib/utils';

interface SeedPillProps {
  seed: string;
  className?: string;
}

export function SeedPill({ seed, className }: SeedPillProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(seed);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy seed:', err);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="outline" 
            className={cn(
              "cursor-pointer transition-all duration-200 px-3 py-1 text-xs",
              "hover:bg-primary/10 hover:border-primary/50 bg-white text-gray-800 border-gray-300",
              "flex items-center space-x-2",
              className
            )}
            onClick={handleCopy}
          >
            <span className="font-mono">{seed}</span>
            {copied ? (
              <Check className="w-3 h-3 text-success" />
            ) : (
              <Copy className="w-3 h-3 opacity-70" />
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{copied ? 'Copied!' : 'Copy seed'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}